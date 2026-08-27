import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus, FaBriefcase, FaUsers, FaCalendarAlt } from "react-icons/fa";

import DashboardLayout from "./../../components/Layout/DashBoardLayout/DashboardLayout";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* =====================================================
     SIDEBAR MENU
  ===================================================== */

  const menuItems = [
    {
      id: "create",
      label: "Create Job",
      path: "/recruiter/create",
      icon: <FaPlus />,
    },

    {
      id: "jobs",
      label: "My Jobs",
      path: "/recruiter/jobs",
      icon: <FaBriefcase />,
    },

    {
      id: "applications",
      label: "Applications",
      path: "/recruiter/applications",
      icon: <FaUsers />,
    },

    {
      id: "interviews",
      label: "Interviews",
      path: "/recruiter/interviews",
      icon: <FaCalendarAlt />,
    },
  ];

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DashboardLayout
      sidebarTitle="Recruiter Panel"
      menuItems={menuItems.map((item) => ({
        ...item,
        active: location.pathname === item.path,
        onClick: () => navigate(item.path),
      }))}
    ></DashboardLayout>
  );
};

export default RecruiterDashboard;
