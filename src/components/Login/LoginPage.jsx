import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";

import { LeftSidePannel } from "../../element/LandingLeftPannel/LeftSidePannel";
import { Input } from "../../element/Input/Input";
import { Loader } from "../../element/Loader/Loader";
import { OtpScreen } from "../../element/OtpScreen/OtpScreen";
import { useAuth } from "../../context/AuthContext";
import { postApiData } from "../../utils/axios-utility";
import { logInfo,logError } from "../../utils/log-util";
import ErrorPopup from "../../element/ErrorPopup/ErrorPopup";

import { useLoader } from "../../hooks/useLoader";

import {
  OTP_LENGTH,
  CHECK_IS_NUMEBR,
  CHECK_IS_MOBILE_NUMBER,
  API_ROUTE,
  API_SUCCESS_CODE,
  API_NETWORK_ERROR,
  APP_ERROR,
  MOBILE_START_WITH_6,
  VALID_PASSWORD
} from "../../const/common";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    mobile: "",
    password: "",
  });
  const [apiError, setApirError] = useState("");
  const [loginwithOtp, setLoginwithOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate(); // Initialize navigate
  const mobileRef = useRef(null);
  const { login } = useAuth();
  useLoader(setLoading);

  const validOtp = "123456";

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && value !== "") {
      if (MOBILE_START_WITH_6.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error
  };

  const handleloginWithMobile = async (e) => {
    e.preventDefault();
    setApirError("");
    if (CHECK_IS_MOBILE_NUMBER.test(formData.mobile)) {
      const body = {
        mobileNumber: formData.mobile,
      };
      try {
        const resp = await postApiData({
          url: API_ROUTE.SIGN_IN_GEN_OTP,
          body,
        });

        if (resp.status === API_SUCCESS_CODE) {
          setLoginwithOtp(true);
        
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError( API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        mobile: APP_ERROR.MOBILE_INVALID_ERROR,
      }));
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setApirError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length === OTP_LENGTH) {
      const body = {
        mobileNumber: formData.mobile,
        otpValue: enteredOtp,
      };
      // Validate OTP write the logic to check validation
      try {
        const resp = await postApiData({
          url: API_ROUTE.SIGNIN_VERIFY_OTP,
          body,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setOtp(["", "", "", "", "", ""]);
          setLoginwithOtp(false);
          setFormData({
            mobile: "",
            password: "",
          });
         
          login({
            name: resp.data.userName,
            mobile: resp.data.mobileNumber,
            token: resp.data.mobileNumber,
            role: resp?.data?.roleName,
            userId: resp?.data?.userId,
            profilePhoto: resp?.data?.profilePhoto
          });
          alert("OTP validated successfully!");
          navigate("/", { replace: true });
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setApirError("");
    if (isValidForm()) {
      const body = {
        mobileNumber: formData.mobile,
        NewPassword: formData.password,
      };
      try {
        const resp = await postApiData({
          url: API_ROUTE.SIGN_IN_PASSWORD,
          body,
        });

        logInfo("here login", resp);
        if (resp.status === API_SUCCESS_CODE) {
          
          login({
            name: resp.data.userName,
            mobile: resp.data.mobileNumber,
            token: resp.data.mobileNumber,
            role: resp?.data?.roleName,
            userId: resp?.data?.userId,
            profilePhoto: resp?.data?.profilePhoto
          });
          resp?.data?.mobileNumber && navigate("/", { replace: true });
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

    // Validate password
    if (formData.password.trim()==0 ) {
      newErrors.password = APP_ERROR.PASSWORD_INVALID_ERROR;
      isValid = false;
    }
    if (isValid) return true;
    else {
      setErrors(newErrors);
      return false;
    }
  };

  const handleCreateOne = () => {
    navigate("/signup");
    window.location.reload();
  };

  const isFormValid =
    formData.mobile.trim() !== "" && formData.password.trim().length !== 0;

  return (
    <div className="hindavi-ads-hub-login-container">
      {/* <Loader /> */}
      {loading && <Loader />}
      <div className="left-section">
        <LeftSidePannel />
      </div>

      <div className="right-section">
      {apiError && <ErrorPopup errorText={apiError} />}
        {loginwithOtp ? (
          <OtpScreen
            otp={otp}
            setOtp={setOtp}
            mobile={formData.mobile}
            handleSubmit={handleOtpSubmit}
            setOtpValidation={setLoginwithOtp}
            title={"Authentication Required"}
            apiPath={API_ROUTE.SIGN_IN_GEN_OTP}
            setApirError={setApirError}
            subtitle={
              <p>
                <span>Enter the code from the sms we sent to </span>
                <span className="contact">
                  IN +91 {formData.mobile}
                  <span
                    className="change-number"
                    onClick={() => {
                      setLoginwithOtp(false);
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
          <div className="form-container ">
            <div className={`from-header hdv-margin-bottom-40`}>
              <h2 className={`form-title hdv-margin-bottom-16`}>Sign In</h2>
              <p className="form-subtitle">
                Signing up or login to see our top picks for you.
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="user-details hdv-margin-bottom-40">
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
                    <span className="form-error-message">{errors.mobile}</span>
                  )}
                </div>

                <div className="form-group hdv-margin-bottom-4">
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

                <div className="forgot-password-link">
                  <span
                    onClick={() =>
                      navigate("/forgot-password", {
                        state: { from: "loginPage" },
                      })
                    }
                  >
                    Forgot Password?
                  </span>
                </div>
              </div>
              <div className="submit-btn-container">
                <button
                  className="submit-button hdv-margin-bottom-24"
                  variant="primary"
                  type="submit"
                  disabled={!isFormValid}
                >
                  Sign In
                </button>
                <button
                  className="otp-login-btn hdv-margin-bottom-24"
                  onClick={handleloginWithMobile}
                  disabled={formData.mobile.trim() == ""}
                >
                  Login with OTP
                </button>
                <div className="signin-link">
                  <p>
                    Don't Have An Account?
                    <span onClick={handleCreateOne}>CREATE ONE</span>
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

export default LoginPage;
