import { Sidebar, SidebarItem } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiArrowCircleRight, HiDocumentText, HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
const DashSide = () => {
  const [tab, setTab] = useState();
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab");
    if (tabUrl) {
      setTab(tabUrl);
    }
  }, [location.search]);
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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor={theme === "light" ? "dark" : "light"}
              as="div"
              icon={HiUser}
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to={"/dashboard?tab=blogs"}>
            <Sidebar.Item
              active={tab === "blogs"}
              labelColor={theme === "light" ? "dark" : "light"}
              as="div"
              icon={HiDocumentText}
            >
              Blogs
            </Sidebar.Item>
          </Link>
          <SidebarItem icon={HiArrowCircleRight} onClick={handleSignOut}>
            Sign Out
          </SidebarItem>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSide;
