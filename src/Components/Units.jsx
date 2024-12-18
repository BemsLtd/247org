import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Pagination,
  Skeleton,
  Stack, 
  CardMedia,
  Paper,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { Edit, Save, Visibility } from "@mui/icons-material";
import ModalBox from "./Modal";
import { useCallback, useEffect, useState } from "react";
import InputCom from "./InputCom";
import { BASE_URL, ENDPOINTS } from "../data/Endpoints";
import makeAPIRequest from "../data";

import SelectCom from "./SelectCom";
import Carousel from "react-material-ui-carousel";
import Notice from "./Notice";
import useUnits from "../data/Units";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import useCompany from "../data/Company";

function Units({ gridnum, pagination, companydetails }) {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState({ status: "", message: null });
  const { data: units, isLoading, error } = useUnits({ companydetails: companydetails || {} });

  useEffect(() => {
    if (units) {
      console.log("Fetched Units Data:", units);
    }
  }, [units]);
  const { data: companies, isLoading: companyLoading } = useCompany();
  const [openModal, setOpenModal] = useState(false);
  const [editUnits, setEditUnits] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    id: "",
    org_id: "",
    image: [],
    phone: "",
    address: "",

  });

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = (unit) => {
    setEditUnits(unit);
    setFormValues({
      id: unit.id,
      org_id: unit.org_id,
      address: unit.address,
      name: unit.name,
      phone: unit.phone,
      image: unit.image || null, // Add fallback for image
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setEditUnits(null);
    setOpenModal(false);
  };

  const formik = useFormik({
    initialValues: formValues,
    enableReinitialize: true, // Allows formik to reset values when formValues change
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("phone", values.phone);
      formData.append("id", values.id);
      formData.append("name", values.name);
      formData.append("address", values.address);
      values.image.forEach((file) => {
        formData.append("image", file);
      });
      try {
        await makeAPIRequest.put(ENDPOINTS.updateunits, formData);
        setMessage({ type: "success", message: "Unit updated successfully" });
        handleClose();
      } catch (error) {
        console.error("Failed to save unit:", error);
        setMessage({ type: "error", message: "Failed to save unit" });
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

  useEffect(() => {
    formik.setFieldValue("phone", formValues.phone);
    formik.setFieldValue("address", formValues.address);
    formik.setFieldValue("id", formValues.id);
    formik.setFieldValue("org_id", formValues.org_id);
    formik.setFieldValue("name", formValues.name);
  }, [formValues]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/jpeg": [], "image/jpg": [], "image/png": [] },
  });


  if (error) return <div>Error: {error.message}</div>;
  return (
    <Box>
      <Grid container spacing={2}>
        {error && <Typography color="error">{error.message}</Typography>}
        {(isLoading ? Array.from(new Array(10)) : Units?.data || []).map((item, i) => (
  <Grid item xs={12} sm={gridnum} key={item?.id ?? `loading-${i}`}>
    {/* Use a unique key */}
    <Card sx={{ height: "100%" }}>
      {isLoading ? (
        <Skeleton variant="rectangular" height={200} />
      ) : (
        <Carousel>
          {typeof item.image === "string" && item.image.startsWith("[") ? (
            JSON.parse(item?.image).map((file, index) => (
              <Paper key={index}>
                <img
                  src={file}
                  alt={`preview-${index}`}
                  width="100%"
                  style={{
                    maxHeight: "300px",
                    minHeight: "250px",
                    objectFit: "cover",
                  }}
                />
              </Paper>
            ))
          ) : (
            <Paper>
              <img
                src={item.image}
                alt={`preview-single`}
                width="100%"
                style={{
                  maxHeight: "300px",
                  minHeight: "250px",
                  objectFit: "cover",
                }}
              />
            </Paper>
          )}
        </Carousel>
      )}
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton animation="wave" height={30} width="80%" />
            <Skeleton animation="wave" height={20} width="60%" />
          </>
        ) : (
          <>
            <Typography gutterBottom variant="h6" component="div">
              {item?.name?.length > 30
                ? `${item.name.substr(0, 25)}...`
                : item?.name ?? "247 Building"}
            </Typography>
            <Typography variant="body2" color="text.error">
              Address: {item?.address ?? "Unknown"}
            </Typography>
            <Typography variant="body2" color="text.error">
              Branch: {item?.branch?.name ?? "Unknown"}
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<Visibility />}
          disabled={isLoading}
        >
          View
        </Button>
        <Button
          variant="contained"
          onClick={() => handleOpen(item)}
          size="small"
          startIcon={<Edit />}
          color="warning"
          disabled={isLoading}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  </Grid>
))}

      </Grid>

      {pagination && units && !isLoading && (
        <Pagination
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
          count={units.total_pages}
          page={page}
          onChange={handleChange}
        />
      )}

      {editUnits && (
        <ModalBox open={openModal} handleClose={handleClose}>
          <h2>Edit Branch</h2>
          {message.message && (
            <Notice
              message={message.message}
              status={message.type}
              onClose={handleClose}
            />
          )}
          <Card sx={{ height: "100%" }}>
          {formik.values.image && formik.values.image.length < 2 && (
          <CardMedia
            component="img"
            height="200"
            image={
      formik.values?.image
        ? `${BASE_URL}uploads/${formik.values.image}`
        : "default_image_url"
    }
    alt={
      formik.values.unit_name?.alt_description ?? "Default description"
    }
    style={{ objectFit: "cover" }}
  />
)}


            {/* Carousel for Multiple Images */}
            {formik.values.image && formik.values.image.length > 1 && (
              <Carousel>
                {Array.isArray(formik.values.image) &&
                  formik.values.image.map((file, index) => (
                    <Paper key={index}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        width="100%"
                        style={{ maxHeight: "400px", objectFit: "cover" }}
                      />
                    </Paper>
                  ))}
                                {/* NextIcon={<ArrowForward />}
                PrevIcon={<ArrowBack />} */}
              </Carousel>
            )}
            <CardContent>
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
                </div>
                <SelectCom
                  id="org_id"
                  name="org_id"
                  value={formValues.org_id}
                  label="Select Company"
                  options={
                    companyLoading
                      ? [{ value: "", text: "Loading companies..." }]
                      : companies.data?.length
        ? companies.data.map((item) => ({
            value: String(item.id),
            text: item.org_name,
          }))
        : [{ value: "", text: "No companies available" }]
      
      
      
      
                  }
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      org_name: e.target.value,
                    })
                  }
                  error={formik.touched.org_id && formik.errors.org_id}
                  helperText={
                    formik.touched.org_id && formik.errors.org_id
                      ? formik.errors.org_id
                      : null
                  }
                />
                <InputCom
                  id="name"
                  label="branch Name"
                  type="text"
                  value={formValues.name}
                  onChange={(e) => setFormValues({
                      ...formValues,
                      name: e.target.value,
                    })
                  }
                />

                <InputCom
                  id="address"
                  label="branch Address"
                  type="text"
                  value={formValues.address}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      address: e.target.value,
                    })
                  }
                />
              </Stack>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={formik.handleSubmit}
              >
                Save
              </Button>
            </CardActions>
          </Card>

{          }

        </ModalBox>
      )}
    </Box>
  );
}

Units.propTypes = {
  gridnum: PropTypes.number,
  pagination: PropTypes.bool,
  id: PropTypes.number,
  companydetails: PropTypes.object, 
};

export default Units;
