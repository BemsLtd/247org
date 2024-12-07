import ModalBox from "../Modal";
import { Button, CircularProgress, FormControlLabel, Stack, Switch } from "@mui/material";
import InputCom from "../InputCom";
import PropTypes from "prop-types";
import makeAPIRequest from "../../data";
import { ENDPOINTS } from "../../data/Endpoints";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback,  useState } from "react";
import Notice from "../Notice"
import SelectCom from "../SelectCom";
import { useDropzone } from "react-dropzone";

function Addunit({ open, handleClose }) {
  const { data: properties, isLoading, error } = useProperties();
  const [message, setMessage] = useState({ status: "", message: null });
  
  const validationSchema = Yup.object({
    property_id: Yup.string().required("Property is required"),
    // unit_name: Yup.string().required("Unit Name is required"),
    unit_number: Yup.string().required("Unit Number is required"),
    image: Yup.array().min(1, "At least one image is required"),
    avaliability: Yup.boolean().required("Availability is required"),
  });

  const formik = useFormik({
    initialValues: {
      property_id: "",
      // unit_name: "",
      unit_number: "",
      image: [],
      avaliability: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("property_id", values.property_id);
      // formData.append("unit_name", values.unit_name);
      formData.append("avaliability", values.avaliability);
      formData.append("unit_number", values.unit_number);
      // formData.append("property_address", values.unit_number);
      values.image.forEach((file) => {
        formData.append(`image`, file);
      });

      setMessage({ type: "", message: null });
      try {
        await makeAPIRequest
          .post(ENDPOINTS.addunits, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            const { success, message } = res.data;
            if (success) {
              setMessage({ type: "success", message: message });
            } else {
              console.log(message);
              setMessage({ type: "error", message: message });
            }
          });
      } catch (error) {
        setMessage({ type: "error", message: error.message });
      }
    },
  });

  // Dropzone configuration
  const onDrop = useCallback(
    (acceptedFiles) => {
      formik.setFieldValue("image", acceptedFiles);
    },
    [formik]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
    },
  });

  return (
    <ModalBox open={open} handleClose={handleClose}>
      {message.message && (
        <Notice
          message={message.message}
          status={message.type}
          onClose={handleClose}
        />
      )}
      <h2>Add New Property Unit</h2>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <SelectCom
            id="property_id"
            name="property_id"
            value={formik.values.property_id}
            label="Select Property"
            options={
              isLoading
                ? [{ value: "", text: "Loading properties..." }]
                : error
                ? [{ value: "", text: "Error loading properties" }]
                : properties.data.map((item) => ({
                    value: String(item.id),
                    text: item.name,
                  }))
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.property_id && formik.errors.property_id}
            helperText={
              formik.touched.property_id && formik.errors.property_id
                ? formik.errors.property_id
                : null
            }
          />
          {/* <InputCom
            id="unit_name"
            name="unit_name"
            label="Unit Name"
            value={formik.values.unit_name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.unit_name && formik.errors.unit_name}
            helperText={
              formik.touched.unit_name && formik.errors.unit_name
                ? formik.errors.unit_name
                : null
            }
          /> */}
          <FormControlLabel
            sx={{ display: "inline-flex", justifyContent: "right" }}
            control={
              <Switch
                checked={formik.values.avaliability}
                onChange={formik.handleChange}
                name="avaliability"
              />
            }
            label="Availability"
          />
          <InputCom
            id="unit_number"
            name="unit_number"
            label="Unit Number"
            value={formik.values.unit_number}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.unit_number && formik.errors.unit_number}
            helperText={
              formik.touched.unit_number && formik.errors.unit_number
                ? formik.errors.unit_number
                : null
            }
          />
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #cccccc",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <input {...getInputProps({ id: "image", name: "image" })} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag & drop some files here, or click to select files</p>
            )}
          </div>

          {/* Display previews of uploaded image */}
          {formik.values.image.length > 0 && (
            <div style={{ display: "flex", gap: "8px" }}>
              {formik.values.image.map((file, index) => (
                <div key={index}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    width="100"
                  />
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Property"
            )}
          </Button>
        </Stack>
      </form>
    </ModalBox>
  );
}

export default Addunit;

Addunit.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
