import ModalBox from "../Modal";
import InputCom from "../InputCom";
import PropTypes from "prop-types";
import { Button, CircularProgress, Stack } from "@mui/material";
import makeAPIRequest from "../../data";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ENDPOINTS } from "../../data/Endpoints";
import { useState } from "react";
import Notice from "../Notice"
import { useSelector } from "react-redux";

function AddManifest({ open, handleClose }) {
   const user = useSelector((state) => state.userDetails.user);
  const [message, setMessage]= useState({status: null, message: null})

  const validationSchema = Yup.object({
    plate_number: Yup.string().required("Property name is required"),
    Vehicle_type: Yup.string().required("Vehicle type is required"),
    manifest_no: Yup.string().required("Property address is required"),
    // units: Yup.number()
    //   .required("Number of units is required")
    //   .positive("Number of units must be a positive number")
    //   .integer("Number of units must be an integer"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Unsupported File Format", (value) => {
        return value && ["image/jpeg", "image/png"].includes(value.type);
      }),
  });

  // const response = await makeAPIRequest.post(ENDPOINTS.AddManifest, values)
  const formik = useFormik({
    initialValues: {
      plate_number: "",
      vehicle_type: "",
      manifest_no: "",
      image: null,
      user_id: user.id
    },
    validationSchema,
    onSubmit: async (values) => {

      const formData = new FormData();
      formData.append("plate_number", values.plate_number);
      formData.append("vehicle_type", values.vehicle_type);
      formData.append("manifest_no", values.manifest_no);
      // formData.append("units", values.units);
      formData.append("image", values.image);
      formData.append("user_id", values.user_id)

      setMessage({ type: "", message: null });

      await makeAPIRequest
        .post(ENDPOINTS.addproperty, values, {
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
      <h2>Add New Property</h2>
      <Stack spacing={2}>
        <InputCom
          id="plate_number"
          label="Plate Number"
          value={formik.values.plate_number}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.plate_number && formik.errors.plate_number
              ? true
              : false
          }
          helperText={
            formik.touched.plate_number && formik.errors.plate_number
              ? formik.errors.plate_number
              : null
          }
        />
        <InputCom
          id="vehicle_type"
          label="Location"
          value={formik.values.vehicle_type}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.vehicle_type && formik.errors.vehicle_type
              ? true
              : false
          }
          helperText={
            formik.touched.vehicle_type && formik.errors.vehicle_type
              ? formik.errors.vehicle_type
              : null
          }
        />
        <InputCom
          id="manifest_no"
          label="Manifest Number"
          value={formik.values.manifest_no}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.manifest_no && formik.errors.manifest_no
              ? true
              : false
          }
          helperText={
            formik.touched.manifest_no && formik.errors.manifest_no
              ? formik.errors.manifest_no
              : null
          }
        />
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
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
          // disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save Property"
          )}
        </Button>
      </Stack>
    </ModalBox>
  );
}

export default AddManifest;

AddManifest.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
