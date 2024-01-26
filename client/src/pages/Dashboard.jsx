import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSide from "../components/DashSide";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";

const Dashboard = () => {
  const [tab, setTab] = useState();
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab");
    if (tabUrl) {
      setTab(tabUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSide />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "blogs" && <DashPosts />}
      {tab === "users" && <DashUsers />}

    </div>
  );
};

export default Dashboard;
