import React, { useEffect, useState } from "react";
import "./Role.scss";
import { Input } from "../../element/Input/Input";
import { API_ROUTE, API_SUCCESS_CODE } from "../../const/common";
import { getApiData } from "../../utils/axios-utility";
import {logError } from "../../utils/log-util";

import { useLoader } from "../../hooks/useLoader";
import { Loader } from "../../element/Loader/Loader";

import { SET_All_CATEGORY } from "../../const/actionTypes";

import {
  useGlobalState,
  useGlobalDispatch,
} from "../../context/GlobalProvider";

const MasterPage = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useGlobalDispatch();
  const allState = useGlobalState();

  const [category, setCategory] = useState({ id: "", name: "" });
  const [subcategory, setSubcategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState(
    allState.allCategoryList
  );

  useLoader(setLoading);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Category:", category);
    console.log("Entered Subcategory:", subcategory);
  };

  const handleChange = (e) => {
    const selectedCategory = categoryOptions.find(
      (option) => option.id === parseInt(e.target.value)
    );
    setCategory(selectedCategory || { id: "", name: "" }); // Update category state
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getApiData({
          url: API_ROUTE.GET_ALL_CAT,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setCategoryOptions(resp.data);
          dispatch({
            type: SET_All_CATEGORY,
            payload: { allCategories: resp.data },
          });
        }
      } catch (error) {
        logError("Error calling API:", error);
      }
    };
    if (allState?.allCategoryList.length === 0) fetchData();
  }, []);

  return (
    <div className="master-page hdv-container">
      {loading && <Loader />}
      <div className="container hdv-row">
        <div className="hdv-col-12">
          <form onSubmit={handleSubmit}>
            <div className="category-details hdv-margin-bottom-40">
              {/* Category Dropdown */}
              <div className="form-group hdv-col-6 hdv-margin-bottom-16">
                <label htmlFor="category" className="hdv-margin-bottom-4">
                  Category
                </label>
                <div className="custom-dropdown">
                  <select
                    id="category"
                    name="category"
                    className="dropdown-select"
                    value={category.id}
                    onChange={handleChange} // Update selected category
                  >
                    <option value="">Select Category</option>
                    {categoryOptions?.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subcategory Input */}
              <div className="form-group hdv-col-6 hdv-margin-bottom-16">
                <Input
                  lableText={"Sub Category"}
                  type="text"
                  id="subcategory"
                  name="subcategory"
                  customClass={"form-control custom-input"}
                  placeholderText="Enter Sub category"
                  value={subcategory}
                  handleInputChange={(e) => setSubcategory(e.target.value)}
                />
              </div>
              <div className="form-group hdv-col-6">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MasterPage;
