import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaBriefcase, FaUsers, FaCalendarAlt } from "react-icons/fa";

import DashboardLayout from "./../../components/Layout/DashBoardLayout/DashboardLayout";

import { recruiterActions } from "./../../store/recruiterSlice";

import CreateJob from "./CreateJob/CreateJob";
import MyJobs from "./MyJobs/MyJobs";
import RecruiterApplications from "./RecruiterApplications/RecruiterApplications";
import RecruiterInterviews from "./RecruiterInterviews/RecruiterInterviews";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();

  const activeView = useSelector((state) => state.recruiter.activeView);

  /* =====================================================
     SIDEBAR MENU
  ===================================================== */

  const menuItems = [
    {
      id: "create",
      label: "Create Job",
      icon: <FaPlus />,
      active: activeView === "create",
      onClick: () => dispatch(recruiterActions.setActiveView("create")),
    },

    {
      id: "jobs",
      label: "My Jobs",
      icon: <FaBriefcase />,
      active: activeView === "jobs",
      onClick: () => dispatch(recruiterActions.setActiveView("jobs")),
    },

    {
      id: "applications",
      label: "Applications",
      icon: <FaUsers />,
      active: activeView === "applications",
      onClick: () => dispatch(recruiterActions.setActiveView("applications")),
    },

    {
      id: "interviews",
      label: "Interviews",
      icon: <FaCalendarAlt />,
      active: activeView === "interviews",
      onClick: () => dispatch(recruiterActions.setActiveView("interviews")),
    },
  ];

  /* =====================================================
     PAGE CONTENT
  ===================================================== */

  const renderPage = () => {
    switch (activeView) {
      case "create":
        return <CreateJob />;

      case "applications":
        return <RecruiterApplications />;

      case "interviews":
        return <RecruiterInterviews />;

      case "jobs":
      default:
        return <MyJobs />;
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DashboardLayout sidebarTitle="Recruiter Panel" menuItems={menuItems}>
      {renderPage()}
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
