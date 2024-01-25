import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
const DashPosts = () => {
  const [blogs, setBlogs] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await fetch(`/api/blog/get-blog?userId=${currentUser._id}`);

        const data = await res.json();

        if (res.ok) {
          setBlogs(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      getBlogs();
    }
  }, [currentUser._id]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && blogs.length > 0 ? (
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
            <Table.Body key={posts._id}>
              <Table.Row>
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
                  <span className="font-medium text-red-500 hover:underline cursor-pointer">
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>
                  {" "}
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
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
};

export default DashPosts;
