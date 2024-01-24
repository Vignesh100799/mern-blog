import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice.js";
import OAuth from "./google/OAuth.jsx";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold text-4xl dark:text-white">
            <span className="px-2 py-1 rounded-lg text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 ">
              Vignesh's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign In with your email and password
            or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label value="Email" />
              <TextInput
                onChange={handleChange}
                placeholder="Email"
                type="email"
                id="email"
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                onChange={handleChange}
                placeholder="************"
                type="password"
                id="password"
              />
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit">
              {loading ? (
                <>
                  <Spinner size="sm"></Spinner>
                  <span>Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="gap-2 flex text-sm mt-5">
            <span>Don't Have an Account ?</span>
            <Link to={"/sign-up"} className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {error && (
            <Alert className="mt-5">
              <span className=" text-red-600">{error}</span>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
