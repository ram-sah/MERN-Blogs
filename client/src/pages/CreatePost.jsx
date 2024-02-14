import React, { useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
//to see the image download progress
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Styles for circular progress bar
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [formData, setFormData] = useState({})
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [publishError, setPublishError] = useState(null)
  const navigate = useNavigate()
  // console.log(formData)
  // Function to upload the selected image file to Firebase storage.
  const handleUploadImage = async () => {
    try {
      if (!imageFile) {
        setImageFileUploadError('Please select an image');
        return;
      }

      if (formData.image) {
        setUpdateUserSuccess('Image has already been uploaded')
      }

      setImageFileUploading(true);
      setImageFileUploadError(null); // Clear previous upload error
      const storage = getStorage(app); // Get Firebase storage instance
      const fileName = new Date().getTime() + '-' + imageFile.name; // Generate unique filename
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
        },
        () => {
          // On successful upload, get the download URL and update state
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadProgress(null);
            setImageFileUploadError(null)
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageFileUploadError("Image upload failed")
      setImageFileUploadProgress(null)
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);
    setUpdateUserSuccess(null);
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen mx-auto p-4 max-w-2xl ">
      <h1 className="text-center my-5 font-semibold text-3xl ">
        Create a post
      </h1>
      <form className="flex flex-col gap-5 " onSubmit={handleSubmit}>
        <div className="flex gap-5 flex-col sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })}
          >
            <option value="uncategorized"> Select a category</option>
            <option value="NodeJs"> Nodejs</option>
            <option value="ReactJs"> ReactJs</option>
            <option value="JavaScript"> JavaScript</option>
            <option value="ExpressJs"> ExpressJs</option>
          </Select>
        </div>
        <div className="flex gap-5 border-2 border-solid rounded border-violet-400 p-4 items-center justify-between">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])} />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageFileUploadProgress}
          >
            {
              imageFileUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageFileUploadProgress}
                    text={`${imageFileUploadProgress || 0}%`}
                  />
                </div>
              ) : ('Upload image')
            }
          </Button>
        </div>
        {imageFileUploadError && (<Alert color="failure" className="mb-4"> {imageFileUploadError} </Alert>
        )}

        {updateUserSuccess && (<Alert color="success" className="mb-4"> {updateUserSuccess} </Alert>
        )}

        {/* To display image on page */}
        {
          formData.image && (
            <img
              src={formData.image}
              alt="upload"
              className={`w-full h-72 object-cover border-gray-300 rounded-md border-4 ${imageFileUploadProgress
                }`}
            />
          )
        }

        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-64 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Publish
        </Button>
        {publishError && (<Alert color="failure" className="mb-4"> {publishError} </Alert>
        )}
      </form>
    </div>
  );
};
