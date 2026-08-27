import { Outlet } from "react-router-dom";

import {
  FaBriefcase,
  FaClipboardList,
  FaBookmark,
  FaCalendarAlt,
  FaFileAlt,
} from "react-icons/fa";

import DashboardLayout from "../../components/Layout/DashBoardLayout/DashboardLayout";

const JobSeekerDashboard = () => {
  /* =====================================================
     SIDEBAR MENU
  ===================================================== */

  const menuItems = [
    {
      id: "available",
      label: "Available Jobs",
      icon: <FaBriefcase />,
      path: "/jobseeker/available",
    },

    {
      id: "applied",
      label: "Applied Jobs",
      icon: <FaClipboardList />,
      path: "/jobseeker/applied",
    },

    {
      id: "saved",
      label: "Saved Jobs",
      icon: <FaBookmark />,
      path: "/jobseeker/saved",
    },

    {
      id: "interviews",
      label: "My Interviews",
      icon: <FaCalendarAlt />,
      path: "/jobseeker/interviews",
    },

    {
      id: "resumes",
      label: "My Resumes",
      icon: <FaFileAlt />,
      path: "/jobseeker/resumes",
    },
  ];

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DashboardLayout sidebarTitle="Job Seeker Panel" menuItems={menuItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default JobSeekerDashboard;
