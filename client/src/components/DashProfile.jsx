import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react"; // UI components library
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Styles for circular progress bar
import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

// Functional component for managing user profile in a dashboard
const DashProfile = () => {
  // Retrieve current user data from Redux store
  const { currentUser, error, loading } = useSelector((state) => state.user);

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
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);

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
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0)); // Update upload progress state
      },
      (error) => {
        // Handle upload error
        const getFileSize = (imageFile.size / (1024 * 1024)).toFixed(); //convert uploaded file's size in to MB and round after zero
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
          setImageFileUploadProgress(null);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Nothing to update!");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait to complete image upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        // setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("👍 User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      // setUpdateUserError(error.message);
    }
  };

  //delete user
  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  //Sign out user
  const handleSignOut = async () => {
    try {
      const res = await fetch("api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutUserSuccess(data));
      }
    } catch (error) {
      console.log(data.message);
    }
  };

  // Return JSX for rendering user profile form and UI
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      {/* For Admin to create a post */}
      <div className="flex flex-col md:flex-row items-center justify-between flex-1">
        <h1 className="text-center my-8 font-bold text-2xl md:flex-1">Profile</h1>
        {
          currentUser && (
            <Link to={'/create-post'}>
              <Button type="submit"
                gradientDuoTone="purpleToBlue"
                className="w-auto mb-4 items-center md:-mr-40"
                outline>Create a post </Button>
            </Link>
          )
        }
      </div>
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
                  stroke: `rgba(40,140, 200, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          {/* Display selected image or current user's profile picture */}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`w-full h-full object-cover border-gray-300 rounded-full border-4 ${imageFileUploadProgress &&
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
          <Alert color="success" className="mb-4">

            {updateUserSuccess}
          </Alert>
        )}

        {updateUserError && (
          <Alert color="failure" className="mb-4">

            {updateUserError}
          </Alert>
        )}

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}
        {/* show delete form, Modal on click  */}
        <Modal
          show={showModel}
          onClose={() => setShowModel(false)}
          popup
          size="md"
        >
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              <HiOutlineExclamationCircle className="w-10 h-10 mx-auto mb-4 text-red-500 " />
              <h2 className="mb-5 text-gray-500">
                Are you sure want to delete your account ?
              </h2>
              <div className="flex justify-center gap-5">
                <Button color="failure" onClick={handleDeleteUser}>
                  Yes, I'm sure !
                </Button>
                <Button color="gray" onClick={() => setShowModel(false)}>
                  No, cancel it.
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* Text inputs for username, email, and password */}
        <TextInput
          id="username"
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          id="email"
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          id="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
        />
        {/* Button for submitting profile changes */}
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update Profile"}
        </Button>

      </form>
      {/* Links for deleting account and signing out */}
      <div className="text-red-600 flex justify-between mt-5">
        <span onClick={() => setShowModel(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default DashProfile; // Export the DashProfile component
