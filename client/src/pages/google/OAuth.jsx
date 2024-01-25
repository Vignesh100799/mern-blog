import { Button } from "flowbite-react";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import {useDispatch} from "react-redux"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "./firebase.js";
import { signInFailure, signInStart, signInSuccess } from "../../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
    const dispatch = useDispatch()
    const  navigate = useNavigate()
  const auth = getAuth(app);
  const logInWithGoolgle = async () => {
    dispatch(signInStart())
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
        
      const resultFromGoolgle = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({token :resultFromGoolgle.user.accessToken}),
      });
      const data = await res.json();
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate("/")
      }
    //   console.log(data);
    } catch (error) {
      dispatch(signInFailure(error))
    }
  };
  return (
    <Button onClick={logInWithGoolgle} gradientDuoTone="pinkToOrange" outline>
      <FaGoogle className=" w-5 h-5 mr-2" />
      Continue with google
    </Button>
  );
};

export default OAuth;
