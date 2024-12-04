import PropTypes from "prop-types";
import makeAPIRequest from "../../data";
import { ENDPOINTS } from "../../data/Endpoints";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

const AddVisitor = ({ formik, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [userFound, setUserFound] = useState(null);
  const [emailComplete, setEmailComplete] = useState(false);

  // Debounce email check
  useEffect(() => {
    // Only check if email is complete and not empty
    if (!emailComplete || !formik.values.email) return;

    const checkUser = async () => {
      try {
        setLoading(true);
        const response = await makeAPIRequest.post(ENDPOINTS.verifyUser, {
          email: formik.values.email,
        });
        const { success } = response.data;

        if (success) {
          setMessage({ type: "success", message: "User found" });
          setUserFound(true);
        } else {
          setMessage({ type: "error", message: "User not found" });
          setUserFound(false);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setMessage({ type: "error", message: error.message });
        setUserFound(false);
      }
    };

    // Only check after a short delay to ensure user has finished typing
    const timerId = setTimeout(checkUser, 500);

    return () => clearTimeout(timerId);
  }, [emailComplete, formik.values.email]);

  const handleEmailBlur = () => {
    // Mark email as complete when user moves away from email field
    setEmailComplete(true);
  };

  const handleEmailChange = (e) => {
    // Reset state when email changes
    formik.handleChange(e);
    setEmailComplete(false);
    setUserFound(null);
    setMessage(null);
  };

  return (
    <Box 
      component="form" 
      onSubmit={formik.handleSubmit}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        p: 2,
        width: '100%' 
      }}
    >
      <TextField
        fullWidth
        name="email"
        label="Email"
        type="email"
        value={formik.values.email}
        onChange={handleEmailChange}
        onBlur={handleEmailBlur}
        required
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />

      <TextField
        fullWidth
        name="purpose_of_visit"
        label="Purpose of Visit"
        type="text"
        value={formik.values.purpose_of_visit}
        onChange={formik.handleChange}
        required
        error={formik.touched.purpose_of_visit && Boolean(formik.errors.purpose_of_visit)}
        helperText={formik.touched.purpose_of_visit && formik.errors.purpose_of_visit}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {message && (
        <Typography 
          color={message.type === 'success' ? 'success.main' : 'error.main'}
        >
          {message.message}
        </Typography>
      )}

      {userFound === false && (
        <>
          <TextField
            fullWidth
            name="first_name"
            label="First Name"
            type="text"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            required
            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
            helperText={formik.touched.first_name && formik.errors.first_name}
          />

          <TextField
            fullWidth
            name="last_name"
            label="Last Name"
            type="text"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            required
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
          />

          <TextField
            fullWidth
            name="phone"
            label="Phone Number"
            type="tel"
            value={formik.values.phone}
            onChange={formik.handleChange}
            required
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Box>
  );
};

// PropTypes validation
AddVisitor.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      address: PropTypes.string,
      purpose_of_visit: PropTypes.string.isRequired,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    touched: PropTypes.object,
    errors: PropTypes.object,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddVisitor;