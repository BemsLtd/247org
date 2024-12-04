import { Alert, Box, Button, Card, CardActionArea, CardActions, CardContent, Typography } from "@mui/material";
import AuthLayout from "./AuthLayout";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useEffect, useState } from "react";
import Logo from "/logo.png";
import { matchIsNumeric } from "../../Services/ValidateNumber";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "../../store/userinfo";
import { TOKEN_KEY } from "../../data/Endpoints";

function VerifyOtp() {
const { state } = useLocation();
const dispatch = useDispatch();
const navigate = useNavigate();  
const [otp, setOtp] = useState("");
const [message, setMessage] = useState({ type: "", message: null });

console.log(state);

  const handleOTP = () => {
    
  }
  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const validateChar = (value) => {
    console.log(value);
    return matchIsNumeric(value);
  };

  const Validate = async(value) => {
    const token = localStorage.getItem('247_token');
    const url =
      "https://stagingapi.247securityandforensic.com/api/auth/verify-otp";
    await axios
      .post(
        url,
        { otp_token: value }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
          },
        }
      )
      .then((response) => {
        console.log("Success:", response.data);
        const {success, message,user, token} = response.data
        if (success) {
          setMessage({type: "success", message: message})
          localStorage.setItem(TOKEN_KEY, token);
          dispatch(updateUserDetails({  user }));
          navigate(`/${user.role}`, {
            replace: true,
          });
          }else{
          setMessage({ type: "error", message: message });
          }
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      });
  }

    useEffect(() => {
      if (!state?.user_id) {
        navigate("/auth/register");
      }
    }, [state, navigate]);

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
              Verify Otp
            </Typography>
            <Typography
              sx={{ fontSize: 14, marginBottom: 2 }}
              align="center"
              color="text.secondary"
            >
              Please token provided in your mail.
            </Typography>
          </Box>
          <MuiOtpInput
            value={otp}
            length={6}
            onChange={handleChange}
            TextFieldsProps={{ disabled: false, size: "medium" }}
            maxWidth={500}
            onComplete={Validate}
            validateChar={validateChar}
          />
        </CardContent>
        <CardActionArea>
          <CardActions>
            <Button onClick={handleOTP}>Resend otp</Button>
          </CardActions>
        </CardActionArea>
      </Card>
    </AuthLayout>
  );
}

export default VerifyOtp;
