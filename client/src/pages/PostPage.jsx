import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CalltoAction from "../components/CalltoAction";
import CommentSection from "../components/CommentSection";

const PostPage = () => {
  const { postSlug } = useParams();
  const [blogs, setBlogs] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog/get-blog?slug=${postSlug}`);
        const data = await res.json();
        setBlogs(data.posts[0]);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [postSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />;
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {blogs?.title}
      </h1>
      <Link
        to={`/search?category=${blogs?.category}`}
        className="self-center mt-5"
      >
        <Button size="xs" color="grey" pill>
          {blogs?.category}
        </Button>
      </Link>
      <img
        src={blogs?.image}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
        alt={blogs.title}
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(blogs?.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {(blogs?.content?.length / 100 ?? 0).toFixed(0)} mins to read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: blogs?.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CalltoAction />
      </div>
      <CommentSection postId={blogs._id} />
    </main>
  );
};

export default PostPage;
