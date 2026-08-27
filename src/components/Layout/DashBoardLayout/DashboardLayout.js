import { Outlet } from "react-router-dom";

import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";

import styles from "./DashboardLayout.module.css";

const DashboardLayout = ({ sidebarTitle, menuItems = [] }) => {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.body}>
        <SideBar title={sidebarTitle} menuItems={menuItems} />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
