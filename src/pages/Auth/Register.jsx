import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import AuthLayout from "./AuthLayout";
import Logo from "/logo.png";
import InputCom from "../../Components/InputCom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SelectCom from "../../Components/SelectCom";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
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

  // Validation schema
  const validationSchema = Yup.object({
    org_name: Yup.string().required("Organization name is required."),
    org_email: Yup.string()
      .email("Invalid email address")
      .required("Organization email is required."),
    avatar: Yup.mixed()
      .required("avatar is required"),
      
      
    org_phone: Yup.string().required("Organization phone number is required."),
    address: Yup.string().required("Organization address is required."),
    role: Yup.string()
      .oneOf(["admin", "user", "landlord"], "Invalid Role")
      .required("Role is required."),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required."),
    industry: Yup.string().required("Industry is required."),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      org_name: "",
      org_email: "",
      org_phone: "",
      address: "",
      role: "",
      password: "",
      industry: "",
      avatar: null,
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
        "https://orgserviceapi.247securityandforensic.com/api/auth/register";
        const formData = new FormData();

  // Append all form fields to FormData
  for (const key in values) {
    if (key === "avatar" && values[key]) {
      // Handle file field
      formData.append(key, values[key]);
    } else {
      formData.append(key, values[key]);
    }
  }

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
        const { success, message, token } = response.data;

        if (success) {
          setMessage({ type: "success", message });
          localStorage.setItem("TOKEN_KEY", token);
          navigate("/auth/verify-otp", {
            replace: true,
            state: { user_id: token },
          });
        } else {
          setMessage({ type: "error", message });
        }
      } catch (error) {
        setMessage({
          type: "error",
          message: error.response?.data?.message || "Something went wrong!",
        });
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
        {message.message && (
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
            <Typography variant="h5" color="text.primary" align="center">
              Sign Up
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Please provide accurate information.
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputCom
                id="org_name"
                label="Organization Name"
                value={formik.values.org_name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.org_name && formik.errors.org_name ? true : false
                }
                helperText={formik.touched.org_name && formik.errors.org_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputCom
                id="org_email"
                label="Organization Email"
                value={formik.values.org_email}
                onBlur={formik.handleBlur}
                type="email"
                onChange={formik.handleChange}
                error={
                  formik.touched.org_email && formik.errors.org_email
                    ? true
                    : false
                }
                helperText={formik.touched.org_email && formik.errors.org_email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputCom
                id="org_phone"
                label="Phone Number"
                value={formik.values.org_phone}
                onBlur={formik.handleBlur}
                type="text"
                onChange={formik.handleChange}
                error={
                  formik.touched.org_phone && formik.errors.org_phone
                    ? true
                    : false
                }
                helperText={formik.touched.org_phone && formik.errors.org_phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputCom
                id="address"
                label="Address"
                value={formik.values.address}
                onBlur={formik.handleBlur}
                type="text"
                onChange={formik.handleChange}
                error={
                  formik.touched.address && formik.errors.address
                    ? true
                    : false
                }
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SelectCom
                id="role"
                name="role"
                value={formik.values.role}
                label="Role"
                options={[
                  { value: "admin", text: "Admin" },
                  { value: "landlord", text: "Landlord" },
                  { value: "user", text: "User" },
                ]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.role && formik.errors.role ? true : false}
                helperText={formik.touched.role && formik.errors.role}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputCom
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && formik.errors.password
                    ? true
                    : false
                }
                helperText={formik.touched.password && formik.errors.password}
                endAdornmentIcon={
                  showPassword ? <VisibilityOff /> : <Visibility />
                }
                handleClickShowPassword={handleClickShowPassword}
                handleMouseDownPassword={handleMouseDownPassword}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputCom
                id="industry"
                label="Industry"
                value={formik.values.industry}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.industry && formik.errors.industry
                    ? true
                    : false
                }
                helperText={formik.touched.industry && formik.errors.industry}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputCom
  id="avatar"
  name="avatar"
  label="Image"
  onBlur={formik.handleBlur}
  onChange={(event) => {
    formik.setFieldValue("avatar", event.currentTarget.files[0]);
  }}
  type="file"
  error={formik.touched.avatar && !!formik.errors.avatar}
  helperText={
    formik.touched.avatar && formik.errors.avatar
      ? formik.errors.avatar
      : null
  }
/>

            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Link to="/auth/login">{"Login"}</Link>
          </Box>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            onClick={formik.handleSubmit}
          >
            {loading ? (
              <CircularProgress variant="determinate" value={progress} size={24} />
            ) : (
              "Register"
            )}
          </Button>
        </CardActions>
      </Card>
    </AuthLayout>
  );
}
