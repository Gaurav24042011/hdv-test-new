import React, { useState, useEffect } from "react";
import "./SubCategory.scss";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import banner_hotels_2024 from "../../assets/banner_hotels_2024.webp";
import {
  useGlobalState,
  useGlobalDispatch,
} from "../../context/GlobalProvider";
import {
  getFromSessionStorage,
  saveToSessionStorage,
} from "../../utils/sessionStorage-utility";
import {
  SET_SELECTED_CATEGORY,
  SET_SELECTED_SUB_CATEGORY,
} from "../../const/actionTypes";

import { FaDownload } from "react-icons/fa";
import { getApiData } from "../../utils/axios-utility";
import { API_ROUTE, API_SUCCESS_CODE } from "../../const/common";
import { logInfo } from "../../utils/log-util";

import { useLoader } from "../../hooks/useLoader";
import { Loader } from "../../element/Loader/Loader";

import restPage1 from '../../assets/restPage1.svg'

const SubCategory = () => {
  const { selectedCategory } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const navigate = useNavigate();

  const [subCategoryList, setSubCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCategory, setShowCategory] = useState(
    (selectedCategory?.id && selectedCategory) ||
      getFromSessionStorage(SET_SELECTED_CATEGORY)
  );
  const location = useLocation();
  useLoader(setLoading);

  if (!location?.state?.allowed) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_SUBCATEGORY_BY_ID,
          queryParams: { categoryId: showCategory?.id },
        });
        logInfo("resp", resp);
        if (resp.status === API_SUCCESS_CODE) {
          setSubCategoryList(resp.data);
        }
      } catch (error) {
        logInfo("Error calling API:", error);
      }
    };
    if (showCategory?.id) fetchData();
  }, [showCategory]);

  const handleSubCatgeoryAction = (subCategory) => {
    console.log("erer", subCategory);
    dispatch({
      type: SET_SELECTED_SUB_CATEGORY,
      payload: { selectedSubCategory: subCategory },
    });
    saveToSessionStorage(SET_SELECTED_SUB_CATEGORY, subCategory);
    navigate(`/category/${showCategory?.name}/${subCategory?.name}`,{ state: { allowed: true } });
  };

  return (
    <div className="hdv-container subcategory-container">
      {loading && <Loader />}
      <div className="hdv-row">
        <div className="hdv-col-12">
          <section className="subcategory-header hdv-row hdv-margin-bottom-32">
            <div className="hdv-col-4 download-right">
              <button className="download-app hdv-col-7">
                Download our app <FaDownload />
              </button>
            </div>
          </section>
          {/* Banner Section */}
          <section className="subcategory__banner hdv-row hdv-margin-bottom-40">
          <div className="subcategory_banner-image hdv-col-6">
            <img src={restPage1} alt="Banner" />
          </div>
          <div className="subcategory__banner-image hdv-col-6">
            <img src={restPage1} alt="Banner"/>
          </div>
          </section>

          {/* Subcategory List */}
          <section className="subcategory-list hdv-row hdv-margin-bottom-36">
            <h2 className="hdv-col-12 hdv-margin-bottom-24 subcategory-name">
              {showCategory?.name}
            </h2>
            <div className="subcategory-item-wrapper hdv-col-12">
              {subCategoryList.length > 0 &&
                subCategoryList.map((subCategory, index) => (
                  <div
                    key={index}
                    className="subcategory-item "
                    onClick={() => handleSubCatgeoryAction(subCategory)}
                  >
                    <span>{subCategory?.name}</span>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
