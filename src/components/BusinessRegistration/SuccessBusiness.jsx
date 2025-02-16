import React from "react";
import disc from "../../assets/disc.svg";
import plan from "../../assets/plan.svg";
import righttick from "../../assets/right-tick.svg";

import "./Success.scss";

const premiumBenefits1 = [
    "Rank higher on search results",
    "Business Leads",
    "Payment Solutions",
    "Online Catalogue"
  ];

  const premiumBenefits2 = [
    "Transactional Enabled Website",
    "Smart Lead Management System",
    "Competitor Analysis",
    "Premium Customer Support"
  ];

function SuccessBusiness({handleUpdate,handleNotNow}) {
  return (
    <div className="upgrade-container">
      <div className="upgrade-box">
        {/* Header Section */}
        <div className="header-section">
          <img src={disc} alt="Warning" className="warning-icon" />
          <div className="header-text">
            <h2 className="title">Please Note</h2>
            <p className="description">
              Your account details have been flagged for possible copyright
              infringement. It will go for audit and will take up to 24 hours
              before the account can be activated.
            </p>
            <p className="description">
              You will be informed about successful activation via email.
            </p>
          </div>
        </div>

        {/* Upgrade Plan Section */}
        <div className="plan-section">
          <img src={plan} alt="Warning" className="warning-icon" />
          <div className="plan-text">
            <h2 className="plan-title">Upgrade to Premium Listing Plan</h2>
            <div className="plan-benefits">
              
              <ul className="benefit-list">
                {premiumBenefits1?.map(benefit => <li>
                    <span>{benefit} </span>
                    <img src={righttick} />
                </li>)}
              </ul>

             
              <ul className="benefit-list" style={{width: '320px'}}>
              {premiumBenefits2?.map(benefit => <li>
                    <span>{benefit} </span>
                    <img src={righttick} />
                </li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-container">
          <button className="suc-btn not-now" onClick={handleNotNow}>Not Now</button>
          <button className="suc-btn upgrade" onClick={handleUpdate}>
            Upgrade to Paid Plan{" "}
            <span className="sub-text">(Grow your Business)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessBusiness;
