import { useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import {
  saveInterview,
  cancelInterview,
} from "../../../../../store/recruiterActions";

import InterviewEditor from "./InterviewEditor";
import InterviewPreview from "./InterviewPreview";
import RescheduleRequestCard from "./RescheduleRequestCard";

const EMPTY_FORM = {
  interviewDate: "",
  interviewTime: "",
  interviewLink: "",
  interviewInstructions: "",
};

const InterviewScheduler = ({ app }) => {
  const dispatch = useDispatch();

  /* =====================================================
     INTERVIEW DATA
  ===================================================== */

  const interviewData = app.interviewData || {};

  const interviewScheduled = interviewData.interviewScheduled ?? false;

  /* =====================================================
     INITIAL FORM
  ===================================================== */

  const initialForm = useMemo(
    () => ({
      interviewDate: interviewData.interviewDate || "",

      interviewTime: interviewData.interviewTime || "",

      interviewLink: interviewData.interviewLink || "",

      interviewInstructions: interviewData.interviewInstructions || "",
    }),
    [
      interviewData.interviewDate,
      interviewData.interviewTime,
      interviewData.interviewLink,
      interviewData.interviewInstructions,
    ],
  );

  /* =====================================================
     LOCAL STATE
  ===================================================== */

  const [editing, setEditing] = useState(!interviewScheduled);

  const [form, setForm] = useState(initialForm);

  /* =====================================================
     SYNC WITH REDUX / REALTIME DATA
  ===================================================== */

  useEffect(() => {
    setForm(initialForm);
    setEditing(!interviewScheduled);
  }, [initialForm, interviewScheduled]);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const changeHandler = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =====================================================
     SAVE INTERVIEW
  ===================================================== */

  const saveInterviewHandler = async () => {
    try {
      await dispatch(saveInterview(app, form));

      setEditing(false);
    } catch (error) {
      console.error("Unable to save interview:", error);
    }
  };

  /* =====================================================
     CANCEL INTERVIEW
  ===================================================== */

  const cancelInterviewHandler = async () => {
    try {
      await dispatch(cancelInterview(app));

      setEditing(true);
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error("Unable to cancel interview:", error);
    }
  };

  /* =====================================================
     CANCEL EDITING
  ===================================================== */

  const cancelEditing = () => {
    setForm(initialForm);

    if (interviewScheduled) {
      setEditing(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      {/* =================================================
          RESCHEDULE REQUEST
      ================================================= */}

      <RescheduleRequestCard app={app} />

      {/* =================================================
          SCHEDULED INTERVIEW
      ================================================= */}

      {interviewScheduled && !editing && (
        <InterviewPreview
          app={app}
          setEditing={setEditing}
          cancelInterview={cancelInterviewHandler}
        />
      )}

      {/* =================================================
          CREATE / EDIT
      ================================================= */}

      {editing && (
        <InterviewEditor
          form={form}
          changeHandler={changeHandler}
          saveInterview={saveInterviewHandler}
          cancelEditing={cancelEditing}
        />
      )}
    </>
  );
};

export default InterviewScheduler;
