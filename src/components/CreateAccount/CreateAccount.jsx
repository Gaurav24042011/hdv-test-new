import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.scss";

import { LeftSidePannel } from "../../element/LandingLeftPannel/LeftSidePannel";
import { Input } from "../../element/Input/Input";
import { OtpScreen } from "../../element/OtpScreen/OtpScreen";

import { useAuth } from "../../context/AuthContext";
import { useLoader } from "../../hooks/useLoader";
import { postApiData } from "../../utils/axios-utility";
import { Loader } from "../../element/Loader/Loader";
import { logError } from "../../utils/log-util";
import ErrorPopup from "../../element/ErrorPopup/ErrorPopup";

import {
  OTP_LENGTH,
  CHECK_IS_NUMEBR,
  CHECK_IS_MOBILE_NUMBER,
  API_ROUTE,
  API_SUCCESS_CODE,
  API_NETWORK_ERROR,
  APP_ERROR,
  VALID_PASSWORD,
  MOBILE_START_WITH_6
} from "../../const/common";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const mobileRef = useRef(null);
  const [goToMobileValidation, setGoToMobileValidation] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const [apiError, setApirError] = useState("");

  useLoader(setLoading);

  const navigate = useNavigate(); // Initialize navigate

  const { user,login } = useAuth();

  useEffect(() => {
    if (user?.name) {
      navigate("/", { replace: true });
    }
  });

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && value !== "") {
      if (MOBILE_START_WITH_6.test(value)) {
        setFormData({ ...formData, [name]: value });
      } // Clear mobile error
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
          url: API_ROUTE.REGISTER_GEN_OTP,
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
    const newErrors = { mobile: "", password: "", name: "" };

    // Validatename
    if (formData.name.trim().length < 3) {
      newErrors.name = APP_ERROR.USERNAME_INVALID_ERROR;
      isValid = false;
    }

    // Validate mobile number
    if (!CHECK_IS_MOBILE_NUMBER.test(formData.mobile)) {
      newErrors.mobile = APP_ERROR.MOBILE_INVALID_ERROR;
      isValid = false;
    }

    // Validate password
    if (!VALID_PASSWORD.test(formData.password.trim())) {
      newErrors.password = APP_ERROR.PASSWORD_INVALID_CHAR_ERROR;
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
        userName: formData.name,
        mobileNumber: formData.mobile,
        newPassword: formData.password,
        otpValue: enteredOtp,
      };

      try {
        const resp = await postApiData({
          url: API_ROUTE.REGISTER_VERIFY_OTP,
          body,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setOtp(["", "", "", "", "", ""]);
          setGoToMobileValidation(false);
          setFormData({
            name: "",
            mobile: "",
            password: "",
          });
          alert("OTP validated successfully!");
          login({
            name: resp.data.userName,
            mobile: resp.data.mobileNumber,
            token: resp.data.mobileNumber,
            role: resp?.data?.roleName,
            userId: resp?.data?.userId
          });

          navigate("/");
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    } else {
      alert("Please enter all 6 digits of the OTP.");
    }
  };

  const isFormValid =
    formData.name.trim() && formData.mobile.trim() && formData.password.trim();

  const handleSingInCTA = () => {
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="hindavi-ads-signup-container">
      {/* Left Section */}
      {loading && <Loader />}
      <div className="left-section ">
        <LeftSidePannel />
      </div>

      {/* Right Section */}
      <div className="right-section" >
        {apiError && <ErrorPopup errorText={apiError} />}
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
                    }}
                  >
                    Change
                  </span>
                </span>
              </p>
            }
          />
        ) : (
          <div className="form-container" >
            <div className={`from-header hdv-margin-bottom-40`}>
              <h2 className={`form-title hdv-margin-bottom-16`}>
                Create an Account
              </h2>
              <p className="form-subtitle">
                Signing up or login to see our top picks for you.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="user-details hdv-margin-bottom-48">
                <div className="form-group hdv-margin-bottom-16">
                  <Input
                    lableText={"Your Name"}
                    isRequired={true}
                    type="text"
                    id="name"
                    name="name"
                    customClass={"form-control"}
                    placeholderText="Enter your name"
                    value={formData.name}
                    handleInputChange={handleFormInputChange}
                  />
                  {errors.name && (
                    <span className="form-error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group hdv-margin-bottom-16">
                  <label htmlFor="mobile" className="hdv-margin-bottom-4">
                    Enter Mobile Number <span className="required">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-prefix">+91</span>
                    <Input
                      inputRef={mobileRef}
                      type="text"
                      id="mobile"
                      name="mobile"
                      maxLength={10}
                      customClass={`form-control`}
                      placeholderText="Mobile Number"
                      value={formData.mobile}
                      handleInputChange={handleFormInputChange}
                    />
                  </div>
                  {errors.mobile && (
                    <span className="form-error-message">{errors.mobile}</span>
                  )}
                </div>

                <div className="form-group hdv-margin-bottom-0">
                  <label htmlFor="password" className="hdv-margin-bottom-4">
                    Password <span className="required">*</span>
                  </label>
                  <div className="input-group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      customClass={"form-control"}
                      placeholderText="Enter your password"
                      value={formData.password}
                      handleInputChange={handleFormInputChange}
                      isPasswordFiled={true}
                      handleTogglePassword={() =>
                        setShowPassword(!showPassword)
                      }
                      showPassword={showPassword}
                    />
                  </div>
                  {errors.password && (
                    <span className="form-error-message">
                      {errors.password}
                    </span>
                  )}
                </div>
              </div>

              <div className="submit-btn-container">
                <button
                  className="submit-button hdv-margin-bottom-24"
                  onClick={handleVerifyMobile}
                  variant="primary"
                  type="button"
                  disabled={!isFormValid}
                >
                  Verify mobile number
                </button>
                <div className="signin-link">
                  <p>
                    Already Have An Account?
                    <span onClick={handleSingInCTA}> SIGN IN</span>
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAccount;
