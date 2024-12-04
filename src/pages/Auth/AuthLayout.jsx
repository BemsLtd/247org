import { Box } from "@mui/material";
import PropTypes from "prop-types";

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url(/loginbg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "0 10px",
      }}
      component="form"
    >
      {children}
    </Box>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
