import styles from "../MyJobs.module.css";

const JobFilters = ({ filters, options, onFilterChange }) => {
  const filterConfig = [
    {
      key: "title",
      label: "All Titles",
      options: options.titles,
    },
    {
      key: "company",
      label: "All Companies",
      options: options.companies,
    },
    {
      key: "location",
      label: "All Locations",
      options: options.locations,
    },
    {
      key: "salary",
      label: "All Salaries",
      options: [
        {
          value: "0-5",
          label: "0 - 5 LPA",
        },
        {
          value: "5-10",
          label: "5 - 10 LPA",
        },
        {
          value: "10+",
          label: "10+ LPA",
        },
      ],
    },
    {
      key: "status",
      label: "All Status",
      options: [
        {
          value: "approved",
          label: "Approved",
        },
        {
          value: "rejected",
          label: "Rejected",
        },
        {
          value: "pending",
          label: "Pending",
        },
      ],
    },
    {
      key: "openingStatus",
      label: "All Openings",
      options: [
        {
          value: "open",
          label: "Open",
        },
        {
          value: "closed",
          label: "Closed",
        },
      ],
    },
  ];

  return (
    <div className={styles.filters}>
      {filterConfig.map((filter) => (
        <select
          key={filter.key}
          className="select"
          value={filters[filter.key]}
          onChange={(e) => onFilterChange(filter.key, e.target.value)}
        >
          <option value="all">{filter.label}</option>

          {filter.options.map((option) => {
            const value = typeof option === "string" ? option : option.value;

            const label = typeof option === "string" ? option : option.label;

            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      ))}
    </div>
  );
};

export default JobFilters;
