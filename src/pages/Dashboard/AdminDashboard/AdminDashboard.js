import { useState } from "react";

import PendingJobs from "./PendingJobs";
import UsersList from "./UsersList";
import Applications from "./Applications";

import classes from "../../../Styling/Pages/AdminDashboard/AdminDashboard.module.css";

const AdminDashboard = () => {
  const [view, setView] = useState("jobs");

  return (
    <div className={classes.dashboard}>
      {/* SIDEBAR */}

      <aside className={classes.sidebar}>
        <h2>Admin Panel</h2>

        <button
          className={view === "jobs" ? classes.active : ""}
          onClick={() => setView("jobs")}
        >
          Pending Jobs
        </button>

        <button
          className={view === "users" ? classes.active : ""}
          onClick={() => setView("users")}
        >
          Manage Users
        </button>

        <button
          className={view === "applications" ? classes.active : ""}
          onClick={() => setView("applications")}
        >
          Applications
        </button>
      </aside>

      {/* CONTENT */}

      <main className={classes.content}>
        {view === "jobs" && <PendingJobs />}

        {view === "users" && <UsersList />}

        {view === "applications" && <Applications />}
      </main>
    </div>
  );
};

export default AdminDashboard;
