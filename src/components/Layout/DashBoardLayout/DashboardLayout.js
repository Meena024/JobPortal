import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";

import styles from "./DashboardLayout.module.css";

const DashboardLayout = ({ sidebarTitle, menuItems = [], children }) => {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.body}>
        <SideBar title={sidebarTitle} menuItems={menuItems} />

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
