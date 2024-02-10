// signOutFunc.jsx
import React from "react";
import Header from "./Header";
import DashProfile from "./DashProfile";
import { useSelector, useDispatch } from "react-redux"; // Import hooks here
import { signOutUserSuccess } from "../redux/user/userSlice";

const SignOutFunc = () => {
  const { currentUser } = useSelector((state) => state.user); // Use useSelector here
  const dispatch = useDispatch(); // Use useDispatch here

  const handleSignOut = async () => {
    try {
      const res = await fetch(`api/user/signout/${currentUser._id}`, {
        method: 'POST',
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

  return (
    <>
      <Header handleSignOut={handleSignOut} />
      <DashProfile />
    </>
  );
};

export default SignOutFunc;
