import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ImageCarousel from "../../element/ImageCarousel/ImageCarousel";
import "./Dashboard.scss";

import banner_hotels_2024 from "../../assets/banner_hotels_2024.webp";
import banner_bills_2024 from "../../assets/banner_bills_2024.webp";
import banner_packersmovers_2024 from "../../assets/banner_packersmovers_2024.webp";
import winterweb from "../../assets/winterweb.webp";

// import useCityName from "../../hooks/CityName";
import { Loader } from "../../element/Loader/Loader";
import dasboardMock from "../../mockJson/Dashboard.json";
import AutoComplete from "../../element/AutoComplete/AutoComplete";
import {
  useGlobalDispatch,
  useGlobalState,
} from "../../context/GlobalProvider";
import { useLoader } from "../../hooks/useLoader";
import { useAuth } from "../../context/AuthContext";
import { getApiData } from "../../utils/axios-utility";
import { logInfo, logError } from "../../utils/log-util";
import {
  saveToSessionStorage,
  removeFromSessionStorage,
} from "../../utils/sessionStorage-utility";

import {
  SET_SELECTED_CATEGORY,
  SET_All_CATEGORY,
} from "../../const/actionTypes";
import {
  API_ROUTE,
  API_SUCCESS_CODE,
  API_NETWORK_ERROR,
} from "../../const/common";

import { FaDownload } from "react-icons/fa";

import restaurant from "../../assets/restaurant.svg";
import heart from "../../assets/heart.svg";
import dash1 from "../../assets/dash1.svg";
import dash2 from "../../assets/dash2.svg";
import dash3 from "../../assets/dash3.svg";

const image500Arr = [
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
  banner_hotels_2024,
  banner_bills_2024,
  banner_packersmovers_2024,
  winterweb,
];

const Dashboard = () => {
  const shoMore = { name: "Show more", icon: "⬇️" };
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation();
  const dispatch = useGlobalDispatch();
  const allState = useGlobalState();
  const { login, user } = useAuth();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [dasboardData, setDashboardData] = useState(dasboardMock);
  const [loading, setLoading] = useState(false);
  const [apiError, setApirError] = useState("");
  const [searchSideCategory, setSearchSideCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState(
    allState.allCategoryList || []
  );

  const bodyRef = useRef(document.getElementsByTagName("body")[0]);
  const htmlRef = useRef(document.getElementsByTagName("html")[0]);
  const dialogRef = useRef(null);
  const dialogContentRef = useRef(null);
  useLoader(setLoading);

  // const { city, error, loading } = useCityName();

  useEffect(() => {
    if (isSidePanelOpen) {
      bodyRef?.current?.classList.toggle("has-open-dialog", true);
      htmlRef?.current?.classList.toggle("has-open-dialog", true);
    } else {
      bodyRef?.current?.classList.toggle("has-open-dialog", false);
      htmlRef?.current?.classList.toggle("has-open-dialog", false);
    }
  }, [isSidePanelOpen]);

  useEffect(() => {
    setApirError("");
    const fetchData = async () => {
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_ALL_CAT,
        });
        console.log("respsdfsd", resp);
        if (resp.status === API_SUCCESS_CODE) {
          setCategoryOptions(resp.data);
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
    if (allState?.allCategoryList.length === 0) fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getApiData({
          url: `${API_ROUTE.GET_CUSTOMER_BY_MOBILE}/${user?.mobile}`,
        });
        if (resp.status === API_SUCCESS_CODE) {
         
          login({
            ...user,
            name: resp?.data?.userName,
            profilePhoto: resp?.data?.preSignedUrl,
          });
          setApirError("");
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
      }
    };
    if (user?.mobile && location.state?.edited) fetchData();
  }, [user?.mobile, location.state]);

  const handleShowMoreClick = () => {
    if (dialogRef) dialogRef?.current?.classList.toggle("open", true);
    setTimeout(() => {
      if (dialogContentRef)
        dialogContentRef?.current?.classList.toggle(
          "pannel-content-open",
          true
        );
    }, 500);
    setIsSidePanelOpen(true);
  };

  const handleClosePanel = () => {
    dialogContentRef?.current?.classList.toggle("pannel-content-open", false);
    dialogContentRef?.current?.classList.toggle("pannel-content-close", true);
    dialogContentRef?.current.addEventListener(
      "animationend",
      () => {
        dialogContentRef?.current?.classList.toggle(
          "pannel-content-close",
          false
        );
      },
      { once: true }
    );
    setTimeout(() => {
      dialogRef?.current?.classList.toggle("open", false);
      dialogRef?.current?.classList.toggle("close", true);
      dialogRef?.current.addEventListener(
        "animationend",
        () => {
          dialogRef?.current?.classList.toggle("close", false);
          setIsSidePanelOpen(false);
        },
        { once: true }
      );
    }, 600);
  };

  const handleSearchSideCategory = (sideCategory) => {
    setSearchSideCategory(sideCategory);
  };

  const handleCategorySelect = (category) => {
    bodyRef?.current?.classList.toggle("has-open-dialog", false);
    htmlRef?.current?.classList.toggle("has-open-dialog", false);
    console.log("here", category);
    dispatch({
      type: SET_SELECTED_CATEGORY,
      payload: { selectedCategory: category },
    });
    saveToSessionStorage(SET_SELECTED_CATEGORY, category);
    navigate(`/category/${category.name}`, { state: { allowed: true } });
  };

  return (
    <div className="dashboard hdv-container">
      {loading && <Loader />}
      <div className="hdv-row">
        <div className="hdv-col-12">
          {/* Header Section */}

          <section className="dashboard__header hdv-row hdv-margin-bottom-32">
            <div className="hdv-col-4 download-right">
              <button className="download-app hdv-col-7">
                Download our app <FaDownload />
              </button>
            </div>
          </section>

          {/* Banner Section */}
          <section className="dashboard__banner hdv-row hdv-margin-bottom-36">
            <div className="dashboard__banner-image hdv-col-6">
              <ImageCarousel images={image500Arr} dots={false} />
            </div>
            {[dash1, dash2, dash3].map((img, i) => {
              return (
                <div className="dashboard__banner-image hdv-col-2" key={i}>
                  <img src={img} alt="Banner 2" className="banner-image" />
                </div>
              );
            })}
          </section>

          {/* Categories Section */}
          <section className="dashboard__categories  hdv-margin-bottom-32">
            {!apiError ? (
              <>
                {[...categoryOptions.slice(0, 15)].map(
                  (
                    category,
                    index //showing limited category on Dashboad
                  ) => (
                    <div
                      className="category-item hdv-col-1"
                      key={index}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {/* <div className="icon">{icon}</div> */}
                      <img
                        className="icon"
                        src={category?.categoryIcon}
                        // {index % 2 === 0 ? restaurant : heart}
                      />
                      <p>{category?.name}</p>
                    </div>
                  )
                )}
                {categoryOptions.length > 0 && (
                  <div
                    className="category-item hdv-col-1"
                    onClick={handleShowMoreClick}
                  >
                    <div className="icon">{shoMore.icon}</div>
                    <p>{shoMore.name}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="error-cate-load">
                <span> {apiError} </span>
              </div>
            )}
          </section>

          {/* Coming Soon Section */}
          <section className="dashboard__coming-soon hdv-row">
            {dasboardData.commingSoonSections.map((soon, id) => (
              <div
                className="coming-soon-card-scetion hdv-col-6 hdv-margin-bottom-24"
                key={soon.title + id}
              >
                <h3 className="coming-soon-title hdv-margin-bottom-16">
                  {soon.title}
                </h3>
                <div className="coming-soon-card">
                  <div className="coming-soon-card-text">
                    <h3>{soon.type}</h3>
                    <p>{soon.text}</p>
                  </div>
                  <img
                    src="https://via.placeholder.com/150x100" //{soon.image}
                    alt="Illustration"
                    className="coming-soon-image"
                  />
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* Side Panel */}
      {/* {isSidePanelOpen && ( */}
      <section>
        <div className="side-panel-wrapper" ref={dialogRef}>
          <div className={`side-panel`} ref={dialogContentRef}>
            <div className="side-panel-header hdv-row">
              <div className="side-panel-header-left hdv-col-5">
                <button className="close-panel" onClick={handleClosePanel}>
                  ×
                </button>
                <h3>Search Categories</h3>
              </div>
              <div className="side-panel-header-right hdv-col-6">
                <AutoComplete
                  suggestions={categoryOptions}
                  val={searchSideCategory}
                  handleSearch={handleSearchSideCategory}
                />
              </div>
            </div>
            <div className="side-panel-content hdv-row">
              {categoryOptions?.map(
                (category, index) =>
                  category.name
                    .toLowerCase()
                    .includes(searchSideCategory?.toLowerCase()) && (
                    <div
                      className="category-item hdv-col-2"
                      key={index}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {/* <div className="icon">{icon}</div> */}
                      <img
                        className="icon"
                        src={category?.categoryIcon}
                        // {index % 2 === 0 ? restaurant : heart}
                      />
                      <p>{category.name}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </section>
      {/* )} */}
    </div>
  );
};

export default Dashboard;
