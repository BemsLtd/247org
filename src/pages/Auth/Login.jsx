import { Alert, Box, Button, CardActions, CircularProgress, Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import {
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import InputCom from "../../Components/InputCom";
import Logo from "/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import makeAPIRequest from "../../data";
import { ENDPOINTS, TOKEN_KEY } from "../../data/Endpoints";
import { useDispatch } from "react-redux";
import  { updateUserDetails } from "../../store/userinfo";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", message: null });

  const validationSchema = Yup.object({
    email_or_phone: Yup.string().required("Enter atleast a phone or email address"),
    password: Yup.string() .min(8, "Password must be at least 8 characters") .required("Required"),
  });
  const location = useLocation();

  const { messager } = location.state || {};

  useEffect(() => {
    if (messager) {
      setMessage({ type: "error", message: messager });
    }
  }, [messager]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      email_or_phone: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setMessage({ type: "", message: null });
      try {
        await makeAPIRequest.post(ENDPOINTS.login, values).then((res) => {
        const { data, success, message } = res.data;
        if (success) {
          console.log(data.user.others);
          setMessage({ type: "success", message: message });
          localStorage.setItem(TOKEN_KEY, data.authToken);
          dispatch(updateUserDetails({ user: data.user.others }));
          setTimeout(() => {
            navigate(`/${data.user.role}`, {
              replace: true,
            });
          }, 2000);
        } else {
          console.log(message);
          setMessage({ type: "error", message: message });
        }
      });
      } catch (error) {
        console.log(error);
        setMessage({ type: "error", message: error.message });
      }
      
    },
  });
  return (
    <AuthLayout>
      <Card
        sx={{
          minWidth: 300,
          padding: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {message && (
          <Alert variant="filled" severity={message.type}>
            {message.message}
          </Alert>
        )}
        <form>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2}}>
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
              <Typography
                sx={{ fontSize: 24, marginBottom: 1 }}
                variant="h5"
                color="text.primary"
                align="center"
              >
                Welcome Back
              </Typography>
              <Typography
                sx={{ fontSize: 14, marginBottom: 2 }}
                align="center"
                color="text.secondary"
              >
                Please enter your credentials to continue
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputCom
                  id="email_or_phone"
                  label="Username or Email"
                  type="text"
                  value={formik.values.email_or_phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  endAdornmentIcon={<Person />}
                  error={
                    formik.touched.email_or_phone && formik.errors.email_or_phone ? true : false
                  }
                  helperText={
                    formik.touched.email_or_phone && formik.errors.email_or_phone
                      ? formik.errors.email_or_phone
                      : null
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <InputCom
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  endAdornmentIcon={
                    showPassword ? <VisibilityOff /> : <Visibility />
                  }
                  handleClickShowPassword={handleClickShowPassword}
                  handleMouseDownPassword={handleMouseDownPassword}
                  error={
                    formik.touched.password && formik.errors.password ? true : false
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
              <Link to="/auth/register" variant="body2" sx={{ marginLeft: 10 }}>
                {"Register"}
              </Link>
              <Link to="/auth/forget-password" variant="body2">
                {"Forget Password?"}
              </Link>
            </Box>
            <Button variant="contained" onClick={formik.handleSubmit}>
              {formik.isSubmitting ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                "Login"
              )}
            </Button>
          </CardActions>
        </form>
      </Card>
    </AuthLayout>
  );
}
