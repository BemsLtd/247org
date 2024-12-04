import ModalBox from "../Modal";
import InputCom from "../InputCom";
import PropTypes from "prop-types";
import { Button, CircularProgress, Stack } from "@mui/material";
import makeAPIRequest from "../../data";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ENDPOINTS } from "../../data/Endpoints";
import { useState } from "react";
import Notice from "../Notice";
import getForceTypes from "../../data/Dropdown";  // Assuming you have a dropdown for force types
import SelectCom from "../SelectCom";

function AddForce({ open, handleClose }) {
  const [message, setMessage] = useState({ status: null, message: null });

  const forceTypes = getForceTypes();  // Assuming you'll create this function
  const validationSchema = Yup.object().shape({
    image: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Unsupported File Format", (value) => {
        return (
          value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
        );
      }),
    force_name: Yup.string().required("Force name is required"),
    force_type: Yup.string().required("Force type is required"),
    force_email: Yup.string()
      .email("Invalid email address")
      .required("Force email is required"),
    force_address: Yup.string().required("Force address is required"),
    force_phone: Yup.string()
      .required("Force phone is required")
      .matches(
        /^\+\d{1,3}\d{7,15}$/,
        "Phone number must be valid and include country code (e.g. +234)"
      ),
  });

  const formik = useFormik({
    initialValues: {
      image: null,
      force_name: "",
      force_type: "",
      force_email: "",
      force_address: "",
      force_phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("force_name", values.force_name);
      formData.append("force_type", values.force_type);
      formData.append("force_address", values.force_address);
      formData.append("force_email", values.force_email);
      formData.append("image", values.image);
      formData.append("force_phone", values.force_phone);

      setMessage({ type: "", message: null });

      await makeAPIRequest
        .post(ENDPOINTS.registerforce, values, {  // Assuming you'll update this endpoint
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const { success, message } = res.data;
          if (success) {
            setMessage({ type: "success", message: message });
          } else {
            setMessage({ type: "error", message: message });
          }
        });
    },
  });

  return (
    <ModalBox open={open} handleClose={handleClose}>
      {message.message && (
        <Notice message={message.message} onClose={handleClose} />
      )}
      <h2>Add New Force</h2>
      <Stack spacing={2}>
        <InputCom
          id="image"
          name="image"
          label="Image"
          defaultValue={formik.values.image}
          onBlur={formik.handleBlur}
          onChange={(event) => {
            formik.setFieldValue("image", event.currentTarget.files[0]);
          }}
          type="file"
          error={formik.touched.image && formik.errors.image ? true : false}
          helperText={
            formik.touched.image && formik.errors.image
              ? formik.errors.image
              : null
          }
        />

        <InputCom
          id="force_name"
          label="Force Name"
          value={formik.values.force_name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.force_name && formik.errors.force_name
              ? true
              : false
          }
          helperText={
            formik.touched.force_name && formik.errors.force_name
              ? formik.errors.force_name
              : null
          }
        />

        <SelectCom
          id="force_type"
          name="force_type"
          label="Force Type"
          options={forceTypes.map((type) => ({
            value: type,
            text: type,
          }))}
          value={formik.values.force_type}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={
            formik.touched.force_type && formik.errors.force_type ? true : false
          }
          helperText={
            formik.touched.force_type && formik.errors.force_type
              ? formik.errors.force_type
              : null
          }
        />

        <InputCom
          id="force_email"
          label="Force Email"
          value={formik.values.force_email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          error={
            formik.touched.force_email && formik.errors.force_email
              ? true
              : false
          }
          helperText={
            formik.touched.force_email && formik.errors.force_email
              ? formik.errors.force_email
              : null
          }
        />

        <InputCom
          id="force_address"
          label="Address"
          value={formik.values.force_address}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.force_address && formik.errors.force_address
              ? true
              : false
          }
          helperText={
            formik.touched.force_address && formik.errors.force_address
              ? formik.errors.force_address
              : null
          }
        />

        <InputCom
          id="force_phone"
          label="Force Phone"
          value={formik.values.force_phone}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.force_phone && formik.errors.force_phone
              ? true
              : false
          }
          helperText={
            formik.touched.force_phone && formik.errors.force_phone
              ? formik.errors.force_phone
              : null
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save Force"
          )}
        </Button>
      </Stack>
    </ModalBox>
  );
}

export default AddForce;

AddForce.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};