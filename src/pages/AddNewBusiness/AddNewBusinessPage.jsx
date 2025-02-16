import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AddNewBusinessPage.scss";
import { useAuth } from "../../context/AuthContext";
import { useGlobalDispatch } from "../../context/GlobalProvider";
import { useLoader } from "../../hooks/useLoader";
import { OtpScreen } from "../../element/OtpScreen/OtpScreen";
import { Loader } from "../../element/Loader/Loader";
import BusinessRegistrationNew from "../../components/BusinessRegistration/BusinessRegistrationNew";
import addmobileforBusness from "../../assets/addmobileforBusness.svg";
import { Input } from "../../element/Input/Input";
import { logError } from "../../utils/log-util";
import { postApiData, getApiData } from "../../utils/axios-utility";
import ErrorPopup from "../../element/ErrorPopup/ErrorPopup";
import RegisteredBusinessList from "../../components/RegisteredBusinessList/RegisteredBusinessList";
import { SET_BUSINESS_NUMBER } from "../../const/actionTypes";

import {
  OTP_LENGTH,
  CHECK_IS_NUMEBR,
  CHECK_IS_MOBILE_NUMBER,
  API_ROUTE,
  API_SUCCESS_CODE,
  API_NETWORK_ERROR,
  APP_ERROR,
} from "../../const/common";

function AddNewBusinessPage() {
  const { user,login } = useAuth();
  const dispatch = useGlobalDispatch();
  // const allState = useGlobalState();
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [listOfBusinessWithMobile, setListOfBusinessWithMobile] = useState({
    businessList: [],
    businessLimit: "",
  });
  const [loading, setLoading] = useState(false);
  const [acceptedTerm, setAcceptedTerm] = useState(false);
  const [goToMobileValidation, setGoToMobileValidation] = useState(false);
  const [formData, setFormData] = useState({
    mobile: "",
  });
  const [errors, setErrors] = useState({
    mobile: "",
    terms: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [apiError, setApirError] = useState("");
  const mobileRef = useRef(null);
  useLoader(setLoading);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusiness = async () => {
      setFormData({ ...formData, selectedCategories: [] });
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_BUSINESS_BY_MOBILE,
          queryParams: { mobileNumber: mobile },
        });

        if (resp.status === API_SUCCESS_CODE) {
          setListOfBusinessWithMobile({
            businessList: resp?.data?.businessList,
            businessLimit: resp?.data?.businessLimit,
          });
          if (resp?.data?.businessList?.length === 0) setIsAuthenticated(true);
          else setIsAuthenticated(false);
        } else {
          setApirError(resp?.message || "");
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(true);
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    };

    if (mobile && user?.mobile) {
      dispatch({
        type: SET_BUSINESS_NUMBER,
        payload: { businessNumber: mobile },
      });
    }
    if (mobile && user?.mobile && !isAuthenticated) {
      console.log("here to check Auth");
      fetchBusiness();
    }
  }, [mobile]);

  useEffect(() => {
    if (user?.mobile && !mobile) setMobile(user?.mobile);
  }, [user?.mobile]);

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    if (value !== "") {
      if (CHECK_IS_NUMEBR.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error
  };

  const handleVerifyMobile = async (e) => {
    e.preventDefault();
    setApirError("");
    const body = {
      mobileNumber: formData.mobile,
    };

    if (isValidForm()) {
      try {
        const resp = await postApiData({
          url: API_ROUTE.START_NOW_GEN_OTP,
          body,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setGoToMobileValidation(true);
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    }
  };

  const isValidForm = () => {
    let isValid = true;
    const newErrors = { mobile: "", password: "" };

    // Validate mobile number
    if (!CHECK_IS_MOBILE_NUMBER.test(formData.mobile)) {
      newErrors.mobile = APP_ERROR.MOBILE_INVALID_ERROR;
      isValid = false;
    }
    if (!acceptedTerm && CHECK_IS_MOBILE_NUMBER.test(formData.mobile)) {
      newErrors.terms = APP_ERROR.TERMS_CONDITION_REQUIRED;
      isValid = false;
    }

    if (isValid) return true;
    else {
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApirError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length === OTP_LENGTH) {
      // Validate OTP write the logic to check validation
      const body = {
        mobileNumber: formData.mobile,
        otpValue: enteredOtp,
      };

      try {
        const resp = await postApiData({
          url: API_ROUTE.START_NOW_VERIFY_OTP,
          body,
        });
        console.log("here", resp?.data?.businessList);
        if (resp.status === API_SUCCESS_CODE) {
          setOtp(["", "", "", "", "", ""]);
          setGoToMobileValidation(false);
          setMobile(formData.mobile);
          login({
            name: resp?.data?.userName,
            mobile: resp?.data?.mobileNumber,
            token: resp?.data?.mobileNumber,
            role: resp?.data?.roleName,
            userId: resp?.data?.userId,
            profilePhoto: resp?.data?.profilePhoto
          });
          dispatch({
            type: SET_BUSINESS_NUMBER,
            payload: { businessNumber: formData.mobile },
          });
          setListOfBusinessWithMobile({
            businessList: resp?.data?.businessList,
            businessLimit: resp?.data?.businessLimit,
          });
          setAcceptedTerm(false);
          setFormData({
            mobile: "",
          });

          if (resp?.data?.businessList?.length === 0) setIsAuthenticated(true);
          else setIsAuthenticated(false);
        } else {
          setApirError(resp?.message || "");
          setIsAuthenticated(true);
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
        setIsAuthenticated(true);
      }
    } else {
      alert("Please enter all 6 digits of the OTP.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/add-business", { replace: true, state: { allowed: true } });
    }
  }, [isAuthenticated]);

  const verifyMobileForNotSignedInUser = () => {
    return (
      <div className="hdv-container ab-container">
        <div className="hdv-row">
          {loading && <Loader />}
          <div className="hdv-col-4 br-left">
            {apiError && <ErrorPopup errorText={apiError} />}
            <div className="hdv-row">
              <div className="hdv-col-12">
                {goToMobileValidation ? (
                  <OtpScreen
                    otp={otp}
                    setOtp={setOtp}
                    mobile={formData.mobile}
                    handleSubmit={handleSubmit}
                    setOtpValidation={setGoToMobileValidation}
                    isSignUpScreen={true}
                    title={"Authentication Required"}
                    apiPath={API_ROUTE.REGISTER_GEN_OTP}
                    setApirError={setApirError}
                    subtitle={
                      <p>
                        <span>Enter the code from the sms we sent to </span>
                        <span className="contact">
                          IN +91 {formData.mobile}
                          <span
                            className="change-number"
                            onClick={() => {
                              setGoToMobileValidation(false);
                              setOtp(["", "", "", "", "", ""]);
                              setApirError("");
                              setAcceptedTerm(false);
                            }}
                          >
                            Change
                          </span>
                        </span>
                      </p>
                    }
                  />
                ) : (
                  <>
                    <div className="free-business-title-container hdv-margin-bottom-40">
                      <h2 className="free-business-title hdv-margin-bottom-20">
                        List your Business <span>for FREE</span>
                      </h2>

                      <p className="free-business-subtitle">
                        No. 1 Local Search Engine
                      </p>
                    </div>
                    <form>
                      <div className="hdv-row ">
                        <div className="form-group hdv-col-12 ">
                          <label
                            htmlFor="mobile"
                            className=" hdv-margin-bottom-4"
                          >
                            Enter Mobile Number
                          </label>
                          <div className="input-group hdv-margin-bottom-4">
                            <span className="input-prefix">+91</span>
                            <Input
                              inputRef={mobileRef}
                              type="text"
                              id="mobile"
                              name="mobile"
                              maxLength={10}
                              customClass={"form-control"}
                              placeholderText="Mobile Number"
                              value={formData.mobile}
                              handleInputChange={handleFormInputChange}
                            />
                          </div>
                          {errors.mobile && (
                            <span className="form-error-message">
                              {errors.mobile}
                            </span>
                          )}

                          <div className="submit-button-section">
                            <p className="term-n-condition hdv-margin-bottom-52">
                              <span className="term-holder">
                                <span>
                                  <input
                                    type="checkbox"
                                    checked={acceptedTerm}
                                    onChange={(e) => {
                                      setAcceptedTerm(!acceptedTerm);
                                      setErrors({ ...errors, terms: "" });
                                    }}
                                    className="check-box"
                                  />
                                </span>
                                <span className="term-text">
                                  I agree to term and conditions.
                                  <a>T&C’s</a>
                                  <a>Privacy Policy</a>
                                </span>
                              </span>
                              {errors.terms && (
                                <span className="form-error-message">
                                  {errors.terms}
                                </span>
                              )}
                            </p>

                            <button
                              className="submit-button hdv-margin-bottom-24"
                              onClick={handleVerifyMobile}
                              variant="primary"
                              type="button"
                              disabled={!isFormValid}
                            >
                              Verify mobile number
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hdv-col-8 br-right">
            <div className="hdv-row br-right-img">
              <img src={addmobileforBusness} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const isFormValid = formData.mobile.trim();

  return (
    <>
      {mobile && loading && <Loader />}
      {!mobile
        ? verifyMobileForNotSignedInUser()
        : listOfBusinessWithMobile?.businessList?.length > 0 && (
            <RegisteredBusinessList
              businessList={listOfBusinessWithMobile.businessList}
              businessLimit={listOfBusinessWithMobile.businessLimit}
            />
          )}
    </>
  );
}

export default AddNewBusinessPage;
