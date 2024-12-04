//import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateUserDetails } from "../store/userinfo";
import { Box, CircularProgress, styled } from "@mui/material";
import { ENDPOINTS } from "../data/Endpoints";
import axios from "axios";

const Routeauth = () => {
  const [loading, setLoading] = useState(true);
  const role = useSelector((state) => state.userDetails.user?.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const DisabledBackground = styled(Box)({
    width: "100%",
    height: "100%",
    position: "fixed",
    background: "#ccc",
    opacity: 0.5,
    zIndex: 1,
  });

  const CircularLoading = () => (
    <>
      <CircularProgress
        size={70}
        sx={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      />
      <DisabledBackground />
    </>
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("247_token");

      try {
        const response = await axios.get(
          `https://stagingapi.247securityandforensic.com/api/${ENDPOINTS.profile}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              "If-Modified-Since": "0",
            },
          }
        );
        const { data } = response.data;
        dispatch(updateUserDetails({ user: data }));
      } catch (error) {
        console.error("Error fetching user profile:", error);

        navigate("/auth/login", {
          state: { messager: error.response.data.message },
        });
      } finally {
        setLoading(false);
      }
    };

    if (!role) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [role, dispatch, navigate]);

  if (loading) {
    return <CircularLoading />;
  }
  return (
    <>
        <Outlet />
    </>
  );
};

export default Routeauth;
