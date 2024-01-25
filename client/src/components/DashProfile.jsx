import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { app } from "../pages/google/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

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
  const [showModal, setShowModal] = useState(false);
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
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();

      if (!res.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/sign-out", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess(data));
      }
    } catch (error) {
      console.log(error.message);
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
      <Link to={"/create-post"}>
        <Button
          type="button"
          gradientDuoTone="purpleToBlue"
          className="w-full mt-5"
          outline
        >
          Create post
        </Button>
      </Link>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
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
      <Modal
        show={showModal}
        size="md"
        popup
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-24 w-24 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3>Are you sure want to delete your account ???</h3>
            <div className="flex justify-between mt-5">
              <Button onClick={handleDeleteUser} color="failure">
                Delete
              </Button>
              <Button onClick={() => setShowModal(false)} color="gray">
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
