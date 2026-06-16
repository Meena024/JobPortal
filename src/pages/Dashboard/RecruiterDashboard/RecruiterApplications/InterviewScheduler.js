import { useState } from "react";
import { useDispatch } from "react-redux";

import { dbApi } from "../../../../services/dbApi";
import { recruiterActions } from "../../../../store/recruiterSlice";

import InterviewPreview from "./InterviewPreview";
import InterviewEditor from "./InterviewEditor";

const InterviewScheduler = ({ app }) => {
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(!app.interviewScheduled);

  const [form, setForm] = useState({
    interviewDate: app.interviewDate || "",
    interviewTime: app.interviewTime || "",
    interviewLink: app.interviewLink || "",
    interviewInstructions: app.interviewInstructions || "",
  });

  const changeHandler = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveInterview = async () => {
    try {
      let updatedHistory = app.rescheduleHistory || [];

      if (app.interviewScheduled) {
        const historyItem = {
          previousDate: app.interviewDate,
          previousTime: app.interviewTime,
          reason: "Interview updated by recruiter",
          changedAt: new Date().toISOString(),
        };

        updatedHistory = [...updatedHistory, historyItem];
      }

      const interviewData = {
        interviewScheduled: true,

        interviewDate: form.interviewDate,
        interviewTime: form.interviewTime,
        interviewLink: form.interviewLink,
        interviewInstructions: form.interviewInstructions,

        rescheduleHistory: updatedHistory,

        rescheduleRequested: false,
        rescheduleRequestReason: "",
        rescheduleRequestedAt: "",
      };
      console.log("app", app);
      await dbApi.patch(
        `applications/${app.recruiterId}/${app.id}/interviewData`,
        interviewData,
      );
      dispatch(
        recruiterActions.updateInterviewDetails({
          id: app.id,
          interviewData,
        }),
      );

      await dbApi.post(`notifications/${app.applicantId}`, {
        message: `Interview scheduled for "${app.jobTitle}" on ${form.interviewDate} at ${form.interviewTime}.`,
        applicationId: app.id,
        read: false,
        createdAt: new Date().toISOString(),
      });

      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelInterview = async () => {
    try {
      const historyItem = {
        previousDate: app.interviewDate,
        previousTime: app.interviewTime,
        reason: "Interview cancelled by recruiter",
        changedAt: new Date().toISOString(),
      };

      const updatedHistory = [...(app.rescheduleHistory || []), historyItem];

      const clearedData = {
        interviewScheduled: false,

        interviewDate: "",
        interviewTime: "",
        interviewLink: "",
        interviewInstructions: "",

        rescheduleHistory: updatedHistory,

        rescheduleRequested: false,
        rescheduleRequestReason: "",
        rescheduleRequestedAt: "",
      };

      await dbApi.patch(`applications/${app.id}`, clearedData);

      dispatch(
        recruiterActions.updateInterviewDetails({
          id: app.id,
          interviewData: clearedData,
        }),
      );

      setForm({
        interviewDate: "",
        interviewTime: "",
        interviewLink: "",
        interviewInstructions: "",
      });

      setEditing(true);

      await dbApi.post(`notifications/${app.applicantId}`, {
        message: `Interview for "${app.jobTitle}" has been cancelled.`,
        applicationId: app.id,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEditing = () => {
    setForm({
      interviewDate: app.interviewDate || "",
      interviewTime: app.interviewTime || "",
      interviewLink: app.interviewLink || "",
      interviewInstructions: app.interviewInstructions || "",
    });

    setEditing(false);
  };

  if (!editing) {
    return (
      <InterviewPreview
        app={app}
        setEditing={setEditing}
        cancelInterview={cancelInterview}
      />
    );
  }

  return (
    <InterviewEditor
      app={app}
      form={form}
      changeHandler={changeHandler}
      saveInterview={saveInterview}
      cancelEditing={cancelEditing}
    />
  );
};

export default InterviewScheduler;
