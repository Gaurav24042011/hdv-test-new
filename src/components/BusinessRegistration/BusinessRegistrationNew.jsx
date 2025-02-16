import React, { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import "./BusinessRegistrationNew.scss";
import { getPostOfficeDetails } from "../../utils/getPostOfficeDetails";
import Dropdown from "react-bootstrap/Dropdown";
import brside from "../../assets/brside.svg";
import ErrorPopup from "../../element/ErrorPopup/ErrorPopup";

import { getApiData, postApiData } from "../../utils/axios-utility";
import {
  useGlobalState,
  useGlobalDispatch,
} from "../../context/GlobalProvider";
import {
  API_ROUTE,
  API_SUCCESS_CODE,
  APP_ERROR,
  CHECK_IS_NUMEBR,
  API_NETWORK_ERROR,
  IMAGE_MAX_IMAGE_SIZE,
  MOBILE_START_WITH_6,
  YEAR_START,
  MONTH_LIST,
} from "../../const/common";
import { SET_All_CATEGORY, SET_All_REFER_LIST } from "../../const/actionTypes";
import { Loader } from "../../element/Loader/Loader";
import { useLoader } from "../../hooks/useLoader";
import { logInfo, logError } from "../../utils/log-util";
import trashcan from "../../assets/trashcan.svg";
import upload from "../../assets/upload.svg";
import deleteicon from "../../assets/deleteicon.svg";

import Subscription from "../SubscriptionListComponent/Subscription";
import SuccessBusiness from "./SuccessBusiness";

const openTimeOptions = [
  { value: "Open 24hrs", label: "Open 24hrs" },
  { value: "Closed", label: "Closed" },
  { value: "5:00 AM", label: "5:00 AM" },
  { value: "6:00 AM", label: "6:00 AM" },
  { value: "7:00 AM", label: "7:00 AM" },
  { value: "8:00 AM", label: "8:00 AM" },
  { value: "9:00 AM", label: "9:00 AM" },
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "11:00 AM", label: "11:00 AM" },
  { value: "12:00 PM", label: "12:00 PM" },
  { value: "1:00 PM", label: "1:00 PM" },
  { value: "2:00 PM", label: "2:00 PM" },
  { value: "3:00 PM", label: "3:00 PM" },
  { value: "4:00 PM", label: "4:00 PM" },
  { value: "5:00 PM", label: "5:00 PM" },
  { value: "6:00 PM", label: "6:00 PM" },
  { value: "7:00 PM", label: "7:00 PM" },
  { value: "8:00 PM", label: "8:00 PM" },
  { value: "9:00 PM", label: "9:00 PM" },
  { value: "10:00 PM", label: "10:00 PM" },
  { value: "11:00 PM", label: "11:00 PM" },
  { value: "12:00 AM", label: "12:00 AM" },
];
const closeTimeOptions = [
  { value: "5:00 AM", label: "5:00 AM" },
  { value: "6:00 AM", label: "6:00 AM" },
  { value: "7:00 AM", label: "7:00 AM" },
  { value: "8:00 AM", label: "8:00 AM" },
  { value: "9:00 AM", label: "9:00 AM" },
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "11:00 AM", label: "11:00 AM" },
  { value: "12:00 PM", label: "12:00 PM" },
  { value: "1:00 PM", label: "1:00 PM" },
  { value: "2:00 PM", label: "2:00 PM" },
  { value: "3:00 PM", label: "3:00 PM" },
  { value: "4:00 PM", label: "4:00 PM" },
  { value: "5:00 PM", label: "5:00 PM" },
  { value: "6:00 PM", label: "6:00 PM" },
  { value: "7:00 PM", label: "7:00 PM" },
  { value: "8:00 PM", label: "8:00 PM" },
  { value: "9:00 PM", label: "9:00 PM" },
  { value: "10:00 PM", label: "10:00 PM" },
  { value: "11:00 PM", label: "11:00 PM" },
  { value: "12:00 AM", label: "12:00 AM" },
];

const phoneFields = [
  {
    phoneFieldLable: "",
    phoneFieldName: "mobileNumber",
    phonePlaceHolder: "Your Primary Contact",
  },
  {
    phoneFieldLable: "",
    phoneFieldName: "mobileNumber1",
    phonePlaceHolder: "Enter your  Number",
  },
  {
    phoneFieldLable: "",
    phoneFieldName: "mobileNumber2",
    phonePlaceHolder: "Enter Your Number",
  },
];

const BusinessRegistrationNew = () => {
  const allState = useGlobalState();
  const location = useLocation();
  const dispatch = useGlobalDispatch();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [areaList, setAreaList] = useState([]);
  const [businessRegistration, setBusinessRegistration] = useState({
    successFull: false,
    businessData: {},
  });

  const [phoneNumberList, setPhoneNumberList] = useState(["mobileNumber"]);

  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [images, setImages] = useState([]);
  const [upgradetoPremium, setUpgradetoPremium] = useState(false);
  const [notNow, setNotNow] = useState(false);
  const [bIcon, setBIcon] = useState([]);
  const [imageSizeError, setImageSizeError] = useState({
    iconError: "",
    imageError: "",
  });

  const [referByList, setReferByList] = useState(allState?.allReferList);
  const [categoryList, setCategoryList] = useState(allState?.allCategoryList);
  const [suggestedSubcategories, setSuggestedSubcategories] = useState([]);
  const [apiError, setApirError] = useState("");
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    businessName: "",
    area: "",
    pincode: "",
    address1: "",
    address2: "",
    cityName: "",
    stateName: "",
    mobileNumber: allState?.addBusinessNumber,
    SubCategoryIds: [],
    categoryId: "",
    landmark: "",
    contactPersonName: "",
    email: "",
    timingsRaw: [{ Days: [], OpenAt: "", CloseAt: "" }],
    uploadPhoto: [],
    id: "",
    uploadbusinessIcon: [],
    businessLink: "",
    instaLink: "",
    otherPlatformLink: "",
    youTubeLink: "",
    websiteLink: "",
    establishedYear: "",
    establishedMonth: "",
    referTypeId: "",
    referTypeName: "",
    referredByCode: "",
  });
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [errors, setErrors] = useState({
    businessName: "",
    area: "",
    pincode: "",
    address1: "",
    address2: "",
    categoryId: "",
    SubCategoryIds: "",
    contactPersonName: "",
    timeSlotError: "",
  });
  const [timings, setTimings] = useState([
    { days: [], openAt: "", closeAt: "" },
  ]);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxTimeSlots = 4;

  if (!location?.state?.allowed) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setApirError("");
      }, 10000);
    }
  }, [apiError]);

  useLoader(setLoading);
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
    const fetchData = async () => {
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_REFER_LIST,
        });
        if (resp.status === API_SUCCESS_CODE) {
          console.log("here", resp);
          setReferByList(resp.data);
          setApirError("");
          dispatch({
            type: SET_All_REFER_LIST,
            payload: { allReferList: resp.data },
          });
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
      }
    };
    if (allState?.allReferList?.length === 0) fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_ALL_CAT,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setCategoryList(resp.data);
          setApirError("");
          dispatch({
            type: SET_All_CATEGORY,
            payload: { allCategories: resp.data },
          });
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logInfo("Error calling API:", error);
      }
    };
    if (currentStep == 2 && allState?.allCategoryList?.length === 0)
      fetchData();
  }, [currentStep]);

  useEffect(() => {
    const fetchData = async () => {
      setSuggestedSubcategories([]);
      setFormData({
        ...formData,
        SubCategoryIds: [],
      });
      setSelectedSubCategories([]);
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_SUBCATEGORY_BY_ID,
          queryParams: { categoryId: formData?.categoryId },
        });
        logInfo("resp", resp);
        if (resp.status === API_SUCCESS_CODE) {
          setSuggestedSubcategories(resp.data);
          setApirError("");
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logInfo("Error calling API:", error);
      }
    };
    if (formData?.categoryId) fetchData();
  }, [formData?.categoryId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "pincode" && value !== "") {
      if (CHECK_IS_NUMEBR.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (
      (name === "mobileNumber1" || name === "mobileNumber2") &&
      value !== ""
    ) {
      if (MOBILE_START_WITH_6.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "establishedYear" && value !== "") {
      if (YEAR_START.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleAreaSelect = (eventKey) => {
    setSelectedArea(eventKey);
    setFormData({ ...formData, area: eventKey });
    setErrors({ ...errors, area: "" });
  };

  const handleMonthSelect = (month) => {
    setFormData({ ...formData, establishedMonth: month });
  };

  const handleReferSelect = (refer) => {
    setFormData({
      ...formData,
      referTypeId: refer?.id,
      referTypeName: refer?.name,
      referredByCode: "",
    });
  };

  const handleCateSelect = (category) => {
    setSelectedCategory(category.name);
    setFormData({
      ...formData,
      categoryId: category.id,
    });
    setErrors({ ...errors, SubCategoryIds: "" });
  };

  //  Time logic start
  const parseTime = (timeString) => {
    if (timeString === "Open 24hrs" || timeString === "Closed") return null;
    const [time, modifier] = timeString?.split(" ");
    let [hours, minutes] = time?.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const isTimeLessThan = (time1, time2) => {
    if (!time1 || !time2) return false;
    return (
      time1.hours < time2.hours ||
      (time1.hours === time2.hours && time1.minutes < time2.minutes)
    );
  };
  //*** */
  const validateTimings = () => {
    logInfo("Starting validation with timings:", timings);

    // 1. Validate that if any day is selected, time should also be selected
    for (let index = 0; index < timings?.length; index++) {
      const timing = timings[index];
      logInfo(`Checking timing slot ${index + 1}:`, timing);

      if (
        timing.days?.length > 0 && // Ensures days are selected
        (!timing.openAt ||
          (!timing.closeAt &&
            timing.openAt !== "Open 24hrs" &&
            timing.openAt !== "Closed"))
      ) {
        logInfo(`Validation failed in slot ${index + 1}: missing times.`);
        return {
          isValid: false,
          errorMessage: `Please select opening and closing times for slot ${index + 1}`,
          errorSlot: index + 1,
        };
      }
    }

    // 2. Prevent selecting the same day with "Open 24hrs" and other times
    const dayMap = {};
    for (let timing of timings) {
      for (let day of timing.days) {
        if (!dayMap[day]) dayMap[day] = [];
        dayMap[day].push(timing.openAt);
      }
    }
    logInfo("Day map:", dayMap);

    for (let day of Object.keys(dayMap)) {
      const dayTimes = dayMap[day];
      if (dayTimes.includes("Open 24hrs") && dayTimes?.length > 1) {
        logInfo(`Validation failed for day ${day}: conflicting time slots.`);
        return {
          isValid: false,
          errorMessage: `Cannot select "Open 24hrs" and other time slots for ${day}`,
          errorSlot: null,
        };
      }
    }

    // 3. Ensure time slots for the same day do not overlap
    const overlaps = (start1, end1, start2, end2) =>
      start1 < end2 && start2 < end1;

    for (let index = 0; index < timings?.length; index++) {
      const timing = timings[index];
      for (let day of timing.days) {
        const timeRanges = timings
          .filter(
            (t, i) =>
              i !== index &&
              t.days.includes(day) &&
              t.openAt !== "Open 24hrs" &&
              t.openAt !== "Closed"
          )
          .map((t) => [t.openAt, t.closeAt]);

        logInfo(
          `Checking overlaps for slot ${index + 1}, day: ${day}`,
          timeRanges
        );

        for (let [openAt, closeAt] of timeRanges) {
          if (overlaps(timing.openAt, timing.closeAt, openAt, closeAt)) {
            logInfo(`Validation failed for ${day}: overlapping time slots.`);
            return {
              isValid: false,
              errorMessage: `Time slots for ${day} overlap`,
              errorSlot: index + 1,
            };
          }
        }
      }
    }

    // 4. Limit selecting a day to a maximum of 2 times
    for (let day of Object.keys(dayMap)) {
      if (dayMap[day]?.length > 2) {
        logInfo(`Validation failed for day ${day}: selected more than twice.`);
        return {
          isValid: false,
          errorMessage: `A day (${day}) can only be selected a maximum of 2 times`,
          errorSlot: null,
        };
      }
    }

    // 5. Ensure open and close times are not the same
    for (let index = 0; index < timings?.length; index++) {
      const timing = timings[index];
      if (timing.openAt && timing.closeAt && timing.openAt === timing.closeAt) {
        logInfo(
          `Validation failed for slot ${index + 1}: open and close times are the same.`
        );
        return {
          isValid: false,
          errorMessage: `Open and Close times cannot be the same`,
          errorSlot: index + 1,
        };
      }
      if (
        timing.openAt &&
        timing.closeAt &&
        timing.openAt !== "Open 24hrs" &&
        timing.openAt !== "Closed"
      ) {
        const openTime = parseTime(timing.openAt);
        const closeTime = parseTime(timing.closeAt);

        if (isTimeLessThan(closeTime, openTime)) {
          logInfo(
            `Validation failed for slot ${index + 1}: closing time is earlier than opening time.`
          );
          return {
            isValid: false,
            errorMessage: `Closing time cannot be earlier than opening time`,
            errorSlot: index + 1,
          };
        }
      }
    }

    logInfo("Validation passed.");
    return { isValid: true, errorMessage: null, errorSlot: null };
  };

  const handleOpenCloseChange = (index, type, value) => {
    const updatedTimings = [...timings];

    // Prevent selecting time without selecting a day
    if (updatedTimings[index].days?.length === 0) {
      setErrors({
        ...errors,
        timeSlotError: "Please select at least one day before setting a time.",
      });
      return;
    }
    if (type === "closeAt" && !updatedTimings[index].openAt) {
      setErrors({
        ...errors,
        timeSlotError: "Please select open time before close time",
      });
      return;
    }
    if (type === "openAt" && value === "Open 24hrs") {
      updatedTimings[index]["closeAt"] = "";
    }

    updatedTimings[index][type] = value;
    setTimings(updatedTimings);

    setErrors({ ...errors, timeSlotError: "" });
  };

  const addTimeSlot = () => {
    let timeResult = validateTimings();
    let isError = false;

    timings.forEach((timing, index) => {
      if (timing.days?.length == 0) {
        setErrors({
          ...errors,
          timeSlotError: "Please select time slot times",
        });
        isError = true;
        return;
      }
    });

    if (!isError) {
      if (timeResult.isValid) {
        if (timings?.length < maxTimeSlots) {
          setTimings([...timings, { days: [], openAt: "", closeAt: "" }]);
        }
      } else {
        setErrors({ ...errors, timeSlotError: timeResult.errorMessage });
      }
    }
  };

  const handleSelectAllChange = (index, checked) => {
    const updatedTimings = [...timings];
    updatedTimings[index].days = checked ? [...days] : [];
    setTimings(updatedTimings);
    setErrors({ ...errors, timeSlotError: "" });
  };

  const removeTimeSlot = (index) => {
    setTimings(timings.filter((_, i) => i !== index));
  };

  const toggleDay = (index, day) => {
    const updatedTimings = [...timings];
    const days = updatedTimings[index].days;

    if (days.includes(day)) {
      updatedTimings[index].days = days.filter((d) => d !== day);
    } else {
      updatedTimings[index].days.push(day);
    }

    setTimings(updatedTimings);
    setErrors({ ...errors, timeSlotError: "" });
  };

  // Time slot logic end
  //*********** */

  const handleSubCategoryAdd = (subCategory) => {
    console.log("here handleSubCategoryAdd", subCategory);
    if (!selectedSubCategories.includes(subCategory)) {
      setFormData({
        ...formData,
        SubCategoryIds: [...formData?.SubCategoryIds, subCategory?.id],
      });
      setSelectedSubCategories([...selectedSubCategories, subCategory]);
      setSuggestedSubcategories(
        suggestedSubcategories.filter((cat) => cat !== subCategory)
      );
    }
    setErrors({ ...errors, SubCategoryIds: "" });
  };

  useEffect(() => {
    console.log("form data is", businessRegistration);
  }, [businessRegistration]);

  const handleSubCategoryRemove = (e, subCategory) => {
    console.log("here handleSubCategoryRemove", subCategory);
    e.preventDefault();
    setFormData({
      ...formData,
      SubCategoryIds: formData?.SubCategoryIds.filter(
        (id) => id !== subCategory?.id
      ),
    });
    setSelectedSubCategories(
      selectedSubCategories.filter((cat) => cat !== subCategory)
    );
    setSuggestedSubcategories([...suggestedSubcategories, subCategory]);
  };

  const progress = (currentStep / totalSteps) * 100;

  const handelNextStep = async (e) => {
    if (currentStep < 5) {
      e.preventDefault();
      if (checkValidationOnNextStep()) {
        if (currentStep === 2) {
          const data = new FormData();

          Object.entries(formData).forEach(([key, value]) => {
            if (value) {
              if (Array.isArray(value)) {
                if (key === "uploadPhoto" || key === "uploadbusinessIcon")
                  value.forEach((item) => data.append(key, item?.src));
                if (key === "timingsRaw")
                  data.append(key, JSON.stringify(value));
                else value.forEach((item) => data.append(key, item));
              } else {
                data.append(key, value);
              }
            }
          });

          for (let [key, value] of data.entries()) {
            console.log(`${key}: ${value}`);
          }

          try {
            const resp = await postApiData({
              url: formData?.id
                ? API_ROUTE.UPDATE_BUSINESS
                : API_ROUTE.ADD_BUSINESS,
              headers: {
                "Content-Type": "multipart/form-data",
              },
              body: data,
            });
            if (resp.status === API_SUCCESS_CODE) {
              setFormData({
                ...formData,
                id: resp?.data?.id || resp?.data?.businessData?.id,
                customerId: resp?.data?.customerId || resp?.data?.businessData?.customerId,
                loginId: resp?.data?.loginId ||  resp?.data?.businessData?.loginId,
              });
              setCurrentStep((prev) => prev + 1);
              setApirError("");
            } else {
              setApirError(resp?.message || "");
            }
          } catch (error) {
            setApirError(API_NETWORK_ERROR);
            logError("Error calling API:", error);
          }
        }
        if (currentStep === 4) {
          setFormData({ ...formData, timingsRaw: timings });
          setCurrentStep((prev) => prev + 1);
        } else if (currentStep !== 2 && currentStep !== 4)
          setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const addPhoneField = (index) => {
    if (phoneNumberList?.length < 3) {
      setPhoneNumberList([...phoneNumberList, ""]);
    }
  };

  const clearPhoneNumber = (name) => {
    console.log("here", name);
    setFormData({ ...formData, [name]: "" });
  };

  const handleRemovePhoneField = (index, fieldName) => {
    const newPhoneNumberList = phoneNumberList.slice(
      0,
      phoneNumberList?.length - 1
    );
    setPhoneNumberList(newPhoneNumberList);
    const newFormData = { ...formData, [fieldName]: "" };
    setFormData(newFormData);
  };

  const checkValidationOnNextStep = () => {
    if (currentStep == 1) {
      let isValid = true;
      const newErrors = {
        businessName: "",
        area: "",
        pincode: "",
        establishedYear: "",
      };

      // business name
      if (formData?.businessName.trim()?.length < 3) {
        newErrors.businessName = APP_ERROR.BUSINESS_NAME_INVALID_ERROR;
        isValid = false;
      }

      // Validate area
      if (formData?.area.trim()?.length === 0) {
        newErrors.area = APP_ERROR.AREA_EMPTY_ERROR;
        isValid = false;
      }

      // Validate pin
      if (formData?.pincode.trim()?.length < 6) {
        newErrors.pincode = APP_ERROR.PINCODE_EMPTY_ERROR;
        isValid = false;
      }
      // validate address1
      if (formData?.address1.trim()?.length == 0) {
        newErrors.address1 = APP_ERROR.EMPTY_BLOCK_NAME;
        isValid = false;
      }
      // validate address2
      if (formData?.address2.trim()?.length == 0) {
        newErrors.address2 = APP_ERROR.EMPTY_STREET_NAME;
        isValid = false;
      }

      // validate Year
      if (
        formData?.establishedYear &&
        formData?.establishedYear.trim()?.length < 4
      ) {
        newErrors.establishedYear = APP_ERROR.YEAR_ERROR;
        isValid = false;
      }

      if (isValid) return true;
      else {
        setErrors(newErrors);
        return false;
      }
    }

    if (currentStep == 2) {
      let isValid = true;
      const newErrors = {
        categoryId: "",
        SubCategoryIds: "",
      };
      // category Id
      if (formData?.SubCategoryIds?.length === 0) {
        newErrors.SubCategoryIds = APP_ERROR.SUBCATEGORY_EMPTY_ERROR;
        isValid = false;
      }

      if (isValid) return true;
      else {
        setErrors(newErrors);
        return false;
      }
    }

    if (currentStep == 3) {
      let isValid = true;
      const newErrors = {
        contactPersonName: "",
      };
      // contactPersonName Id
      if (formData?.contactPersonName.trim()?.length < 3) {
        newErrors.contactPersonName = APP_ERROR.CONTACT_NAME_INVALID_ERROR;
        isValid = false;
      }

      if (isValid) return true;
      else {
        setErrors(newErrors);
        return false;
      }
    }
    if (currentStep == 4) {
      let result = validateTimings();

      if (result?.isValid) {
        return true;
      } else {
        setErrors({ ...errors, timeSlotError: result?.errorMessage });
        return false;
      }
    }

    return true;
  };

  const isFormValid = (currentStep) => {
    if (currentStep === 1) {
      return (
        formData?.businessName.trim() &&
        formData?.pincode.trim() &&
        formData?.address1.trim() &&
        formData?.address2.trim() &&
        formData?.area.trim() &&
        (formData?.referTypeId == 1 ? formData?.referredByCode.trim() : true)
      );
    }
    if (currentStep === 2) {
      return formData?.categoryId;
    }
    if (currentStep === 3) {
      return formData?.contactPersonName.trim();
    }
    return true;
  };

  const getFilteredTimeOptions = (currentIndex, type) => {
    const selectedTimes = timings
      ?.filter((_, idx) => idx == currentIndex)
      ?.map((timing) => timing["openAt"])
      ?.filter(Boolean); // Exclude empty values
    if (timings[currentIndex]["openAt"]) {
      return type === "openAt"
        ? openTimeOptions
        : closeTimeOptions.filter((option) =>
            isTimeLessThan(parseTime(selectedTimes[0]), parseTime(option.value))
          );
    } else {
      return type === "openAt" ? openTimeOptions : closeTimeOptions;
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageSizeError({ ...imageSizeError, imageError: "" });
    processFiles(e, files, "images");
  };

  const handleIconUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageSizeError({ ...imageSizeError, iconError: "" });
    processFiles(e, files, "icon");
  };

  const processFiles = (e, files, name) => {
    if (name === "images") {
      const newImages = [...images];

      files.forEach((file) => {
        if (file.size > IMAGE_MAX_IMAGE_SIZE) {
          setImageSizeError({
            ...imageSizeError,
            imageError: APP_ERROR.IMAGE_SIZE_ERROR(file.name),
          });
          return;
        }

        if (newImages?.length >= 2) {
          return; // Stop processing files if the limit is already reached
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (newImages.length < 2) {
            newImages.push({ id: newImages?.length, src: reader.result, file });
            setImages([...newImages]);
            setFormData({ ...formData, uploadPhoto: [...newImages] });
          }
        };
        reader.readAsDataURL(file);
      });
      if (e?.target?.value) e.target.value = ""; // Clear file input value
    }

    if (name === "icon") {
      const newBIcon = [...bIcon];
      files.forEach((file) => {
        if (file.size > IMAGE_MAX_IMAGE_SIZE) {
          setImageSizeError({
            ...imageSizeError,
            iconError: APP_ERROR.IMAGE_SIZE_ERROR(file.name),
          });
          return;
        }
        if (newBIcon?.length >= 1) {
          return; // Stop processing files if the limit is already reached
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (newBIcon.length < 1) {
            newBIcon.push({ id: newBIcon?.length, src: reader.result, file });
            setBIcon([...newBIcon]);
            setFormData({ ...formData, uploadbusinessIcon: [...newBIcon] });
          }
        };
        reader.readAsDataURL(file);
      });
      if (e?.target?.value) e.target.value = "";
    }
  };

  const handleRemoveImage = (id) => {
    const filteredImages = images.filter((image) => image.id !== id);
    setImages(filteredImages);
    setFormData({ ...formData, uploadPhoto: filteredImages });
    setImageSizeError({ ...imageSizeError, imageError: "" });
  };

  const handleRemoveIcon = (e) => {
    setBIcon([]);
    setFormData({ ...formData, uploadbusinessIcon: [] });
    setImageSizeError({ ...imageSizeError, iconError: "" });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(e, files, "images");
  };

  const handleIconDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(e, files, "icon");
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 5) {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (key === "uploadPhoto" || key === "uploadbusinessIcon") {
            value.forEach((item) => data.append(key, item?.file));
          } else if (key === "timingsRaw") {
            data.append(key, JSON.stringify(value));
          } else {
            value.forEach((item) => data.append(key, item));
          }
        } else if (key !== "uploadPhoto" && key !== "uploadbusinessIcon") {
          // Skip these keys since they are already handled above
          data.append(key, value);
        }
      });

      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }
      console.log(data.entries());

      try {
        const resp = await postApiData({
          url: API_ROUTE.UPDATE_BUSINESS,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: data,
        });
        if (resp.status === API_SUCCESS_CODE) {
          console.log("succes", resp);
          setApirError("");
          resetAllState();
          setBusinessRegistration({
            successFull: true,
            businessData: resp?.data?.businessData,
          });
          // navigate("/", { replace: true });
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    }
  };

  const resetAllState = () => {
    setCurrentStep(1);
    setLoading(false);
    setPinLoading(false);
    setAreaList([]);
    setPhoneNumberList(["mobileNumber"]);
    setSelectedArea("");
    setSelectedCategory("");
    setImages([]);
    setBIcon([]);
    setCategoryList([]);
    setSuggestedSubcategories([]);
    setApirError("");
    setFormData({
      businessName: "",
      area: "",
      pincode: "",
      address1: "",
      address2: "",
      cityName: "",
      stateName: "",
      mobileNumber: allState?.addBusinessNumber,
      SubCategoryIds: [],
      categoryId: "",
      landmark: "",
      contactPersonName: "",
      email: "",
      timingsRaw: [{ Days: [], OpenAt: "", CloseAt: "" }],
      uploadPhoto: [],
      id: "",
    });
    setSelectedSubCategories([]);
    setErrors({
      businessName: "",
      area: "",
      pincode: "",
      address1: "",
      address2: "",
      categoryId: "",
      SubCategoryIds: "",
      contactPersonName: "",
      timeSlotError: "",
    });
    setTimings([{ days: [], openAt: "", closeAt: "" }]);
  };

  return (
    <div className="hdv-container br-container">
      {!businessRegistration.successFull ? (
        <div className="hdv-row">
          {loading && <Loader />}
          {pinLoading && <Loader />}
          <div
            className={` ${currentStep == 5 ? "hdv-col-5" : "hdv-col-4"} br-left`}
          >
            <div className="hdv-row br-left-img">
              <img src={brside} />
            </div>
          </div>
          <div
            className={`${currentStep == 5 ? "hdv-col-7" : "hdv-col-8"} br-right`}
          >
            <div className="progress-bar hdv-margin-bottom-32">
              <div className="progress" style={{ width: `${progress}%` }} />
            </div>
            <div className="hdv-row">
              <div className="hdv-col-12">
                {currentStep === 1 && (
                  <>
                    <h2 className="step-title hdv-margin-bottom-16">
                      Enter Your Business Details
                    </h2>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        logInfo("Form submission prevented");
                      }}
                    >
                      <div className="hdv-row  step-1-container">
                        <div className="form-group hdv-col-3 ">
                          <label htmlFor="refer-dropdown">Referred by</label>
                          <Dropdown
                            // onSelect={handleMonthSelect}
                            className="br-dropdown"
                          >
                            <Dropdown.Toggle
                              variant="primary"
                              id="refer-dropdown"
                              className={`br-dropdown-toggle ${formData?.referTypeName === "" ? "placeholder-visible" : "value-selected"}`}
                            >
                              {!formData?.referTypeName
                                ? "Refered By"
                                : formData?.referTypeName}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="area-menu">
                              {referByList.map((refer) => (
                                <Dropdown.Item
                                  key={refer?.id}
                                  onClick={() => handleReferSelect(refer)}
                                >
                                  {refer?.name}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>

                        <div className="form-group hdv-col-3 ">
                          <label>
                            Code {`${formData?.referTypeId === 1 ? "*" : ""}`}
                          </label>
                          <input
                            type="text"
                            name="referredByCode"
                            value={formData?.referredByCode}
                            onChange={handleInputChange}
                            placeholder="Enter Code"
                          />
                          {errors?.referredByCode && (
                            <span className="form-error-message">
                              {errors?.referredByCode}
                            </span>
                          )}
                        </div>

                        <div className="form-group hdv-col-6 ">
                          <label>Business Name *</label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData?.businessName}
                            onChange={handleInputChange}
                            placeholder="Enter business name"
                          />
                          {errors.businessName && (
                            <span className="form-error-message">
                              {errors.businessName}
                            </span>
                          )}
                        </div>

                        <div className="form-group hdv-col-6 ">
                          <label>Pincode *</label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData?.pincode}
                            onChange={handleInputChange}
                            placeholder="Enter pincode"
                            maxLength={6}
                          />
                          {errors.pincode && (
                            <span className="form-error-message">
                              {errors.pincode}
                            </span>
                          )}
                        </div>
                        <div className="form-group hdv-col-6 ">
                          <label htmlFor="area-dropdown">Area *</label>
                          <Dropdown
                            onSelect={handleAreaSelect}
                            className={`br-dropdown ${areaList?.length === 0 ? "br-dropdown-disabled" : ""} `}
                          >
                            <Dropdown.Toggle
                              variant="primary"
                              id="area-dropdown"
                              className={`br-dropdown-toggle ${selectedArea === "" ? "placeholder-visible" : "value-selected"}`}
                              disabled={areaList?.length === 0}
                            >
                              {selectedArea === ""
                                ? "Select an area"
                                : selectedArea}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="area-menu">
                              {areaList.map((area, i) => (
                                <Dropdown.Item
                                  key={`${area.id}-${i}`}
                                  eventKey={area}
                                >
                                  {area}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                          {errors.area && (
                            <span className="form-error-message">
                              {errors.area}
                            </span>
                          )}
                        </div>

                        <div className="form-group hdv-col-6 ">
                          <label>Landmark</label>
                          <input
                            type="text"
                            name="landmark"
                            value={formData?.landmark}
                            onChange={handleInputChange}
                            placeholder="Enter landmark"
                          />
                        </div>

                        <div className="form-group hdv-col-6 ">
                          <label>Block Number/Building Name *</label>
                          <input
                            type="text"
                            name="address1"
                            value={formData?.address1}
                            onChange={handleInputChange}
                            placeholder="Enter building name"
                          />
                          {errors.address1 && (
                            <span className="form-error-message">
                              {errors.address1}
                            </span>
                          )}
                        </div>
                        <div className="form-group hdv-col-6 ">
                          <label>City *</label>
                          <input
                            type="text"
                            name="cityName"
                            value={formData?.cityName}
                            onChange={handleInputChange}
                            placeholder="Enter cityName"
                            readOnly={true}
                          />
                        </div>
                        <div className="form-group hdv-col-6 ">
                          <label>Street/Colony Name *</label>
                          <input
                            type="text"
                            name="address2"
                            value={formData?.address2}
                            onChange={handleInputChange}
                            placeholder="Enter street name"
                          />
                          {errors.address2 && (
                            <span className="form-error-message">
                              {errors.address2}
                            </span>
                          )}
                        </div>

                        <div className="form-group hdv-col-6 ">
                          <label>State *</label>
                          <input
                            type="text"
                            name="stateName"
                            value={formData?.stateName}
                            onChange={handleInputChange}
                            placeholder="Enter stateName"
                            readOnly={true}
                          />
                        </div>
                        <div className="form-group hdv-col-3 ">
                          <label>Year of Establishment</label>
                          <input
                            type="text"
                            name="establishedYear"
                            value={formData?.establishedYear}
                            onChange={handleInputChange}
                            placeholder="Enter Year"
                            maxLength={4}
                          />
                          {errors.establishedYear && (
                            <span className="form-error-message">
                              {errors.establishedYear}
                            </span>
                          )}
                        </div>
                        <div className="form-group hdv-col-3 ">
                          <label htmlFor="month-dropdown" />
                          <Dropdown
                            onSelect={handleMonthSelect}
                            className="br-dropdown"
                          >
                            <Dropdown.Toggle
                              variant="primary"
                              id="month-dropdown"
                              className={`br-dropdown-toggle ${formData?.establishedMonth === "" ? "placeholder-visible" : "value-selected"}`}
                              disabled={!formData?.establishedYear}
                            >
                              {!formData?.establishedMonth
                                ? "Month"
                                : formData?.establishedMonth}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="area-menu">
                              {MONTH_LIST.map((month, i) => (
                                <Dropdown.Item
                                  key={`${month?.label}`}
                                  eventKey={month?.label}
                                >
                                  {month?.label}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </form>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h2 className="step-title hdv-margin-bottom-16">
                      Add Business Category
                    </h2>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        logInfo("Form submission prevented");
                      }}
                    >
                      <div className="hdv-row  step-2-container">
                        <div className="form-group hdv-col-7 ">
                          <label htmlFor="area-dropdown">
                            Select Business Category *
                          </label>
                          <Dropdown
                            // onSelect={handleCateSelect}
                            className="br-dropdown hdv-margin-bottom-28"
                          >
                            <Dropdown.Toggle
                              variant="primary"
                              id="area-dropdown"
                              className={`br-dropdown-toggle ${selectedCategory === "" ? "placeholder-visible" : "value-selected"}`}
                              // disabled={categoryList?.length === 0}
                            >
                              {selectedCategory === ""
                                ? "Select Business Category"
                                : selectedCategory}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="area-menu">
                              {categoryList.map((category) => (
                                <Dropdown.Item
                                  key={category.id}
                                  onClick={() => handleCateSelect(category)}
                                >
                                  {category.name}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>

                          {selectedSubCategories?.length > 0 && (
                            <div className="selected-categories hdv-margin-bottom-40">
                              <p className="title hdv-margin-bottom-16">
                                Selected Subcategories
                              </p>
                              <div className="selected-category-tags">
                                {selectedSubCategories?.map((category, i) => (
                                  <button
                                    key={`slected-category-tag-${i}`}
                                    className="slected-category-tag"
                                    onClick={(e) =>
                                      handleSubCategoryRemove(e, category)
                                    }
                                  >
                                    <span>{category?.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {suggestedSubcategories?.length > 0 && (
                            <div className="suggested-categories">
                              <p className="title hdv-margin-bottom-16">
                                <span>Suggested Subcategories</span>
                                {errors.SubCategoryIds && (
                                  <span className="form-error-message">
                                    {errors.SubCategoryIds}
                                  </span>
                                )}
                              </p>

                              <div className="category-buttons">
                                {suggestedSubcategories?.map((category, i) => (
                                  <button
                                    key={`slected-category-tag-${category?.name}-${i}`}
                                    onClick={() =>
                                      handleSubCategoryAdd(category)
                                    }
                                    className="suggestion-button"
                                  >
                                    {category?.name} <span>+</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h2 className="step-title hdv-margin-bottom-16">
                      Add Contacts Details
                    </h2>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        logInfo("Form submission prevented");
                      }}
                    >
                      <div className="hdv-row  step-3-container">
                        <div className="form-group hdv-col-6 ">
                          <label>Contact Person</label>
                          <input
                            type="text"
                            name="contactPersonName"
                            value={formData?.contactPersonName}
                            onChange={handleInputChange}
                            placeholder="Enter Contact Person"
                          />
                          {errors.contactPersonName && (
                            <span className="form-error-message">
                              {errors.contactPersonName}
                            </span>
                          )}
                        </div>

                        {phoneNumberList?.map((phone, i) => (
                          <div className="form-group hdv-col-6 " key={i}>
                            <label
                              style={{
                                marginBottom: `${!phoneFields[i].phoneFieldLable ? "22px" : ""}`,
                              }}
                            >
                              {phoneFields[i].phoneFieldLable}
                            </label>

                            <div className="input-group phone-field">
                              <span
                                className={`input-prefix  read-only-fieldread-only-field`}
                              >
                                +91
                              </span>
                              <input
                                type="text"
                                value={formData[phoneFields[i].phoneFieldName]}
                                name={phoneFields[i].phoneFieldName}
                                onChange={handleInputChange}
                                placeholder={phoneFields[i].phonePlaceHolder}
                                maxLength={10}
                                readOnly={i === 0}
                                className={`${i == 0 ? "read-only-field" : ""}`}
                              />
                              {i !== 0 && (
                                <button
                                  type="button"
                                  className="btn-close clear-phone"
                                  aria-label="Close"
                                  onClick={() =>
                                    formData[phoneFields[i].phoneFieldName]
                                      ? clearPhoneNumber(
                                          phoneFields[i].phoneFieldName
                                        )
                                      : handleRemovePhoneField(
                                          i,
                                          phoneFields[i].phoneFieldName
                                        )
                                  }
                                ></button>
                              )}
                            </div>

                            {i === phoneNumberList?.length - 1 &&
                              phoneNumberList?.length < 3 && (
                                <button
                                  type="button"
                                  onClick={() => addPhoneField(i)}
                                  className="add-more-slot"
                                >
                                  + Add Another Phone
                                </button>
                              )}
                          </div>
                        ))}

                        <div className="form-group hdv-col-6 ">
                          <label>Email</label>
                          <input
                            type="text"
                            name="email"
                            value={formData?.email}
                            onChange={handleInputChange}
                            placeholder="Enter Email"
                          />
                        </div>

                        <div className="form-group hdv-col-6 ">
                          <label>Facebook Link</label>
                          <input
                            type="text"
                            name="businessLink"
                            value={formData?.businessLink}
                            onChange={handleInputChange}
                            placeholder="Enter Facebook Link"
                          />
                        </div>
                        <div className="form-group hdv-col-6 ">
                          <label>Business insta Link</label>
                          <input
                            type="text"
                            name="instaLink"
                            value={formData?.instaLink}
                            onChange={handleInputChange}
                            placeholder="Enter Insta Link"
                          />
                        </div>
                        <div className="form-group hdv-col-6 ">
                          <label>Other Platform Link</label>
                          <input
                            type="text"
                            name="otherPlatformLink"
                            value={formData?.otherPlatformLink}
                            onChange={handleInputChange}
                            placeholder="Enter Other Link"
                          />
                        </div>
                        <div className="form-group hdv-col-6 ">
                          <label>You tube Link</label>
                          <input
                            type="text"
                            name="youTubeLink"
                            value={formData?.youTubeLink}
                            onChange={handleInputChange}
                            placeholder="Enter You tube Link"
                          />
                        </div>
                        <div className="form-group hdv-col-6 ">
                          <label>Website Link</label>
                          <input
                            type="text"
                            name="websiteLink"
                            value={formData?.websiteLink}
                            onChange={handleInputChange}
                            placeholder="Enter Website Link"
                          />
                        </div>
                      </div>
                    </form>
                  </>
                )}

                {currentStep === 4 && (
                  <div className="fixed-time-container">
                    <h2 className="step-title hdv-margin-bottom-16">
                      Add Business Timings
                    </h2>
                    <div className="hdv-row step-4-container">
                      <div className="form-group hdv-col-12 ">
                        {timings.map((timing, index) => (
                          <React.Fragment key={index}>
                            <div key={index} className="time-slot-container">
                              <p className="time-slot-title">
                                <span>Select Days of the Week</span>
                                {timings?.length > 1 &&
                                  index === timings?.length - 1 && (
                                    <img
                                      src={trashcan}
                                      onClick={() => {
                                        removeTimeSlot(index);
                                        setErrors({
                                          ...errors,
                                          timeSlotError: "",
                                        });
                                      }}
                                      style={{ cursor: "pointer" }}
                                    />
                                  )}
                              </p>

                              <div className="days-container hdv-row hdv-margin-bottom-28">
                                <div className="hdv-col-8">
                                  <div className="days-container-wrapper hdv-margin-bottom-8">
                                    {days.map((day) => (
                                      <button
                                        key={`${index}-${day}`}
                                        className={`day-button ${
                                          timing.days.includes(day)
                                            ? "active"
                                            : ""
                                        }`}
                                        onClick={() => toggleDay(index, day)}
                                      >
                                        {day}
                                      </button>
                                    ))}
                                  </div>
                                  <span className="select-all">
                                    <span>
                                      <input
                                        type="checkbox"
                                        checked={
                                          timing.days?.length === days?.length
                                        }
                                        onChange={(e) =>
                                          handleSelectAllChange(
                                            index,
                                            e.target.checked
                                          )
                                        }
                                      />
                                    </span>
                                    Select All Days
                                  </span>
                                </div>
                              </div>

                              <div className="time-selection hdv-row">
                                <div className="hdv-col-6 open-close">
                                  <label htmlFor={`open-at-${index}`}>
                                    Open at
                                  </label>

                                  <Dropdown className="br-dropdown hdv-margin-bottom-28">
                                    <Dropdown.Toggle
                                      variant="primary"
                                      id="area-dropdown"
                                      className={`br-dropdown-toggle ${timing.openAt ? "value-selected" : "placeholder-visible"}`}
                                    >
                                      {timing.openAt || "Select opening time"}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu
                                      className="area-menu overflow-auto"
                                      container="body"
                                      style={{
                                        maxHeight: "200px",
                                      }}
                                      popperConfig={{
                                        modifiers: [
                                          {
                                            name: "preventOverflow",
                                            options: {
                                              boundary: "viewport",
                                            },
                                          },
                                        ],
                                      }}
                                    >
                                      {getFilteredTimeOptions(
                                        index,
                                        "openAt"
                                      )?.map((option, i) => (
                                        <Dropdown.Item
                                          key={i}
                                          onClick={() =>
                                            // handleCateSelect(category)
                                            handleOpenCloseChange(
                                              index,
                                              "openAt",
                                              option.value
                                            )
                                          }
                                        >
                                          {option.value}
                                        </Dropdown.Item>
                                      ))}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                                {timing.openAt !== "Open 24hrs" &&
                                  timing.openAt !== "Closed" && (
                                    <div className="hdv-col-6 open-close">
                                      <label htmlFor={`close-at-${index}`}>
                                        Close at
                                      </label>

                                      <Dropdown className="br-dropdown hdv-margin-bottom-28">
                                        <Dropdown.Toggle
                                          variant="primary"
                                          id="area-dropdown"
                                          className={`br-dropdown-toggle ${timing.closeAt ? "value-selected" : "placeholder-visible"}`}
                                        >
                                          {timing.closeAt ||
                                            "Select closing time"}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu
                                          className="area-menu overflow-auto"
                                          container="body"
                                          style={{
                                            maxHeight: "200px",
                                          }}
                                          popperConfig={{
                                            modifiers: [
                                              {
                                                name: "preventOverflow",
                                                options: {
                                                  boundary: "viewport",
                                                },
                                              },
                                            ],
                                          }}
                                        >
                                          {getFilteredTimeOptions(
                                            index,
                                            "closeAt"
                                          ).map((option, i) => (
                                            <Dropdown.Item
                                              key={i}
                                              onClick={() =>
                                                handleOpenCloseChange(
                                                  index,
                                                  "closeAt",
                                                  option.value
                                                )
                                              }
                                            >
                                              {option.value}
                                            </Dropdown.Item>
                                          ))}
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  )}
                              </div>
                            </div>
                            {timings?.length > 1 &&
                              index !== timings?.length - 1 && (
                                <div className="hr-sepraor" />
                              )}
                          </React.Fragment>
                        ))}
                        {timings?.length < maxTimeSlots && (
                          <button
                            type="button"
                            onClick={addTimeSlot}
                            className="add-more-slot hdv-margin-bottom-40"
                          >
                            + Add Another Time Slot
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        logInfo("Form submission prevented");
                      }}
                    >
                      <div className="step-5-container ">
                        <div className={`hdv-row hdv-margin-bottom-20`}>
                          <h2 className="step-title hdv-margin-bottom-4">
                            Upload Your Business Icon
                          </h2>
                          <div className="form-group hdv-col-12 ">
                            <div
                              className="upload-image-section"
                              onDragOver={handleDragOver}
                              onDrop={handleIconDrop}
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                            >
                              <input
                                type="file"
                                accept=".jpeg, .jpg, .png"
                                style={{ display: "none" }}
                                id="icon-file-upload"
                                onChange={handleIconUpload}
                                disabled={bIcon?.length >= 1}
                                name="icon"
                              />
                              <label
                                htmlFor="icon-file-upload"
                                className={`image-upload-label ${bIcon?.length >= 1 ? "image-upload-label-disabled" : ""}`}
                              >
                                <img
                                  src={upload}
                                  alt="Upload Icon"
                                  className="hdv-margin-bottom-4"
                                />
                                <p className="drag-wrap">
                                  <span className="drga-image">
                                    Drag & drop files or click to{" "}
                                    <span className="browse-image">
                                      {" "}
                                      browse
                                    </span>
                                  </span>
                                </p>
                                <p className="support-wrap">
                                  Supported Format: PNG, JPEG, JPG
                                </p>
                                {imageSizeError.iconError && (
                                  <span className="form-error-message">
                                    {imageSizeError.iconError}
                                  </span>
                                )}
                              </label>
                            </div>
                          </div>
                          {bIcon?.length >= 1 && (
                            <div className="hdv-row img-preview-container">
                              {bIcon.map((icon) => (
                                <div key={icon.id} className="preview-image ">
                                  <img
                                    src={icon.src}
                                    alt={`Preview ${icon.id}`}
                                  />
                                  <button
                                    onClick={handleRemoveIcon}
                                    className="clear-img-preview"
                                  >
                                    <img src={deleteicon} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className={`hdv-row`}>
                          <h2 className="step-title hdv-margin-bottom-4">
                            Upload Your Business Images
                          </h2>
                          <div className="form-group hdv-col-12 ">
                            <div
                              className="upload-image-section"
                              onDragOver={handleDragOver}
                              onDrop={handleDrop}
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                            >
                              <input
                                type="file"
                                accept=".jpeg, .jpg, .png"
                                multiple
                                style={{ display: "none" }}
                                id="image-file-upload"
                                onChange={handleImageUpload}
                                disabled={images?.length >= 2}
                                name="images"
                              />
                              <label
                                htmlFor="image-file-upload"
                                className={`image-upload-label ${images?.length >= 2 ? "image-upload-label-disabled" : ""}`}
                              >
                                <img
                                  src={upload}
                                  alt="Upload Icon"
                                  className="hdv-margin-bottom-4"
                                />
                                <p className="drag-wrap">
                                  <span className="drga-image">
                                    Drag & drop files or click to{" "}
                                    <span className="browse-image">
                                      {" "}
                                      browse
                                    </span>
                                  </span>
                                </p>
                                <p className="support-wrap">
                                  <span>Supported Format: PNG, JPEG, JPG</span>
                                </p>
                                {imageSizeError.imageError && (
                                  <span className="form-error-message">
                                    {imageSizeError.imageError}
                                  </span>
                                )}
                              </label>
                            </div>
                          </div>
                          {images?.length > 0 && (
                            <div className="hdv-row img-preview-container">
                              {images.map((image) => (
                                <div key={image.id} className="preview-image ">
                                  <img
                                    src={image.src}
                                    alt={`Preview ${image.id}`}
                                  />
                                  <button
                                    onClick={() => handleRemoveImage(image.id)}
                                    className="clear-img-preview"
                                  >
                                    <img src={deleteicon} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </>
                )}

                {/*  Action button to move-on to next screen */}
                <div
                  className={`form-actions ${currentStep == 4 ? "form-action-marging" : ""}`}
                >
                  {currentStep == 4 && errors.timeSlotError && (
                    <span className="form-error-message">
                      {errors.timeSlotError}
                    </span>
                  )}
                  <div className="form-action-button">
                    {apiError && <ErrorPopup errorText={apiError} />}
                    {currentStep > 1 && (
                      <button
                        className="back-button"
                        type="button"
                        onClick={prevStep}
                      >
                        Back
                      </button>
                    )}
                    {currentStep < 5 ? (
                      <button
                        type="button"
                        className="submit-button"
                        disabled={!isFormValid(currentStep)}
                        onClick={handelNextStep}
                      >
                        Save & Continue
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="submit-button"
                        onClick={handelSubmit}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
       upgradetoPremium ? <Subscription businessData={businessRegistration?.businessData} /> :
        <SuccessBusiness handleUpdate={()=>setUpgradetoPremium(true)} 
        handleNotNow={()=>{setUpgradetoPremium(true); navigate("/list-business", { replace: true });}}
         />
      )}
        {/* <Subscription businessData={businessRegistration?.businessData} /> */}
    </div>
  );
};

export default BusinessRegistrationNew;
