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
   user_id: Yup.number().required("Select a company"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Unsupported File Format", (value) => {
        return (
          value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
        );
      }),
    name: Yup.string().required("branch name is required"),
    address: Yup.string().required("branch address is required"),
    
  });

  // const response = await makeAPIRequest.post(ENDPOINTS.addproperty, values)
  const formik = useFormik({
    initialValues: {
      image: null,
      user_id: "",
      name: "",
      address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
        const formData = new FormData();
        formData.append("user_id", values.user_id);
      formData.append("name", values.name);
      formData.append("address", values.address);
      formData.append("image", values.image);

      setMessage({ type: "", message: null });

      await makeAPIRequest
        .post(ENDPOINTS.addbranches, values, {
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
          id="user_id"
          name="user_id"
          value={formik.values.user_id}
          label="Select Company"
          options={
            companyLoading
              ? [{ value: "", text: "Loading companies..." }]
              : companyError ||
                (companies.data && companies.data.length === 0)
              ? [{ value: "", text: "No companies available" }]
              
              : companies.data.map((item) => ({
                  value: String(item.id),
                  text: item.org_name,
                }))
          }
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.user_id && formik.errors.id}
          helperText={
            formik.touched.user_id && formik.errors.user_id
              ? formik.errors.user_id
              : null
          }
        />

        <InputCom
          id="name"
          label="branch Name"
          value={formik.values.name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.name && formik.errors.name
              ? true
              : false
          }
          helperText={
            formik.touched.name && formik.errors.name
              ? formik.errors.name
              : null
          }
        />

        <InputCom
          id="address"
          label="Address"
          value={formik.values.address}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.address && formik.errors.address
              ? true
              : false
          }
          helperText={
            formik.touched.address && formik.errors.address
              ? formik.errors.address
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
