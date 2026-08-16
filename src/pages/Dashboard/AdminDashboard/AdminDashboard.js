import { useState } from "react";

import { FaBriefcase, FaUsers, FaClipboardList, FaList } from "react-icons/fa";

import DashboardLayout from "../../../components/Layout/DashBoardLayout/DashboardLayout";

import JobApproval from "../../../features/admin/JobApproval/JobApproval";
import ManageUsers from "../../../features/admin/ManageUsers/ManageUsers";
import Applications from "./Applications";
import AllJobs from "../../../features/admin/AllJobs/AllJobs";

const AdminDashboard = () => {
  const [view, setView] = useState("jobs");

  /* =====================================================
     SIDEBAR MENU
  ===================================================== */

  const menuItems = [
    {
      id: "users",
      label: "Manage Users",
      icon: <FaUsers />,
      active: view === "users",
      onClick: () => setView("users"),
    },

    {
      id: "jobs",
      label: "Job Approval",
      icon: <FaBriefcase />,
      active: view === "jobs",
      onClick: () => setView("jobs"),
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
        return <JobApproval />;
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
