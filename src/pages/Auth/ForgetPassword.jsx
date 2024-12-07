import { Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import AuthLayout from "./AuthLayout";
import Logo from "/logo.png";
import InputCom from "../../Components/InputCom";
import { Mail } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import axios from "axios";
import { TOKEN_KEY } from "../../data/Endpoints";

export default function ForgetPassword() {
  const [message, setMessage] = useState({ type: "", message: null });
  const navigate = useNavigate();

    const validationSchema = Yup.object({
      email: Yup.string().required(
        "Enter atleast a phone or email address"
      ),
    })

     const formik = useFormik({
       initialValues: {
         email: "",
       },
       validationSchema,
       onSubmit: async (values) => {
         setMessage({ type: "", message: null });
         const url =
           "https://orgserviceapi.247securityandforensic.com/api/auth/send-password-otp";
         try {
           await axios.post(url, values).then((response) => {
             const { success, message, token } = response.data;

             if (success) {
               setMessage({ type: "success", message: message });
                localStorage.setItem(TOKEN_KEY, token);
               navigate("/auth/reset-passsword", {
                 replace: true,
                 state: { user_id: token },
               });
             } else {
               setMessage({ type: "error", message: message });
             }
           });
         } catch (error) {
           console.error("Error submitting form:", error);
           setMessage({ type: "error", message: error.response.data.message });
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
              Forgot Password
            </Typography>
            <Typography
              sx={{ fontSize: 14, marginBottom: 2 }}
              align="center"
              color="text.secondary"
            >
              Please enter your email Address to continue
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputCom
                id="email"
                label="Email Address"
                type="mail"
                value={formik.values.email}
                endAdornmentIcon={<Mail />}
                onBlur={formik.handleBlur}
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
            <Link to="/auth/forget-password" variant="body2">
              {"Resend mail"}
            </Link>
          </Box>
          <Button variant="contained" onClick={formik.handleSubmit}>
            {formik.isSubmitting ? (
              <CircularProgress sx={{ color: "white" }} size={24} />
            ) : (
              "Forget Password"
            )}
          </Button>
        </CardActions>
      </Card>
    </AuthLayout>
  );
}
