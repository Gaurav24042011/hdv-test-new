import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./OtpScreen.scss";
import { useLoader } from "../../hooks/useLoader";
import { Loader } from "../Loader/Loader";
import { postApiData } from "../../utils/axios-utility";
import { logError } from "../../utils/log-util";

import {
  API_SUCCESS_CODE,
  API_NETWORK_ERROR,
  OTP_LENGTH
} from "../../const/common";

export const OtpScreen = ({
  otp,
  setOtp,
  mobile,
  handleSubmit,
  isSignUpScreen,
  title,
  subtitle,
  isForgotPassowrd = false,
  apiPath,
  setApirError,
}) => {
  const navigate = useNavigate(); // Initialize navigate

  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(false);
  useLoader(setLoading);
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];

    // Only allow single character input
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if a value is entered
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index]) {
      // Move to the previous input if Backspace is pressed and current input is empty
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return; // Stop the timer when it reaches 0

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on unmount
  }, [timeLeft]);

  const handleCreateOneCTA = () => {
    navigate("/signup");
    window.location.reload();
  };

  const handleSingInCTA = () => {
    navigate("/login");
    window.location.reload();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    setOtp(["", "", "", "", "", ""]);
    setApirError("");
    const body = {
      mobileNumber: mobile,
    };
    try {
      const resp = await postApiData({
        url: apiPath,
        body,
      });
      if (resp.status === API_SUCCESS_CODE) setTimeLeft(60);
      else setApirError(resp?.message || "");
    } catch (error) {
      setApirError(API_NETWORK_ERROR);
      logError("Error calling API:", error);
    }
  };

  return (
    <div className="form-container ">
      {loading && <Loader />}
      <div className={`otp-header hdv-margin-bottom-20`}>
        <h2 className={`form-title hdv-margin-bottom-12 `}>{title}</h2>
        <div className="form-subtitle">{subtitle}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="otp-container">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                maxLength="1"
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder="_"
                autoFocus={index === 0}
              />
            ))}
          </div>
          <span className="supporting-text">
            I didn't receive any code Retry in.
            {timeLeft > 0 ? (
              <span> {formatTime(timeLeft)} </span>
            ) : (
              <span onClick={handleResendOtp}> RESEND OTP</span>
            )}
          </span>
        </div>

        <div className="submit-btn-container">
          <Button
            className="submit-button hdv-margin-bottom-24"
            variant="primary"
            type="submit"
            disabled={otp.join("").length !== OTP_LENGTH}
          >
            Submit
          </Button>
          {!isForgotPassowrd && (
            <div className="signin-link">
              {isSignUpScreen ? (
                <p>
                  Already Have Account?{" "}
                  <span onClick={handleSingInCTA}> SIGN IN</span>
                </p>
              ) : (
                <p>
                  Don't Have An Account?
                  <span onClick={handleCreateOneCTA}>CREATE ONE</span>
                </p>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
