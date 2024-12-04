import { useState } from 'react';
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
import SelectCom from '../SelectCom';

const PhoneForm = ({user, phones, setPhones, setMessage }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const validationSchema = Yup.object({
    phone_name: Yup.string()
      .required("phone_name is required")
      .matches(
        /^[a-zA-Z0-9 ]*$/,
        "phone_name can only contain letters and numbers"
      ),
    model_number: Yup.string()
      .required("Model name is required")
      .matches(
        /^[a-zA-Z0-9 -]*$/,
        "Model name can only contain letters, numbers, and dashes"
      ),
    imei_number: Yup.string()
      .matches(/^\d{15}$/, "IMEI must be 15 digits")
      .required("IMEI number is required"),
    model_year: Yup.string().required("model date is required"),
    color: Yup.string()
      .required("Color is required")
      .matches(/^[a-zA-Z ]*$/, "Color can only contain letters"),
    serial_number: Yup.string()
      .required("Type is required"),
    purchase_date: Yup.date()
      .required("Registration date is required")
      .typeError("Invalid date format"),
    status: Yup.string().oneOf(['active','inactive'])
  });

  const initialValues = {
    phone_name: "",
    model_number: "",
    imei_number: "",
    color: "",
    serial_number: "",
    purchase_date: "",
    model_year: "",
    id: "",
    status: "",
    isNewPhone: false,
    editIndex: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setMessage({ type: "", message: null });
      console.log(values);
      
      try {
        const endpoint = values.isNewPhone ? ENDPOINTS.phone_add : `${ENDPOINTS.update_phone}?id=${values.id}`;
        const response = values.isNewPhone === true ? await makeAPIRequest.post(endpoint, values) : await makeAPIRequest.put(endpoint, values);
        const { success, message } = response.data;
        
        if (success) {
          setMessage({ type: "success", message });
          if (values.isNewPhone) {
            setPhones([...phones, { ...values, isEditing: false }]);
            setShowAddForm(false);
          } else {
            const updatedPhones = phones.map((phone, idx) =>
              idx === values.editIndex
                ? { ...values, isEditing: false }
                : phone
            );
            setPhones(updatedPhones);
          }
          resetForm();
        } else {
          setMessage({ type: "error", message });
        }
      } catch (error) {
        console.log(error);
        
        setMessage({ type: "error", message: "An error occurred while saving the phone" });
      }
    },
  });

  const handleEdit = (index) => {
    const phone = phones[index];
    formik.setValues({ 
      ...phone, 
      editIndex: index, 
      isNewPhone: false 
    });
    const updatedPhones = phones.map((p, idx) => ({
      ...p,
      isEditing: idx === index,
    }));
    setPhones(updatedPhones);
  };

  const handleCancel = (index) => {
    if (index !== undefined) {
      const updatedPhones = phones.map((p) => ({
        ...p,
        isEditing: false,
      }));
      setPhones(updatedPhones);
    } else {
      setShowAddForm(false);
    }
    formik.resetForm();
  };

  const handleAddPhone = () => {
    setShowAddForm(true);
    formik.setValues({ ...initialValues, isNewPhone: true });
  };

  const renderFormFields = () => (
    <Grid container spacing={2}>
      {/* phone_name */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="phone_name"
          name="phone_name"
          label="Phone Name"
          value={formik.values.phone_name}
          type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.phone_name && formik.errors.phone_name}
          helperText={
            formik.touched.phone_name && formik.errors.phone_name
              ? formik.errors.phone_name
              : null
          }
        />
      </Grid>

      {/* Model Name */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="model_number"
          name="model_number"
          label="Model number"
          value={formik.values.model_number}
          type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.model_number && formik.errors.model_number}
          helperText={
            formik.touched.model_number && formik.errors.model_number
              ? formik.errors.model_number
              : null
          }
        />
      </Grid>

      {/* Model Name */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="model_year"
          name="model_year"
          label="Model year"
          value={formik.values.model_year}
          type="text"
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

      {/* IMEI Number */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="imei_number"
          name="imei_number"
          label="IMEI Number"
          value={formik.values.imei_number}
          type="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.imei_number && formik.errors.imei_number}
          helperText={
            formik.touched.imei_number && formik.errors.imei_number
              ? formik.errors.imei_number
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

      {/* Type */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="serial_number"
          name="serial_number"
          label="Serial number"
          value={formik.values.serial_number}
          serial_number="text"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.serial_number && formik.errors.serial_number}
          helperText={
            formik.touched.serial_number && formik.errors.serial_number
              ? formik.errors.serial_number
              : null
          }
        />
      </Grid>

      {/* Registration Date */}
      <Grid item xs={12} sm={6} md={4}>
        <InputCom
          id="purchase_date"
          name="purchase_date"
          label="Purchase Date"
          value={formik.values.purchase_date}
          type="date"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.purchase_date && formik.errors.purchase_date}
          helperText={
            formik.touched.purchase_date && formik.errors.purchase_date
              ? formik.errors.purchase_date
              : null
          }
        />
      </Grid>

      {/* Active */}
      <Grid item xs={12} sm={6} md={4}>
        <SelectCom
          id="status"
          name="status"
          value={formik.values.status}
          label="Select Status"
          options={[
            { value: 'active', text: "Active" },
            { value: 'inactive', text: "Inactive" },
          ]}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.status && formik.errors.status}
          helperText={
            formik.touched.status && formik.errors.status
              ? formik.errors.status
              : null
          }
        />
      </Grid>
    </Grid>
  );

  const renderPhoneForm = (isNewPhone = false, index) => (
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
          startIcon={isNewPhone ? <Add /> : <EditNote />}
          onClick={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} />
          ) : isNewPhone ? (
            "Add Phone"
          ) : (
            "Save Changes"
          )}
        </Button>
      </Box>
    </Box>
  );

  const renderPhoneInfo = (phone, index) => (
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
        <Typography variant="body1" fontWeight="bold">Phone Name:</Typography>
        <Typography variant="body1">{phone.phone_name}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Model Number:</Typography>
        <Typography variant="body1">{phone.model_number}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">IMEI Number:</Typography>
        <Typography variant="body1">{phone.imei_number}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Color:</Typography>
        <Typography variant="body1">{phone.color}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Model Year:</Typography>
        <Typography variant="body1">{phone.model_year}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Purchase Date:</Typography>
        <Typography variant="body1">{phone.purchase_date}</Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Typography variant="body1" fontWeight="bold">Serial Number:</Typography>
        <Typography variant="body1">{phone.serial_number}</Typography>
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
            Phone Information
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            color="success"
            onClick={handleAddPhone}
            disabled={showAddForm}
          >
            Add New Phone
          </Button>
        </Box>
      </Stack>

      {showAddForm && (
        <Box marginTop={2} boxShadow={3} borderRadius={2}>
          {renderPhoneForm(true)}
        </Box>
      )}

      {phones.map((phone, index) => (
        <Box key={index} marginTop={2} boxShadow={3} borderRadius={2}>
          {phone.isEditing ? (
            renderPhoneForm(false, index)
          ) : (
            renderPhoneInfo(phone, index)
          )}
        </Box>
      ))}
    </>
  );
};

PhoneForm.propTypes = {
  user: PropTypes.any,
  phones: PropTypes.array.isRequired,
  setPhones: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};

export default PhoneForm;