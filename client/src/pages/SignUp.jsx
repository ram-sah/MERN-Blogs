import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    // console.log(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Each fields must be fill out !");
    }
    try {
      setErrorMessage(null);
      setLoading(true);
      const res = await fetch('/api/auth/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
      setErrorMessage(null)
    }
  }
  return (
    <>
      <div className="min-h-screen mt-20 ">
        <div className="main flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-5">
          <div className="left flex-1">
            <Link
              to="/"
              className=" dark:text-white font-bold text-4xl"
            >
              <span className="px-8 py-2 bg-gradient-to-r from-blue-500 via-purple-400 to-blue-400 rounded-lg text-white">
                Ram's
              </span>
              Blog
            </Link>
            <div className="text-sm mt-6" ><h1 className=" text-2xl text-blue-600 font-thin tracking-wider">Publish your passions, your way</h1>
              <p className="my-1">Signup with your email or with google account.</p></div>
          </div>
          <div className="right flex-1">

            {/* alert error on blank submit */}
            <div>
              {
                errorMessage && (
                  <Alert className="mb-10" color="failure">
                    {errorMessage}
                  </Alert>
                )
              }
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="">
                <Label value="Your username" />
                <TextInput
                  type="text"
                  placeholder="username"
                  id="username" onChange={handleChange}
                />
              </div>
              <div className="">
                <Label value="Your email" />
                <TextInput
                  type="text"
                  placeholder="email@email.com"
                  id="email" onChange={handleChange}
                />
              </div>
              <div className="">
                <Label value="Your password" />
                <TextInput
                  type="password"
                  placeholder="password"
                  id="password" onChange={handleChange}
                />
              </div>
              <Button gradientDuoTone='purpleToBlue' type="submit" disabled={loading}>
                {
                  loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-5">Loading...</span>
                    </>
                  ) : ('Sign Up')
                }
              </Button>
              <OAuth />
            </form>
            <div className="my-2 text-sm gap-2 flex">
              <span >Have an account ?</span>
              <Link to='/sign-in' className="text-blue-500"> Sign In</Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
