import { useState } from "react";
import { useDispatch } from "react-redux";

import { saveOfferLetter } from "../../../../../../store/recruiterActions";

import OfferLetterEditor from "./OfferLetterEditor";
import OfferLetterPreview from "./OfferLetterPreview";

const OfferLetterSection = ({ app }) => {
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(!app.offerLetter?.url);

  const saveHandler = async (url) => {
    try {
      await dispatch(saveOfferLetter(app, url));

      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (editing) {
    return (
      <OfferLetterEditor
        initialValue={app.offerLetter?.url}
        onSave={saveHandler}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <OfferLetterPreview
      offerLetter={app.offerLetter}
      onEdit={() => setEditing(true)}
    />
  );
};

export default OfferLetterSection;
