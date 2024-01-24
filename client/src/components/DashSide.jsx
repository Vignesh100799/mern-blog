import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiArrowCircleRight, HiUser } from "react-icons/hi";
import { useSelector } from "react-redux";
const DashSide = () => {
  const [tab, setTab] = useState();
  const location = useLocation();
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab");
    if (tabUrl) {
      setTab(tabUrl);
    }
  }, [location.search]);
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              label="User"
              labelColor={theme === "light" ? "dark" : "light"}
              as="div"
              icon={HiUser}
            >
              Profile
            </Sidebar.Item>
          </Link>
          <SidebarItem icon={HiArrowCircleRight}>Sign Out</SidebarItem>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSide;
