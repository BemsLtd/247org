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
import getIndustries from "../../data/Dropdown";
import SelectCom from "../SelectCom";

function Addcompany({ open, handleClose }) {
  const [message, setMessage] = useState({ status: null, message: null });

  const industries = getIndustries();
  const validationSchema = Yup.object().shape({
    image: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Unsupported File Format", (value) => {
        return (
          value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
        );
      }),
    company_name: Yup.string().required("Company name is required"),
    industry: Yup.string().required("Industry is required"),
    company_email: Yup.string()
      .email("Invalid email address")
      .required("Company email is required"),
    company_address: Yup.string().required("Company address is required"),
    company_phone: Yup.string()
      .required("Company phone is required")
      .matches(
        /^\+\d{1,3}\d{7,15}$/,
        "Phone number must be valid and include country code (e.g. +234)"
      ),
  });

  // const response = await makeAPIRequest.post(ENDPOINTS.addproperty, values)
  const formik = useFormik({
    initialValues: {
      image: null,
      company_name: "",
      industry: "",
      company_email: "",
      company_address: "",
      company_phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("company_name", values.company_name);
      formData.append("industry", values.industry);
      formData.append("company_address", values.company_address);
      formData.append("company_email", values.company_email);
      formData.append("image", values.image);
      formData.append("company_address", values.company_address);
      formData.append("company_phone", values.company_phone);

      setMessage({ type: "", message: null });

      await makeAPIRequest
        .post(ENDPOINTS.registercompany, values, {
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
      <h2>Add New Company</h2>
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
          id="company_name"
          label="Company Name"
          value={formik.values.company_name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.company_name && formik.errors.company_name
              ? true
              : false
          }
          helperText={
            formik.touched.company_name && formik.errors.company_name
              ? formik.errors.company_name
              : null
          }
        />

        <SelectCom
          id="industry"
          name="industry"
          label="Industry"
          options={industries.map((industry) => ({
            value: industry,
            text: industry,
          }))}
          value={formik.values.industry}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={
            formik.touched.industry && formik.errors.industry ? true : false
          }
          helperText={
            formik.touched.industry && formik.errors.industry
              ? formik.errors.industry
              : null
          }
        />

        <InputCom
          id="company_email"
          label="Company Email"
          value={formik.values.company_email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          error={
            formik.touched.company_email && formik.errors.company_email
              ? true
              : false
          }
          helperText={
            formik.touched.company_email && formik.errors.company_email
              ? formik.errors.company_email
              : null
          }
        />

        <InputCom
          id="company_address"
          label="Address"
          value={formik.values.company_address}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.company_address && formik.errors.company_address
              ? true
              : false
          }
          helperText={
            formik.touched.company_address && formik.errors.company_address
              ? formik.errors.company_address
              : null
          }
        />

        <InputCom
          id="company_phone"
          label="Company Phone"
          value={formik.values.company_phone}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.company_phone && formik.errors.company_phone
              ? true
              : false
          }
          helperText={
            formik.touched.company_phone && formik.errors.company_phone
              ? formik.errors.company_phone
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
            "Save Company"
          )}
        </Button>
      </Stack>
    </ModalBox>
  );
}

export default Addcompany;

Addcompany.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
