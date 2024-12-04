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
import SelectCom from "../SelectCom";
import useCompany from "../../data/Company";

function Addbranch({ open, handleClose }) {
  const [message, setMessage] = useState({ status: null, message: null });
  const { data: companies, isLoading: companyLoading, error: companyError} = useCompany();

  const validationSchema = Yup.object().shape({
    company_id: Yup.number().required("Select a company"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Unsupported File Format", (value) => {
        return (
          value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
        );
      }),
    branch_name: Yup.string().required("branch name is required"),
    branch_address: Yup.string().required("branch address is required"),
    
  });

  // const response = await makeAPIRequest.post(ENDPOINTS.addproperty, values)
  const formik = useFormik({
    initialValues: {
      image: null,
      company_id: "",
      branch_name: "",
      branch_address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
        const formData = new FormData();
        formData.append("company_id", values.company_id);
      formData.append("branch_name", values.branch_name);
      formData.append("branch_address", values.branch_address);
      formData.append("image", values.image);

      setMessage({ type: "", message: null });

      await makeAPIRequest
        .post(ENDPOINTS.addbranch, values, {
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
      <h2>Add New branch</h2>
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

        <SelectCom
          id="company_id"
          name="company_id"
          value={formik.values.company_id}
          label="Select Company"
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
          id="branch_name"
          label="branch Name"
          value={formik.values.branch_name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.branch_name && formik.errors.branch_name
              ? true
              : false
          }
          helperText={
            formik.touched.branch_name && formik.errors.branch_name
              ? formik.errors.branch_name
              : null
          }
        />

        <InputCom
          id="branch_address"
          label="Address"
          value={formik.values.branch_address}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.branch_address && formik.errors.branch_address
              ? true
              : false
          }
          helperText={
            formik.touched.branch_address && formik.errors.branch_address
              ? formik.errors.branch_address
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
            "Save branch"
          )}
        </Button>
      </Stack>
    </ModalBox>
  );
}

export default Addbranch;

Addbranch.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
