import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "../../element/Loader/Loader";
import { LeftSidePannel } from "../../element/LandingLeftPannel/LeftSidePannel";
import { Input } from "../../element/Input/Input";
import { OtpScreen } from "../../element/OtpScreen/OtpScreen";
import "./ForgotPassword.scss";

import { maskMobileNumber } from "../../utils/maskMobile";

import { postApiData } from "../../utils/axios-utility";
import { logError } from "../../utils/log-util";
import ErrorPopup from "../../element/ErrorPopup/ErrorPopup";

import { useLoader } from "../../hooks/useLoader";

import {
  OTP_LENGTH,
  CHECK_IS_NUMEBR,
  CHECK_IS_MOBILE_NUMBER,
  API_SUCCESS_CODE,
  API_ROUTE,
  API_NETWORK_ERROR,
  APP_ERROR,
  VALID_PASSWORD,
  MOBILE_START_WITH_6
} from "../../const/common";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    mobile: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [varifyMobile, setVarifyMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApirError] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpverified, setIsOtpverified] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  useLoader(setLoading);

  const mobileRef = useRef(null);
  const validOtp = "123456";

  useEffect(() => {
    if (!location.state || location.state.from !== "loginPage") {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && value !== "") {
      if (MOBILE_START_WITH_6.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVeryfyMobile = async (e) => {
    e.preventDefault();
    setApirError("")
    if (CHECK_IS_MOBILE_NUMBER.test(formData.mobile)) {
      const body = {
        mobileNumber: formData.mobile,
      };
      try {
        const resp = await postApiData({
          url: API_ROUTE.FORGOT_PASSWORD_GEN_OTP,
          body,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setVarifyMobile(true);
        }
        else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    } else
      setErrors((prev) => ({
        ...prev,
        mobile: APP_ERROR.MOBILE_INVALID_ERROR,
      }));
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setApirError("")
    const enteredOtp = otp.join("");
    if (enteredOtp.length === OTP_LENGTH) {
      const body = {
        mobileNumber: formData.mobile,
        otpValue: enteredOtp,
      };

      try {
        const resp = await postApiData({
          url: API_ROUTE.FORGOT_PASSWORD_VERIFY_OTP,
          body,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setOtp(["", "", "", "", "", ""]);
          setVarifyMobile(false);
          setIsOtpverified(true);
        }
        else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        logError("Error calling API:", error);
        setApirError(API_NETWORK_ERROR);
        setIsOtpverified(false);
      }
    } else {
      alert("Please enter all 6 digits of the OTP.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setApirError("")
    if (isValidForm()) {
      const body = {
        mobileNumber: formData.mobile,
        newPassword: formData.newPassword,
      };

      try {
        const resp = await postApiData({
          url: API_ROUTE.FORGOT_PASSWORD_SUBMIT,
          body,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setFormData({
            mobile: "",
            newPassword: "",
            confirmPassword: "",
          });
          setVarifyMobile(false);
          setIsOtpverified(false);
          alert("Password change is successful");
          navigate("/", { replace: true });
        }
        else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        logError("Error calling API:", error);
        setIsOtpverified(false);
        setApirError(API_NETWORK_ERROR);
      }
    }
  };

  const isValidForm = () => {
    let isValid = true;
    const newErrors = { mobile: "", password: "",newPassword:"" };

    // Validate new password
      if (!VALID_PASSWORD.test(formData.newPassword.trim())) {
      newErrors.newPassword = APP_ERROR.PASSWORD_INVALID_CHAR_ERROR;
      isValid = false;
    }
    // Validate confirm new password
    if (
      formData.confirmPassword.trim() !== formData.newPassword.trim() &&
      VALID_PASSWORD.test(formData.newPassword.trim())
    ) {
      newErrors.confirmPassword = APP_ERROR.NEWPASSWORD_MATCH;
      isValid = false;
    }
    if (isValid) return true;
    else {
      setErrors(newErrors);
      return false;
    }
  };


  const isPassworValid =
    formData.newPassword.trim() && formData.confirmPassword.trim();

  return (
    <div className="hindavi-ads-forgot-password-container">
      {
        loading && <Loader/>
      }
      <div className="left-section">
        <LeftSidePannel />
      </div>

      <div className="right-section">
      {apiError && <ErrorPopup errorText={apiError} />}
        {varifyMobile ? (
          <OtpScreen
            otp={otp}
            setOtp={setOtp}
            mobile={formData.mobile}
            handleSubmit={handleOtpSubmit}
            setOtpValidation={setVarifyMobile}
            title={"Enter verification code"}
            apiPath={API_ROUTE.FORGOT_PASSWORD_GEN_OTP}
            setApirError={setApirError}
            subtitle={
              <p>
                <span>
                  For your security, we have sent the code to your phone.
                  {maskMobileNumber(formData.mobile)}.
                  <span
                    className="change-number"
                    onClick={() => {
                      setVarifyMobile(false);
                      setOtp(["", "", "", "", "", ""]);
                      setApirError("")
                    }}
                  >
                    Change
                  </span>
                </span>
              </p>
            }
          />
        ) : (
          <div className="form-container ">
            <div className={`from-header hdv-margin-bottom-40`}>
              <h2 className={`form-title hdv-margin-bottom-16`}>
                {isOtpverified ? "Create new password" : "Password assistance"}
              </h2>
              <p className="form-subtitle">
                {isOtpverified
                  ? `We'll ask for this password whenever you sign in.`
                  : "Enter the mobile  number associated with your account."}
              </p>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="user-details hdv-margin-bottom-40">
                {!isOtpverified ? (
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
                  </div>
                ) : (
                  <>
                    <div className="form-group hdv-margin-bottom-20">
                      <label htmlFor="password" className="hdv-margin-bottom-4">
                        Password <span className="required">*</span>
                      </label>
                      <div className="input-group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="newPassword"
                          customClass={"form-control"}
                          placeholderText="Enter your password"
                          value={formData.newPassword}
                          handleInputChange={handleFormInputChange}
                          isPasswordFiled={true}
                          handleTogglePassword={() =>
                            setShowPassword(!showPassword)
                          }
                          showPassword={showPassword}
                        />
                      </div>
                      {errors.newPassword && (
                        <span className="form-error-message">
                          {errors.newPassword}
                        </span>
                      )}
                    </div>
                    <div className="form-group hdv-margin-bottom-0">
                      <label
                        htmlFor="confirm-password"
                        className="hdv-margin-bottom-4"
                      >
                        Confitm Password <span className="required">*</span>
                      </label>
                      <div className="input-group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          id="confirm-password"
                          name="confirmPassword"
                          customClass={"form-control"}
                          placeholderText="Re-Enter your password"
                          value={formData.confirmPassword}
                          handleInputChange={handleFormInputChange}
                          isPasswordFiled={true}
                          handleTogglePassword={() =>
                            setShowPassword(!showPassword)
                          }
                          showPassword={showPassword}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <span className="form-error-message">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="submit-btn-container">
                {isOtpverified ? (
                  <button
                    className="submit-button hdv-margin-bottom-24"
                    type="submi"
                    disabled={
                      !(
                        formData.newPassword.trim() &&
                        formData.confirmPassword.trim()
                      )
                    }
                    onClick={handlePasswordChange}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    className="submit-button hdv-margin-bottom-24"
                    disabled={formData.mobile.trim() === ""}
                    onClick={handleVeryfyMobile}
                  >
                    Continue
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
