import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaTrash,
} from "react-icons/fa";

import { removeUser } from "../../../store/adminActions";

import styles from "./ManageUsers.module.css";

const ManageUsers = () => {
  const dispatch = useDispatch();

  const allUsers = useSelector((state) => state.admin.allUsers || []);

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState(null);

  /* =====================================================
     ROLE OPTIONS
  ===================================================== */

  const roles = useMemo(() => {
    return [
      ...new Set(allUsers.map((user) => user.role).filter(Boolean)),
    ].sort();
  }, [allUsers]);

  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    const result = allUsers.filter((user) => {
      const email = (user.email || "").toLowerCase();
      const role = (user.role || "").toLowerCase();

      const matchesSearch =
        !search || email.includes(search) || role.includes(search);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    if (sortDirection) {
      result.sort((a, b) => {
        const emailA = (a.email || "").toLowerCase();
        const emailB = (b.email || "").toLowerCase();

        const comparison = emailA.localeCompare(emailB);

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [allUsers, searchText, roleFilter, sortDirection]);

  /* =====================================================
     SORT
  ===================================================== */

  const handleSort = () => {
    setSortDirection((current) => {
      if (current === null) return "asc";
      if (current === "asc") return "desc";
      return null;
    });
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(removeUser(userId));
    } catch (error) {
      console.error("Unable to delete user:", error);

      window.alert("Unable to delete user.");
    }
  };

  /* =====================================================
     SORT ICON
  ===================================================== */

  const renderSortIcon = () => {
    if (sortDirection === "asc") {
      return <FaSortUp />;
    }

    if (sortDirection === "desc") {
      return <FaSortDown />;
    }

    return <FaSort />;
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className={styles.page}>
      {/* =================================================
          HEADER
      ================================================= */}

      <header className={styles.header}>
        <h2 className="page-title">Manage Users</h2>

        <div className={styles.search}>
          <input
            type="search"
            className="input"
            placeholder="Search users or roles..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      {allUsers.length === 0 ? (
        <div className={styles.empty}>No users found.</div>
      ) : (
        <div className={styles.table}>
          {/* =============================================
              TABLE HEADER
          ============================================= */}

          <div className={styles.tableHeader}>
            <div className={styles.userHeader}>
              <span>User</span>

              <button
                type="button"
                className={styles.sortButton}
                onClick={handleSort}
                aria-label="Sort users by email"
                title="Sort by email"
              >
                {renderSortIcon()}
              </button>
            </div>

            <div className={styles.roleHeader}>
              <span>Role</span>

              <FaFilter />

              <select
                className={`select ${styles.roleSelect}`}
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                aria-label="Filter users by role"
              >
                <option value="all">All</option>

                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* =============================================
              USER ROWS
          ============================================= */}

          {filteredUsers.length === 0 ? (
            <div className={styles.empty}>
              No users match the selected filters.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className={styles.userRow}>
                <div className={styles.userCell}>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleDelete(user.id)}
                    aria-label={`Delete ${user.email}`}
                    title="Delete user"
                  >
                    <FaTrash />
                  </button>
                  <span className={styles.email}>{user.email}</span>
                </div>

                <div className={styles.role}>{user.role}</div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default ManageUsers;
