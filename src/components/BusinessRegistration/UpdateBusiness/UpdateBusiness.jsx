import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import "./UpdateBusiness.scss";
import { getPostOfficeDetails } from "../../../utils/getPostOfficeDetails";
import Dropdown from "react-bootstrap/Dropdown";
import { getApiData, postApiData } from "../../../utils/axios-utility";
import { useGlobalState } from "../../../context/GlobalProvider";
import {
  API_ROUTE,
  API_SUCCESS_CODE,
  APP_ERROR,
  CHECK_IS_NUMEBR,
  MOBILE_START_WITH_6,
  YEAR_START,
  API_NETWORK_ERROR,
  IMAGE_MAX_IMAGE_SIZE,
  VIDEO_MAX_IMAGE_SIZE,
  MONTH_LIST,
} from "../../../const/common";
import { SET_All_CATEGORY } from "../../../const/actionTypes";
import { Loader } from "../../../element/Loader/Loader";
import { useLoader } from "../../../hooks/useLoader";
import { logInfo, logError } from "../../../utils/log-util";
import trashcan from "../../../assets/trashcan.svg";
import upload from "../../../assets/upload.svg";
import deleteicon from "../../../assets/deleteicon.svg";
import ErrorPopup from "../../../element/ErrorPopup/ErrorPopup";

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

const fieldsToCompare = [
  "businessName",
  "area",
  "pincode",
  "address1",
  "address2",
  "cityName",
  "stateName",
  "mobileNumber",
  "mobileNumber1",
  "mobileNumber2",
  "SubCategoryIds", // Includes array comparison
  "categoryId",
  "landmark",
  "contactPersonName",
  "email",
  "businessLink",
  "instaLink",
  "otherPlatformLink",
  "youTubeLink",
  "websiteLink",
  "establishedYear",
  "establishedMonth",
  "facility",
  "averageCost",
];

const hasNonTimeFieldsChanged = (obj1, obj2, fields) => {
  let hasChanged = false;

  fields.forEach((field) => {
    const value1 = obj1[field];
    const value2 = obj2[field];

    // Skip comparison if the field in obj1 is empty
    if (value1 === null || value1 === undefined || value1 === "") {
      return; // Skip this field
    }

    if (Array.isArray(value1) && Array.isArray(value2)) {
      // Compare arrays (order-independent)
      const sortedArray1 = [...value1].sort();
      const sortedArray2 = [...value2].sort();

      if (
        sortedArray1.length !== sortedArray2.length ||
        !sortedArray1.every((item, index) => item === sortedArray2[index])
      ) {
        hasChanged = true;
      }
    } else {
      // Compare primitive values
      if (value1 !== value2) {
        hasChanged = true;
      }
    }
  });

  return hasChanged;
};

const hasTimingsChanged = (timings1, timings2) => {
  let hasChanged = false;

  // Compare timings arrays
  if (timings1.length !== timings2?.length) {
    hasChanged = true;
  } else {
    timings1?.forEach((timing, index) => {
      const timing2 = timings2[index];

      // Compare Days (order-independent) and OpenAt, CloseAt fields
      if (
        timing?.days?.split(",")?.sort()?.join(",") !==
          timing2?.days?.sort()?.join(",") ||
        timing?.openAt !== timing2?.openAt ||
        timing?.closeAt !== timing2?.closeAt
      ) {
        hasChanged = true;
      }
    });
  }

  return hasChanged;
};

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

const UpdateBusiness = ({}) => {
  const allState = useGlobalState();
  const location = useLocation();
  const navigate = useNavigate();
  const { businessId } = location?.state || "";
  const [activeKey, setActiveKey] = useState("0");
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [areaList, setAreaList] = useState([]);
  const [phoneNumberList, setPhoneNumberList] = useState(["mobileNumber"]);
  const [businessData, setBusinessData] = useState({
    timingsRaw: [],
    businessData: {},
  });
  const [dataUpdated, setDataUpdated] = useState(false);
  const [imageUpdated, setImageUpdated] = useState({
    banner: false,
    icon: false,
    image: false,
    video: false,
  });

  const [businessDataFetched, setBusinessDataFetched] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [images, setImages] = useState([]);
  const [rateCardImages, setRateCardImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [bIcon, setBIcon] = useState([]);
  const [banner, setBanner] = useState([]);
  const [imageSizeError, setImageSizeError] = useState({
    iconError: "",
    imageError: "",
    bannerError: "",
  });

  const [categoryList, setCategoryList] = useState(allState?.allCategoryList);
  const [suggestedSubcategories, setSuggestedSubcategories] = useState([]);
  const [apiError, setApirError] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    area: "",
    pincode: "",
    address1: "",
    address2: "",
    cityName: "",
    stateName: "",
    mobileNumber: allState?.addBusinessNumber,
    mobileNumber1: "",
    mobileNumber2: "",
    SubCategoryIds: [],
    categoryId: "",
    landmark: "",
    contactPersonName: "",
    email: "",
    timingsRaw: [{ Days: [], OpenAt: "", CloseAt: "" }],
    uploadPhoto: [],
    id: "",
    uploadbusinessIcon: [],
    BusDelAddFlag: [{}],
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
    facility: "",
    averageCost: "",
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
      }, 15000);
    }
  }, [apiError]);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const resp = await getApiData({
          url: `${API_ROUTE.GET_BUSINESS_BY_ID}/${businessId}`,
        });

        if (resp.status === API_SUCCESS_CODE) {
          console.log("here", resp.data);
          // setPreviewUploadedImage(resp?.data?.cachedBusinessData?.businessImages?.map(img=> img?.preSignedUrl))

          let updatedTimingField = resp?.data?.timings.map((timing) => ({
            days: timing.days.length
              ? timing.days.split(",")
              : timing.days.split(""),
            openAt: timing.openAt,
            closeAt: timing.closeAt,
          }));

          if (updatedTimingField.length == 0) {
            updatedTimingField = [{ days: [], openAt: "", closeAt: "" }];
          }

          setFormData({
            ...formData,
            ...resp?.data?.businessData,
            SubCategoryIds: [...resp?.data?.subCategories],
            uploadbusinessIcon: [],
            uploadPhoto: [],
            uploadBannerImage: [],
            uploadVideo: [],
          });

          resp?.data?.businessData?.mobileNumber1 && setPhoneNumberList(["mobileNumber","mobileNumber1"])
          resp?.data?.businessData?.mobileNumber2 && setPhoneNumberList([...phoneNumberList,"mobileNumber2"])

          setBIcon(
            resp?.data?.cachedBusinessData?.businessIcon &&
              resp?.data?.cachedBusinessData?.businessIcon?.fileName !== null &&
              !Array.isArray(resp?.data?.cachedBusinessData?.businessIcon)
              ? [resp?.data?.cachedBusinessData?.businessIcon]
              : []
          );
          setImages(
            resp?.data?.cachedBusinessData?.businessImages.filter((image) =>
              image?.documentType.includes("image")
            ) || []
          );

          setRateCardImages(
            resp?.data?.cachedBusinessData?.businessRateCards.filter((image) =>
              image?.documentType.includes("image")
            ) || []
          );
          setVideos(
            resp?.data?.cachedBusinessData?.businessImages.filter((image) =>
              image?.documentType.includes("video")
            ) || []
          );
          setBanner(
            resp?.data?.cachedBusinessData?.businessBanner &&
              resp?.data?.cachedBusinessData?.businessBanner?.fileName !==
                null &&
              !Array.isArray(resp?.data?.cachedBusinessData?.businessBanner)
              ? [resp?.data?.cachedBusinessData?.businessBanner]
              : []
          );

          setSelectedSubCategories([...resp?.data?.subCategories]);

          setTimings(updatedTimingField);
          setBusinessData({
            ...resp?.data?.businessData,
            SubCategoryIds: [...resp?.data?.subCategories],
            timingsRaw:
              resp?.data?.timings?.length == 0
                ? [{ days: "", openAt: "", closeAt: "" }]
                : resp?.data?.timings,
          });
          setApirError("");
          setBusinessDataFetched(true);
        } else {
          alert(resp?.message || API_NETWORK_ERROR);

          navigate("/list-business");
          console.log("here1", resp);
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
        logError("Error calling API:", error);
      }
    };
    fetchBusiness();
  }, [businessId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getApiData({
          url: `${API_ROUTE.GET_REFER_LIST}/?id=${formData?.referTypeId}`,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setFormData({ ...formData, referTypeName: resp?.data[0]?.name });
          setApirError("");
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
      }
    };
    if (formData?.referTypeId) fetchData();
  }, [formData?.referTypeId]);

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
      setFormData({ ...formData, area: "" });
      setAreaList([]);
      setPinLoading(false);
    }
  }, [formData?.pincode]);

  useEffect(() => {
    // Check for updates in non-time fields
    const nonTimeFieldsChanged = hasNonTimeFieldsChanged(
      formData,
      businessData,
      fieldsToCompare
    );

    // Check for updates in time-related fields (timings)
    const timingsChanged = hasTimingsChanged(businessData.timingsRaw, timings);

    setDataUpdated(
      nonTimeFieldsChanged ||
        timingsChanged ||
        imageUpdated.banner ||
        imageUpdated.icon ||
        imageUpdated.image ||
        imageUpdated.video
    );

    console.log("Non-time fields have changed.", nonTimeFieldsChanged);
    console.log("Timing fields have changed.", timingsChanged);
  }, [formData, businessData, timings, imageUpdated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_ALL_CAT,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setCategoryList(resp.data);
          dispatch({
            type: SET_All_CATEGORY,
            payload: { allCategories: resp.data },
          });
        }
      } catch (error) {
        logInfo("Error calling API:", error);
      }
    };
    if (allState?.allCategoryList?.length === 0 && businessDataFetched)
      fetchData();
  }, [allState?.allCategoryList]);

  useEffect(() => {
    const fetchData = async () => {
      setSuggestedSubcategories([]);
      // setFormData({
      //   ...formData,
      //   SubCategoryIds: [],
      // });
      // setSelectedSubCategories([]);
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_SUBCATEGORY_BY_ID,
          queryParams: { categoryId: formData?.categoryId },
        });
        logInfo("resp", resp);
        if (resp.status === API_SUCCESS_CODE) {
          if (
            formData?.SubCategoryIds?.sort()?.join("") ===
              businessData?.SubCategoryIds?.sort().join("") &&
            formData?.categoryId === businessData?.categoryId
          ) {
            const removedCategories = []; // New list for removed categories

            // Filter and remove categories
            const updatedSubcategoryList = resp.data?.filter((category) => {
              if (businessData?.SubCategoryIds.includes(category.id)) {
                removedCategories.push(category); // Add to removed list
                return false; // Exclude from updated list
              }
              return true; // Keep in updated list
            });
            setSelectedSubCategories(removedCategories);
            setSuggestedSubcategories(updatedSubcategoryList);
          } else setSuggestedSubcategories(resp.data);
        }
      } catch (error) {
        logInfo("Error calling API:", error);
      }
    };
    if (formData?.categoryId && businessDataFetched) fetchData();
  }, [formData?.categoryId, businessData?.SubCategoryIds]);

  useEffect(() => {
    if (categoryList.length && !selectedCategory && formData?.categoryId) {
      let selectedCategory = categoryList.filter(
        (cat) => cat.id === formData?.categoryId
      );
      setSelectedCategory(selectedCategory[0].name);
    }
  }, [categoryList, formData?.categoryId]);

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
    setFormData({ ...formData, area: eventKey });
    setErrors({ ...errors, area: "" });
  };

  const handleMonthSelect = (eventKey) => {
    setFormData({ ...formData, establishedMonth: eventKey });
  };

  const handleCateSelect = (category) => {
    setSelectedCategory(category.name);
    setFormData({
      ...formData,
      categoryId: category.id,
      SubCategoryIds: [],
    });
    setSelectedSubCategories([]);
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
      setActiveKey("3");
      return;
    }
    if (type === "closeAt" && !updatedTimings[index].openAt) {
      setErrors({
        ...errors,
        timeSlotError: "Please select open time before close time",
      });
      setActiveKey("3");
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
        setActiveKey("3");
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
        setActiveKey("3");
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
    console.log("form data is", formData);
  }, [formData]);

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
  const handleBannerUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageSizeError({ ...imageSizeError, bannerError: "" });
    processFiles(e, files, "banner");
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageSizeError({ ...imageSizeError, videoError: "" });
    processFiles(e, files, "video");
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

  const handleRateCardUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageSizeError({ ...imageSizeError, rateCardError: "" });
    processFiles(e, files, "rateCard");
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

        if (newImages?.length >= 5) {
          return; // Stop processing files if the limit is already reached
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (newImages.length < 5) {
            newImages.push({
              id: `${newImages?.length}-image`,
              src: reader.result,
              file,
            });
            setImages([...newImages]);
            setFormData({ ...formData, uploadPhoto: [...newImages] });
            setImageUpdated({ ...imageUpdated, image: true });
          }
        };
        reader.readAsDataURL(file);
      });

      if (e?.target?.value) e.target.value = ""; // Clear file input value
    }
    if (name === "rateCard") {
      const newRateCardImages = [...rateCardImages];

      files.forEach((file) => {
        if (file.size > IMAGE_MAX_IMAGE_SIZE) {
          setImageSizeError({
            ...imageSizeError,
            rateCardError: APP_ERROR.IMAGE_SIZE_ERROR(file.name),
          });
          return;
        }

        if (newRateCardImages?.length >= 2) {
          return; // Stop processing files if the limit is already reached
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (newRateCardImages.length < 2) {
            newRateCardImages.push({
              id: `${newRateCardImages?.length}-image`,
              src: reader.result,
              file,
            });
            setRateCardImages([...newRateCardImages]);
            setFormData({
              ...formData,
              uploadRateCard: [...newRateCardImages],
            });
            setImageUpdated({ ...imageUpdated, image: true });
          }
        };
        reader.readAsDataURL(file);
      });

      if (e?.target?.value) e.target.value = ""; // Clear file input value
    }

    if (name === "video") {
      const newVideos = [...videos];

      files.forEach((file) => {
        if (file.size > VIDEO_MAX_IMAGE_SIZE) {
          setImageSizeError({
            ...imageSizeError,
            videoError: APP_ERROR.IMAGE_SIZE_ERROR(file.name),
          });
          return;
        }

        if (newVideos?.length >= 2) {
          return; // Stop processing files if the limit is already reached
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (newVideos.length < 2) {
            newVideos.push({
              id: `${newVideos?.length}-image`,
              src: reader.result,
              file,
            });
            setVideos([...newVideos]);
            setFormData({ ...formData, uploadVideo: [...newVideos] });
            setImageUpdated({ ...imageUpdated, video: true });
          }
        };
        reader.readAsDataURL(file);
      });

      if (e?.target?.value) e.target.value = ""; // Clear file input value
    }

    if (name === "banner") {
      const newBanner = [...banner];
      files.forEach((file) => {
        if (file.size > IMAGE_MAX_IMAGE_SIZE) {
          setImageSizeError({
            ...imageSizeError,
            bannerError: APP_ERROR.IMAGE_SIZE_ERROR(file.name),
          });
          return;
        }
        if (newBanner?.length >= 1) {
          return; // Stop processing files if the limit is already reached
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (newBanner.length < 1) {
            newBanner.push({
              id: `${newBanner?.length}-banner`,
              src: reader.result,
              file,
            });
            setBanner([...newBanner]);
            setFormData({ ...formData, uploadBannerImage: [...newBanner] });
            setImageUpdated({ ...imageUpdated, banner: true });
          }
        };
        reader.readAsDataURL(file);
      });
      if (e?.target?.value) e.target.value = "";
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
            newBIcon.push({
              id: `${newBIcon?.length}-icon`,
              src: reader.result,
              file,
            });
            setBIcon([...newBIcon]);
            setFormData({ ...formData, uploadbusinessIcon: [...newBIcon] });
            setImageUpdated({ ...imageUpdated, icon: true });
          }
        };
        reader.readAsDataURL(file);
      });
      if (e?.target?.value) e.target.value = "";
    }
  };

  const handleRemoveImage = (id, name) => {
    if (id) {
      const filteredImages = images.filter((image) => image.id !== id);
      setImages(filteredImages);
      setFormData({ ...formData, uploadPhoto: filteredImages });
      setImageSizeError({ ...imageSizeError, imageError: "" });
      setImageUpdated({ ...imageUpdated, image: true });
    }
    if (name) {
      const filteredImages = images.filter((image) => image?.fileName !== name);
      setImages(filteredImages);
      setImageUpdated({ ...imageUpdated, image: true });
      setFormData((prevState) => {
        const updatedBusDelAddFlag = prevState?.BusDelAddFlag?.[0]
          ? [
              {
                BusinessId: businessId,
                DocumentList: [
                  ...(prevState.BusDelAddFlag[0].DocumentList || []),
                  name,
                ],
              },
            ]
          : [
              {
                BusinessId: businessId,
                DocumentList: [name],
              },
            ];

        return {
          ...prevState,
          BusDelAddFlag: updatedBusDelAddFlag,
        };
      });
    }
  };

  const handleRemoveRateCard = (id, name) => {
    if (id) {
      const filteredImages = rateCardImages.filter((image) => image.id !== id);
      setRateCardImages(filteredImages);
      setFormData({ ...formData, uploadRateCard: filteredImages });
      setImageSizeError({ ...imageSizeError, rateCardError: "" });
      setImageUpdated({ ...imageUpdated, image: true });
    }
    if (name) {
      const filteredImages = rateCardImages.filter(
        (image) => image?.fileName !== name
      );
      setRateCardImages(filteredImages);
      setImageUpdated({ ...imageUpdated, image: true });
      setFormData((prevState) => {
        const updatedBusDelAddFlag = prevState?.BusDelAddFlag?.[0]
          ? [
              {
                BusinessId: businessId,
                DocumentList: [
                  ...(prevState.BusDelAddFlag[0].DocumentList || []),
                  name,
                ],
              },
            ]
          : [
              {
                BusinessId: businessId,
                DocumentList: [name],
              },
            ];

        return {
          ...prevState,
          BusDelAddFlag: updatedBusDelAddFlag,
        };
      });
    }
  };

  const handleRemoveVideo = (id, name) => {
    if (id) {
      const filteredVideos = videos.filter((video) => video.id !== id);
      setVideos(filteredVideos);
      setFormData({ ...formData, uploadVideo: filteredVideos });
      setImageSizeError({ ...imageSizeError, videoError: "" });
      setImageUpdated({ ...imageUpdated, video: true });
    }
    if (name) {
      const filteredVideos = videos.filter((video) => video?.fileName !== name);
      setVideos(filteredVideos);
      setImageUpdated({ ...imageUpdated, video: true });
      setFormData((prevState) => {
        const updatedBusDelAddFlag = prevState?.BusDelAddFlag?.[0]
          ? [
              {
                BusinessId: businessId,
                DocumentList: [
                  ...(prevState.BusDelAddFlag[0].DocumentList || []),
                  name,
                ],
              },
            ]
          : [
              {
                BusinessId: businessId,
                DocumentList: [name],
              },
            ];

        return {
          ...prevState,
          BusDelAddFlag: updatedBusDelAddFlag,
        };
      });
    }
  };

  const handleRemoveIcon = (id, name) => {
    if (id) {
      setBIcon([]);
      setFormData({ ...formData, uploadbusinessIcon: [] });
      setImageSizeError({ ...imageSizeError, iconError: "" });
      setImageUpdated({ ...imageUpdated, icon: true });
    }
    if (name) {
      setBIcon([]);
      setFormData({ ...formData, uploadbusinessIcon: [] });
      setImageUpdated({ ...imageUpdated, image: true });
      setFormData((prevState) => {
        const updatedBusDelAddFlag = prevState?.BusDelAddFlag?.[0]
          ? [
              {
                BusinessId: businessId,
                DocumentList: [
                  ...(prevState.BusDelAddFlag[0].DocumentList || []),
                  name,
                ],
              },
            ]
          : [
              {
                BusinessId: businessId,
                DocumentList: [name],
              },
            ];

        return {
          ...prevState,
          BusDelAddFlag: updatedBusDelAddFlag,
        };
      });
    }
  };

  const handleRemoveBanner = (id, name) => {
    if (id) {
      setBanner([]);
      setFormData({ ...formData, uploadBannerImage: [] });
      setImageSizeError({ ...imageSizeError, bannerError: "" });
      setImageUpdated({ ...imageUpdated, banner: true });
    }
    if (name) {
      setBanner([]);
      setFormData({ ...formData, uploadBannerImage: [] });
      setImageUpdated({ ...imageUpdated, banner: true });
      setFormData((prevState) => {
        const updatedBusDelAddFlag = prevState?.BusDelAddFlag?.[0]
          ? [
              {
                BusinessId: businessId,
                DocumentList: [
                  ...(prevState.BusDelAddFlag[0].DocumentList || []),
                  name,
                ],
              },
            ]
          : [
              {
                BusinessId: businessId,
                DocumentList: [name],
              },
            ];

        return {
          ...prevState,
          BusDelAddFlag: updatedBusDelAddFlag,
        };
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    processFiles(e, files, "images");
  };

  const handleIconDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    processFiles(e, files, "icon");
  };

  const handleRateCardDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    processFiles(e, files, "rateCard");
  };

  const handleBannerDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    processFiles(e, files, "banner");
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    processFiles(e, files, "video");
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const resetAllState = () => {
    setLoading(false);
    setPinLoading(false);
    setDataUpdated(false);
    setImageUpdated({ icon: false, banner: false, image: false });
    setAreaList([]);
    setPhoneNumberList(["mobileNumber"]);
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
      BusDelAddFlag: [],
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

  const checkValidationOnNextStep = () => {
    let isValid = true;
    const newErrors = {
      businessName: "",
      area: "",
      pincode: "",
      landmark: "",
      categoryId: "",
      SubCategoryIds: "",
      contactPersonName: "",
      timeSlotError: "",
      establishedYear: "",
    };

    // validate Year
    if (
      formData?.establishedYear &&
      formData?.establishedYear.trim()?.length < 4
    ) {
      newErrors.establishedYear = APP_ERROR.YEAR_ERROR;
      isValid = false;
    }

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

    // category Id
    if (formData?.SubCategoryIds?.length === 0) {
      newErrors.SubCategoryIds = APP_ERROR.SUBCATEGORY_EMPTY_ERROR;
      isValid = false;
    }

    // contactPersonName Id
    if (formData?.contactPersonName?.trim()?.length < 3) {
      newErrors.contactPersonName = APP_ERROR.CONTACT_NAME_INVALID_ERROR;
      isValid = false;
    }

    let result = validateTimings();
    if (!result?.isValid) {
      newErrors.timeSlotError = result?.errorMessage;
      isValid = false;
    }

    if (isValid && result?.isValid) return true;
    else {
      setErrors(newErrors);
      return false;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (checkValidationOnNextStep()) {
      const data = new FormData();

      let RemovedDocuments = "";

      Object.entries({ ...formData, timingsRaw: timings }).forEach(
        ([key, value]) => {
          if (Array.isArray(value) && value.length) {
            if (
              key === "uploadPhoto" ||
              key === "uploadbusinessIcon" ||
              key === "uploadBannerImage" ||
              key === "uploadVideo" ||
              key === "uploadRateCard"
            ) {
              value.forEach((item) => item?.id && data.append(key, item?.file));
            } else if (key === "timingsRaw") {
              data.append(key, JSON.stringify(value));
            } else if (key === "BusDelAddFlag") {
              // data.append('RemovedDocuments', JSON.stringify(value[0]));
              RemovedDocuments = value[0];
            } else {
              value.forEach((item) => data.append(key, item));
            }
          } else if (
            key !== "uploadPhoto" &&
            key !== "uploadbusinessIcon" &&
            key !== "uploadBannerImage" &&
            key !== "uploadVideo" &&
            key !== "uploadRateCard" &&
            value
          ) {
            // Skip these keys since they are already handled above
            data.append(key, value);
          }
        }
      );

      if (RemovedDocuments && RemovedDocuments?.DocumentList?.length >= 0) {
        data.append("RemovedDocuments.BusinessId", RemovedDocuments.BusinessId);
        RemovedDocuments.DocumentList.forEach((doc, index) => {
          data.append(`RemovedDocuments.DocumentList[${index}]`, doc);
        });
      }

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
          alert("business added successfully");
          handleOperationComplete();
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
      }
    }
  };

  const handleOperationComplete = () => {
    resetAllState();
    navigate("/list-business", { replace: true });
  };

  const isFormValid =
    formData?.businessName.trim() &&
    formData?.pincode.trim() &&
    formData?.address1.trim() &&
    formData?.address2.trim() &&
    formData?.area.trim() &&
    formData?.categoryId;

  return (
    <div className="ub-container hdv-container">
      {loading && <Loader />}
      {pinLoading && <Loader />}
      <Accordion
        activeKey={activeKey}
        onSelect={(key) => setActiveKey(!key ? "0" : key)}
      >
        <Accordion.Item eventKey="0" className="hdv-margin-bottom-8">
          <Accordion.Header>Enter Your Business Details</Accordion.Header>
          <Accordion.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                logInfo("Form submission prevented");
              }}
            >
              <div className="hdv-row accordian-row-form">
                <div className=" hdv-col-5 hdv-margin-bottom-16 refer-by-wraper">
                  <div className="form-group hdv-col-6 ">
                    <label>Referred by</label>
                    <input
                      type="text"
                      name="referTypeName"
                      value={formData?.referTypeName}
                      onChange={handleInputChange}
                      placeholder="Referred by"
                      readOnly
                    />
                  </div>
                  <div className="form-group hdv-col-6 ">
                    <label>Code</label>
                    <input
                      type="text"
                      name="referredByCode"
                      value={formData?.referredByCode}
                      onChange={handleInputChange}
                      placeholder="Enter Code"
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-group hdv-col-5 hdv-margin-bottom-16">
                  <label>Business Name *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData?.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter business name"
                  />
                  {errors?.businessName && (
                    <span className="form-error-message">
                      {errors?.businessName}
                    </span>
                  )}
                </div>

                <div className="form-group hdv-col-5 hdv-margin-bottom-16 ">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData?.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter pincode"
                    maxLength={6}
                  />
                  {errors?.pincode && (
                    <span className="form-error-message">
                      {errors?.pincode}
                    </span>
                  )}
                </div>

                <div className="form-group hdv-col-5 hdv-margin-bottom-16 ">
                  <label htmlFor="area-dropdown">Area *</label>
                  <Dropdown
                    onSelect={handleAreaSelect}
                    className={`ub-dropdown ${areaList?.length === 0 ? "ub-dropdown-disabled" : ""} `}
                  >
                    <Dropdown.Toggle
                      variant="primary"
                      id="area-dropdown"
                      className={`ub-dropdown-toggle ${formData?.area === "" ? "placeholder-visible" : "value-selected"}`}
                      disabled={areaList?.length === 0}
                    >
                      {/* {selectedArea === "" ? "Select an area" : selectedArea} */}
                      {formData?.area === ""
                        ? "Select an area"
                        : formData?.area}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="area-menu">
                      {areaList.map((area, i) => (
                        <Dropdown.Item key={`${area.id}-${i}`} eventKey={area}>
                          {area}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  {errors?.area && (
                    <span className="form-error-message">{errors?.area}</span>
                  )}
                </div>

               
                <div className="form-group hdv-col-5 hdv-margin-bottom-16 ">
                  <label>Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData?.landmark}
                    onChange={handleInputChange}
                    placeholder="Enter landmark"
                  />
                </div>

                <div className="form-group hdv-col-5 hdv-margin-bottom-16 ">
                  <label>Block Number/Building Name *</label>
                  <input
                    type="text"
                    name="address1"
                    value={formData?.address1}
                    onChange={handleInputChange}
                    placeholder="Enter building name"
                  />
                  {errors?.address1 && (
                    <span className="form-error-message">
                      {errors?.address1}
                    </span>
                  )}
                </div>
                <div className="form-group hdv-col-5 hdv-margin-bottom-16 ">
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
                <div className="form-group hdv-col-5 hdv-margin-bottom-16 ">
                  <label>Street/Colony Name *</label>
                  <input
                    type="text"
                    name="address2"
                    value={formData?.address2}
                    onChange={handleInputChange}
                    placeholder="Enter street name"
                  />
                  {errors?.address2 && (
                    <span className="form-error-message">
                      {errors?.address2}
                    </span>
                  )}
                </div>

                <div className="form-group hdv-col-5 hdv-margin-bottom-16 ">
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
                <div className="hdv-col-5 hdv-margin-bottom-16 established-year-month">
                  <div className="form-group hdv-col-6 ">
                    <label>Year of Establishment</label>
                    <input
                      type="text"
                      name="establishedYear"
                      value={formData?.establishedYear}
                      onChange={handleInputChange}
                      placeholder="Enter Year"
                      maxLength={4}
                    />
                    {errors?.establishedYear && (
                      <span className="form-error-message">
                        {errors?.establishedYear}
                      </span>
                    )}
                  </div>
                  <div className="form-group hdv-col-6 ">
                    <label
                      htmlFor="month-dropdown"
                      className="established-month-label"
                    />
                    <Dropdown
                      onSelect={handleMonthSelect}
                      className="ub-dropdown"
                    >
                      <Dropdown.Toggle
                        variant="primary"
                        id="month-dropdown"
                        className={`ub-dropdown-toggle ${!formData?.establishedMonth ? "placeholder-visible" : "value-selected"}`}
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
              </div>
            </form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className="hdv-margin-bottom-8">
          <Accordion.Header>Add Business Category</Accordion.Header>
          <Accordion.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                logInfo("Form submission prevented");
              }}
            >
              <div className="hdv-row category-details-section">
                <div className="form-group hdv-col-5 ">
                  <label htmlFor="area-dropdown">
                    Select Business Category *
                  </label>
                  <Dropdown
                    // onSelect={handleCateSelect}
                    className="ub-dropdown hdv-margin-bottom-28"
                  >
                    <Dropdown.Toggle
                      variant="primary"
                      id="area-dropdown"
                      className={`ub-dropdown-toggle ${selectedCategory === "" ? "placeholder-visible" : "value-selected"}`}
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
                    <div className="selected-categories hdv-margin-bottom-24">
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
                        {errors?.SubCategoryIds && (
                          <span className="form-error-message">
                            {errors?.SubCategoryIds}
                          </span>
                        )}
                      </p>

                      <div className="category-buttons">
                        {suggestedSubcategories?.map((category, i) => (
                          <button
                            key={`slected-category-tag-${category?.name}-${i}`}
                            onClick={() => handleSubCategoryAdd(category)}
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
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2" className="hdv-margin-bottom-8">
          <Accordion.Header>Add Contacts Details</Accordion.Header>
          <Accordion.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                logInfo("Form submission prevented");
              }}
            >
              <div className="hdv-row  contact-container">
                <div className="form-group hdv-col-6 ">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    name="contactPersonName"
                    value={formData?.contactPersonName}
                    onChange={handleInputChange}
                    placeholder="Enter Contact Person"
                  />
                  {errors?.contactPersonName && (
                    <span className="form-error-message">
                      {errors?.contactPersonName}
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
                      <span className={`input-prefix  read-only-field`}>
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
                              ? clearPhoneNumber(phoneFields[i].phoneFieldName)
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
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3" className="hdv-margin-bottom-8">
          <Accordion.Header>Add Business Timing</Accordion.Header>
          <Accordion.Body>
            {errors?.timeSlotError && (
              <div className="error-wrapper hdv-margin-bottom-16">
                <span className="form-error-message">
                  {errors?.timeSlotError}
                </span>
              </div>
            )}
            <div className="hdv-row ub-time-container">
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
                                  timing.days.includes(day) ? "active" : ""
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
                                checked={timing.days?.length === days?.length}
                                onChange={(e) =>
                                  handleSelectAllChange(index, e.target.checked)
                                }
                              />
                            </span>
                            Select All Days
                          </span>
                        </div>
                      </div>

                      <div className="time-selection hdv-row">
                        <div className="hdv-col-6 open-close">
                          <label htmlFor={`open-at-${index}`}>Open at</label>

                          <Dropdown className="ub-dropdown hdv-margin-bottom-28">
                            <Dropdown.Toggle
                              variant="primary"
                              id="area-dropdown"
                              className={`ub-dropdown-toggle ${timing.openAt ? "value-selected" : "placeholder-visible"}`}
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
                              {getFilteredTimeOptions(index, "openAt")?.map(
                                (option, i) => (
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
                                )
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        {timing.openAt !== "Open 24hrs" &&
                          timing.openAt !== "Closed" && (
                            <div className="hdv-col-6 open-close">
                              <label htmlFor={`close-at-${index}`}>
                                Close at
                              </label>

                              <Dropdown className="ub-dropdown hdv-margin-bottom-28">
                                <Dropdown.Toggle
                                  variant="primary"
                                  id="area-dropdown"
                                  className={`ub-dropdown-toggle ${timing.closeAt ? "value-selected" : "placeholder-visible"}`}
                                >
                                  {timing.closeAt || "Select closing time"}
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
                                  {getFilteredTimeOptions(index, "closeAt").map(
                                    (option, i) => (
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
                                    )
                                  )}
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          )}
                      </div>
                    </div>
                    {timings?.length > 1 && index !== timings?.length - 1 && (
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
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4" className="hdv-margin-bottom-8">
          <Accordion.Header>Upload Your Documents</Accordion.Header>
          <Accordion.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                logInfo("Form submission prevented");
              }}
            >
              <div className="photo-upload-container ">
                <div className={`hdv-row hdv-margin-bottom-20`}>
                  <h2 className="step-title hdv-margin-bottom-4">Icon</h2>
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
                            <span className="browse-image"> browse</span>
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
                      {bIcon.map((icon, i) => (
                        <div
                          key={`${icon?.id}-${i}-image`}
                          className="preview-image "
                        >
                          <img
                            src={icon?.src || icon?.preSignedUrl}
                            alt={`Preview ${icon?.id}`}
                          />

                          {/* <img src={icon.src} alt={`Preview ${icon.id}`} /> */}
                          <button
                            onClick={() =>
                              handleRemoveIcon(icon?.id, icon?.fileName)
                            }
                            // onClick={handleRemoveIcon}
                            className="clear-img-preview"
                          >
                            <img src={deleteicon} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`hdv-row hdv-margin-bottom-20`}>
                  <h2 className="step-title hdv-margin-bottom-4">Images</h2>
                  <div className="form-group hdv-col-12 ">
                    <div
                      className="upload-image-section"
                      onDragOver={handleDragOver}
                      onDrop={handleImageDrop}
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
                        disabled={images?.length >= 5}
                        name="images"
                      />
                      <label
                        htmlFor="image-file-upload"
                        className={`image-upload-label ${images?.length >= 5 ? "image-upload-label-disabled" : ""}`}
                      >
                        <img
                          src={upload}
                          alt="Upload Icon"
                          className="hdv-margin-bottom-4"
                        />
                        <p className="drag-wrap">
                          <span className="drga-image">
                            Drag & drop files or click to{" "}
                            <span className="browse-image"> browse</span>
                          </span>
                        </p>
                        <p className="support-wrap">
                          <span>Supported Format: PNG, JPEG, JPG</span>
                        </p>
                        {imageSizeError?.imageError && (
                          <span className="form-error-message">
                            {imageSizeError?.imageError}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                  {images?.length > 0 && (
                    <div className="hdv-row img-preview-container">
                      {images.map((image, i) => (
                        <div
                          key={`${image?.id}-${i}-image`}
                          className="preview-image "
                        >
                          {/* <img src={image?.src} alt={`Preview ${image.id}`} /> */}
                          <img
                            src={image?.src || image?.preSignedUrl}
                            alt={`Preview ${image?.id}`}
                          />
                          <button
                            // onClick={() => handleRemoveImage(image?.id)}
                            onClick={() =>
                              handleRemoveImage(image?.id, image?.fileName)
                            }
                            className="clear-img-preview"
                          >
                            <img src={deleteicon} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={`hdv-row hdv-margin-bottom-20`}>
                  <h2 className="step-title hdv-margin-bottom-4">Banner</h2>
                  <div className="form-group hdv-col-12 ">
                    <div
                      className="upload-image-section"
                      onDragOver={handleDragOver}
                      onDrop={handleBannerDrop}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                    >
                      <input
                        type="file"
                        accept=".jpeg, .jpg, .png"
                        style={{ display: "none" }}
                        id="banner-file-upload"
                        onChange={handleBannerUpload}
                        disabled={banner?.length >= 1}
                        name="banner"
                      />
                      <label
                        htmlFor="banner-file-upload"
                        className={`image-upload-label ${banner?.length >= 1 ? "image-upload-label-disabled" : ""}`}
                      >
                        <img
                          src={upload}
                          alt="Upload banner"
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
                        {imageSizeError?.bannerError && (
                          <span className="form-error-message">
                            {imageSizeError?.bannerError}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                  {banner?.length >= 1 && (
                    <div className="hdv-row img-preview-container">
                      {banner.map((banner, i) => (
                        <div
                          key={`${banner?.id}-${i}-image`}
                          className="preview-image "
                        >
                          <img
                            src={banner?.src || banner?.preSignedUrl}
                            alt={`Preview ${banner?.id}`}
                          />
                          <button
                            onClick={() =>
                              handleRemoveBanner(banner?.id, banner?.fileName)
                            }
                            // onClick={handleRemoveBanner}
                            className="clear-img-preview"
                          >
                            <img src={deleteicon} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={`hdv-row hdv-margin-bottom-20`}>
                  <h2 className="step-title hdv-margin-bottom-4"> Videos</h2>
                  <div className="form-group hdv-col-12 ">
                    <div
                      className="upload-image-section"
                      onDragOver={handleDragOver}
                      onDrop={handleVideoDrop}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                    >
                      <input
                        type="file"
                        accept=".mov,.mp4"
                        style={{ display: "none" }}
                        id="video-file-upload"
                        onChange={handleVideoUpload}
                        disabled={videos?.length >= 2}
                        name="video"
                      />
                      <label
                        htmlFor="video-file-upload"
                        className={`image-upload-label ${videos?.length >= 2 ? "image-upload-label-disabled" : ""}`}
                      >
                        <img
                          src={upload}
                          alt="Upload videos"
                          className="hdv-margin-bottom-4"
                        />
                        <p className="drag-wrap">
                          <span className="drga-image">
                            Drag & drop files or click to
                            <span className="browse-image"> browse</span>
                          </span>
                        </p>
                        <p className="support-wrap">
                          Supported Format: MOV, MP4
                        </p>
                        {imageSizeError?.videoError && (
                          <span className="form-error-message">
                            {imageSizeError?.videoError}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                  {videos?.length >= 1 && (
                    <div className="hdv-row img-preview-container">
                      {videos.map((video, i) => (
                        <div
                          key={`${video?.id}-${i}-video`}
                          className="preview-image "
                        >
                          <video controls width="250" height="150px">
                            <source
                              src={video?.src || video?.preSignedUrl}
                              type="video/mp4"
                            />
                            <source
                              src={video?.src || video?.preSignedUrl}
                              type="video/mov"
                            />
                          </video>
                          <button
                            onClick={() =>
                              handleRemoveVideo(video?.id, video?.fileName)
                            }
                            // onClick={handleRemoveBanner}
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
                  <h2 className="step-title hdv-margin-bottom-4">RateCard</h2>
                  <div className="form-group hdv-col-12 ">
                    <div
                      className="upload-image-section"
                      onDragOver={handleDragOver}
                      onDrop={handleRateCardDrop}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                    >
                      <input
                        type="file"
                        accept=".jpeg, .jpg, .png"
                        multiple
                        style={{ display: "none" }}
                        id="rate-card-file-upload"
                        onChange={handleRateCardUpload}
                        disabled={rateCardImages?.length >= 2}
                        name="rateCard"
                      />
                      <label
                        htmlFor="rate-card-file-upload"
                        className={`image-upload-label ${rateCardImages?.length >= 2 ? "image-upload-label-disabled" : ""}`}
                      >
                        <img
                          src={upload}
                          alt="Upload rate card"
                          className="hdv-margin-bottom-4"
                        />
                        <p className="drag-wrap">
                          <span className="drga-image">
                            Drag & drop files or click to{" "}
                            <span className="browse-image"> browse</span>
                          </span>
                        </p>
                        <p className="support-wrap">
                          <span>Supported Format: PNG, JPEG, JPG</span>
                        </p>
                        {imageSizeError?.rateCardError && (
                          <span className="form-error-message">
                            {imageSizeError?.rateCardError}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                  {rateCardImages?.length > 0 && (
                    <div className="hdv-row img-preview-container">
                      {rateCardImages.map((image, i) => (
                        <div
                          key={`${image?.id}-${i}-image`}
                          className="preview-image "
                        >
                          <img
                            src={image?.src || image?.preSignedUrl}
                            alt={`Preview ${image?.id}`}
                          />
                          <button
                            onClick={() =>
                              handleRemoveRateCard(image?.id, image?.fileName)
                            }
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
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5" className="hdv-margin-bottom-8">
          <Accordion.Header>Additional Information </Accordion.Header>
          <Accordion.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                logInfo("Form submission prevented");
              }}
            >
              <div className="hdv-row accordian-row-form">
                <div className="form-group hdv-col-12 hdv-margin-bottom-16">
                  <label>Add Yours Business Facilities</label>
                  <input
                    type="text"
                    name="facility"
                    value={formData?.facility}
                    onChange={handleInputChange}
                    placeholder="Text here..."
                  />
                </div>

                <div className="form-group hdv-col-12 hdv-margin-bottom-16">
                  <label>Add Average Cost</label>
                  <input
                    type="text"
                    name="averageCost"
                    value={formData?.averageCost}
                    onChange={handleInputChange}
                    placeholder="Text here..."
                  />
                </div>
              </div>
            </form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="cta-container hdv-row">
        {apiError && <ErrorPopup errorText={apiError} />}
        <button
          className="secondary hdv-col-2"
          onClick={handleOperationComplete}
        >
          Cancel
        </button>

        <button
          className="submit-button hdv-col-2"
          disabled={!dataUpdated || !isFormValid}
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateBusiness;
