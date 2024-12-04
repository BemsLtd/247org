import { Route, Routes } from "react-router-dom";
// import HomePage from "../pages/Homepage";
import AboutPage from "../pages/AboutPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register"
import ForgetPassword from "../pages/Auth/ForgetPassword";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import NewPassword from "../pages/Auth/ResetPassword";


const PublicRoutes = () => (
  <Routes>
    <Route path="/" exact element={<Login />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/auth/login" element={<Login />} />
    <Route path="/auth/register" element={<Register />} />
    <Route path="/auth/forget-password" element={<ForgetPassword />} />
    <Route path="/auth/reset-passsword" element={<NewPassword />} />
    <Route path="/auth/verify-otp" element={<VerifyOtp />} />
  </Routes>
);

export default PublicRoutes;
