export const PASSWORD_MIN_LENGTH = 8;
export const OTP_LENGTH = 6;
// export const CHECK_IS_NUMEBR = /^\d*$/;
export const CHECK_IS_NUMEBR = /^[0-9]\d*$/;
export const CHECK_IS_MOBILE_NUMBER = /^[0-9]{10}$/;
export const CHECK_FOR_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MOBILE_START_WITH_6 = /^[6789]\d*$/;

export const YEAR_START = /^[12]\d*$/;

export const IMAGE_MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB for images
export const VIDEO_MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 2MB for images

export const VALID_PASSWORD =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const API_SUCCESS_CODE = 200;

//const for Cookies
export const USER_DETAILS = "HDVLOGGEDINUSER";

export const MONTH_LIST = [
  { value: "Jan", label: "Jan" },
  { value: "Feb", label: "Feb" },
  { value: "Mar", label: "Mar" },
  { value: "Apr", label: "Apr" },
  { value: "May", label: "May" },
  { value: "Jun", label: "Jun" },
  { value: "Jul", label: "Jul" },
  { value: "Aug", label: "Aug" },
  { value: "Sep", label: "Sep" },
  { value: "Oct", label: "Oct" },
  { value: "Nov", label: "Nov" },
  { value: "Dec", label: "Dec" },
];

export const EVENTS = {
  LOAD: "load",
  SET_LOADER: "SET_LOADER",
};

export const API_ROUTE = {
  GET_SUBCATEGORY_BY_ID: "Dashboard/GetSubcategoryByCategoryId/categoryId",
  GET_BUSINESS_BY_SUBC_ID: "Dashboard/GetBusinessBySubCategoryId/subCategoryId",
  GET_ALL_CAT: "Dashboard/GetCategories",
  GLOBAL_SEARCH:'Dashboard/SearchGlobalItem',
  GET_BUSINESS_SEARCH:'Dashboard/BusinessSearch',

  //Login Flow Apis

  REGISTER_GEN_OTP: "login/GenerateOTP?ActionName=Register",
  REGISTER_VERIFY_OTP: "login/VerifyOTP?ActionName=Register",

  START_NOW_GEN_OTP: "login/GenerateOTP?ActionName=StartNow",
  START_NOW_VERIFY_OTP: "login/VerifyOTP?ActionName=StartNow",

  SIGN_IN_GEN_OTP: "login/GenerateOTP?ActionName=SignInWithOTP",
  SIGNIN_VERIFY_OTP: "login/VerifyOTP?ActionName=SignInWithOTP",
  SIGN_IN_PASSWORD: "Login/SignInWithPassword",
  SIGN_IN_CHANGE_PWD: "Login/ChangePassword",

  FORGOT_PASSWORD_GEN_OTP: "login/GenerateOTP?ActionName=ForgotPassword",
  FORGOT_PASSWORD_VERIFY_OTP: "login/VerifyOTP?ActionName=ForgotPassword",
  FORGOT_PASSWORD_SUBMIT: "login/ForgotPassword",

  //Business
  ADD_BUSINESS: "Business/AddBusiness",
  GET_BUSINESS_BY_MOBILE: "login/GetBusinessByMobileNo",
  GET_BUSINESS_BY_ID: "Business/GetBusinessById",
  UPDATE_BUSINESS: "Business/UpdateBusiness",

  //Employee

  GET_ALL_EMPLOYEE: "Employee/GetEmployeeByKeyword",
  DEACTIVATE_EMPLOYEE: "Employee/DeactivateEmployee",
  ADD_EMPLOYEE: "Employee/AddEmployee",
  UPDATE_EMPLOYEE: "Employee/UpdateEmployee",
  GET_EMPLOYEE_ROLES: "Employee/GetEmployeeRoles",

  //Reporting person

  GET_REPORTING_PERSON: "Employee/GetReportingEmployeeById",

  //Roles
  GET_ALL_ROLES: "Roles/GetRoles",

  //SubscriptionPlan

  GET_SUBSCRIPTION_PLAN_DETAIL: "SubcriptionPlan/GetSubscriptionPlanDetails",
  GET_PLAN_LIST: "Subcription/GetSubcriptions",
  GET_ALL_PACKAGE_LIST: "/SubscriptionPlanMaster/GetSubscriptionPlan",
  ADD_NEW_SUBSCRIPTION: "SubcriptionPlan/AddSubscriptionPlanDetail",
  UPDATE_SUBSCRIPTION: "SubcriptionPlan/UpdateSubscriptionPlanDetail",
  ACTIVATE_SUBSCRIPTION: "SubcriptionPlan/ActivateSubscription",
  DEACTIVATE_SUBSCRIPTION: "SubcriptionPlan/DeactivateSubscription",
  GET_ACTIVE_SUBSCRIPTION: "SubcriptionPlan/GetSubscriptionActivePlanDetails",

  //Customer
  GET_CUSTOMER_BY_MOBILE: "Customer/GetCustomerByMobileNumber",
  REGISTER_CUSTOMER: "Customer/RegisterCustomer",
  GET_REFER_LIST: "Customer/GetReferenceType/id",

  //Transaction

  TRANSACTION_CREATE_ORDER: "Transaction/CreateOrder",
  TRANSACTION_VERIFY_PAYMENT: "Transaction/VerifyPayment",
};

export const API_NETWORK_ERROR = "Something went wrong, please try again later";

export const RAZOR_PAY_ORDER_ERROR="Failed to placed your order"

export const APP_ERROR = {
  MOBILE_REQUIRED_ERROR: "Please enter your mobile number",
  MOBILE_INVALID_ERROR: "Please enter a valid 10-digit mobile number",
  USERNAME_REQUIRED_ERROR: "Please enter a name",
  USERNAME_INVALID_ERROR: "Name must be at least 3 characters long",
  PASSWORD_REQUIRED_ERROR: "Please enter your password",
  PASSWORD_INVALID_ERROR: "Please enter a valid password",
  PASSWORD_INVALID_CHAR_ERROR:
    "Password should be minimum 8 characters alpha numeric with one caps and one special character",
  NEW_PASSWORD_SAME_AS_OLD_ERROR:
    "Old Password and New Password should be different",
  NEW_PASSWORD_INVALID_CHAR_ERROR:
    "New Password should be minimum 8 characters alpha numeric with one caps and one special character",
  OLD_PASSWORD_INVALID_CHAR_ERROR:
    "New Password should be minimum 8 characters alpha numeric with one caps and one special character",
  NEWPASSWORD_MATCH: "New password and confirm password must be the same",
  NEWPASSWORD_SUCCESS: "Password reset successfully",
  CHANGEPASSWORD_SUCCESS: "Password changed successfully",
  CHANGE_NEWPASSWORD_MATCH:
    "New password and confirm new password must be the same",
  BUSINESS_NAME_EMPTY_ERROR: "Please enter a business name",
  BUSINESS_NAME_INVALID_ERROR:
    "Business name must be at least 3 characters long",
  PINCODE_EMPTY_ERROR: "Please enter a valid 6-digit pincode",
  PINCODE_INVALID_ERROR: "Please enter a valid pincode",
  AREA_EMPTY_ERROR: "Please select a Area",
  CONTACT_NAME_INVALID_ERROR:
    "Contact person name must be at least 3 characters long",
  EMAIL_ID_INVALID_ERROR: "Please enter valid email ID",
  CATEGORY_NOT_FOUND: "Cannot find category",
  CATEGORY_EMPTY_ERROR: "Please enter category",
  SUBCATEGORY_EMPTY_ERROR: "Please select one or more subcategory",
  INVALID_DAY_24HRS_ERROR: " cannot be selected as it is marked as Open24Hrs.",
  INVALID_DAY_CLOSED_ERROR: " cannot be selected as it is marked as Closed.",
  INVALID_DAY_SELECTION_ERROR: " cannot be selected in more than 2 Time Slots",
  DAYS_SELECTION_REQUIRED: "Please select working days",
  OPEN_TIMING_REQUIRED: "Please enter Open Timing",
  CLOSE_TIMING_REQUIRED: "Please enter Close Timing",
  TERMS_CONDITION_REQUIRED:
    "You must agree to the Terms and Conditions and Privacy Policy to proceed.",
  EMPTY_BLOCK_NAME: "Block name field cann't be empty",
  EMPTY_STREET_NAME: "Street name field cann't be empty",
  INVALID_EMAIL: "Please enter a valid Email",
  ENTER_12_DIGIT_FOR_AADHAR: "Please enter 12 digit for Aadhar",
  YEAR_ERROR: "Enter a valid Year",

  IMAGE_SIZE_ERROR: (name) => `File ${name} exceeds the 2MB size limit.`,
};
