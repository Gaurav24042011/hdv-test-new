import React, { useState, useEffect } from "react";
import "./AddEditSubscription.scss";
import Dropdown from "react-bootstrap/Dropdown";
import {
  API_ROUTE,
  API_NETWORK_ERROR,
  API_SUCCESS_CODE,
} from "../../../const/common";

import { getApiData, postApiData } from "../../../utils/axios-utility";

import { useLoader } from "../../../hooks/useLoader";

import ErrorPopup from "../../../element/ErrorPopup/ErrorPopup";
import { Loader } from "../../../element/Loader/Loader";

const AddEditSubscription = ({
  isAddNewPlan,
  handleCancel,
  handleOperationSuccess,
  isEdit = false,
  editData = {},
}) => {
  const [slectedSubscription, setSlectedSubscription] = useState({
    id: editData?.subscriptionId || "",
    name: editData?.subscriptionName || "",
  });
  const [subscriptionPlanList, setSubscriptionPlanList] = useState([]);

  const [packageList, setPackageList] = useState([]);
  const [selectedPackageList, setSelectedPackageList] = useState(
    editData?.planInfo?.map((plan) => plan?.planId.toString()) || []
  );

  const [apiError, setApirError] = useState("");

  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  useLoader(setLoading);

  const resetState = () => {
    setSlectedSubscription({
      id: "",
      name: "",
    });

    setSubscriptionPlanList([]);
    setPackageList([]);
    setSelectedPackageList([]);
    setApirError("");
  };
  useEffect(() => {
    const subscriptionChanged =
      slectedSubscription.id !== editData?.subscriptionId;

    const packageListChanged = !(
      editData?.planInfo
        ?.map((plan) => plan.planId.toString())
        .sort()
        .join(",") === selectedPackageList.sort().join(",")
    );

    setIsUpdated(subscriptionChanged || packageListChanged);
  }, [slectedSubscription, selectedPackageList, editData]);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_PLAN_LIST,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setSubscriptionPlanList(resp.data);
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
      }
    };
    if (subscriptionPlanList.length === 0) fetchSubscriptionPlans();
  }, []);

  useEffect(() => {
    const fetchAllPackage = async () => {
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_ALL_PACKAGE_LIST,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setPackageList(resp.data);
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
      }
    };
    if (slectedSubscription.id !== "") fetchAllPackage();
  }, [slectedSubscription]);

  const handlePlanSelect = (plan) => {
    setSlectedSubscription({ id: plan?.id, name: plan?.name });
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedPackageList(
      (prevSelectedItems) =>
        prevSelectedItems.includes(value)
          ? prevSelectedItems.filter((item) => item !== value) // Deselect
          : [...prevSelectedItems, value] // Select
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      console.log(packageList.map((packagePlan) => packagePlan?.id.toString()));
      setSelectedPackageList(
        packageList.map((packagePlan) => packagePlan?.id.toString())
      );
    } else setSelectedPackageList([]);
  };

  const handleSubmit = async () => {
    const body = {
      subscriptionId: slectedSubscription?.id,
      subscriptionPlanId: selectedPackageList,
    };

    try {
      const resp = await postApiData({
        url: isAddNewPlan
          ? API_ROUTE.ADD_NEW_SUBSCRIPTION
          : API_ROUTE.UPDATE_SUBSCRIPTION,
        body,
      });
      if (resp.status === API_SUCCESS_CODE) {
        resetState();
        handleOperationSuccess();
      } else {
        setApirError(resp?.message || "");
      }
    } catch (error) {
      setApirError(API_NETWORK_ERROR);
    }
  };

  const handleActionCancel = () => {
    handleCancel();
  };

  const handleActiveDeactive = async (id, currentStatus) => {

    try {
      const resp = await postApiData({
        url: currentStatus
          ? `${API_ROUTE.DEACTIVATE_SUBSCRIPTION}/${id}`
          : `${API_ROUTE.ACTIVATE_SUBSCRIPTION}/${id}`,
      });
      if (resp.status === API_SUCCESS_CODE) {
        resetState();
        handleOperationSuccess();
      } else {
        setApirError(resp?.message || "");
      }
    } catch (error) {
      setApirError(API_NETWORK_ERROR);
    }
  };

  const isSubmitEnable =
    slectedSubscription?.name.trim() && selectedPackageList.length;

  return (
    <div className="hdv-container add-edit-subscription">
      <div className="hdv-row">
        <div className="hdv-col-12">
          {loading && <Loader />}
          {apiError && <ErrorPopup errorText={apiError} />}
          <h3 className="add-sub-title hdv-margin-bottom-12">
            Please select the options from below
          </h3>
          {apiError}
          <div className="form-group hdv-col-5 hdv-margin-bottom-24 padding-lr-0">
            <label className="hdv-margin-bottom-4">Subscription Name </label>
            <Dropdown className={`aes-dropdown `}>
              <Dropdown.Toggle
                variant="primary"
                id="palm-dropdown"
                className={`aes-dropdown-toggle ${slectedSubscription?.name == "" ? "placeholder-visible" : "value-selected"}`}
              >
                {slectedSubscription?.name === ""
                  ? "Select Subscription"
                  : slectedSubscription?.name}
              </Dropdown.Toggle>

              <Dropdown.Menu className="aes-menu">
                {subscriptionPlanList?.map((subscription, i) => (
                  <Dropdown.Item
                    key={`${subscription?.name}-${i}`}
                    onClick={() => handlePlanSelect(subscription)}
                  >
                    {subscription.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="plan-container ">
            {packageList?.length > 1 && (
              <div className="plan hdv-col-5 ">
                <input
                  type="checkbox"
                  value={"all"}
                  checked={selectedPackageList?.length === packageList?.length}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
                Select All
              </div>
            )}
            {packageList?.map((plan) => (
              <div key={plan.id} className="plan hdv-col-5 ">
                <input
                  type="checkbox"
                  value={plan.id}
                  checked={selectedPackageList.includes(plan.id.toString())}
                  onChange={handleCheckboxChange}
                />
                {plan?.name}
              </div>
            ))}
          </div>

          <div className="cta-container hdv-row">
            <button
              className="secondary hdv-col-2"
              onClick={handleActionCancel}
            >
              Cancel
            </button>

            {isAddNewPlan && (
              <button
                className="submit-button hdv-col-2"
                disabled={!isSubmitEnable}
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}

            {isEdit && (
              <>
                <button
                  className="submit-button hdv-col-2"
                  onClick={()=> handleActiveDeactive(slectedSubscription?.id, editData.subscriptionStatus) }
                >
                {editData.subscriptionStatus ? 'Deactivate': 'Activate' }
                </button>
                <button
                  className="submit-button hdv-col-2"
                  onClick={handleSubmit}
                  disabled={!isUpdated}
                >
                  Update
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditSubscription;
