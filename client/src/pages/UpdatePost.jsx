import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./google/firebase.js";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {
  const [file, setFile] = useState(null);
  const [imgUploadError, setImgUploadError] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(null);
  const [blogData, setBlogData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/blog/get-blog?postId=${postId}`);
        const data = await res.json();

        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setBlogData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      setPublishError(error.message);
    }
  }, [postId]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `/api/blog/update-blog/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/blog/${data.slug}`);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };

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
          setImgUploadError(
            "Could not upload image (File must be less than 2MB)"
          );
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
      <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            onChange={(e) =>
              setBlogData({ ...blogData, title: e.target.value })
            }
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={blogData.title}
          />
          <Select
            onChange={(e) =>
              setBlogData({ ...blogData, category: e.target.value })
            }
            value={blogData.category}
          >
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
        {imgUploadError && <Alert color="failure">{imgUploadError}</Alert>}
        {blogData.image && (
          <img
            src={blogData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          id="content"
          theme="snow"
          value={blogData.content}
          placeholder="Write Something...."
          className="h-72 mb-12"
          onChange={(value) => {
            setBlogData({ ...blogData, content: value });
          }}
          required
        />

        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update Post
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdatePost;
