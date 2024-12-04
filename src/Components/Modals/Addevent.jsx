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
import SelectCom from "../SelectCom";
import useCompany from "../../data/Company";
import Textarea from "../Textarea";

function Addevent({ open, handleClose }) {
  const [message, setMessage]= useState({status: null, message: null})
  const { data: companies, isLoading: companyLoading, error: companyError} = useCompany();
console.log(companies)
const validationSchema = Yup.object().shape({
  image: Yup.mixed()
    .required("Image is required")
    .test("fileType", "Unsupported File Format", (value) => {
      return (
        value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
      );
    }),
  company_id: Yup.number()
    .required("Company ID is required")
    .positive("Company ID must be a positive number"),
  title: Yup.string().required("Event Title name is required"),
  description: Yup.string().required("description is required"),
  location: Yup.string().required("Company email is required"),
  max: Yup.string().required("Maximum number of attendee is required"),
  privacy: Yup.string().required('Event privacy is required')
});

  // const response = await makeAPIRequest.post(ENDPOINTS.addproperty, values)
  const formik = useFormik({
    initialValues: {
      image: null,
      title: "",
      description: "",
      location: "",
      max: "",
      company_id:"",
      privacy: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("max", values.max);
      formData.append("location", values.location);
      formData.append("image", values.image);
      formData.append("max", values.max);

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
      <h2>Add New Event</h2>
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
          id="title"
          label="Event Title"
          value={formik.values.title}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={formik.touched.title && formik.errors.title ? true : false}
          helperText={
            formik.touched.title && formik.errors.title
              ? formik.errors.title
              : null
          }
        />

        <Textarea
          id="yourTextarea"
          label="Event description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          rows={6}
        />

        <SelectCom
          id="company_id"
          name="company_id"
          value={formik.values.company_id}
          label="Select Company (Optional)"
          options={
            companyLoading
              ? [{ value: "", text: "Loading companies..." }]
              : companyError ||
                (companies.companies && companies.companies.length === 0)
              ? [{ value: "", text: "No companies available" }]
              : companies.companies.map((item) => ({
                  value: String(item.id),
                  text: item.company_name,
                }))
          }
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.company_id && formik.errors.company_id}
          helperText={
            formik.touched.company_id && formik.errors.company_id
              ? formik.errors.company_id
              : null
          }
        />

        <InputCom
          id="location"
          label="Event location"
          value={formik.values.location}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          error={
            formik.touched.location && formik.errors.location ? true : false
          }
          helperText={
            formik.touched.location && formik.errors.location
              ? formik.errors.location
              : null
          }
        />

        <InputCom
          id="max"
          label="Max attendance"
          value={formik.values.max}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="number"
          error={formik.touched.max && formik.errors.max ? true : false}
          helperText={
            formik.touched.max && formik.errors.max ? formik.errors.max : null
          }
        />

        <SelectCom
          id="privacy"
          name="privacy"
          value={formik.values.privacy}
          label="Event Privacy"
          options={[
            { value: "private", text: "Private" },
            { value: "public", text: "Public" },
          ]}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.privacy && formik.errors.privacy}
          helperText={
            formik.touched.privacy && formik.errors.privacy
              ? formik.errors.privacy
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

export default Addevent;

Addevent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
