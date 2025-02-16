import { useState, useEffect } from "react";
import axios from "axios";

const useCityName = () => {
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCityName = async () => {
      setLoading(true);
      try {
        // Step 1: Get Public IP
        const ipResponse = await axios.get("https://api.ipify.org?format=json");
        const ip = ipResponse.data.ip;

        // Step 2: Fetch Geolocation Details
        const geoResponse = await axios.get(`https://ipwhois.app/json/${ip}`);
        const cityName = geoResponse.data.city;
        setCity(cityName);
      } catch (err) {
        setError("Failed to fetch city name. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCityName();
  }, []);

  return { city, error, loading };
};

export default useCityName;
