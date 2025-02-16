import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisteredBusinessList.scss";
import addmobileforBusness from "../../assets/addmobileforBusness.svg";
import businessFallback from "../../assets/businessFallback.svg";
// import rblimage from "../../assets/rblimage.svg";
import rblarrow from "../../assets/subarrow.svg";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import Image from "../../element/Image/Image";

const RegisteredBusinessList = ({ businessList, businessLimit }) => {
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  const [showToast, setShowToast] = useState(false);

  const handleAddNewBusiness = () => {
    if (businessList.length >= businessLimit) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } else {
      navigate("/add-business", { replace: true, state: { allowed: true } });
    }
  };

  const handleBusiessClick = (businessId) => {
    navigate("/update-business", {
      replace: true,
      state: { allowed: true, businessId },
    });
  };

  return (
    <div className="hdv-container rbl-container">
      <div className="hdv-row">
        <div className="hdv-col-4 rbl-left">
          <h2 className="rbl-title hdv-margin-bottom-12">
            Select your Business
          </h2>
          <div className="hdv-margin-bottom-24 rbl-listed-business-container">
            {businessList.map((business, index) => (
              <div className="hdv-row " key={index}>
                <div className="form-group hdv-col-12 ">
                  <div
                    className="business-item"
                    onClick={() => handleBusiessClick(business?.id)}
                  >
                    {/* <img
                      src={business?.businessIcon}
                      alt={business?.businessName}
                      className="business-image"
                    /> */}
                    <Image
                      src={business?.businessIcon || businessFallback}
                      alt={business?.businessName}
                      defaultImageSrc={businessFallback}
                      className="business-image"
                    />
                    <div className="rbl-business-details">
                      <h3 className="business-name hdv-margin-bottom-12">
                        {business.businessName}
                      </h3>
                      <p className="business-address">{`${business?.area}, ${business?.cityName}`}</p>
                    </div>
                    <div className="arrow">
                      <img src={rblarrow} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rbl-button-wrapper">
            <button
              className="add-new-business-button hdv-margin-bottom-12"
              variant="primary"
              type="button"
              // disabled={businessList?.length >= 5}
              onClick={handleAddNewBusiness}
              ref={buttonRef}
            >
              Add New Business
            </button>

            <Overlay
              target={buttonRef?.current}
              show={showToast}
              placement="top"
            >
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  You can only have {businessLimit} Business Listed to a number
                </Tooltip>
              )}
            </Overlay>
          </div>
        </div>
        <div className="hdv-col-8 rbl-right">
          <div className="hdv-row">
            <div className="hdv-col-4"></div>
            <div className="hdv-col-8 rbl-right-img">
              <img src={addmobileforBusness} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisteredBusinessList;
