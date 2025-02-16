import React, { useState } from "react";
import "./BusinessDetails.scss";
import Image from "../Image/Image";
import businessFallback from "../../assets/businessFallback.svg";

const BusinessDetails = ({ business, handleClick }) => {
  const {
    businessName,
    image = "",
    distance = `${business?.area}, ${business?.cityName} `,
    mobileNumber,
    businessIcon,
  } = business;

  const [showMobile, setShowMobile] = useState(false);

  const handleShowNumber = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!showMobile) setShowMobile(true);
  };
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="business-item" onClick={() => handleClick(business)}>
      {/* <img src={businessIcon} className="business-image" /> */}
      <Image
        src={businessIcon || businessFallback}
        alt={businessName}
        defaultImageSrc={businessFallback}
        className="business-image"
      />
      <div className="business-details">
        <h3 className="business-name hdv-margin-bottom-12">{businessName}</h3>
        <p className="business-distance hdv-margin-bottom-20">{distance}</p>
        <div className="business-actions">
          <button className="btn btn-call" onClick={handleShowNumber}>
            {showMobile ? mobileNumber : "Show Number"}
          </button>
          <button className="btn btn-share" onClick={handleShare}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
