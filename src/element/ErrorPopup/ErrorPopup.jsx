import React from "react";
import "./ErrorPopup.scss";

const ErrorPopup = ({ errorText }) => {
  return (
    <div className="error-alert hdv-margin-bottom-20">
      <span>{errorText}</span>
    </div>
  );
};

export default ErrorPopup;
