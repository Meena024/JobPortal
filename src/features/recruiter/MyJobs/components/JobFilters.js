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
      key: "package",
      label: "All Packages",
      options: [
        {
          value: "0 - 2 LPA",
          label: "0 - 2 LPA",
        },
        {
          value: "2 - 4 LPA",
          label: "2 - 4 LPA",
        },
        {
          value: "4 - 6 LPA",
          label: "4 - 6 LPA",
        },
        {
          value: "6 - 8 LPA",
          label: "6 - 8 LPA",
        },
        {
          value: "8 - 10 LPA",
          label: "8 - 10 LPA",
        },
        {
          value: "10 - 12 LPA",
          label: "10 - 12 LPA",
        },
        {
          value: "12 - 15 LPA",
          label: "12 - 15 LPA",
        },
        {
          value: "15 - 20 LPA",
          label: "15 - 20 LPA",
        },
        {
          value: "20+ LPA",
          label: "20+ LPA",
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
          onChange={(event) => onFilterChange(filter.key, event.target.value)}
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
