import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPosts = () => {
  const [blogs, setBlogs] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState("");
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await fetch(`/api/blog/get-blog?userId=${currentUser._id}`);

        const data = await res.json();

        if (res.ok) {
          setBlogs(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      getBlogs();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = blogs.length;
    try {
      const res = await fetch(
        `/api/blog/get-blog?userId=${currentUser._id}&startIndex=${startIndex}`
      );

      const data = await res.json();

      if (res.ok) {
        setBlogs((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/blog/delete-blog/${postId}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setBlogs((prev) => {
          const indexToRemove = prev.findIndex((post) => post._id === postId);
          if (indexToRemove !== -1) {
            const updatedBlogs = [
              ...prev.slice(0, indexToRemove),
              ...prev.slice(indexToRemove + 1),
            ];
            return updatedBlogs;
          }
          return prev;
        });
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto w-full overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && blogs.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Uploaded</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {blogs.map((posts) => (
              <Table.Body className="divide-y" key={posts._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(posts.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/blog/${posts.slug}`}>
                      <img
                        alt={posts.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                        src={posts.image}
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/blog/${posts.slug}`}>{posts.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{posts.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostId(posts._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${posts._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              className="w-full text-teal-500 self-center text-sm py-7"
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
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
            <h3>Are you sure want to delete this blog ???</h3>
            <div className="flex justify-between mt-5">
              <Button onClick={handleDeletePost} color="failure">
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

export default DashPosts;
