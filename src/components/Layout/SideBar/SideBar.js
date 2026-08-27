import { useLocation, useNavigate } from "react-router-dom";

import styles from "./SideBar.module.css";

const SideBar = ({ title, menuItems = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>{title}</h2>

      <nav className={styles.navigation}>
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.id === "available" && location.pathname === "/jobseeker");

          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}

              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideBar;
