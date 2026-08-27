import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { FaBriefcase, FaUsers, FaClipboardList, FaList } from "react-icons/fa";

import DashboardLayout from "./../../components/Layout/DashBoardLayout/DashboardLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* =====================================================
     SIDEBAR MENU
  ===================================================== */

  const menuItems = [
    {
      id: "users",
      label: "Manage Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },

    {
      id: "jobs",
      label: "Job Approval",
      path: "/admin/jobs",
      icon: <FaBriefcase />,
    },

    {
      id: "allJobs",
      label: "All Jobs",
      path: "/admin/all-jobs",
      icon: <FaList />,
    },

    {
      id: "applications",
      label: "Applications",
      path: "/admin/applications",
      icon: <FaClipboardList />,
    },
  ];

  /* =====================================================
     ADD ACTIVE STATE
  ===================================================== */

  const menuItemsWithActiveState = menuItems.map((item) => ({
    ...item,

    active: location.pathname === item.path,

    onClick: () => navigate(item.path),
  }));

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DashboardLayout
      sidebarTitle="Admin Panel"
      menuItems={menuItemsWithActiveState}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;
