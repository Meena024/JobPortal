import styles from "../AppliedJobs.module.css";

const ApplicationFilters = ({
  statusFilter,
  openingStatusFilter,
  onStatusChange,
  onOpeningStatusChange,
}) => {
  return (
    <div className={styles.filters}>
      <select
        className={styles.filterDropdown}
        value={statusFilter}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="all">All Statuses</option>

        <option value="pending">Pending</option>

        <option value="reviewed">Reviewed</option>

        <option value="shortlisted">Shortlisted</option>

        <option value="selected">Selected</option>

        <option value="rejected">Rejected</option>
      </select>

      <select
        className={styles.filterDropdown}
        value={openingStatusFilter}
        onChange={(event) => onOpeningStatusChange(event.target.value)}
      >
        <option value="all">All Openings</option>

        <option value="open">Open</option>

        <option value="closed">Closed</option>
      </select>
    </div>
  );
};

export default ApplicationFilters;
