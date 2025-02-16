import React from "react";
import PropTypes from "prop-types";
import "./ContactAndRatings.scss";

const ContactAndRatings = ({
  name,
  rating,
  totalRatings,
  location,
  distance,
  time,
  isOpen,
  closeTime,
}) => {
  return (
    <div className="contact-ratings">
      <h1 className="business-name hdv-margin-bottom-12">{name}</h1>
      <p className="business-location hdv-margin-bottom-12">
        {location} - {distance} - {time}
      </p>
      <p className={`${isOpen ? "open" : "closed"} business-hours`}>
        {isOpen ? `Open Now: until ${closeTime}` : "Closed"}
      </p>
      {/* <div className="ratings">
        <strong>{rating} ⭐</strong> ({totalRatings} Ratings)
      </div> */}
      <div className="action-buttons">
        <button>📞 Call</button>
        <button>📱 WhatsApp</button>
        <button>🔗 Share</button>
        <button>⭐ Save</button>
      </div>
    </div>
  );
};

ContactAndRatings.propTypes = {
  name: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  totalRatings: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
  distance: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeTime: PropTypes.string.isRequired,
};

export default ContactAndRatings;
