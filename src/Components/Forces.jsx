import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Pagination,
    Paper,
    Skeleton,
    Stack,
    Typography,
  } from "@mui/material";
  import PropTypes from "prop-types";
  import { Edit, Save, Delete, Visibility } from "@mui/icons-material";
  import ModalBox from "./Modal";
  import { useCallback, useState } from "react";
  import InputCom from "./InputCom";
  import SelectCom from "./SelectCom";
  import { BASE_URL, ENDPOINTS } from "../data/Endpoints";
  import makeAPIRequest from "../data";
  import Notice from "./Notice";
  import useForce from "../data/Force";  // You'll need to create this hook
  import getForceTypes from "../data/Dropdown";  // Update to get force types
  import Carousel from "react-material-ui-carousel";
  import { useDropzone } from "react-dropzone";
  import { useFormik } from "formik";
  
  function Force({ gridnum, pagination }) {
    const [page, setPage] = useState(1);
    const [message, setMessage] = useState({ status: "", message: null });
    const { data: forces, isLoading, error, refetch } = useForce();  // Update to use force hook
  
    const [openModal, setOpenModal] = useState(false);
    const [editForce, setEditForce] = useState(null);
    const [formValues, setFormValues] = useState({
      image: "",
      force_name: "",
      force_type: "",
      force_email: "",
      force_address: "",
      force_phone: "",
    });
  
    const forceTypes = getForceTypes();  // Update to get force types
  
    const handleChange = (event, value) => {
      setPage(value);
    };
  
    const handleOpen = (force) => {
      setEditForce(force);
      setFormValues({
        force_id: force.id,
        force_name: force.force_name,
        force_email: force.force_email,
        force_address: force.force_address,
        force_type: force.force_type,
        force_phone: force.force_phone,
      });
      setOpenModal(true);
    };
  
    const handleClose = () => {
      setEditForce(null);
      setOpenModal(false);
    };
  
    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this force?")) {
        try {
          await makeAPIRequest.delete(`${ENDPOINTS.deleteforce}?force_id=${id}`);
         
          setMessage({
            status: "success",
            message: "Force deleted successfully.",
          });
          refetch(); // Refresh force list after deletion
        } catch (err) {
          console.error("Failed to delete force:", err);
          setMessage({
            status: "error",
            message: "Failed to delete force.",
          });
        }
      }
    };
  
    const formik = useFormik({
      initialValues: {
        force_id: "",
        force_name: "",
        force_email: "",
        force_address: "",
        force_type: "",
        force_phone: "",
        image: [],
      },
      onSubmit: async (values) => {
        const formData = new FormData();
        formData.append("force_name", values.force_name);
        formData.append("force_type", values.force_type);
        formData.append("force_address", values.force_address);
        formData.append("force_email", values.force_email);
        formData.append("force_phone", values.force_phone);
        values.image.forEach((file) => {
          formData.append(`image`, file);
        });
        try {
          await makeAPIRequest.put(ENDPOINTS.updateforce, values);
          setMessage({ type: "success", message: "Force updated successfully" });
          handleClose();
          refetch();
        } catch (error) {
          console.error("Failed to save Force:", error);
          setMessage({ type: "error", message: "Failed to save Force" });
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
  
    if (error) return <div>Error: {error.message}</div>;
  
    return (
      <Box>
        <Grid container spacing={2}>
          {error && <Typography color="error">{error.message}</Typography>}
          {(isLoading
            ? Array.from(new Array(10))
            : forces.forces || []
          ).map((item, i) => (
            <Grid item xs={12} sm={gridnum} key={item?.id ?? `loading-${i}`}>
              <Card sx={{ height: "100%" }}>
                {isLoading ? (
                  <Skeleton variant="rectangular" height={200} />
                ) : (
                  <Carousel>
                    {typeof item.image === "string" &&
                    item.image.startsWith("[") ? (
                      JSON.parse(item?.image).map((file, index) => (
                        <Paper key={index}>
                          <img
                            src={`${BASE_URL}uploads/${file}`}
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
                          src={`${BASE_URL}uploads/${item.image}`}
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
                        {item?.force_name?.length > 30
                          ? `${item.force_name.substr(0, 25)}...`
                          : item?.force_name ?? "Force Name"}
                      </Typography>
                      <Typography variant="body2" color="text.error">
                        Force Type: {item?.force_type ?? "Unknown"}
                      </Typography>
                      <Typography variant="body2" color="text.error">
                        Email: {item?.force_email ?? "Unknown"}
                      </Typography>
                      <Typography variant="body2" color="text.error">
                        Phone:{" "}
                        {item?.force_phone.replace("+234", "0") ?? "Unknown"}
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
                  <Button
                    variant="contained"
                    onClick={() => handleDelete(item.id)}
                    size="small"
                    startIcon={<Delete />}
                    color="error"
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
  
        {pagination && forces && !isLoading && (
          <Pagination
            sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
            count={forces.total_pages}
            page={page}
            onChange={handleChange}
          />
        )}
  
        {editForce && (
          <ModalBox open={openModal} handleClose={handleClose}>
            <h2>Edit Force</h2>
            {message.message && (
              <Notice
                message={message.message}
                status={message.type}
                onClose={handleClose}
              />
            )}
            <Card sx={{ height: "100%" }}>
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
                    formik.values.force_name?.alt_description ??
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
                        style={{ maxHeight: "400px", objectFit: "cover" }}
                      />
                    </Paper>
                  ))}
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
                  <InputCom
                    id="force_name"
                    label="Force Name"
                    type="text"
                    value={formValues.force_name}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        force_name: e.target.value,
                      })
                    }
                  />
                  <SelectCom
                    id="force_type"
                    label="Force Type"
                    name="force_type"
                    value={formValues.force_type}
                    options={forceTypes.map((type) => ({
                      value: type,
                      text: type,
                    }))}
                    onChange={(e) =>
                      setFormValues({ ...formValues, force_type: e.target.value })
                    }
                  />
                  <InputCom
                    id="force_email"
                    label="Force Email"
                    type="email"
                    value={formValues.force_email}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        force_email: e.target.value,
                      })
                    }
                  />
                  <InputCom
                    id="force_address"
                    label="Force Address"
                    type="text"
                    value={formValues.force_address}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        force_address: e.target.value,
                      })
                    }
                  />
                  <InputCom
                    id="force_phone"
                    label="Force Phone"
                    type="text"
                    value={formValues.force_phone}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        force_phone: e.target.value,
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
          </ModalBox>
        )}
      </Box>
    );
  }
  
  Force.propTypes = {
    gridnum: PropTypes.number,
    pagination: PropTypes.bool,
  };
  
  export default Force;