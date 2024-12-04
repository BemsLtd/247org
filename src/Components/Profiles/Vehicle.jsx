import  { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import InputCom from "../InputCom";
import { EditNote, Add, Close } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import makeAPIRequest from "../../data";
import { ENDPOINTS } from "../../data/Endpoints";

const VehicleForm = ({user, vehicles, setVehicles, setMessage }) => {
  const [showAddForm, setShowAddForm] = useState(false);



  const validationSchema = Yup.object({
    vehicle_name: Yup.string()
      .required("Vehicle name is required")
      .matches(/^[a-zA-Z ]*$/, "Vehicle name can only contain letters"),
    chassis_number: Yup.string()
      .required("Chasis number is required")
      .matches(
        /^[a-zA-Z0-9-]+$/,
        "Chasis number can only contain letters, numbers, and dashes"
      ),
    color: Yup.string()
      .required("Color is required")
      .matches(/^[a-zA-Z ]*$/, "Color can only contain letters"),
    engine_number: Yup.string()
      .required("Engine number is required")
      .matches(
        /^[a-zA-Z0-9]+$/,
        "Engine number can only contain letters and numbers"
      ),
    plate_number: Yup.string()
      .required("Plate number is required")
      .matches(
        /^[a-zA-Z0-9]+$/,
        "Plate number can only contain letters and numbers"
      ),
    registration_date: Yup.date()
      .required("Registration date is required")
      .typeError("Invalid date format"),
    model_year: Yup.number()
      .required("Model year is required")
      .min(1900, "Model year must be later than 1900")
      .max(
        new Date().getFullYear(),
        `Model year cannot be later than ${new Date().getFullYear()}`
      ),
  });

  const initialValues = {
    vehicle_name: "",
    chassis_number: "",
    color: "",
    engine_number: "",
    plate_number: "",
    registration_date: "",
    model_year: "",
    id: "",
    isNewVehicle: false,
    editIndex: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setMessage({ type: "", message: null });
      try {
        const endpoint = values.isNewVehicle ? ENDPOINTS.addVehicle : `${ENDPOINTS.updateVehicle}?id=${values.id}`;
        const response = values.isNewVehicle ? await makeAPIRequest.post(endpoint, values) : await makeAPIRequest.put(endpoint, values);
        const { success, message } = response.data;
        
        if (success) {
          setMessage({ type: "success", message });
          if (values.isNewVehicle) {
            setVehicles([...vehicles, { ...values, isEditing: false }]);
            setShowAddForm(false);
          } else {
            const updatedVehicles = vehicles.map((vehicle, idx) =>
              idx === values.editIndex
                ? { ...values, isEditing: false }
                : vehicle
            );
            setVehicles(updatedVehicles);
          }
          resetForm();
        } else {
          setMessage({ type: "error", message });
        }
      } catch (error) {
        console.log(error);
        
        setMessage({ type: "error", message: "An error occurred while saving the vehicle" });
      }
    },
  });

  const handleEdit = (index) => {
    const vehicle = vehicles[index];
    formik.setValues({ 
      ...vehicle, 
      user_id: user.id,
      editIndex: index, 
      isNewVehicle: false 
    });
    const updatedVehicles = vehicles.map((v, idx) => ({
      ...v,
      isEditing: idx === index,
    }));
    setVehicles(updatedVehicles);
  };

  const handleCancel = (index) => {
    if (index !== undefined) {
      const updatedVehicles = vehicles.map((v) => ({
        ...v,
        isEditing: false,
      }));
      setVehicles(updatedVehicles);
    } else {
      setShowAddForm(false);
    }
    formik.resetForm();
  };

  const handleAddVehicle = () => {
    setShowAddForm(true);
    formik.setValues({ ...initialValues, isNewVehicle: true });
  };

  const renderFormFields = () => (
    <Grid container spacing={2}>
      {/* Vehicle Name */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="vehicle_name"
          name="vehicle_name"
          label="Vehicle Name"
          value={formik.values.vehicle_name}
          type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.vehicle_name && formik.errors.vehicle_name}
          helperText={
            formik.touched.vehicle_name && formik.errors.vehicle_name
              ? formik.errors.vehicle_name
              : null
          }
        />
      </Grid>

      {/* Chasis Number */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="chassis_number"
          name="chassis_number"
          label="Chassis Number"
          value={formik.values.chassis_number}
          type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.chassis_number && formik.errors.chassis_number}
          helperText={
            formik.touched.chassis_number && formik.errors.chassis_number
              ? formik.errors.chassis_number
              : null
          }
        />
      </Grid>

      {/* Color */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="color"
          name="color"
          label="Color"
          value={formik.values.color}
          type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.color && formik.errors.color}
          helperText={
            formik.touched.color && formik.errors.color
              ? formik.errors.color
              : null
          }
        />
      </Grid>

      {/* Engine Number */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="engine_number"
          name="engine_number"
          label="Engine Number"
          value={formik.values.engine_number}
          type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.engine_number && formik.errors.engine_number}
          helperText={
            formik.touched.engine_number && formik.errors.engine_number
              ? formik.errors.engine_number
              : null
          }
        />
      </Grid>

      {/* Plate Number */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="plate_number"
          name="plate_number"
          label="Plate Number"
          value={formik.values.plate_number}
          type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.plate_number && formik.errors.plate_number}
          helperText={
            formik.touched.plate_number && formik.errors.plate_number
              ? formik.errors.plate_number
              : null
          }
        />
      </Grid>

      {/* Registration Date */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="registration_date"
          name="registration_date"
          label="Registration Date"
          value={formik.values.registration_date}
          type="date"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.registration_date && formik.errors.registration_date}
          helperText={
            formik.touched.registration_date && formik.errors.registration_date
              ? formik.errors.registration_date
              : null
          }
        />
      </Grid>

      {/* Model Year */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="model_year"
          name="model_year"
          label="Model Year"
          value={formik.values.model_year}
          type="number"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.model_year && formik.errors.model_year}
          helperText={
            formik.touched.model_year && formik.errors.model_year
              ? formik.errors.model_year
              : null
          }
        />
      </Grid>
    </Grid>
  );

  const renderVehicleForm = (isNewVehicle = false, index) => (
    <Box p={2}>
      {renderFormFields()}
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        mt={2}
      >
        <Button
          variant="contained"
          color="error"
          startIcon={<Close />}
          onClick={() => handleCancel(index)}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={isNewVehicle ? <Add /> : <EditNote />}
          onClick={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} />
          ) : isNewVehicle ? (
            "Add Vehicle"
          ) : (
            "Save Changes"
          )}
        </Button>
      </Box>
    </Box>
  );

  const renderVehicleInfo = (vehicle, index) => (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      p={2}
      bgcolor={(theme) =>
        theme.palette.mode === "dark" ? "black" : "grey.200"
      }
    >
      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Vehicle Name:</Typography>
        <Typography variant="body1">{vehicle.vehicle_name}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Chasis Number:</Typography>
        <Typography variant="body1">{vehicle.chassis_number}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Color:</Typography>
        <Typography variant="body1">{vehicle.color}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Engine Number:</Typography>
        <Typography variant="body1">{vehicle.engine_number}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Plate Number:</Typography>
        <Typography variant="body1">{vehicle.plate_number}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Registration Date:</Typography>
        <Typography variant="body1">{vehicle.registration_date}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Model Year:</Typography>
        <Typography variant="body1">{vehicle.model_year}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Owner:</Typography>
        <Typography variant="body1">{user.first_name} {user.last_name}</Typography>
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<EditNote />}
          color="success"
          onClick={() => handleEdit(index)}
        >
          Edit
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Stack direction="row" justifyContent="space-between" marginTop={2}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Vehicle Information
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            color="success"
            onClick={handleAddVehicle}
            disabled={showAddForm}
          >
            Add New Vehicle
          </Button>
        </Box>
      </Stack>

      {showAddForm && (
        <Box marginTop={2} boxShadow={3} borderRadius={2}>
          {renderVehicleForm(true)}
        </Box>
      )}

      {vehicles.map((vehicle, index) => (
        <Box key={index} marginTop={2} boxShadow={3} borderRadius={2}>
          {vehicle.isEditing ? (
            renderVehicleForm(false, index)
          ) : (
            renderVehicleInfo(vehicle, index)
          )}
        </Box>
      ))}
    </>
  );
};

VehicleForm.propTypes = {
  user: PropTypes.any,
  vehicles: PropTypes.array.isRequired,
  setVehicles: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};

export default VehicleForm;