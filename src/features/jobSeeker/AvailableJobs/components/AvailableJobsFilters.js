import classes from "./AvailableJobsFilters.module.css";

const AvailableJobsFilters = ({
  locationFilter,
  packageFilter,
  locations,
  onLocationChange,
  onPackageChange,
}) => {
  return (
    <div className={classes.filters}>
      {/* =================================================
          LOCATION
      ================================================= */}

      <select
        className="input"
        value={locationFilter}
        onChange={(event) => onLocationChange(event.target.value)}
        aria-label="Filter by location"
      >
        <option value="all">All Locations</option>

        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>

      {/* =================================================
          PACKAGE
      ================================================= */}

      <select
        className="input"
        value={packageFilter}
        onChange={(event) => onPackageChange(event.target.value)}
        aria-label="Filter by package"
      >
        <option value="all">All Packages</option>

        <option value="0-5">0 – 5 LPA</option>

        <option value="5-10">5 – 10 LPA</option>

        <option value="10+">10+ LPA</option>
      </select>
    </div>
  );
};

export default AvailableJobsFilters;
