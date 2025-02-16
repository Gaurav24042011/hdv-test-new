import React, { useState, useRef, useEffect } from "react";
import "./Places.scss";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { postApiData } from "../../utils/axios-utility";
import {
  useGlobalDispatch,
  useGlobalState,
} from "../../context/GlobalProvider";

import {
  API_ROUTE,
  API_SUCCESS_CODE,
  API_NETWORK_ERROR,
} from "../../const/common";

import {
  SET_LOCATION_DETAILS,
  SET_GLOBAL_SEARCH_ITEMS,
} from "../../const/actionTypes";

import { Loader } from "../../element/Loader/Loader";

const libraries = ["places"]; // Load Places API
const DEFAULT_LOCATION = { lat: 18.5204, lng: 73.8567 }; // Pune, India

const PlacesAutocomplete = () => {
  const allState = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBAp7mGWR_ZY-fn2ezZpzLZAQns9cufADU",
    libraries,
  });

  const [place, setPlace] = useState({});
  const [inputValue, setInputValue] = useState("");
  const autocompleteRef = useRef(null);
  const dropDownRef = useRef(null);
  const ipRef = useRef(null);
  const [apiError, setApirError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place) {
      setPlace(place);
      setInputValue(place?.name);
    }
  };

  useEffect(() => {
    if (!isLoaded) return; // ✅ Wait for Google Maps API to load
    getCurrentLocation();
  }, [isLoaded]);

  const getCurrentLocation = (useDefault = false) => {
    setLoading(true);

    const geocoder = new window.google.maps.Geocoder();
    useDefault
      ? updateLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, geocoder)
      : navigator.geolocation
        ? navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              updateLocation(latitude, longitude, geocoder);
            },
            (error) => {
              console.error("Error getting location:", error);
              updateLocation(
                DEFAULT_LOCATION.lat,
                DEFAULT_LOCATION.lng,
                geocoder
              ); // Use Pune if denied
            }
          )
        : updateLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, geocoder);
  };

  const updateLocation = (lat, lng, geocoder) => {
    const latLng = { lat, lng };

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        setInputValue(address);
        const newPlace = {
          name: address,
          geometry: { location: { lat: () => lat, lng: () => lng } },
        };
        setPlace(newPlace);

        dispatch({
          type: SET_LOCATION_DETAILS,
          payload: { locationDetails: newPlace },
        });
      } else {
        console.error("Geocoder failed:", status);
      }
      setLoading(false);
      setShowDropdown(false);
    });
  };

  useEffect(() => {
    if (inputValue.length > 0) setShowDropdown(false);
    // else setShowDropdown(true);
  }, [inputValue]);

  useEffect(() => {
    dispatch({
      type: SET_LOCATION_DETAILS,
      payload: { locationDetails: place },
    });
  }, [place?.name]);

  useEffect(() => {
    const fetchGlobalData = async () => {
      const body = {
        latitude: allState?.locationDetails?.geometry?.location?.lat(),
        longitude: allState?.locationDetails?.geometry?.location?.lng(),
        keyword: "",
      };

      try {
        const resp = await postApiData({
          url: API_ROUTE.GLOBAL_SEARCH,
          body,
        });
        if (resp.status === API_SUCCESS_CODE) {
          setApirError("");
          dispatch({
            type: SET_GLOBAL_SEARCH_ITEMS,
            payload: { globalSearchItems: resp.data },
          });
        } else {
          setApirError(resp?.message || "");
        }
      } catch (error) {
        setApirError(API_NETWORK_ERROR);
      }
    };

    if (allState?.locationDetails?.name) {
      fetchGlobalData();
    }
  }, [allState?.locationDetails?.name]);

  const handleInputChage = (e) => {
    // if (e?.target?.value) {
    setInputValue(e.target.value);
    if (e?.target?.value) setShowDropdown(false);
    else setShowDropdown(true);
    // }
    // else s
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setShowDropdown(false); // ✅ Hide dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //AIzaSyBAp7mGWR_ZY-fn2ezZpzLZAQns9cufADU"
  return (
    <>
      {/* {loading && <Loader />} */}

      {isLoaded && (
        <div ref={dropDownRef} className="autocomplete-container">
          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={handlePlaceSelect}
            options={{
              componentRestrictions: { country: "IN" },
            }}
          >
            <input
              type="text"
              placeholder="Search places..."
              value={inputValue}
              onChange={handleInputChage}
              onFocus={() => inputValue.length == 0 && setShowDropdown(true)}
              // onBlur={() => setShowDropdown(false)}
              ref={ipRef}
            />
          </Autocomplete>
          {showDropdown && (
            <div className="ask-current-location">
              <button
                className="ask-current-location-btn"
                onClick={getCurrentLocation}
              >
                📍 Use Current Location
              </button>
            </div>
          )}
        </div>
      )}
      {/* </LoadScript> */}
    </>
  );
};

export default PlacesAutocomplete;
