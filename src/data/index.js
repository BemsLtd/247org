import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "./Endpoints";

// Utility to get the full URL
export const getFullUrl = (endpoint) => {
  if (!endpoint) throw new Error("Endpoint is required to get the full URL.");
  return BASE_URL + endpoint;
};

const getDefaultHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY); 
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const makeAPIRequest = axios.create({
  baseURL: BASE_URL,
  headers: getDefaultHeaders(),
});

makeAPIRequest.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.replace("/auth/login");
    }
    return Promise.reject(error.response.data); 
  }
);

export default makeAPIRequest;
