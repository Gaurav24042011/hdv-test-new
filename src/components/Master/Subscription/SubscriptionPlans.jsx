import React, { useState, useEffect, useRef } from "react";
import SubscriptionPlanCard from "../../../element/SubscriptionPlanCard/SubscriptionPlanCard";
import "./SubscriptionPlans.scss";
import AddEditSubscription from "./AddEditSubscription";

import {
  API_ROUTE,
  API_NETWORK_ERROR,
  API_SUCCESS_CODE,
} from "../../../const/common";

import { getApiData } from "../../../utils/axios-utility";

import ErrorPopup from "../../../element/ErrorPopup/ErrorPopup";

const SubscriptionPlans = () => {
  const [planDetails, setPlanDetails] = useState([]);
  const [apiError, setApirError] = useState("");
  const [addNewPlan, setAddNewPlan] = useState(false);
  const [editPlan, setEditPlan] = useState({ edit: false, planData: {} });
  const [addEditSuccess, setAddEditSuccess] = useState(false);

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 340, behavior: "smooth" });
  };

  const fetchSubscriptionPlanDetails = async () => {
    try {
      const resp = await getApiData({
        url: API_ROUTE.GET_SUBSCRIPTION_PLAN_DETAIL,
      });
      if (resp.status === API_SUCCESS_CODE) {
        setPlanDetails(resp.data);
      } else {
        setApirError(resp?.message || "");
      }
    } catch (error) {
      setApirError(API_NETWORK_ERROR);
    }
  };

  useEffect(() => {
    if (planDetails.length === 0) fetchSubscriptionPlanDetails();
  }, []);

  useEffect(() => {
    if (addEditSuccess) {
      fetchSubscriptionPlanDetails();

      setAddEditSuccess(false);
    }
  }, [addEditSuccess]);

  const handleCancel = () => {
    setAddNewPlan(false);
    setEditPlan({ edit: false, planData: {} });
  };

  const handleOperationSuccess = () => {
    setAddEditSuccess(true);
    setAddNewPlan(false);
    setEditPlan({ edit: false, planData: {} });
  };

  const handleEditPlan = (subscriptionId, subscriptionName, planInfo,subscriptionStatus) => {
    setEditPlan({
      edit: true,
      data: { subscriptionId, subscriptionName, planInfo,subscriptionStatus },
    });
  };

  return addNewPlan || editPlan?.edit ? (
    <AddEditSubscription
      isAddNewPlan={addNewPlan}
      handleCancel={handleCancel}
      handleOperationSuccess={handleOperationSuccess}
      isEdit={editPlan.edit}
      editData={editPlan.data}
    />
  ) : (
    <>
      <div className="add-subscription hdv-row hdv-margin-bottom-16">
        <button
          className="submit-button hdv-col-2"
          onClick={() => setAddNewPlan(true)}
        >
          Add new subscription
        </button>
      </div>
      {apiError && <ErrorPopup errorText={apiError} />}
      {planDetails.length > 0 && (
        <div className="pricing-container carousel-container">
          <div className="carousel" ref={carouselRef}>
            {planDetails?.map((plan) => (
              <SubscriptionPlanCard
                key={plan?.subscriptionId}
                {...plan}
                handleEditPlan={handleEditPlan}
              />
            ))}
          </div>
          {planDetails.length > 4 && (
            <>
              <button className="scroll-button left" onClick={scrollLeft} />
              <button className="scroll-button right" onClick={scrollRight} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SubscriptionPlans;
