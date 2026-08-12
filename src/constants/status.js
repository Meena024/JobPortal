export const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  REVIEWED: "reviewed",
  SHORTLISTED: "shortlisted",
  SELECTED: "selected",

  OPEN: "open",
  CLOSED: "closed",

  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",

  ACTIVE: "active",
  INACTIVE: "inactive",

  READ: "read",
  UNREAD: "unread",
};

export const STATUS_VARIANTS = {
  [STATUS.PENDING]: "warning",

  [STATUS.APPROVED]: "success",

  [STATUS.REJECTED]: "danger",

  [STATUS.REVIEWED]: "info",

  [STATUS.SHORTLISTED]: "primary",

  [STATUS.SELECTED]: "success",

  [STATUS.OPEN]: "success",

  [STATUS.CLOSED]: "secondary",

  [STATUS.SCHEDULED]: "primary",

  [STATUS.COMPLETED]: "success",

  [STATUS.CANCELLED]: "danger",

  [STATUS.ACTIVE]: "success",

  [STATUS.INACTIVE]: "secondary",

  [STATUS.READ]: "secondary",

  [STATUS.UNREAD]: "warning",
};
