// EditCrime.js
import { Box, Button, Card, CardContent, CardActions, TextField, Stack } from "@mui/material";
import PropTypes from "prop-types";

function EditCrime({ open, onClose, onSave, formValues, setFormValues }) {
  if (!open) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        zIndex: 1300,
        width: "400px",
        borderRadius: "8px",
      }}
    >
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Company Name"
              name="company_name"
              value={formValues.company_name}
              onChange={handleInputChange}
            />
            <TextField
              label="Industry"
              name="industry"
              value={formValues.industry}
              onChange={handleInputChange}
            />
            <TextField
              label="Company Email"
              name="company_email"
              value={formValues.company_email}
              onChange={handleInputChange}
            />
            <TextField
              label="Company Address"
              name="company_address"
              value={formValues.company_address}
              onChange={handleInputChange}
            />
            <TextField
              label="Company Phone"
              name="company_phone"
              value={formValues.company_phone}
              onChange={handleInputChange}
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

EditCrime.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
};

export default EditCrime;
