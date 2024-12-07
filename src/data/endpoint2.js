import axios from "axios";
import { BASE_URL2, TOKEN_KEY2 } from "./Endpoints";

// Utility to get the full URL
export const getFullUrl = (endpoint) => {
  if (!endpoint) throw new Error("Endpoint is required to get the full URL.");
  return BASE_URL2 + endpoint;
};

const getDefaultHeaders = () => {
  const second_token = localStorage.getItem(TOKEN_KEY2); 
  return {
    Authorization: `Bearer ${second_token}`,
    "Content-Type": "application/json",
  };
};

const makeAPIRequest2 = axios.create({
  baseURL: BASE_URL2,
  headers: getDefaultHeaders(),
});

makeAPIRequest2.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY2);
      window.location.replace("/auth/login");
    }
    return Promise.reject(error.response.data); 
  }
);

export default makeAPIRequest2;
