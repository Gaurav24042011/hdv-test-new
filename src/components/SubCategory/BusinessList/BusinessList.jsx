import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./BusinessList.scss";
import { FaDownload } from "react-icons/fa";
import BusinessDetails from "../../../element/BusinessDetails/BusinessDetails";

import { getApiData } from "../../../utils/axios-utility";
import { logInfo, logError } from "../../../utils/log-util";
import { API_ROUTE, API_SUCCESS_CODE } from "../../../const/common";
import { SET_SELECTED_SUB_CATEGORY } from "../../../const/actionTypes";
import { getFromSessionStorage } from "../../../utils/sessionStorage-utility";
import { useLoader } from "../../../hooks/useLoader";
import { Loader } from "../../../element/Loader/Loader";

import {
  useGlobalState,
  useGlobalDispatch,
} from "../../../context/GlobalProvider";

const BusinessList = () => {
  const { selectedSubCategory } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [showBusiness, setShowBusiness] = useState(
    (selectedSubCategory?.id && selectedSubCategory) ||
      getFromSessionStorage(SET_SELECTED_SUB_CATEGORY)
  );
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(false);
  useLoader(setLoading);

  if (!location?.state?.allowed) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_BUSINESS_BY_SUBC_ID,
          queryParams: { subCategoryId: showBusiness?.id },
        });
        logInfo("resp", resp);
        if (resp.status === API_SUCCESS_CODE) {
          setBusinessList(resp.data);
        }
      } catch (error) {
        logInfo("Error calling API:", error);
      }
    };
    if (showBusiness?.id) fetchData();
  }, [showBusiness]);

  const handleBusinessDetails = (business) => {
    navigate(`/business/${business?.businessName}`, {
      state: { allowed: true, businessData: business },
    });
  };
  return (
    <div className="business-list-container hdv-container">
      <div className="hdv-row">
        <div className="hdv-col-12">
          <section className="business-list-header hdv-row hdv-margin-bottom-32">
            <div className="hdv-col-4 download-right">
              <button className="download-app hdv-col-7">
                Download our app <FaDownload />
              </button>
            </div>
          </section>
          {loading && <Loader />}
          <section className="business-list-all-business hdv-row hdv-margin-bottom-32">
            <h1 className="business-name hdv-col-12 hdv-margin-bottom-16">Search results</h1>

            {businessList.length > 0 &&
              businessList.map((business, index) => {
                return (
                  <div className="  hdv-col-12" key={business.id}>
                    <BusinessDetails
                      key={business.id}
                      business={business}
                      handleClick={handleBusinessDetails}
                    />
                  </div>
                );
              })}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BusinessList;
