import styles from "./SideBar.module.css";

const SideBar = ({ title, menuItems = [] }) => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>{title}</h2>

      <nav className={styles.navigation}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.menuItem} ${item.active ? styles.active : ""}`}
            onClick={item.onClick}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}

            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
