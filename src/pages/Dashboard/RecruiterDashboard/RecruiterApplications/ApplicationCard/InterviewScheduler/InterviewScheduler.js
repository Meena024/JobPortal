import { useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  saveInterview,
  cancelInterview,
} from "../../../../../../store/recruiterActions";

import InterviewEditor from "./InterviewEditor";
import InterviewPreview from "./InterviewPreview";
import RescheduleRequestCard from "./RescheduleRequestCard";
import InterviewHistory from "./InterviewHistory";

const InterviewScheduler = ({ app }) => {
  const dispatch = useDispatch();

  const initialForm = useMemo(
    () => ({
      interviewDate: app.interviewData?.interviewDate || "",
      interviewTime: app.interviewData?.interviewTime || "",
      interviewLink: app.interviewData?.interviewLink || "",
      interviewInstructions: app.interviewData?.interviewInstructions || "",
    }),
    [app.interviewData],
  );

  const [editing, setEditing] = useState(
    !app.interviewData?.interviewScheduled,
  );

  const [form, setForm] = useState(initialForm);

  const interviewScheduled = app.interviewData?.interviewScheduled ?? false;

  /*
    When interview data changes because of realtime updates,
    refresh the editor.
  */

  useEffect(() => {
    setForm(initialForm);
    setEditing(!interviewScheduled);
  }, [initialForm, interviewScheduled]);

  const changeHandler = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveInterviewHandler = async () => {
    try {
      await dispatch(saveInterview(app, form));

      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelInterviewHandler = async () => {
    try {
      await dispatch(cancelInterview(app));

      setEditing(true);

      setForm({
        interviewDate: "",
        interviewTime: "",
        interviewLink: "",
        interviewInstructions: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEditing = () => {
    setForm(initialForm);

    if (app.interviewData?.interviewScheduled) {
      setEditing(false);
    }
  };

  return (
    <>
      {/* Pending applicant request */}

      <RescheduleRequestCard app={app} />

      {/* Scheduled interview */}

      {app.interviewData?.interviewScheduled && !editing && (
        <InterviewPreview
          app={app}
          setEditing={setEditing}
          cancelInterview={cancelInterviewHandler}
        />
      )}

      {/* Create / Edit interview */}

      {editing && (
        <InterviewEditor
          form={form}
          changeHandler={changeHandler}
          saveInterview={saveInterviewHandler}
          cancelEditing={cancelEditing}
        />
      )}

      {/* Previous schedules */}

      <InterviewHistory app={app} />
    </>
  );
};

export default InterviewScheduler;
