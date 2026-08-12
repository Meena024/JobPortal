import { STATUS_VARIANTS } from "../../constants/status";

const formatText = (text = "") =>
  text
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (char) => char.toUpperCase());

const Badge = ({
  children,
  status,
  variant,
  size = "medium",
  outline = false,
  className = "",
}) => {
  const badgeVariant =
    variant || (status ? STATUS_VARIANTS[status] : "primary");

  const classes = [
    "badge",
    `badge--${badgeVariant}`,
    size !== "medium" && `badge--${size}`,
    outline && "badge--outline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children || formatText(status)}</span>;
};

export default Badge;
