
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react"; // UI components library
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Styles for circular progress bar
import { updateStart, updateFailure, updateSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

// Functional component for managing user profile in a dashboard
const DashProfile = () => {
  // Retrieve current user data from Redux store
  const { currentUser } = useSelector((state) => state.user);

  // State variables for managing image upload
  const [imageFile, setImageFile] = useState(null); // Uploaded image file
  const [imageFileUrl, setImageFileUrl] = useState(null); // URL of uploaded image
  const filePickerRef = useRef(); // Reference to file input element
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); // Upload progress of image
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // Error message during image upload
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null)
  // Function to handle selection of image file
  const handleImage = (e) => {
    const file = e.target.files[0]; // Retrieve selected file
    if (file) {
      // Set selected image file and its URL
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      // console.log('here--', imageFile, 'and', imageFileUrl)
    }
  };

  // Effect hook to trigger image upload when imageFile changes
  useEffect(() => {
    if (imageFile) {
      uploadImage(); // Upload the image
    }
  }, [imageFile]);

  // Function to upload the selected image file to Firebase storage.
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null); // Clear previous upload error
    const storage = getStorage(app); // Get Firebase storage instance
    const fileName = new Date().getTime() + imageFile.name; // Generate unique filename
    const storageRef = ref(storage, fileName); // Reference to storage location
    const uploadTask = uploadBytesResumable(storageRef, imageFile); // Start uploading image

    // Event listener for tracking upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate and update upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0)); // Update upload progress state
      },
      (error) => {
        // Handle upload error
        const getFileSize = (imageFile.size / (1024 * 1024)).toFixed()//convert uploaded file's size in to MB and round after zero
        setImageFileUploadError(
          `🚫 Could not upload ${getFileSize}MB image, (File must be less than 2MB)`
        );
        // Reset states
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        // On successful upload, get the download URL and update state
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); // Set image URL
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // console.log(formData)
  const handleSubmit = async(e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if(Object.keys(formData).length === 0){
      setUpdateUserError('No changes made');
      return;
    }
    if(imageFileUploading){
      setUpdateUserError("Please wait to complete image upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }else{
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("👍 User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message)
    }
  }
  // Return JSX for rendering user profile form and UI
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-8 font-bold text-2xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* File input for selecting image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          ref={filePickerRef}
          hidden
        />
        {/* Container for displaying selected image */}
        <div
          className="relative w-32 h-32 border-[lightgray] rounded-full overflow-hidden cursor-pointer shadow-lg self-center mb-4"
          onClick={() => filePickerRef.current.click()} //this event listener ref to call above form
        >
          {/* Display upload progress as circular progress bar */}
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(40,140, 200, ${imageFileUploadProgress / 100
                    })`,
                },
              }}
            />
          )}
          {/* Display selected image or current user's profile picture */}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`w-full h-full object-cover border-gray-100 rounded-full border-8 ${imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-50"
              }`}
          />
        </div>
        {/* Display error message during image upload */}
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        {updateUserSuccess && (
            <Alert color= "success" className="mb-4">{updateUserSuccess} </Alert>
          )}

          {updateUserError && (
            <Alert color= "failure" className="mb-4">{updateUserError} </Alert>
          )}

        {/* Text inputs for username, email, and password */}
        <TextInput
          id="username"
          type="text"
          placeholder="username"
          defaultValue={currentUser.username} onChange={handleChange}
        />
        <TextInput
          id="email"
          type="text"
          placeholder="email"
          defaultValue={currentUser.email} onChange={handleChange}
        />
        <TextInput id="password" type="password" placeholder="password" onChange={handleChange} />
        {/* Button for submitting profile changes */}
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Submit
        </Button>
      </form>
      {/* Links for deleting account and signing out */}
      <div className="text-red-600 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile; // Export the DashProfile component
