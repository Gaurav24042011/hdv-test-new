import {
  SET_USER,
  SET_SELECTED_CATEGORY,
  SET_All_CATEGORY,
  SET_USER_LOCATION,
  SET_SELECTED_SUB_CATEGORY,
  SET_BUSINESS_NUMBER,
  SET_ALL_EMPLOYEE_LIST,
  SET_ROLE_LIST,
  SET_All_REFER_LIST,
  SET_LOCATION_DETAILS,
  SET_GLOBAL_SEARCH_ITEMS
} from "../const/actionTypes";
export const globalReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload.useDetails };
    case SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload.selectedCategory };
    case SET_SELECTED_SUB_CATEGORY:
      return {
        ...state,
        selectedSubCategory: action.payload.selectedSubCategory,
      };
    case SET_All_CATEGORY:
      return { ...state, allCategoryList: action.payload.allCategories };
    case SET_All_REFER_LIST:
      return { ...state, allReferList: action.payload.allReferList };
    case SET_USER_LOCATION:
      return { ...state, userCurrentLocation: action.payload };
    case SET_BUSINESS_NUMBER:
      return { ...state, addBusinessNumber: action.payload.businessNumber };
    case SET_ALL_EMPLOYEE_LIST:
      return { ...state, allEmployeeList: action.payload.employees };
    case SET_ROLE_LIST:
      return { ...state, allRoleList: action.payload.roles };
    case SET_LOCATION_DETAILS:
      return { ...state, locationDetails: action.payload.locationDetails };
    case SET_GLOBAL_SEARCH_ITEMS:
      return { ...state, globalSearchItems: action.payload.globalSearchItems };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};
