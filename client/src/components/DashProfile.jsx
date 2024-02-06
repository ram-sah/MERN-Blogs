import React from "react";
import { useSelector } from "react-redux";
import { Button, TextInput } from 'flowbite-react'
const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user);

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="text-center my-8 font-bold text-2xl ">Profile</h1>
            <form className="flex flex-col gap-2">
                <div className="w-32 h-32 relative border-8 border-[lightgray] rounded-full overflow-hidden cursor-pointer shadow-lg self-center mb-4">
                    <img
                        src={currentUser.profilePicture}
                        alt="user"
                        className="w-full h-full object-cover"
                    />
                </div>
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
