import React from "react";
import { Link } from "react-router-dom";
import { Button, Label, TextInput } from 'flowbite-react';

const SignUp = () => {
  return (
    <>
      <div className="min-h-screen mt-20">
        <div className="main flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          <div className="left flex-1">
            <Link
              to="/"
              className=" dark:text-white font-bold text-4xl"
            >
              <span className="px-3 py-2 bg-gradient-to-r from-yellow-500 via-purple-400 to-blue-400 rounded-lg text-white">
                Ram's
              </span>
              Blogs
            </Link>
            <p className="text-sm mt-5">This is blogs project. Signup with username and password or with google account</p>
          </div>
          <div className="right flex-1">
            <form className="flex flex-col gap-4">
              <div className="">
                <Label value="Your username" />
                <TextInput
                  type="text"
                  placeholder="username"
                  id="username"
                />
              </div>
              <div className="">
                <Label value="Your email" />
                <TextInput
                  type="text"
                  placeholder="email@email.com"
                  id="email"
                />
              </div>
              <div className="">
                <Label value="Your password" />
                <TextInput
                  type="password"
                  placeholder="password"
                  id="password"
                />
              </div>
              <Button gradientDuoTone='purpleToBlue' type="submit" >
                Sign Up
              </Button>
            </form>
            <div className="my-2 text-sm gap-2 flex">
            <span >Have an account ?</span>
            <Link to='/' className="text-blue-500"> Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
