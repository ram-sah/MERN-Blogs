import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from 'flowbite-react';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const filePickerRef = useRef()
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    console.log(imageFileUploadProgress, imageFileUploadError)

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file))
        };
    };
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    //uploading image in firebase
    const uploadImage = async () => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            }, (error) => {
                setImageFileUploadError("File must be less than 2MB")
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                })
            }
        )

    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="text-center my-8 font-bold text-2xl ">Profile</h1>
            <form className="flex flex-col gap-2">
                <input type="file" accept="image/*" onChange={handleImage} ref={filePickerRef} hidden />
                <div className=" relative w-32 h-32 relative border-8 border-[lightgray] rounded-full overflow-hidden cursor-pointer shadow-lg self-center mb-4" onClick={() =>
                    filePickerRef.current.click()} >

                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress || 0} text={`$
                         {imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                },
                                path:{
                                    stroke: `rgba(60,150, 200, ${imageFileUploadProgress /100 } )`
                                }
                            }}
                            />
                       )}
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user"
                        className={`w-full h-full object-cover border-gray-100 `
                    }
                    />
                </div>
                {imageFileUploadError && <Alert color='failure'> {imageFileUploadError} </Alert >
                }
                <TextInput id="username" type="text" placeholder="username" defaultValue={currentUser.username} />
                <TextInput id="email" type="text" placeholder="email" defaultValue={currentUser.email} />
                <TextInput id="password" type="password" placeholder="password" />
                <Button type="submit" gradientDuoTone='purpleToBlue' outline>
                    Submit
                </Button>
            </form>
            <div className="text-red-600 flex justify-between mt-5">
                <span className="cursor-pointer"> Delete Account</span>
                <span className="cursor-pointer"> Sign Out</span>

            </div>
        </div>
    );
};

export default DashProfile;
