import { useDispatch, useSelector } from "react-redux";

import {
  FaBriefcase,
  FaClipboardList,
  FaBookmark,
  FaCalendarAlt,
  FaFileAlt,
  FaBell,
} from "react-icons/fa";

import DashboardLayout from "../../../components/Layout/DashBoardLayout/DashboardLayout";

import { jobSeekerActions } from "../../../store/jobSeekerSlice";

import AvailableJobs from "./AvailableJobs";
import AppliedJobs from "./AppliedJobs";
import MyResumes from "./MyResumes";
import SavedJobs from "./SavedJobs";
import Notifications from "./Notifications";
import MyInterviews from "./MyInterviews";

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();

  const activeView = useSelector((state) => state.jobs.activeView);

  const notifications = useSelector((state) => state.jobs.notifications || []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  /* =====================================================
     SIDEBAR MENU
  ===================================================== */

  const menuItems = [
    {
      id: "available",
      label: "Available Jobs",
      icon: <FaBriefcase />,
      active: activeView === "available",
      onClick: () => dispatch(jobSeekerActions.setActiveView("available")),
    },

    {
      id: "applied",
      label: "Applied Jobs",
      icon: <FaClipboardList />,
      active: activeView === "applied",
      onClick: () => dispatch(jobSeekerActions.setActiveView("applied")),
    },

    {
      id: "saved",
      label: "Saved Jobs",
      icon: <FaBookmark />,
      active: activeView === "saved",
      onClick: () => dispatch(jobSeekerActions.setActiveView("saved")),
    },

    {
      id: "interviews",
      label: "My Interviews",
      icon: <FaCalendarAlt />,
      active: activeView === "interviews",
      onClick: () => dispatch(jobSeekerActions.setActiveView("interviews")),
    },

    {
      id: "resumes",
      label: "My Resumes",
      icon: <FaFileAlt />,
      active: activeView === "resumes",
      onClick: () => dispatch(jobSeekerActions.setActiveView("resumes")),
    },

    {
      id: "notifications",
      label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
      icon: <FaBell />,
      active: activeView === "notifications",
      onClick: () => dispatch(jobSeekerActions.setActiveView("notifications")),
    },
  ];

  /* =====================================================
     PAGE CONTENT
  ===================================================== */

  const renderPage = () => {
    switch (activeView) {
      case "applied":
        return <AppliedJobs />;

      case "saved":
        return <SavedJobs />;

      case "interviews":
        return <MyInterviews />;

      case "resumes":
        return <MyResumes />;

      case "notifications":
        return <Notifications />;

      case "available":
      default:
        return <AvailableJobs />;
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DashboardLayout sidebarTitle="Job Seeker Panel" menuItems={menuItems}>
      {renderPage()}
    </DashboardLayout>
  );
};

export default JobSeekerDashboard;
