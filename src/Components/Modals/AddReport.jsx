import ModalBox from "../Modal";
import {
  Button,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import InputCom from "../InputCom";
import PropTypes from "prop-types";
import makeAPIRequest from "../../data";
import {  ENDPOINTS } from "../../data/Endpoints";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback, useState } from "react";
import Notice from "../Notice";
import Textarea from "../Textarea";
import { useDropzone } from "react-dropzone";
import Carousel from "react-material-ui-carousel";

function AddReport({ open, handleClose }) {
  const [message, setMessage] = useState({ status: "", message: null });

  const validationSchema = Yup.object({
    location: Yup.string().required("Location is required"),
    dateandtime: Yup.date()
      .required("Date of incident is required")
      .max(new Date(), "Incident date cannot be in the future"),
    description: Yup.string()
      .required("Description of the incident is required")
      .min(10, "Description must be at least 10 characters long"),
  });

  const formik = useFormik({
    initialValues: {
      image: [], // Initialize with empty array for images
      location: "",
      dateandtime: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setMessage({ type: "", message: null });
      const formData = new FormData();

      if (values.image && values.image.length > 0) {
        values.image.forEach((file) => {
          formData.append("image", file);
        });
      }
      formData.append("location", values.location);
      formData.append("dateandtime", values.dateandtime);
      formData.append("description", values.description);

      try {
        const res = await makeAPIRequest.post(ENDPOINTS.addcrime, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const { success, message } = res.data;

        if (success) {
          setMessage({ type: "success", message });
          handleClose();
        } else {
          setMessage({ type: "error", message });
        }
      } catch (error) {
        setMessage({ type: "error", message: error.message });
      }
    },
  });

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 5) {
        alert("You can only upload a maximum of 5 files.");
        return;
      }
      formik.setFieldValue("image", acceptedFiles); // Update formik state
    },
    [formik]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: "image/jpeg, image/jpg, image/png", // Accept multiple image types
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
      <h2>Add New Crime Record</h2>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
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

            {/* Display images as previews */}
            {formik.values.image.length > 0 && (
              <Carousel>
                {formik.values.image.map((file, index) => (
                  <Paper key={index}>
                    <img
                      src={URL.createObjectURL(file)} // Display file preview
                      alt={`preview-${index}`}
                      width="100%"
                      style={{ maxHeight: "400px", objectFit: "cover" }}
                    />
                  </Paper>
                ))}
              </Carousel>
            )}
          </div>

          <InputCom
            id="location"
            name="location"
            label="Location"
            value={formik.values.location}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.location && formik.errors.location}
            helperText={
              formik.touched.location && formik.errors.location
                ? formik.errors.location
                : null
            }
          />

          <InputCom
            id="dateandtime"
            name="dateandtime"
            label="Date and Time of Incident"
            value={formik.values.dateandtime}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="datetime-local"
            error={formik.touched.dateandtime && formik.errors.dateandtime}
            helperText={
              formik.touched.dateandtime && formik.errors.dateandtime
                ? formik.errors.dateandtime
                : null
            }
          />

          <Textarea
            id="description"
            name="description"
            label="Description of the Incident"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description}
            helperText={
              formik.touched.description && formik.errors.description
                ? formik.errors.description
                : null
            }
            rows={6}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit Incident"
            )}
          </Button>
        </Stack>
      </form>
    </ModalBox>
  );
}

export default AddReport;

AddReport.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
