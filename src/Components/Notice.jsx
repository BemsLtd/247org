import { Snackbar, Slide, Alert } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

export default function Notice({ message, status }) {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const SlideTransition = (props) => {
    return <Slide {...props} direction="up" />;
  };

  return (
     <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }} 
    >
      <Alert onClose={handleClose} severity={status} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

Notice.propTypes = {
  message: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};
