import { useState } from "react";

import { FaBriefcase, FaUsers, FaClipboardList, FaList } from "react-icons/fa";

import DashboardLayout from "../../../components/Layout/DashBoardLayout/DashboardLayout";

import PendingJobs from "./PendingJobs";
import ManageUsers from "../../../features/admin/ManageUsers/ManageUsers";
import Applications from "./Applications";
import AllJobs from "./AllJobs";

const AdminDashboard = () => {
  const [view, setView] = useState("jobs");

  /* =====================================================
     SIDEBAR MENU
  ===================================================== */

  const menuItems = [
    {
      id: "jobs",
      label: "Pending Jobs",
      icon: <FaBriefcase />,
      active: view === "jobs",
      onClick: () => setView("jobs"),
    },

    {
      id: "users",
      label: "Manage Users",
      icon: <FaUsers />,
      active: view === "users",
      onClick: () => setView("users"),
    },

    {
      id: "allJobs",
      label: "All Jobs",
      icon: <FaList />,
      active: view === "allJobs",
      onClick: () => setView("allJobs"),
    },

    {
      id: "applications",
      label: "Applications",
      icon: <FaClipboardList />,
      active: view === "applications",
      onClick: () => setView("applications"),
    },
  ];

  /* =====================================================
     PAGE CONTENT
  ===================================================== */

  const renderPage = () => {
    switch (view) {
      case "users":
        return <ManageUsers />;

      case "allJobs":
        return <AllJobs />;

      case "applications":
        return <Applications />;

      case "jobs":
      default:
        return <PendingJobs />;
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DashboardLayout sidebarTitle="Admin Panel" menuItems={menuItems}>
      {renderPage()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
