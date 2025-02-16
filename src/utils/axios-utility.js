import axios from 'axios';
import { EVENTS } from '../const/common';
import {logInfo} from '../utils/log-util'

// Token and expiry constants
const TOKEN_KEY = 'hdv_authToken';
const EXPIRY_KEY = 'hdv_authTokenExpiry';
const API_URL = 'https://hindaviadshub.com';
// const API_URL = 'http://ec2-13-203-88-141.ap-south-1.compute.amazonaws.com:8080';

// Helper functions for token management
const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);

  if (!token || !expiry || new Date().getTime() > parseInt(expiry, 10)) {
    return null; // Token is missing or expired
  }

  return token;
};

const setToken = (token, expiresIn) => {
  const expiryTime = new Date().getTime() + expiresIn * 1000; // Convert seconds to milliseconds
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
};

const fetchNewToken = async () => {

  try {
    const response = await axios.get(`${API_URL}/login/GetToken/`, {
      params: {
        key: import.meta.env.VITE_API_KEY,
        Issuer: `https://hidaviadshub.com`,
        Audience: `https://hidaviadshub.com`
      }
    });

    const { data } = response.data;
    if (data) {
      setToken(data, 1800); // Set token and expiry time
      return data;
    }

    throw new Error('Invalid token response');
  } catch (error) {
    console.error('Failed to fetch new token:', error);
    throw error;
  }
};

// Create Axios instance
const axiosClient = axios.create();
axiosClient.defaults.timeout = 15000000;

// Function to dispatch EVENTS for showing/hiding the loader
const setLoader = (isLoading) => {
  const event = new CustomEvent(EVENTS.SET_LOADER, { detail: isLoading });
  window.dispatchEvent(event); // Dispatch an event to inform components about the loading state
};

// Request interceptor to handle loader and token
axiosClient.interceptors.request.use(
  async (config) => {
    setLoader(true);

    // Add Authorization header with the token
    let token = getToken();
    if (!token) {
      logInfo('Fetching a new token...');
      token = await fetchNewToken(); // Fetch a new token if not present
    }

    config.headers['Authorization'] = `Bearer ${token}`; // Attach token to the header
    return config;
  },
  (error) => {
    setLoader(false);
    return Promise.reject(error);
  }
);

// Response interceptor to stop the loader
axiosClient.interceptors.response.use(
  (response) => {
    setLoader(false);
    return response;
  },
  (error) => {
    setLoader(false);
    return Promise.resolve({
      data:  error?.response?.data,
      status: error?.response?.status || 500,
    });
  }
);

// Separate GET API call function
export const getApiData = async ({ url, headers = {}, queryParams = {} }) => {
  try {
    const response = await axiosClient.get(`${API_URL}/${url}`, {
      headers: { ...headers },
      params: queryParams, // Use params for query parameters
    });
    logInfo('in get utility', response)
    return { data: response?.data?.data,message:response?.data?.message, status: response?.status} // Return the API response data
  } catch (error) {
    console.error('GET API call failed:', error);
    throw error; // Optionally rethrow the error for the caller to handle
  }
};

// Separate POST API call function
export const postApiData = async ({ url, headers = {}, body = {} }) => {
  try {
    const response = await axiosClient.post(`${API_URL}/${url}`, body, {
      headers: { ...headers },
    });
    logInfo('in post utility', response)
    return{ data: response?.data?.data,message:response?.data?.message, status: response?.status}; // Return the API response data
  } catch (error) {
    console.error('POST API call failed:', error);
    throw error; // Optionally rethrow the error for the caller to handle
  }
};
