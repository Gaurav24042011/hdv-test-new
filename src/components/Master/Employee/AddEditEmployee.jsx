import React, { useState, useEffect } from "react";
import "./AddEditEmployee.scss";
import { Accordion } from "react-bootstrap";
import {
  useGlobalState,
  useGlobalDispatch,
} from "../../../context/GlobalProvider";

import {
  CHECK_IS_NUMEBR,
  APP_ERROR,
  CHECK_IS_MOBILE_NUMBER,
  CHECK_FOR_EMAIL,
  API_ROUTE,
  API_SUCCESS_CODE,
  MOBILE_START_WITH_6,
} from "../../../const/common";
import { SET_ROLE_LIST } from "../../../const/actionTypes";
import Dropdown from "react-bootstrap/Dropdown";
import { getPostOfficeDetails } from "../../../utils/getPostOfficeDetails";
import { Loader } from "../../../element/Loader/Loader";
import { useLoader } from "../../../hooks/useLoader";
import { getApiData, postApiData } from "../../../utils/axios-utility";
import { logInfo, logError } from "../../../utils/log-util";

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

const AddEditEmployee = ({
  handleOperationSuccess,
  handleActionComplete,
  isEditPage = false,
  isAddEmployeePage = false,
  employeeData = {},
  showEmployeeDetails = false,
}) => {
  const { allRoleList } = useGlobalState();
  const dispatch = useGlobalDispatch();

  const [formData, setFormData] = useState({
    firstName: employeeData?.firstName || "",
    middleName: employeeData?.middleName || "",
    lastName: employeeData?.lastName || "",
    roleId: employeeData?.roleId || "",
    roleName: employeeData?.roleName || "",
    email: employeeData?.email || "",
    businessTarget: employeeData?.businessTarget || "",
    hrmsId: employeeData?.hrmsId || "",
    aadharNo: employeeData?.aadharNo || "",
    dob: convertDateToISO(employeeData?.dob) || "",
    maritalStatus: employeeData?.maritalStatus || "",
    reportingTo: employeeData?.reportingTo || "",
    reportingEmployeeName: employeeData?.reportingEmployeeName || "",
    pincode: employeeData?.pincode || "",
    stateName: employeeData?.stateName || "",
    cityName: employeeData?.cityName || "",
    addressLine1: employeeData?.addressLine1 || "",
    mobileNumber: employeeData?.mobileNumber || "",
    mobileNumber1: employeeData?.mobileNumber1 || "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    mobileNumber: "",
    mobileNumber1: "",
    email: "",
    pincode: "",
  });
  const [apiError, setApirError] = useState("");
  const [activeKey, setActiveKey] = useState("0");

  const [selectedRole, setSelectedRole] = useState(
    employeeData?.roleName || ""
  );
  const [roleList, setRoleList] = useState(allRoleList);

  const [maritalStatus, setMaritalStaus] = useState(
    employeeData?.maritalStatus || ""
  );
  const [maritalStatusList, setmaritalStatusList] = useState([
    "Single",
    "Married",
  ]);

  const [selectedReportingPerson, setSelectedReportingPerson] = useState(
    employeeData?.reportingEmployeeName || ""
  );
  const [reportingPersonList, setReportingPersonList] = useState([]);

  const [pinLoading, setPinLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  useLoader(setLoading);

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "businessTarget" ||
        name === "pincode" ||
        name === "reportingTo" ||
        name === "aadharNo" ||
        name === "hrmsId") &&
      value !== ""
    ) {
      if (CHECK_IS_NUMEBR.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (
      (name === "mobileNumber" || name === "mobileNumber1") &&
      value !== ""
    ) {
      if (MOBILE_START_WITH_6.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error
  };

  const handleRoleSelect = (eventKey) => {
    setSelectedRole(eventKey.name);
    setFormData({ ...formData, roleId: eventKey.id, roleName: eventKey.name });
    setErrors({ ...errors, roleName: "", roleId: "" });
  };

  const handleReportingSelect = (eventKey) => {
    setSelectedReportingPerson(eventKey.empName);
    setFormData({
      ...formData,
      reportingTo: eventKey.id,
      reportingEmployeeName: eventKey.empName,
    });
    setErrors({ ...errors, reportingEmployeeName: "", reportingTo: "" });
  };

  const handleMaritalStatusSelect = (eventKey) => {
    setMaritalStaus(eventKey);
    setFormData({ ...formData, maritalStatus: eventKey });
    setErrors({ ...errors, maritalStatus: "" });
  };

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setApirError("");
      }, 10000);
    }
  }, [apiError]);

  useEffect(() => {
    console.log("for", formData);
  }, [formData]);

  useEffect(() => {
    const fetchReportingTo = async () => {
      try {
        const resp = await getApiData({
          url: `${API_ROUTE.GET_REPORTING_PERSON}/${employeeData?.id || 0}`,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setReportingPersonList(resp?.data);
        }
      } catch (error) {
        logInfo("Error calling API:", error);
      }
    };

    if (reportingPersonList?.length == 0) fetchReportingTo();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_EMPLOYEE_ROLES,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setRoleList(resp?.data);
          dispatch({
            type: SET_ROLE_LIST,
            payload: {
              roles: resp?.data,
            },
          });
        }
      } catch (error) {
        logInfo("Error calling API:", error);
      }
    };
    if (!showEmployeeDetails) {
      if (allRoleList?.length == 0) fetchRole();
      else setRoleList(allRoleList);
    }
  }, []);

  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      roleId: "",
      roleName: "",
      email: "",
      businessTarget: "",
      hrmsId: "",
      aadharNo: "",
      dob: "",
      maritalStatus: "",
      reportingTo: "",
      pincode: "",
      stateName: "",
      cityName: "",
      addressLine1: "",
      mobileNumber: "",
      mobileNumber1: "",
    });
  };

  useEffect(() => {
    if (!showEmployeeDetails) {
      if (formData?.pincode?.length === 6) {
        setPinLoading(true);
        getPostOfficeDetails(formData?.pincode).then((res) => {
          if (!res?.isError) {
            setFormData({
              ...formData,
              ["stateName"]: res?.state,
              ["cityName"]: res?.city,
            });
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
        });
        setPinLoading(false);
      }
    }
  }, [formData?.pincode]);

  const handleActionCancel = () => {
    resetForm();
    handleActionComplete();
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const resp = await postApiData({
          url: API_ROUTE.ADD_EMPLOYEE,
          body: { ...formData, dob: convertToDDMMYYYY(formData.dob) },
        });
        if (resp.status === API_SUCCESS_CODE) {
          resetForm();
          handleOperationSuccess();
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    }
  };
  const handleUpdate = async () => {
    if (validateForm()) {
      try {
        const resp = await postApiData({
          url: API_ROUTE.UPDATE_EMPLOYEE,
          body: {
            ...formData,
            id: employeeData?.id,
            dob: convertToDDMMYYYY(formData.dob),
          },
        });
        if (resp.status === API_SUCCESS_CODE) {
          resetForm();
          handleOperationSuccess();
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      mobileNumber: "",
      mobileNumber1: "",
      email: "",
      pincode: "",
      aadharNo: "",
    };

    // Validate password
    if (!CHECK_FOR_EMAIL.test(formData.email.trim())) {
      newErrors.email = APP_ERROR.INVALID_EMAIL;
      isValid = false;
      setActiveKey("0");
    }

    // Aadhar validation
    if (formData?.aadharNo.trim() && formData?.aadharNo.length < 12) {
      newErrors.aadharNo = APP_ERROR.ENTER_12_DIGIT_FOR_AADHAR;
      isValid = false;
      setActiveKey("0");
    }

    // Validate mobile number
    if (!CHECK_IS_MOBILE_NUMBER.test(formData.mobileNumber)) {
      newErrors.mobileNumber = APP_ERROR.MOBILE_INVALID_ERROR;
      isValid = false;
      setActiveKey("1");
    }
    // Validate alternate mobile number
    if (
      formData.mobileNumber1.trim() &&
      !CHECK_IS_MOBILE_NUMBER.test(formData.mobileNumber1)
    ) {
      newErrors.mobileNumber1 = APP_ERROR.MOBILE_INVALID_ERROR;
      isValid = false;
      setActiveKey("1");
    }

    // Validate pin
    if (formData?.pincode.trim()?.length < 6) {
      newErrors.pincode = APP_ERROR.PINCODE_EMPTY_ERROR;
      isValid = false;
      setActiveKey("1");
    }
    // Validate pin
    if (formData?.pincode.trim()?.length < 6) {
      newErrors.pincode = APP_ERROR.PINCODE_EMPTY_ERROR;
      isValid = false;
      setActiveKey("1");
    }

    if (isValid) return true;
    else {
      setErrors(newErrors);
      return false;
    }
  };

  const isFormValid =
    formData.firstName.trim() &&
    formData.middleName.trim() &&
    formData.lastName.trim() &&
    formData.roleName.trim() &&
    formData.hrmsId &&
    formData.email.trim() &&
    formData.businessTarget &&
    formData.reportingEmployeeName.trim() &&
    formData.pincode &&
    formData.mobileNumber.trim();

  // Check if any value in formData has changed from employeeData
  const hasChanges = Object.keys(formData).some((key) =>
    key === "dob"
      ? formData[key] && formData[key] != convertDateToISO(employeeData[key])
      : formData[key] && formData[key] != employeeData[key]
  );

  return (
    <div className="add-edit-employee">
      {loading && <Loader />}
      {pinLoading && <Loader />}
      <Accordion
        activeKey={activeKey}
        onSelect={(key) => setActiveKey(activeKey == "1" ? "0" : "1")}
      >
        <Accordion.Item eventKey="0" className="hdv-margin-bottom-8">
          <Accordion.Header>
            {isAddEmployeePage
              ? "Please provide personal info"
              : isEditPage
                ? "Update personal Info"
                : "Personal Info"}
          </Accordion.Header>
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
                    readOnly={showEmployeeDetails}
                    placeholder="Enter First name"
                  />
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Middle Name *</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData?.middleName}
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails}
                    placeholder="Enter Middle name"
                  />
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData?.lastName}
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails}
                    placeholder="Enter Last name"
                  />
                </div>
              </div>

              <div className="hdv-row hdv-margin-bottom-16">
                <div className="form-group hdv-col-4 ">
                  <label>Role *</label>
                  <Dropdown className={`aee-dropdown `}>
                    <Dropdown.Toggle
                      variant="primary"
                      id="role-dropdown"
                      className={`aee-dropdown-toggle ${selectedRole == "" ? "placeholder-visible" : "value-selected"}`}
                      disabled={showEmployeeDetails}
                    >
                      {selectedRole === "" ? "Select Role" : selectedRole}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="aee-menu">
                      {roleList?.map((role, i) => (
                        <Dropdown.Item
                          key={`${role?.name}-${i}`}
                          onClick={() => handleRoleSelect(role)}
                        >
                          {role.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>HRMS ID *</label>
                  <input
                    type="text"
                    name="hrmsId"
                    value={formData?.hrmsId}
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails || isEditPage}
                    placeholder="Enter HRMS ID"
                  />
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Aadhar Number</label>
                  <input
                    type="text"
                    name="aadharNo"
                    value={formData?.aadharNo}
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails}
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
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails}
                    placeholder="Enter Email"
                  />
                  {errors.email && (
                    <span className="form-error-message">{errors.email}</span>
                  )}
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData?.dob}
                    // placeholder="dd/mm/yyyy"
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails}
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
                      disabled={showEmployeeDetails}
                    >
                      {maritalStatus === "" ? "Select Marital Status" : maritalStatus}
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
              </div>

              <div className="hdv-row">
                <div className="form-group hdv-col-4 ">
                  <label>Business Target *</label>
                  <input
                    type="text"
                    name="businessTarget"
                    value={formData?.businessTarget}
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails}
                    placeholder="Enter Target"
                  />
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Reporting To *</label>
                  <Dropdown className={`aee-dropdown `}>
                    <Dropdown.Toggle
                      variant="primary"
                      id="role-dropdown"
                      className={`aee-dropdown-toggle ${selectedReportingPerson == "" ? "placeholder-visible" : "value-selected"}`}
                      disabled={showEmployeeDetails}
                    >
                      {selectedReportingPerson === ""
                        ? "Select Reporting Person"
                        : selectedReportingPerson}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="aee-menu">
                      {reportingPersonList?.map((reportingPerson, i) => (
                        <Dropdown.Item
                          key={`${reportingPerson?.id}-${i}`}
                          onClick={() => handleReportingSelect(reportingPerson)}
                        >
                          {reportingPerson?.empName}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </form>
          </Accordion.Body>
        </Accordion.Item>

        {/* Contact Info Section */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            {isAddEmployeePage
              ? " Please provide contact info"
              : isEditPage
                ? "Update contact Info"
                : "Contact Info"}
          </Accordion.Header>
          <Accordion.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="hdv-row hdv-margin-bottom-16">
                <div className="form-group hdv-col-4 ">
                  <label>Pin Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData?.pincode}
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails}
                    placeholder="Enter Pin Code"
                    maxLength={6}
                  />
                  {errors.pincode && (
                    <span className="form-error-message">{errors.pincode}</span>
                  )}
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>State *</label>
                  <input
                    type="text"
                    name="stateName"
                    value={formData?.stateName}
                    placeholder="Enter State name"
                    readOnly
                  />
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>City *</label>
                  <input
                    type="text"
                    name="cityName"
                    value={formData?.cityName}
                    placeholder="Enter City name"
                    readOnly
                  />
                </div>
              </div>
              <div className="hdv-row">
                <div className="form-group hdv-col-4 ">
                  <label>Address</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData?.addressLine1}
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails}
                    placeholder="Enter Your Address"
                  />
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Mobile Number *</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData?.mobileNumber}
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails}
                    placeholder="Enter Mobile Number"
                    maxLength={10}
                  />
                  {errors.mobileNumber && (
                    <span className="form-error-message">
                      {errors.mobileNumber}
                    </span>
                  )}
                </div>
                <div className="form-group hdv-col-4 ">
                  <label>Alternate Mobile Number</label>
                  <input
                    type="text"
                    name="mobileNumber1"
                    value={formData?.mobileNumber1}
                    onChange={handleFormInputChange}
                    readOnly={showEmployeeDetails}
                    placeholder="Enter Alternate Mobile Number"
                    maxLength={10}
                  />
                  {errors.mobileNumber1 && (
                    <span className="form-error-message">
                      {errors.mobileNumber1}
                    </span>
                  )}
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
        {isEditPage && (
          <button
            className="submit-button hdv-col-2"
            disabled={!hasChanges || !isFormValid}
            onClick={handleUpdate}
          >
            Update
          </button>
        )}

        {isAddEmployeePage && (
          <button
            className="submit-button hdv-col-2"
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default AddEditEmployee;
