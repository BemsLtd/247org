import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import AuthLayout from "./AuthLayout";
import Logo from "/logo.png";
import InputCom from "../../Components/InputCom";
import { Lock } from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [message, setMessage] = useState({ type: "", message: null });
  const navigate = useNavigate();
  const location = useLocation();


  const { user_id } = location.state || {};

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Please enter a new password")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setMessage({ type: "", message: null });
      const url =
        "https://orgserviceapi.247securityandforensic.com/api/user/reset-password";
      try {
        const response = await axios.post(
          url,
          {
            password: values.password,
          },
          {
            headers: {
              Authorization: `Bearer ${user_id}`, 
            },
          }
        );

        const { success, message } = response.data;

        if (success) {
          setMessage({ type: "success", message });
          navigate("/auth/login", { replace: true });
        } else {
          setMessage({ type: "error", message });
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        setMessage({
          type: "error",
          message: error.message || "An error occurred",
        });
      }
    },
  });

  return (
    <AuthLayout>
      <Card
        sx={{  minWidth: 300,  padding: 2,  position: "relative",  overflow: "hidden",}}>
        {message && (
          <Alert variant="filled" severity={message.type}>
            {message.message}
          </Alert>
        )}
        <CardContent>
          <Box sx={{ display: "flex",  flexDirection: "column",  alignItems: "center",  mb: 2,}}>
            <img
              src={Logo}
              srcSet={Logo}
              alt="Logo"
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 2,
              }}
              loading="lazy"
            />
            <Typography  sx={{ fontSize: 24, marginBottom: 1 }}  variant="h5"  color="text.primary"  align="center" >
              Reset Password
            </Typography>
            <Typography sx={{ fontSize: 14, marginBottom: 2 }} align="center" color="text.secondary">
              Please enter your new password and confirm it
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {/* Password field */}
            <Grid item xs={12}>
              <InputCom
                id="password"
                label="New Password"
                type="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && formik.errors.password
                    ? true
                    : false
                }
                helperText={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : null
                }
                endAdornmentIcon={<Lock />}
              />
            </Grid>

            {/* Confirm Password field */}
            <Grid item xs={12}>
              <InputCom
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formik.values.confirmPassword}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? true
                    : false
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? formik.errors.confirmPassword
                    : null
                }
                endAdornmentIcon={<Lock />}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{  display: "flex",  justifyContent: "space-between", width: "95%",  mb: 2}}>
            <Link to="/auth/login" variant="body2" sx={{ marginLeft: 10 }}>
              {"Login"}
            </Link>
            <Link to="/auth/forgot-password" variant="body2">
              {"Forgot Password?"}
            </Link>
          </Box>
          <Button variant="contained" onClick={formik.handleSubmit}>
            Reset Password
          </Button>
        </CardActions>
      </Card>
    </AuthLayout>
  );
}
