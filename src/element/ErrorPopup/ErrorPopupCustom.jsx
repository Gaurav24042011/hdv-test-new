import React from "react";
import "./ErrorPopup.scss";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import './ErrorPopupCustom.scss'

const ErrorPopupCustom = ({ errorText, targetRef,placement,showToast }) => {
  return (
    <Overlay target={targetRef?.current} show={showToast} placement={placement}>
      {(props) => (
        <Tooltip id="overlay-example" {...props}>
          {errorText}
        </Tooltip>
      )}
    </Overlay>
  );
};

export default ErrorPopupCustom;
