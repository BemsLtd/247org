import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControlLabel,
  Grid,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { Edit, Save, Visibility } from "@mui/icons-material";
import ModalBox from "./Modal";
import { useCallback, useState } from "react";
import InputCom from "./InputCom";
import SelectCom from "./SelectCom";
import { BASE_URL, ENDPOINTS } from "../data/Endpoints";
import useUnits from "../data/Units";
import { Link } from "react-router-dom";
import makeAPIRequest from "../data";
import { useFormik } from "formik";
import Notice from "./Notice";
import { useDropzone } from "react-dropzone";
import Carousel from "react-material-ui-carousel";

function Units({ gridnum, pagination, property_id }) {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState({ status: null, message: null });
  const { data: Units, isLoading, error } = useUnits({ property_id });

  const [openModal, setOpenModal] = useState(false);

  const [editUnit, setEditUnit] = useState(null);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = (property) => {
    setEditUnit(property);
    formik.setValues({
      unit_id: property.id,
      unit_number: property.unit_number,
      avaliability: property.avaliability,
      type: property.type, // assuming type comes from property
      image: Array.isArray(property.unit_image)
        ? property.unit_image
        : [property.unit_image],
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setEditUnit(null);
    setOpenModal(false);
  };

  const formik = useFormik({
    initialValues: {
      unit_id: "",
      unit_number: "",
      avaliability: false,
      type: "",
      image: [],
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("unit_id", values.unit_id);
      formData.append("avaliability", values.avaliability);
      formData.append("type", values.type);
      formData.append("unit_number", values.unit_number);
      values.image.forEach((file) => {
        formData.append(`image`, file);
      });
      try {
        await makeAPIRequest.post(ENDPOINTS.editunit, values);
        setMessage({ type: "success", message: message });
        setEditUnit(null);
        handleClose();
      } catch (error) {
        console.error("Failed to save Unit:", error);
        setMessage({ type: "success", message: "Failed to save Unit" });
      }
      console.log(values);
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

  console.log(formik.values.image.length);

  if (error) return <div>Error: {error.response?.data?.message}</div>;

  return (
    <Box>
      <Grid container spacing={2}>
        {error && <Typography color="error">{error.message}</Typography>}
        {(isLoading
          ? Array.from(new Array(10))
          : Units?.property_units || []
        ).map((item, i) => (
          <Grid item xs={12} sm={gridnum} key={item?.id ?? `loading-${i}`}>
            {" "}
            {/* Use a unique key */}
            <Card sx={{ height: "100%" }}>
              {isLoading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : (
                <>
                  {item.unit_image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        item?.unit_image
                          ? `${BASE_URL}uploads/${item.unit_image}` // Access the first image
                          : "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      }
                      alt={item?.name ?? "Default description"}
                      style={{ objectFit: "cover" }}
                    />
                  )}

                  {/* {item.unit_image.length > 1 && (
                    <Carousel>
                      {item.unit_image.map((file, index) => (
                        <Paper key={index}>
                          <img
                            src={`${BASE_URL}uploads/${file}`} 
                            alt={`preview-${index}`}
                            width="100%"
                            style={{ maxHeight: "400px", objectFit: "cover" }}
                          />
                        </Paper>
                      ))}
                    </Carousel>
                  )} */}
                </>
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
                      Unit Number: {item?.unit_number ?? "Unknown"}
                    </Typography>
                  </>
                )}
              </CardContent>
              <CardActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
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

      {pagination && Units && !isLoading && (
        <Pagination
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
          count={Units.total_pages}
          page={page}
          onChange={handleChange}
        />
      )}

      {editUnit && (
        <ModalBox open={openModal} handleClose={handleClose}>
          <h2>Edit Unit</h2>
          {message.message && (
            <Notice
              message={message.message}
              status={message.type}
              onClose={handleClose}
            />
          )}
          <Card>
            {formik.values.image.length < 2 && (
              <CardMedia
                component="img"
                height="200"
                image={
                  formik.values?.image
                    ? `${BASE_URL}uploads/${formik.values.image}`
                    : "default_image_url" // Fallback image URL
                }
                alt={
                  formik.values.unit_name?.alt_description ??
                  "Default description" // Fallback alt text
                }
                style={{ objectFit: "cover" }}
              />
            )}

            {/* Carousel for Multiple Images */}
            {formik.values.image.length > 1 && (
              <Carousel>
                {formik.values.image.map((file, index) => (
                  <Paper key={index}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      width="100%"
                      style={{ maxHeight: "400px", objectFit: "cover" }} // Adjust maxHeight based on your layout
                    />
                  </Paper>
                ))}
                {/* NextIcon={<ArrowForward />}
                PrevIcon={<ArrowBack />} */}
              </Carousel>
            )}
            <CardContent>
              <Stack spacing={2}>
                {formik.values.availability && (
                  <Link
                    style={{ display: "inline-flex", justifyContent: "right" }}
                  >
                    View Occupants
                  </Link>
                )}
                <InputCom
                  id="unit_number"
                  label="Unit/Flat Number"
                  type="text"
                  value={formik.values.unit_number}
                  onChange={formik.handleChange}
                />

                {/* Availability Switch */}
                <FormControlLabel
                  sx={{ display: "inline-flex", justifyContent: "right" }}
                  control={
                    <Switch
                      checked={formik.values.avaliability}
                      onChange={(e) =>
                        formik.setFieldValue("avaliability", e.target.checked)
                      }
                      name="avaliability"
                    />
                  }
                  label="Availability"
                />

                {/* Property Type */}
                <SelectCom
                  label="Property Type"
                  options={[
                    { value: "tenancy", text: "Tenancy" },
                    { value: "commercial", text: "Commercial" },
                  ]}
                  value={formik.values.type}
                  onChange={(e) => formik.setFieldValue("type", e.target.value)}
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
        </ModalBox>
      )}
    </Box>
  );
}

Units.propTypes = {
  gridnum: PropTypes.number,
  pagination: PropTypes.bool,
  property_id: PropTypes.number,
};

export default Units;
