import React, { useState, useEffect } from "react";
import { useNavigate,Navigate,useLocation } from "react-router-dom";
import "./EditProfile.scss";
import { Accordion } from "react-bootstrap";
import {
  CHECK_IS_NUMEBR,
  APP_ERROR,
  CHECK_IS_MOBILE_NUMBER,
  CHECK_FOR_EMAIL,
  API_ROUTE,
  API_SUCCESS_CODE,
  IMAGE_MAX_IMAGE_SIZE,
  API_NETWORK_ERROR,
} from "../../../const/common";
import Dropdown from "react-bootstrap/Dropdown";
import { getPostOfficeDetails } from "../../../utils/getPostOfficeDetails";
import { Loader } from "../../../element/Loader/Loader";
import { useLoader } from "../../../hooks/useLoader";
import { getApiData, postApiData } from "../../../utils/axios-utility";
import { convertNullToEmptyString } from "../../../utils/Object-utils";
import { logInfo, logError } from "../../../utils/log-util";
import upload from "../../../assets/upload.svg";
import deleteicon from "../../../assets/deleteicon.svg";

import { useAuth } from "../../../context/AuthContext";

import ErrorPopup from "../../../element/ErrorPopup/ErrorPopup";

const convertDateToISO = (dateString) => {
  if (dateString) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }
  return dateString;
};

const convertToDDMMYYYY = (isoDate) => {
  if (isoDate) {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  }
  return isoDate;
};

function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!location?.state?.allowed) {
    return <Navigate to="/" replace />;
  }

  const [apiData, setApiData] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    aadharNo: "",
    email: "",
    dob: "",
    maritalStatus: "",
    stateName: "",
    cityName: "",
    pincode: "",
    occupation: "",
    area: "",
    mobileNo: "",
    contactName: "",
    contactNumber: "",
    contactEmail: "",
    officePincode: "",
    officeStateName: "",
    officeCityName: "",
    officeArea: "",
    officeAddress: "",
    uploadCustomerProfilePhoto: null, // File data will be appended later
    uploadPhoto: null,
    isDeleted: false,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    mobileNumber: "",
    mobileNumber1: "",
    email: "",
    pincode: "",
  });
  const [areaList, setAreaList] = useState([]);
  const [officeAreaList, setOfficeAreaList] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedOfficeArea, setSelectedOfficeArea] = useState("");
  const [apiError, setApirError] = useState("");
  const [activeKey, setActiveKey] = useState("0");
  const [maritalStatus, setMaritalStaus] = useState("");
  const [maritalStatusList, setmaritalStatusList] = useState([
    "Single",
    "Married",
  ]);
  const [pinLoading, setPinLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState([]);
  const [imageSizeError, setImageSizeError] = useState({
    profileError: "",
  });

  useLoader(setLoading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getApiData({
          url: `${API_ROUTE.GET_CUSTOMER_BY_MOBILE}/${user?.mobile}`,
        });
        if (resp.status === API_SUCCESS_CODE) {
          const formatedData = convertNullToEmptyString(resp?.data)

          setFormData({
            ...formData,
            ...formatedData,
            dob: convertDateToISO(formatedData?.dob),
          });
          setApiData({ ...apiData, ...formatedData });
          setApirError("");
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logInfo("Error calling API:", error);
      }
    };
    if (user?.mobile) fetchData();
  }, [user]);

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === "pincode" || name === "aadharNo") && value !== "") {
      if (CHECK_IS_NUMEBR.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleMaritalStatusSelect = (eventKey) => {
    setMaritalStaus(eventKey);
    setFormData({ ...formData, maritalStatus: eventKey });
    setErrors({ ...errors, maritalStatus: "" });
  };
  const handleAreaSelect = (eventKey) => {
    setSelectedArea(eventKey);
    setFormData({ ...formData, area: eventKey });
    setErrors({ ...errors, area: "" });
  };

  const handleOfficeAreaSelect = (eventKey) => {
    setSelectedOfficeArea(eventKey);
    setFormData({ ...formData, officeArea: eventKey });
    setErrors({ ...errors, officeArea: "" });
  };

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setApirError("");
      }, 10000);
    }
  }, [apiError]);

  useEffect(() => {
    // Setting City and state on pincode
    if (formData?.pincode?.length === 6) {
      console.log("here");
      setPinLoading(true);
      getPostOfficeDetails(formData?.pincode).then((res) => {
        if (!res?.isError) {
          setFormData({
            ...formData,
            ["stateName"]: res?.state,
            ["cityName"]: res?.city,
          });
          setAreaList(res?.area);
          setPinLoading(false);
        } else {
          setFormData({
            ...formData,
            ["stateName"]: "",
            ["cityName"]: "",
          });
          setErrors({ ...errors, pincode: APP_ERROR.PINCODE_INVALID_ERROR });
          setPinLoading(false);
        }
      });
    } else {
      setFormData({
        ...formData,
        ["stateName"]: "",
        ["cityName"]: "",
        ["area"]: "",
      });
      setSelectedArea("");
      setAreaList([]);
      setPinLoading(false);
    }
  }, [formData?.pincode]);

  useEffect(() => {
    // Setting City and state on officePincode
    if (formData?.officePincode?.length === 6) {
      console.log("here");
      setPinLoading(true);
      getPostOfficeDetails(formData?.officePincode).then((res) => {
        if (!res?.isError) {
          setFormData({
            ...formData,
            ["officeStateName"]: res?.state,
            ["officeCityName"]: res?.city,
          });
          setOfficeAreaList(res?.area);
          setPinLoading(false);
        } else {
          setFormData({
            ...formData,
            ["officeStateName"]: "",
            ["officeCityName"]: "",
          });
          setErrors({
            ...errors,
            officePincode: APP_ERROR.PINCODE_INVALID_ERROR,
          });
          setPinLoading(false);
        }
      });
    } else {
      setFormData({
        ...formData,
        ["officeStateName"]: "",
        ["officeCityName"]: "",
        ["officeArea"]: "",
      });
      setSelectedOfficeArea("");
      setOfficeAreaList([]);
      setPinLoading(false);
    }
  }, [formData?.officePincode]);

  const handleProfilePicUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageSizeError({ ...imageSizeError, profileError: "" });
    processFiles(e, files);
  };

  const processFiles = (e, files) => {
    const newProfileImage = [...profileImage];
    files.forEach((file) => {
      if (file.size > IMAGE_MAX_IMAGE_SIZE) {
        setImageSizeError({
          ...imageSizeError,
          profileError: APP_ERROR.IMAGE_SIZE_ERROR(file.name),
        });
        return;
      }
      if (newProfileImage?.length >= 1) {
        return; // Stop processing files if the limit is already reached
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (newProfileImage.length < 1) {
          newProfileImage.push({
            id: newProfileImage?.length,
            src: reader.result,
            file,
          });
          setProfileImage([...newProfileImage]);
          setFormData({
            ...formData,
            uploadCustomerProfilePhoto: [...newProfileImage],
            isDeleted: false,
          });
        }
      };
      reader.readAsDataURL(file);
    });
    if (e?.target?.value) e.target.value = "";
  };

  const handleRemoveProfile = (e, id) => {
    setProfileImage([]);
    setImageSizeError({ ...imageSizeError, profileError: "" });
    if (id) {
      setFormData({ ...formData, uploadCustomerProfilePhoto: null });
    } else {
      setFormData({
        ...formData,
        uploadCustomerProfilePhoto: null,
        preSignedUrl: null,
        isDeleted: true,
      });
    }
  };

  useEffect(() => {
    console.log("form Data", formData);
  }, [formData]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(e, files);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleActionCancel = () => {
    navigate(-1); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (key === "uploadCustomerProfilePhoto") {
            value.forEach((item) => data.append(key, item?.file));
          } else {
            value.forEach((item) => data.append(key, item));
          }
        } else if (key !== "uploadCustomerProfilePhoto") {
          if (key === "dob") {
            data.append(key, value === null ? "" : convertToDDMMYYYY(value));
          } else data.append(key, value === null ? "" : value);
        }
      });

      try {
        const resp = await postApiData({
          url: API_ROUTE.REGISTER_CUSTOMER,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: data,
        });
        if (resp.status === API_SUCCESS_CODE) {
          alert("profile updated successfully");
          // resetStates();
          navigate('/', { state: { edited: true } }); 
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    }
  };

  const isFormValid = formData.firstName.trim();

  // Check if any value in formData has changed from employeeDate
  const hasChanges = Object.keys(formData).some((key) =>
    key === "dob"
      ? formData[key] && formData[key] != convertDateToISO(apiData[key])
      : formData[key] && formData[key] != apiData[key]
  );

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      email: "",
      pincode: "",
      aadharNo: "",
      officePincode: "",
      contactName: "",
      contactEmail: "",
      contactNumber: "",
    };

    // FirstName
    if (formData?.firstName?.trim().length < 3) {
      newErrors.firstName = APP_ERROR.USERNAME_INVALID_ERROR;
      isValid = false;
      setActiveKey("0");
    }

    // Validate Email
    if (
      formData?.email?.trim() &&
      !CHECK_FOR_EMAIL.test(formData?.email?.trim())
    ) {
      newErrors.email = APP_ERROR.INVALID_EMAIL;
      isValid = false;
      setActiveKey("0");
    }

    // Aadhar validation
    if (formData?.aadharNo?.trim() && formData?.aadharNo.length < 12) {
      newErrors.aadharNo = APP_ERROR.ENTER_12_DIGIT_FOR_AADHAR;
      isValid = false;
      setActiveKey("0");
    }

    // Validate pin
    if (
      formData?.pincode?.trim()?.length < 6 &&
      formData?.pincode?.trim()?.length > 0
    ) {
      newErrors.pincode = APP_ERROR.PINCODE_EMPTY_ERROR;
      isValid = false;
      setActiveKey("0");
    }

    // Validate Office pin
    if (
      formData?.officePincode?.trim()?.length < 6 &&
      formData?.officePincode?.trim()?.length > 0
    ) {
      newErrors.officePincode = APP_ERROR.PINCODE_EMPTY_ERROR;
      isValid = false;
      setActiveKey("1");
    }

    // Validate mobile number
    if (
      formData?.contactNumber &&
      !CHECK_IS_MOBILE_NUMBER.test(formData?.contactNumber)
    ) {
      newErrors.contactNumber = APP_ERROR.MOBILE_INVALID_ERROR;
      isValid = false;
      setActiveKey("1");
    }

    // ValidateOffice Email
    if (
      formData?.contactEmail?.trim() &&
      !CHECK_FOR_EMAIL?.test(formData?.contactEmail?.trim())
    ) {
      newErrors.contactEmail = APP_ERROR.INVALID_EMAIL;
      isValid = false;
      setActiveKey("1");
    }

    // Office contact Name
    if (
      formData?.contactName?.trim() &&
      formData?.contactName?.trim().length < 3
    ) {
      newErrors.contactName = APP_ERROR.USERNAME_INVALID_ERROR;
      isValid = false;
      setActiveKey("1");
    }

    if (isValid) return true;
    else {
      setErrors(newErrors);
      return false;
    }
  };

  const resetStates = () => {
    setLoading(true);
    setApiData({});
    setFormData({
      firstName: "",
      lastName: "",
      middleName: "",
      aadharNo: "",
      email: "",
      dob: "",
      maritalStatus: "",
      stateName: "",
      cityName: "",
      pincode: "",
      occupation: "",
      area: "",
      mobileNo: "",
      contactName: "",
      contactNumber: "",
      contactEmail: "",
      officePincode: "",
      officeStateName: "",
      officeCityName: "",
      officeArea: "",
      officeAddress: "",
      uploadCustomerProfilePhoto: null,
      uploadPhoto: null,
      isDeleted: false,
    });
    setErrors({
      firstName: "",
      mobileNumber: "",
      mobileNumber1: "",
      email: "",
      pincode: "",
    });
    setAreaList([]);
    setOfficeAreaList([]);
    setSelectedArea("");
    setSelectedOfficeArea("");
    setApirError("");
    setActiveKey("0");
    setMaritalStaus("");
    setmaritalStatusList(["Single", "Married"]);
    setPinLoading(false);
    setProfileImage([]);
    setImageSizeError({
      profileError: "",
    });
    setLoading(false);
  };
  

  return (
    <div className="hdv-container edit-profile">
      {loading && <Loader />}
      {pinLoading && <Loader />}
      <Accordion
        activeKey={activeKey}
        onSelect={(key) => setActiveKey(activeKey == "1" ? "0" : "1")}
      >
        <Accordion.Item eventKey="0" className="hdv-margin-bottom-8">
          <Accordion.Header>Please provide your personal info</Accordion.Header>
          <Accordion.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="hdv-row hdv-margin-bottom-16">
                <div className="form-group hdv-col-4 ">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData?.firstName}
                    onChange={handleFormInputChange}
                    placeholder="Enter First name"
                  />
                  {errors?.firstName && (
                    <span className="form-error-message">
                      {errors?.firstName}
                    </span>
                  )}
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData?.middleName}
                    onChange={handleFormInputChange}
                    placeholder="Enter Middle name"
                  />
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Last Name </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData?.lastName}
                    onChange={handleFormInputChange}
                    placeholder="Enter Last name"
                  />
                </div>
              </div>

              <div className="hdv-row hdv-margin-bottom-16">
                <div className="form-group hdv-col-4 ">
                  <label>DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData?.dob}
                    onChange={handleFormInputChange}
                    className={`${formData?.dob && "valid-date"}`}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group hdv-col-4 ">
                  <label>Marital Status</label>
                  <Dropdown
                    onSelect={handleMaritalStatusSelect}
                    className={`aee-dropdown `}
                  >
                    <Dropdown.Toggle
                      variant="primary"
                      id="marital-status-dropdown"
                      className={`aee-dropdown-toggle ${maritalStatus == "" ? "placeholder-visible" : "value-selected"}`}
                    >
                      {maritalStatus === ""
                        ? "Select Marital Status"
                        : maritalStatus}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="aee-menu">
                      {maritalStatusList?.map((status, i) => (
                        <Dropdown.Item key={`${status}-${i}`} eventKey={status}>
                          {status}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div className="form-group hdv-col-4 ">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData?.pincode}
                    onChange={handleFormInputChange}
                    placeholder="Enter Pincode"
                    maxLength={6}
                  />
                  {errors.pincode && (
                    <span className="form-error-message">{errors.pincode}</span>
                  )}
                </div>
              </div>

              <div className="hdv-row hdv-margin-bottom-16">
                <div className="form-group hdv-col-4 ">
                  <label htmlFor="area-dropdown">Area</label>
                  <Dropdown
                    onSelect={handleAreaSelect}
                    className={`ep-dropdown ${areaList?.length === 0 ? "ep-dropdown-disabled" : ""} `}
                  >
                    <Dropdown.Toggle
                      variant="primary"
                      id="area-dropdown"
                      className={`ep-dropdown-toggle ${selectedArea === "" ? "placeholder-visible" : "value-selected"}`}
                      disabled={areaList?.length === 0}
                    >
                      {selectedArea === "" ? "Select an area" : selectedArea}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="area-menu">
                      {areaList.map((area, i) => (
                        <Dropdown.Item key={`${area.id}-${i}`} eventKey={area}>
                          {area}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  {errors.area && (
                    <span className="form-error-message">{errors.area}</span>
                  )}
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>City </label>
                  <input
                    type="text"
                    name="cityName"
                    value={formData?.cityName}
                    placeholder="Enter City Name"
                    readOnly
                  />
                </div>

                <div className="form-group hdv-col-4 ">
                  <label>State </label>
                  <input
                    type="text"
                    name="stateName"
                    value={formData?.stateName}
                    placeholder="Enter State Name"
                    readOnly
                  />
                </div>
              </div>

              <div className="hdv-row hdv-margin-bottom-16">
                <div className="form-group hdv-col-4 ">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleFormInputChange}
                    placeholder="Enter Email"
                  />
                  {errors.email && (
                    <span className="form-error-message">{errors.email}</span>
                  )}
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    name="mobileNo"
                    value={formData?.mobileNo}
                    onChange={handleFormInputChange}
                    readOnly
                    placeholder="Enter Mobile"
                  />
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Aadhar Number</label>
                  <input
                    type="text"
                    name="aadharNo"
                    value={formData?.aadharNo}
                    onChange={handleFormInputChange}
                    placeholder="Enter Aadhar Number"
                    maxLength={12}
                  />
                  {errors.aadharNo && (
                    <span className="form-error-message">
                      {errors.aadharNo}
                    </span>
                  )}
                </div>
              </div>
              <div className="hdv-row hdv-margin-bottom-16">
                <div className="form-group hdv-col-4 ">
                  <label>Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData?.occupation}
                    onChange={handleFormInputChange}
                    placeholder="Enter Occupation"
                  />
                </div>
              </div>
              <div className="hdv-row hdv-margin-bottom-16 flex-col">
                <h2 className="step-title hdv-col-3 hdv-margin-bottom-4">
                  Upload Photo
                </h2>

                <div className={`form-group hdv-col-12 display-flex`}>
                  <div
                    className="upload-image-section hdv-col-6"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      type="file"
                      accept=".jpeg, .jpg, .png"
                      style={{ display: "none" }}
                      id="icon-file-upload"
                      onChange={handleProfilePicUpload}
                      disabled={
                        profileImage?.length >= 1 || formData?.preSignedUrl
                      }
                      name="icon"
                    />
                    <label
                      htmlFor="icon-file-upload"
                      className={`image-upload-label ${profileImage?.length >= 1 || formData?.preSignedUrl ? "image-upload-label-disabled" : ""}`}
                    >
                      <img
                        src={upload}
                        alt="Upload Icon"
                        className="hdv-margin-bottom-4"
                      />
                      <p className="drag-wrap">
                        <span className="drga-image">
                          Drag & drop files or click to
                          <span className="browse-image"> browse</span>
                        </span>
                      </p>
                      <p className="support-wrap">
                        Supported Format: PNG, JPEG, JPG
                      </p>
                      {imageSizeError.profileError && (
                        <span className="form-error-message">
                          {imageSizeError.profileError}
                        </span>
                      )}
                    </label>
                  </div>
                  {profileImage?.length >= 1 && (
                    <div className="img-preview-container">
                      {profileImage.map((icon) => (
                        <div key={icon.id} className="preview-image ">
                          <img src={icon.src} alt={`Preview ${icon?.id}`} />
                          <button
                            onClick={(e) => handleRemoveProfile(e, icon?.id)}
                            className="clear-img-preview"
                          >
                            <img src={deleteicon} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {profileImage?.length === 0 && formData?.preSignedUrl && (
                    <div className="img-preview-container">
                      <div className="preview-image ">
                        <img
                          src={formData?.preSignedUrl}
                          alt={`Preview ${formData?.uploadPhoto}`}
                        />
                        <button
                          onClick={(e) => handleRemoveProfile(e)}
                          className="clear-img-preview"
                        >
                          <img src={deleteicon} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Accordion.Body>
        </Accordion.Item>

        {/* Contact Info Section */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>Provide office address</Accordion.Header>
          <Accordion.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="hdv-row hdv-margin-bottom-16">
                <div className="form-group hdv-col-4 ">
                  <label>Office Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData?.contactName}
                    onChange={handleFormInputChange}
                    placeholder="Enter Office Name"
                  />
                  {errors.contactName && (
                    <span className="form-error-message">
                      {errors.contactName}
                    </span>
                  )}
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData?.contactNumber}
                    onChange={handleFormInputChange}
                    placeholder="Enter Mobile Number"
                    maxLength={10}
                  />
                  {errors.contactNumber && (
                    <span className="form-error-message">
                      {errors.contactNumber}
                    </span>
                  )}
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData?.contactEmail}
                    onChange={handleFormInputChange}
                    placeholder="Enter Email"
                  />
                  {errors.contactEmail && (
                    <span className="form-error-message">
                      {errors.contactEmail}
                    </span>
                  )}
                </div>
              </div>
              <div className="hdv-row hdv-margin-bottom-16">
                <div className="form-group hdv-col-4 ">
                  <label>Address</label>
                  <input
                    type="text"
                    name="officeAddress"
                    value={formData?.officeAddress}
                    onChange={handleFormInputChange}
                    placeholder="Enter Office Name"
                  />
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="officePincode"
                    value={formData?.officePincode}
                    onChange={handleFormInputChange}
                    placeholder="Enter Office Pincode"
                    maxLength={6}
                  />
                  {errors.officePincode && (
                    <span className="form-error-message">
                      {errors.officePincode}
                    </span>
                  )}
                </div>
                <div className="form-group hdv-col-4 ">
                  <label htmlFor="area-dropdown">Area</label>
                  <Dropdown
                    onSelect={handleOfficeAreaSelect}
                    className={`ep-dropdown ${officeAreaList?.length === 0 ? "ep-dropdown-disabled" : ""} `}
                  >
                    <Dropdown.Toggle
                      variant="primary"
                      id="area-dropdown"
                      className={`ep-dropdown-toggle ${selectedOfficeArea === "" ? "placeholder-visible" : "value-selected"}`}
                      disabled={officeAreaList?.length === 0}
                    >
                      {selectedOfficeArea === ""
                        ? "Select an area"
                        : selectedOfficeArea}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="area-menu">
                      {officeAreaList.map((area, i) => (
                        <Dropdown.Item key={`${area.id}-${i}`} eventKey={area}>
                          {area}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  {errors.area && (
                    <span className="form-error-message">{errors.area}</span>
                  )}
                </div>
              </div>
              <div className="hdv-row hdv-margin-bottom-16">
                <div className="form-group hdv-col-4 ">
                  <label>City </label>
                  <input
                    type="text"
                    name="officeCityName"
                    value={formData?.officeCityName}
                    placeholder="Enter City Name"
                    readOnly
                  />
                </div>

                <div className="form-group hdv-col-4 ">
                  <label>State </label>
                  <input
                    type="text"
                    name="officeStateName"
                    value={formData?.officeStateName}
                    placeholder="Enter State Name"
                    readOnly
                  />
                </div>
              </div>
            </form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="cta-container hdv-row">
        {apiError && <ErrorPopup errorText={apiError} />}
        <button className="secondary hdv-col-2" onClick={handleActionCancel}>
          Cancel
        </button>

        <button
          className="submit-button hdv-col-2"
          onClick={handleSubmit}
          disabled={!hasChanges || !isFormValid}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
