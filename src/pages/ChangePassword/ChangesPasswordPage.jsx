import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangesPasswordPage.scss";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../element/Input/Input";
import { useLoader } from "../../hooks/useLoader";
import ErrorPopup from "../../element/ErrorPopup/ErrorPopup";

import {
  API_ROUTE,
  API_NETWORK_ERROR,
  API_SUCCESS_CODE,
  APP_ERROR,
  VALID_PASSWORD,
} from "../../const/common";
import { postApiData } from "../../utils/axios-utility";

import brside from "../../assets/brside.svg";

const ChangesPasswordPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
    oldPassword: "",
    mobileNumber: user?.mobile,
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmNewPassword: "",
    oldPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCNPassword, setShowCNPassword] = useState(false);
  const [apiError, setApirError] = useState("");
  const [loading, setLoading] = useState(false);

  useLoader(loading);

  useEffect(() => {
    setFormData({ ...formData, mobileNumber: user?.mobile });
  }, [user?.mobile]);

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isValidForm = () => {
    let isValid = true;
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };

    // Validate old password password length
    if (!VALID_PASSWORD.test(formData.oldPassword)) {
      newErrors.newPassword = APP_ERROR.PASSWORD_INVALID_CHAR_ERROR;
      isValid = false;
    }

    // old and new password should not be same
    if (formData.newPassword.trim() === formData.oldPassword.trim()) {
      newErrors.newPassword = APP_ERROR.NEW_PASSWORD_SAME_AS_OLD_ERROR;
      isValid = false;
    }

    // Validate new password
    if (!VALID_PASSWORD.test(formData.newPassword)) {
      newErrors.newPassword = APP_ERROR.PASSWORD_INVALID_CHAR_ERROR;
      isValid = false;
    }
    // Validate confirm new password
    if (
      formData.confirmNewPassword.trim() !== formData.newPassword.trim() &&
      VALID_PASSWORD.test(formData.newPassword)
    ) {
      newErrors.confirmNewPassword = APP_ERROR.NEWPASSWORD_MATCH;
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
    if (isValidForm()) {
      try {
        const resp = await postApiData({
          url: API_ROUTE.SIGN_IN_CHANGE_PWD,
          body: formData,
        });

        if (resp.status === API_SUCCESS_CODE) {
          navigate("/", { replace: true });
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    }
  };

  return (
    <div className="hdv-container ch-pwd-container">
      <div className="hdv-row">
        {loading && <Loader />}
        <div className="hdv-col-6 ch-pwd-left">
          <div className="hdv-row ch-pwd-left-img">
            <img src={brside} />
          </div>
        </div>
        <div className="hdv-col-6 ch-pwd-right">
          {apiError && <ErrorPopup errorText={apiError} />}
          <div className="hdv-row">
            <div className="hdv-col-12">
              <h2 className="step-title hdv-margin-bottom-16">
                Enter Your Business Details
              </h2>

              <form>
                <div className="hdv-row  step-1-container">
                  <div className="form-group hdv-col-8 hdv-margin-bottom-12">
                    <label htmlFor="oldPassword">Old Password *</label>
                    <div className="input-group">
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        id="oldPassword"
                        name="oldPassword"
                        customClass={"form-control"}
                        placeholderText="Enter your oldPassword"
                        value={formData.oldPassword}
                        handleInputChange={handleFormInputChange}
                        isPasswordFiled={true}
                        handleTogglePassword={() =>
                          setShowOldPassword(!showOldPassword)
                        }
                        showPassword={showOldPassword}
                      />
                    </div>
                    {errors.oldPassword && (
                      <span className="form-error-message">
                        {errors.oldPassword}
                      </span>
                    )}
                  </div>

                  <div className="form-group hdv-col-8 hdv-margin-bottom-12">
                    <label htmlFor="newPassword">New Password *</label>
                    <div className="input-group">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        customClass={"form-control"}
                        placeholderText="Enter your New Password"
                        value={formData.newPassword}
                        handleInputChange={handleFormInputChange}
                        isPasswordFiled={true}
                        handleTogglePassword={() =>
                          setShowNewPassword(!showNewPassword)
                        }
                        showPassword={showNewPassword}
                      />
                    </div>
                    {errors.newPassword && (
                      <span className="form-error-message">
                        {errors.newPassword}
                      </span>
                    )}
                  </div>
                  <div className="form-group hdv-col-8 hdv-margin-bottom-12">
                    <label htmlFor="confirmNewPassword">
                      Confirm Password*
                    </label>
                    <div className="input-group">
                      <Input
                        type={showCNPassword ? "text" : "password"}
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        customClass={"form-control"}
                        placeholderText="Re Enter NewPassword"
                        value={formData.confirmNewPassword}
                        handleInputChange={handleFormInputChange}
                        isPasswordFiled={true}
                        handleTogglePassword={() =>
                          setShowCNPassword(!showCNPassword)
                        }
                        showPassword={showCNPassword}
                      />
                    </div>
                    {errors.confirmNewPassword && (
                      <span className="form-error-message">
                        {errors.confirmNewPassword}
                      </span>
                    )}
                  </div>
                </div>
              </form>
              <div className="hdv-row">
                <div className="form-actions hdv-col-8">
                  <button
                    type="button"
                    className="submit-button"
                    disabled={
                      !(
                        formData.oldPassword.trim() &&
                        formData.newPassword.trim() &&
                        formData.confirmNewPassword.trim()
                      )
                    }
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangesPasswordPage;
