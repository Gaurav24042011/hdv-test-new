import React, { useState, useRef, useEffect } from "react";
import header_logo from "../../assets/header_logo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./Header.scss"; // Make sure to create your own styles
import notification from "../../assets/notification.svg";

import { useAuth } from "../../context/AuthContext";
import { useGlobalState } from "../../context/GlobalProvider";

import AutoComplete from "../AutoComplete/AutoComplete";
import PlacesAutocomplete from "../../components/Places/Places";

const roleAction = {
  admin: [{ actionName: "Master", redirectTo: "/master" }],
};

const commonAction = [
  { actionName: "Edit Profile", key: "ep" },
  { actionName: "Change Password", key: "chPwd" },
  { actionName: "Get Subcriptions", key: "gs" },
  { actionName: "Help", key: "hl" },
  { actionName: "Add Business", key: "ab" },
  { actionName: "Download Festive Banner", key: "dfb" },
  { actionName: "Advertise & Grow your Business", key: "agyb" },
  { actionName: "Favourite Business", key: "fb" },
];


const Header = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const bodyRef = useRef(document.getElementsByTagName("body")[0]);
  const dialogRef = useRef(null);
  const dialogContentRef = useRef(null);
  const headerSearchRef = useRef(null);
  // const { city:currentCity,loading } = useCityName();

  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation();

  const { user, logout } = useAuth();
  const allState = useGlobalState();

  const path = [
    "/master",
    "/list-business",
    "/add-business",
    "/change-password",
    "/update-business",
    "/edit-profile",
  ];

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 0 && headerSearchRef?.current) {
      headerSearchRef?.current?.classList.toggle("toggle-search", true);
    } else {
      headerSearchRef?.current?.classList.toggle("toggle-search", false);
    }
  };

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isSidePanelOpen)
      bodyRef?.current?.classList.toggle("has-open-dialog", true);
    else bodyRef?.current?.classList.toggle("has-open-dialog", false);
  }, [isSidePanelOpen]);

  useEffect(() => {
    setGlobalSearch("")
  },  [allState?.locationDetails?.name]);

  const handleOpenDialog = () => {
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
    }, 100);
  };

  const handleLogout = () => {
    handleClosePanel();
    logout();
    navigate("/", { replace: true });
    window.location.reload();
  };

  const handleRoleClick = (redirect) => {
    handleClosePanel();
    navigate(redirect);
  };

  const handleLoginSignupCTA = () => {
    navigate("/signup");
    window.location.reload();
  };
  const handleAddBusiness = () => {
    navigate("/list-business");
    // window.location.reload();
  };

  const handleGlobalSearch = (search) => {

    setGlobalSearch(search);
  };

  const handleCommonAction = (e, name) => {
    handleClosePanel();
    if (name === "chPwd") {
      navigate("/change-password");
    }
    if(name==='ep'){
      navigate("/edit-profile",{ state: { allowed: true } });
    }
  };

  return (
    <>
      <header className="header hdv-container">
        <div className="header-wrapper">
          <div className="container hdv-row">
            <div className="logo" onClick={() => navigate("/")}>
              <img src={header_logo} alt="Logo" style={{ height: "40px" }} />
            </div>

            <nav className="nav">
              <span className="add-business" onClick={handleAddBusiness}>
                Free Business
              </span>

              <span className="icon-link">
                <img src={notification} />
              </span>

              {user?.mobile ? (
                user?.profilePhoto ? (
                  <img
                    src={user?.profilePhoto}
                    alt={user?.name}
                    className="profile-photo"
                    onClick={handleOpenDialog}
                  />
                ) : (
                  <div
                    className="user-profile-icon"
                    onClick={handleOpenDialog}
                  />
                )
              ) : (
                <Button
                  className="login-btn"
                  variant="primary"
                  onClick={handleLoginSignupCTA}
                >
                  Login/Sign up
                </Button>
              )}
            </nav>
          </div>
          {!path.includes(location?.pathname) && (
            <div className="header-search hdv-row" ref={headerSearchRef}>
              <div className="search-fields hdv-col-12">
                <div className="hdv-row" style={{ flex: 1 }}>
                  <div className="location hdv-col-3">
                    <PlacesAutocomplete/>
                  </div>
                  <div className="search-bar category-search hdv-col-4">
                    <AutoComplete
                      suggestions={allState?.globalSearchItems}
                      val={globalSearch}
                      handleSearch={handleGlobalSearch}
                      isGlobalSearch={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <aside>
        <div className="side-panel-wrapper" ref={dialogRef}>
          <div className={`side-panel`} ref={dialogContentRef}>
            <div className="side-panel-header">
              <div className="side-panel-header-close">
                <button className="close-panel" onClick={handleClosePanel}>
                  ×
                </button>
              </div>
              <div className="side-panel-header-profile hdv-col-12">
                <p>Hi {user?.name}!</p>
                {user?.profilePhoto ? (
                  <img
                    src={user?.profilePhoto}
                    alt={user?.name}
                    className="profile-photo drawer"
                  />
                ) : (
                  <div className="user-profile-icon" />
                )}
              </div>
            </div>
            <div className="side-panel-content">
              {user?.role &&
                roleAction[user?.role.toLowerCase()]?.map((action, index) => (
                  <div
                    className="menu-item hdv-col-12"
                    key={index}
                    onClick={() => handleRoleClick(action.redirectTo)}
                  >
                    {action.actionName}
                  </div>
                ))}

              {commonAction?.map((action, index) => (
                <div
                  className="menu-item hdv-col-12"
                  key={index}
                  onClick={(e) => handleCommonAction(e, action?.key)}
                >
                  {action.actionName}
                </div>
              ))}
              <div className="menu-item hdv-col-12" onClick={handleLogout}>
                Logout
              </div>
            </div>
          </div>
        </div>
      </aside>
      {/* )} */}
    </>
  );
};

export default Header;
