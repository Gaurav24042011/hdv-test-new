import React from "react";
import AutoComplete from "../../element/AutoComplete/AutoComplete";
import { FaSearch, FaDownload } from "react-icons/fa";

const SearchAndDownload = ({ Sidecategories, city,val, handleSearch }) => {
  return (
    <section className="dashboard__header hdv-row hdv-margin-bottom-32">
      <div className="search-fields hdv-col-8">
        <div className="hdv-row" style={{ flex: 1 }}>
          <div className="search-bar location hdv-col-4">
            <input type="text" placeholder="Location" value={city} readOnly />
          </div>
          <div className="search-bar category-search hdv-col-6">
            <AutoComplete suggestions={Sidecategories} val={val} handleSearch={handleSearch}/>
          </div>
        </div>
      </div>
      <div className="hdv-col-4 download-right">
        <button className="download-app hdv-col-7">
          Download our app <FaDownload />
        </button>
      </div>
    </section>
  );
};

export default SearchAndDownload;
