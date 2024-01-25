import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../pages/google/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { set } from "mongoose";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const filePickref = useRef();
  const [imagefile, setImagefile] = useState(null);
  const [imgUrl, setImgurl] = useState(null);
  const [imgUploadingProgress, setImgUploadingProgress] = useState(null);
  const [imgUploadingError, setImgUploadingError] = useState(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserFailure, setUpdateUserFailure] = useState(null);

  const dispatch = useDispatch();
  const handleChangeImg = (e) => {
    const img = e.target.files[0];
    if (img) {
      setImagefile(img);
      setImgurl(URL.createObjectURL(img));
    }
  };
  useEffect(() => {
    if (imagefile) {
      uploadImg();
    }
  }, [imagefile]);

  const uploadImg = async () => {
    setImgUploading(true);
    setImgUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imagefile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imagefile);
    uploadTask.on(
      "state_changed",
      (snapchat) => {
        const progress =
          (snapchat.bytesTransferred / snapchat.totalBytes) * 100;
        setImgUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImgUploadingError(
          "Could not upload image (File must be less than 2MB)"
        ),
          setImgUploadingProgress(null),
          setImgurl(null),
          setImgUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL });
          setImgurl(downloadURL);
          setImgUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserFailure(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserFailure("No changes made");
      return;
    }
    if (imgUploading) {
      setUpdateUserFailure("Please wait for image uploading");
      return;
    }

    try {
      dispatch(updateStart);
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
        setUpdateUserFailure(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User updated Successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form
        onSubmit={handleSubmit}
        type="submit"
        className="flex flex-col gap-4"
      >
        <input
          type="file"
          onChange={handleChangeImg}
          accept="image/*"
          ref={filePickref}
          hidden
        />
        <div
          onClick={() => filePickref.current.click()}
          className="relative w-32 h-32 self-center cursor-pointer shadow-xl overflow-hidden rounded-full"
        >
          {imgUploadingProgress && (
            <CircularProgressbar
              value={imgUploadingProgress || 0}
              text={`${imgUploadingProgress}%`}
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
                  stroke: `rgba(62,152,199,${imgUploadingProgress / 100})`,
                },
              }}
            />
          )}
          <img
            alt="user"
            src={imgUrl || currentUser.profilePicture}
            className={`rounded-full h-full w-full border-8 object-cover border-[lightgrey] ${
              imgUploadingProgress && imgUploadingProgress < 100 && "opacity-60"
            }`}
          />
        </div>
        {imgUploadingError && (
          <Alert color="failure">{imgUploadingError}</Alert>
        )}
        <TextInput
          onChange={handleChange}
          defaultValue={currentUser.username}
          type="text"
          placeholder="username"
          id="username"
        />
        <TextInput
          onChange={handleChange}
          defaultValue={currentUser.email}
          type="email"
          placeholder="email"
          id="email"
        />
        <TextInput
          onChange={handleChange}
          type="password"
          placeholder="password"
          id="password"
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          className="w-full"
          outline
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserFailure && (
        <Alert className="mt-5" color="failure">
          {updateUserFailure}
        </Alert>
      )}
      {updateUserSuccess && (
        <Alert className="mt-5" color="success">
          {updateUserSuccess}
        </Alert>
      )}
    </div>
  );
};

export default DashProfile;
