import { Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import AuthLayout from "./AuthLayout";
import Logo from "/logo.png";
import InputCom from "../../Components/InputCom";
import {Visibility, VisibilityOff } from "@mui/icons-material";
import SelectCom from "../../Components/SelectCom";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
 import * as Yup from "yup";
import {  TOKEN_KEY } from "../../data/Endpoints";
import axios from "axios";


export default function Register() {
  const navigate = useNavigate();
  

    const [showPassword, setShowPassword] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", message: null });

    const handleClickShowPassword = () => setShowPassword((show) => !show);
     const handleMouseDownPassword = (event) => {
       event.preventDefault();
     };

     const validationSchema = Yup.object({
       first_name: Yup.string()
         .max(15, "Must be 15 characters or less")
         .required("Required"),
       middle_name: Yup.string(),
       last_name: Yup.string()
         .max(20, "Must be 20 characters or less")
         .required("Required"),
       email: Yup.string().email("Invalid email address").required("Required"),
       phone: Yup.string().required("Required"),
       password: Yup.string()
         .min(8, "Password must be at least 8 characters")
         .required("Required"),
       role: Yup.string()
         .oneOf(["CEO", "admin", "user","landlord"], "Invalid Role")
         .required("Required"),
     });

     const formik = useFormik({
       initialValues: {
         first_name: "",
         middle_name: "",
         last_name: "",
         email: "",
         phone: "",
         password: "",
         role: "",
       },
       validationSchema,
       onSubmit: async (values) => {
         setLoading(true);
         setProgress(0);
         const interval = setInterval(() => {
           setProgress((prev) => {
             if (prev >= 100) {
               clearInterval(interval);
               return 100;
             }
             return prev + 10;
           });
         }, 200);
         const url =
           "https://stagingapi.247securityandforensic.com/api/user/register";
         try {
           await axios.post(url, values).then((response) => {
             // Access response data
             const { success, message, token } = response.data;

             if (success) {

               setMessage({ type: "success", message:message });

               localStorage.setItem(TOKEN_KEY, token);

               navigate("/auth/verify-otp", {
                 replace: true,
                 state: { user_id: token }, 
               });
             } else {
               setMessage({ type: "error", message : message});
             }
           });
         } catch (error) {
           console.error("Error submitting form:", error);
           setMessage({ type: "error", message: error.response.data.message });
         } finally {
           setLoading(false);
           setProgress(100);
         }
       },
     });
  return (
    <AuthLayout>
      <Card
        sx={{
          minWidth: 300,
          maxWidth: 700,
          padding: 2,
        }}
      >
        {message && (
          <Alert variant="filled" severity={message.type}>
            {message.message}
          </Alert>
        )}
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <img
              src={Logo}
              srcSet={Logo}
              alt="Logo"
              style={{
                width: 70, // Adjust size as needed
                height: 70, // Adjust size as needed
                borderRadius: "50%", // Make the logo rounded
                objectFit: "cover", // Ensure the logo covers the circle
                marginBottom: 2,
              }}
              loading="lazy"
            />
            <Typography
              sx={{ fontSize: 24, marginBottom: 1 }}
              variant="h5"
              color="text.primary"
              align="center"
            >
              Sign Up
            </Typography>
            <Typography
              sx={{ fontSize: 14, marginBottom: 2 }}
              align="center"
              color="text.secondary"
            >
              Please provide accurate information.
            </Typography>
          </Box>
          <Grid container spacing={2} columns={{ xs: 1, md: 12 }}>
            <Grid item xs={1} md={6}>
              <SelectCom
                id="role"
                name="role"
                value={formik.values.role}
                label="Sign up as"
                options={[
                  { value: "CEO", text: "Business Owner" },
                  { value: "admin", text: "Admin" },
                  { value: "landlord", text: "Landlord" },
                  { value: "user", text: "User" },
                  { value: "medical", text: "Medical" },
                ]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid item xs={1} md={6}>
              <InputCom
                id="email"
                label="Email Address*"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                type="email"
                onChange={formik.handleChange}
                error={
                  formik.touched.email && formik.errors.email ? true : false
                }
                helperText={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : null
                }
              />
            </Grid>
            <Grid item xs={1} md={6}>
              <InputCom
                id="first_name"
                label="First Name"
                type="text"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.first_name && formik.errors.first_name
                    ? true
                    : false
                }
                helperText={
                  formik.touched.first_name && formik.errors.first_name
                    ? formik.errors.first_name
                    : null
                }
              />
            </Grid>
            <Grid item xs={1} md={6}>
              <InputCom
                id="middle_name"
                label="Middle Name"
                type="text"
                value={formik.values.middle_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.middle_name && formik.errors.middle_name
                    ? true
                    : false
                }
                helperText={
                  formik.touched.middle_name && formik.errors.middle_name
                    ? formik.errors.middle_name
                    : null
                }
              />
            </Grid>
            <Grid item xs={1} md={6}>
              <InputCom
                id="last_name"
                label="Last Name"
                type="text"
                onBlur={formik.handleBlur}
                value={formik.values.last_name}
                onChange={formik.handleChange}
                error={
                  formik.touched.last_name && formik.errors.last_name
                    ? true
                    : false
                }
                helperText={
                  formik.touched.last_name && formik.errors.last_name
                    ? formik.errors.last_name
                    : null
                }
              />
            </Grid>
            <Grid item xs={1} md={6}>
              <InputCom
                id="phone"
                label="Phone Number"
                type="text"
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={
                  formik.touched.phone && formik.errors.phone
                    ? true
                    : false
                }
                helperText={
                  formik.touched.phone && formik.errors.phone
                    ? formik.errors.phone
                    : null
                }
              />
            </Grid>
            <Grid item xs={1} md={6}>
              <InputCom
                id="password"
                label="Password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type={showPassword ? "text" : "password"}
                endAdornmentIcon={
                  showPassword ? <VisibilityOff /> : <Visibility />
                }
                handleClickShowPassword={handleClickShowPassword}
                handleMouseDownPassword={handleMouseDownPassword}
                value={formik.values.password}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "95%",
              mb: 2,
            }}
          >
            <Link to="/auth/login" variant="body2" sx={{ marginLeft: 10 }}>
              {"Login"}
            </Link>
            {/* <Link to="/auth/forget-password" variant="body2">
              {"Forget Password?"}
            </Link> */}
          </Box>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            onClick={formik.handleSubmit}
          >
            {loading ? (
              <CircularProgress
                variant="determinate"
                value={progress}
                size={24}
              />
            ) : (
              "Register"
            )}
          </Button>
        </CardActions>
      </Card>
    </AuthLayout>
  );
}
