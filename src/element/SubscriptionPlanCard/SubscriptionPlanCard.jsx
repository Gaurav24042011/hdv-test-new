import React from "react";
import "./SubscriptionPlanCard.scss";

const SubscriptionPlanCard = ({
  subscriptionId,
  ammountPerDay,
  ammountPerYear,
  subscriptionStatus,
  planInfo,
  subscriptionName,
  handleEditPlan
}) => {
  return (
    <div className="card">
      <div className={`card-header ${subscriptionStatus ? 'active':'deactive'}`} onClick={()=> handleEditPlan(subscriptionId, subscriptionName,planInfo, subscriptionStatus)}>
        <h3 className="paln-name">
          {subscriptionName} <span> (Annual Plan): </span>
        </h3>
        <p>
          {ammountPerDay} RS per day, {ammountPerYear} RS p.a.
        </p>
      </div>
      <ul className="card-features">
        {planInfo?.map((feature, index) => (
          <li key={index}>{feature.planName}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionPlanCard;
