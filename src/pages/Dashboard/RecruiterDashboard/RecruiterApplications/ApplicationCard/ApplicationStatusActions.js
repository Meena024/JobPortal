import { useState } from "react";
import { useDispatch } from "react-redux";

import { statusChangeHandler } from "../../../../../store/recruiterActions";

import RejectDialog from "./dialogs/RejectDialog";
import SelectDialog from "./dialogs/SelectDialog";

import styles from "../../../../../Styling/Pages/RecruiterDashboard/RecruiterApplications/ApplicationCard/ApplicationStatusActions.module.css";

const ApplicationStatusActions = ({ app }) => {
  const dispatch = useDispatch();

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showSelectDialog, setShowSelectDialog] = useState(false);

  const updateStatus = async (status) => {
    try {
      await dispatch(statusChangeHandler(app, status));
    } catch (err) {
      console.error(err);
    }
  };

  const rejectHandler = async (reason) => {
    try {
      await dispatch(
        statusChangeHandler(app, "rejected", {
          rejectedAt: new Date().toISOString(),
          rejectedBy: app.recruiterId,
          reason,
        }),
      );

      setShowRejectDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  const selectHandler = async ({ sendOfferNow }) => {
    try {
      await dispatch(statusChangeHandler(app, "selected"));

      // Used by OfferLetterSection
      if (sendOfferNow) {
        // We'll connect this in ApplicationCard later.
      }

      setShowSelectDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className={styles.container}>
        {/* Pending */}

        {app.status === "pending" && (
          <button
            className={`${styles.btn} ${styles.reviewBtn}`}
            onClick={() => updateStatus("reviewed")}
          >
            Review Application
          </button>
        )}

        {/* Reviewed */}

        {app.status === "reviewed" && (
          <>
            <button
              className={`${styles.btn} ${styles.shortlistBtn}`}
              onClick={() => updateStatus("shortlisted")}
            >
              Shortlist
            </button>

            <button
              className={`${styles.btn} ${styles.rejectBtn}`}
              onClick={() => setShowRejectDialog(true)}
            >
              Reject
            </button>
          </>
        )}

        {/* Shortlisted */}

        {app.status === "shortlisted" && (
          <>
            <button
              className={`${styles.btn} ${styles.selectBtn}`}
              onClick={() => setShowSelectDialog(true)}
            >
              Select
            </button>

            <button
              className={`${styles.btn} ${styles.rejectBtn}`}
              onClick={() => setShowRejectDialog(true)}
            >
              Reject
            </button>
          </>
        )}

        {/* Selected */}

        {app.status === "selected" && (
          <button
            className={`${styles.btn} ${styles.reviewBtn}`}
            onClick={() => updateStatus("reviewed")}
          >
            Move to Reviewed
          </button>
        )}

        {/* Rejected */}

        {app.status === "rejected" && (
          <button
            className={`${styles.btn} ${styles.reviewBtn}`}
            onClick={() => updateStatus("reviewed")}
          >
            Reconsider Candidate
          </button>
        )}
      </div>

      <RejectDialog
        open={showRejectDialog}
        onCancel={() => setShowRejectDialog(false)}
        onConfirm={rejectHandler}
      />

      <SelectDialog
        open={showSelectDialog}
        onCancel={() => setShowSelectDialog(false)}
        onConfirm={selectHandler}
      />
    </>
  );
};

export default ApplicationStatusActions;
