import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiCheck, HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUsers = () => {
  const [users, setusers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState("");
  useEffect(() => {
    const getusers = async () => {
      try {
        const res = await fetch(`/api/user/get-users`);

        const data = await res.json();
        if (res.ok) {
          setusers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      getusers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `/api/blog/get-blog?userId=${currentUser._id}&startIndex=${startIndex}`
      );

      const data = await res.json();

      if (res.ok) {
        setusers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteUser = async () => {
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
        setusers((prev) => {
          const indexToRemove = prev.findIndex((post) => post._id === postId);
          if (indexToRemove !== -1) {
            const updatedusers = [
              ...prev.slice(0, indexToRemove),
              ...prev.slice(indexToRemove + 1),
            ];
            return updatedusers;
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
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((users) => (
              <Table.Body className="divide-y" key={users._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(users.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/blog/${users.slug}`}>
                      <img
                        alt={users.username}
                        className="w-10 h-10 object-cover rounded-full bg-gray-500"
                        src={users.profilePicture}
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/blog/${users.slug}`}>{users.username}</Link>
                  </Table.Cell>
                  <Table.Cell>{users.email}</Table.Cell>
                  <Table.Cell>
                    {users.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostId(users._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
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
        <p>You have no Users yet!</p>
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
            <h3>Are you sure want to delete this User ???</h3>
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

export default DashUsers;
