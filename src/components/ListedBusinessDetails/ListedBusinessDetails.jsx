import React from "react";
import { useLocation } from "react-router-dom";
import ContactAndRatings from "../../element/BusinessContactAndRating/ContactAndRatings"; // Import the reusable component
import "./ListedBusinessDetails.scss"; // Add styling as required
import { FaDownload } from "react-icons/fa";

const mockData = {
  name: "Ashoka Restaurant",
  rating: 4.7,
  totalRatings: 215,
  location: "Vishal Nagar, Pimple Nilakh",
  distance: "1.6 km",
  time: "15 Mins",
  isOpen: true,
  closeTime: "1:00 am",
  contact: "+91 768 789 8900",
  address:
    "Shop No. 5 and 6 Near Mayur Colony, Datta Mandir Road, Wakad, Pune - 411057 (Near Ribbons and Balloons)",
  averageCost: "800 per person",
  year: 2016,
  menuImages: ["/menu1.jpg", "/menu2.jpg", "/menu3.jpg"],
  photos: ["/photo1.jpg", "/photo2.jpg", "/photo3.jpg"],
  reviews: {
    rating: 4.3,
    total: 120,
  },
};

function ListedBusinessDetails() {
  const location = useLocation();
  const businessData = location.state?.businessData;
  return (
    <div className="listed-business-container hdv-container">
      <div className="hdv-row">
        <div className="hdv-col-12">
          {/* Header */}
          <section className="listed-busines-header hdv-row hdv-margin-bottom-32">
            <div className="hdv-col-4 download-right">
              <button className="download-app hdv-col-7">
                Download our app <FaDownload />
              </button>
            </div>
          </section>

          <section className="listed-busines-banner hdv-row hdv-margin-bottom-32">
            <div className="image-gallery hdv-col-12">
              {mockData.menuImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Menu ${index + 1}`}
                  className=""
                />
              ))}
            </div>
          </section>

          <section className="listed-business-contact hdv-margin-bottom-28">
            <div className="hdv-col-12">
              <ContactAndRatings
                name={mockData.name}
                rating={mockData.rating}
                totalRatings={mockData.totalRatings}
                location={mockData.location}
                distance={mockData.distance}
                time={mockData.time}
                isOpen={mockData.isOpen}
                closeTime={mockData.closeTime}
              />
            </div>
          </section>

          {/* Tabs */}

          {/* Content */}
          <section className="content">
            <div className="tabs">
              <button>Overview</button>
              <button>Menu</button>
              <button>Services</button>
              <button>Review</button>
            </div>
            <div className="menu-quick-info">
              <div className="menu hdv-col-6">
                <p className="hdv-margin-bottom-20">Menu</p>
                <div className="menu-images">
                  {mockData.menuImages.map((image, index) => (
                    <img key={index} src={image} alt={`Menu ${index + 1}`} />
                  ))}
                </div>
              </div>

              <div className="quick-info menu hdv-col-6">
                <p className="quick-info-title hdv-margin-bottom-20">
                  Quick Information
                </p>
                <div className="quick-info-details">
                  <p className="hdv-margin-bottom-20">
                    <span className="sub-heading"> Contacts </span>
                    <span className="sub-heading-val">{mockData.contact} </span>
                  </p>
                  <p className="hdv-margin-bottom-20">
                    <span className="sub-heading">Address </span>
                    <span className="sub-heading-val"> {mockData.address}</span>
                  </p>
                  <div className="hdv-row">
                    <p className="hdv-margin-bottom-20 hdv-col-4">
                      <span className="sub-heading">Business Hours</span>
                      <span className="sub-heading-val">
                        {mockData.isOpen ? "Open now" : "Closed"}
                      </span>
                    </p>
                    <p className="hdv-margin-bottom-20 hdv-col-4">
                      <span className="sub-heading">Average Cost</span>
                      <span className="sub-heading-val">
                        {mockData.averageCost}
                      </span>
                    </p>
                    <p className="hdv-margin-bottom-20 hdv-col-4">
                      <span className="sub-heading">Year of Establishment</span>
                      <span className="sub-heading-val"> {mockData.year}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hr-seprator" />
            <div className="photo-container">
              <div className="available-photos hdv-col-6">
                <h2>Photos</h2>
                <div className="photo-gallery">
                  {mockData.photos.map((photo, index) => (
                    <img key={index} src={photo} alt={`Photo ${index + 1}`} />
                  ))}
                </div>
              </div>
              <div className="upload hdv-col-6">
                <h3>Upload Photos</h3>
                <div className="upload-box">
                  <p>Drag and Drop file here or Browse to upload</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ListedBusinessDetails;
