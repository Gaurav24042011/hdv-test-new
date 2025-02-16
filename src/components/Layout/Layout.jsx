import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../element/Header";
import Footer from "../../element/Footer/Footer";
// import { SET_USER_LOCATION } from "../../const/actionTypes";
// import { Loader } from "../../element/Loader/Loader";
import {
  useGlobalState,
  useGlobalDispatch,
} from "../../context/GlobalProvider";
// import useCityName from "../../hooks/CityName";

function Layout() {
  const allState = useGlobalState();
  const dispatch = useGlobalDispatch();
  // const { city, loading } = useCityName();
  // useEffect(() => {
  //   if (!allState?.userCurrentLocation?.currentCity) { 
  //     dispatch({ type: SET_USER_LOCATION, payload: { currentCity:city, loading:loading } });
  //   }
  // }, [allState?.userCurrentLocation?.currentCity,city, loading, dispatch]);

  return (
    <>
     {/* {loading && <Loader />} */}
      <Header  />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
