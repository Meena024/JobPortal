import { useState } from "react";
import { useDispatch } from "react-redux";

import { statusChangeHandler } from "../../../../../store/recruiterActions";

import RejectDialog from "./RejectDialog";
import SelectDialog from "./SelectDialog";

import styles from "./ApplicationStatusActions.module.css";

const ApplicationStatusActions = ({ app, disabled = false }) => {
  const dispatch = useDispatch();

  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const [showSelectDialog, setShowSelectDialog] = useState(false);

  /* =====================================================
     STATUS UPDATE
  ===================================================== */

  const updateStatus = async (status) => {
    if (disabled) {
      return;
    }

    try {
      await dispatch(statusChangeHandler(app, status));
    } catch (error) {
      console.error("Unable to update application status:", error);
    }
  };

  /* =====================================================
     REJECT
  ===================================================== */

  const rejectHandler = async (reason) => {
    if (disabled) {
      return;
    }

    try {
      await dispatch(
        statusChangeHandler(app, "rejected", {
          rejectedAt: new Date().toISOString(),
          rejectedBy: app.recruiterId,
          reason,
        }),
      );

      setShowRejectDialog(false);
    } catch (error) {
      console.error("Unable to reject application:", error);
    }
  };

  /* =====================================================
     SELECT
  ===================================================== */

  const selectHandler = async () => {
    if (disabled) {
      return;
    }

    try {
      await dispatch(statusChangeHandler(app, "selected"));

      setShowSelectDialog(false);
    } catch (error) {
      console.error("Unable to select application:", error);
    }
  };

  /* =====================================================
     DISABLED / TERMINAL STATES
  ===================================================== */

  if (disabled || app.status === "selected" || app.status === "rejected") {
    return null;
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <div className={styles.container}>
        {/* ===============================================
            PENDING
        =============================================== */}

        {app.status === "pending" && (
          <>
            <button
              type="button"
              className="btn btn--success"
              onClick={() => updateStatus("reviewed")}
            >
              Review
            </button>

            <button
              type="button"
              className="btn btn--danger"
              onClick={() => setShowRejectDialog(true)}
            >
              Reject
            </button>
          </>
        )}

        {/* ===============================================
            REVIEWED
        =============================================== */}

        {app.status === "reviewed" && (
          <>
            <button
              type="button"
              className="btn btn--success"
              onClick={() => updateStatus("shortlisted")}
            >
              Shortlist
            </button>

            <button
              type="button"
              className="btn btn--danger"
              onClick={() => setShowRejectDialog(true)}
            >
              Reject
            </button>
          </>
        )}

        {/* ===============================================
            SHORTLISTED
        =============================================== */}

        {app.status === "shortlisted" && (
          <>
            <button
              type="button"
              className="btn btn--success"
              onClick={() => setShowSelectDialog(true)}
            >
              Select
            </button>

            <button
              type="button"
              className="btn btn--danger"
              onClick={() => setShowRejectDialog(true)}
            >
              Reject
            </button>
          </>
        )}
      </div>

      {/* ===============================================
          REJECT DIALOG
      =============================================== */}

      <RejectDialog
        open={showRejectDialog}
        onCancel={() => setShowRejectDialog(false)}
        onConfirm={rejectHandler}
      />

      {/* ===============================================
          SELECT DIALOG
      =============================================== */}

      <SelectDialog
        open={showSelectDialog}
        onCancel={() => setShowSelectDialog(false)}
        onConfirm={selectHandler}
      />
    </>
  );
};

export default ApplicationStatusActions;
