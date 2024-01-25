import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./google/firebase.js";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imgUploadError, setImgUploadError] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(null);
  const [blogData, setBlogData] = useState({});

  const handleImgUpload = async () => {
    try {
      if (!file) {
        setImgUploadError("Please select an image");
      }

      setImgUploadError(null);
      const storage = getStorage(app);
      const filename = new Date().getTime() + "-" + file.name;

      const storageRef = ref(storage, filename);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImgUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImgUploadError("Could not upload image (File must be less than 2MB)");
          setImgUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImgUploadProgress(null);
            setImgUploadError(null);
            setBlogData({ ...blogData, image: downloadUrl });
          });
        }
      );
    } catch (error) {
      setImgUploadProgress(null);
      setImgUploadError("Image uploading failed");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            outline
            gradientDuoTone="purpleToBlue"
            type="button"
            size="sm"
            onClick={handleImgUpload}
          >
            {imgUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imgUploadProgress}
                  text={`${imgUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
          {imgUploadError && <Alert color='failure'>{imgUploadError}</Alert>}
          {blogData.image && (
          <img
            src={blogData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          id="content"
          theme="snow"
          placeholder="Write Something...."
          className="h-72 mb-12"
          required
        />

        <Button type="submit" gradientDuoTone="purpleToBlue">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
