import React from "react";
import './Loader.scss'
import loaderimg from '../../assets/loaderimg.svg'

export const Loader = () => {
  return (
    <div id="fullscreen-loader" className="loader-wrapper">
      <img src={loaderimg} alt="Hindavi Ads Hub Logo" className="loader" />
    </div>
  );
};
