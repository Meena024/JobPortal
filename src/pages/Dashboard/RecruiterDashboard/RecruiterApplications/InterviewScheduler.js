import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";

import {
  saveInterview,
  cancelInterview,
} from "../../../../store/recruiterActions";
import InterviewPreview from "./InterviewPreview";
import InterviewEditor from "./InterviewEditor";

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

      setForm(initialForm);
      setEditing(true);
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

  if (!editing) {
    return (
      <InterviewPreview
        app={app}
        setEditing={setEditing}
        cancelInterview={cancelInterviewHandler}
      />
    );
  }

  return (
    <InterviewEditor
      app={app}
      form={form}
      changeHandler={changeHandler}
      saveInterview={saveInterviewHandler}
      cancelEditing={cancelEditing}
    />
  );
};

export default InterviewScheduler;
