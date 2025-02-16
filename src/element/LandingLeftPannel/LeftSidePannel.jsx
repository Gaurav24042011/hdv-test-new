import React from "react";
import hdv_big_logo from "../../assets/hdv_big_logo.svg";
import hdv_text_logo from "../../assets/hdv_text_logo.svg";
import './LeftSidePannel.scss'

export const LeftSidePannel = () => {
  return (
  <>
      <div className="upper-logo">
        <img src={hdv_text_logo} alt="Hindavi Ads Hub Logo" className="logo" />
      </div>
      <div className="lower-logo">
        <span>
        <img src={hdv_big_logo} alt="Hindavi Ads Hub Logo" className="logo" />
       
        </span>
      </div>
    </>
  );
};
