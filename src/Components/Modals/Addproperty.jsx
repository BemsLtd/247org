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
import SelectCom from "../SelectCom";

function Addproperty({ open, handleClose }) {
   const user = useSelector((state) => state.userDetails.user);
  const [message, setMessage]= useState({status: null, message: null})

  const validationSchema = Yup.object({
    property_name: Yup.string().required("Property name is required"),
    type: Yup.string().required("Type is required"),
    property_address: Yup.string().required("Property address is required"),
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

  // const response = await makeAPIRequest.post(ENDPOINTS.addproperty, values)
  const formik = useFormik({
    initialValues: {
      property_name: "",
      type: "",
      property_address: "",
      // units: "",
      image: null,
      user_id: user.id
    },
    validationSchema,
    onSubmit: async (values) => {

      const formData = new FormData();
      formData.append("property_name", values.property_name);
      formData.append("type", values.type);
      formData.append("property_address", values.property_address);
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
          id="property_name"
          label="Property Name"
          value={formik.values.property_name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.property_name && formik.errors.property_name
              ? true
              : false
          }
          helperText={
            formik.touched.property_name && formik.errors.property_name
              ? formik.errors.property_name
              : null
          }
        />
        {/* <InputCom
          id="units"
          label="Number of flats"
          value={formik.values.units}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={formik.touched.units && formik.errors.units ? true : false}
          helperText={
            formik.touched.units && formik.errors.units
              ? formik.errors.units
              : null
          }
        /> */}
        <InputCom
          id="property_address"
          label="Location"
          value={formik.values.property_address}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.property_address && formik.errors.property_address
              ? true
              : false
          }
          helperText={
            formik.touched.property_address && formik.errors.property_address
              ? formik.errors.property_address
              : null
          }
        />
        <SelectCom
          id="type"
          name="type"
          label="Property Type"
          options={[
            { value: "tenancy", text: "Tenancy" },
            { value: "commercial", text: "Commercial" },
          ]}
          value={formik.values.type}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.type && formik.errors.type ? true : false}
          helperText={
            formik.touched.type && formik.errors.type
              ? formik.errors.type
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

export default Addproperty;

Addproperty.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
