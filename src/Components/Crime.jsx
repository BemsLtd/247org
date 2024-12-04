import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { Edit, Save, Visibility } from "@mui/icons-material";
import ModalBox from "./Modal";
import { useCallback, useState } from "react";
import InputCom from "./InputCom";
import { BASE_URL, ENDPOINTS } from "../data/Endpoints";
import makeAPIRequest from "../data";
import Notice from "./Notice";
import Carousel from "react-material-ui-carousel";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import useCrime from "../data/Crime";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";

function Crime({ gridnum, pagination }) {
  const user_id = useSelector((state) => state.userDetails.user);
  
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState({ status: "", message: null });
  const { data: crime, isLoading, error, refetch } = useCrime();

  const [openModal, setOpenModal] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [formValues, setFormValues] = useState({
    image: [],
    location: "",
    description: "",
    dateandtime: ""
  });


  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = (crime) => {
    console.log(crime);
    
    setEditCompany(crime);
    setFormValues({
      id: crime.id,
      image: crime.image,
      location: crime.location,
      description: crime.description,
      dateandtime: format(parseISO(crime.dateandtime), "yyyy-MM-dd'T'HH:mm"),
    });

    formik.setValues({
      id: crime.id,
      image: crime.image || [],
      location: crime.location,
      description: crime.description,
      dateandtime: format(parseISO(crime.dateandtime), "yyyy-MM-dd'T'HH:mm"),
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setEditCompany(null);
    setOpenModal(false);
  };

  const formik = useFormik({
    initialValues: {
      image: [],
      location: "",
      description: "",
      dateandtime: "",
      id: ""
    },
    onSubmit: async (values) => {
      console.log(values);
      
      const formData = new FormData();
      // formData.append("image", values.image);
      formData.append("location", values.location);
      formData.append("dateandtime", values.dateandtime);
      formData.append("description", values.description);
      if (Array.isArray(values.image) && values.image.length > 0) {
        values.image.forEach((file) => {
          formData.append("image", file); // Append each file to formData
        });
      }
      try {
        await makeAPIRequest.put(`${ENDPOINTS.update_crime}?reportId=${values.id}`, values);
        setMessage({ type: "success", message: message });
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await makeAPIRequest.delete(`${ENDPOINTS.deletcompany}?crime_id=${id}`);
       
       
        setMessage({
          status: "success",
          message: "Company deleted successfully.",
        });
        refetch(); // Refresh company list after deletion
      } catch (err) {
        console.error("Failed to delete company:", err);
        setMessage({
          status: "error",
          message: "Failed to delete company.",
        });
      }
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box>
      <Grid container spacing={2}>
        {error && <Typography color="error">{error.message}</Typography>}
        {(isLoading ? Array.from(new Array(10)) : crime.report || []).map(
          (item, i) => (
            <Grid item xs={12} sm={gridnum} key={item?.id ?? `loading-${i}`}>
              {" "}
              {/* Use a unique key */}
              <Card sx={{ height: "100%" }}>
                {isLoading ? (
                  <Skeleton variant="rectangular" height={200} />
                ) : (
                  <Carousel>
                    {typeof item.image === "string" && item.image ? (
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
                        {item?.location?.length > 30
                          ? `${item.location.substr(0, 25)}...`
                          : item?.location ?? "247 Building"}
                      </Typography>
                      <Typography variant="body2" color="text.error">
                      {item?.description?.length > 100
                        ? `${item.description.substr(0, 95)}...`
                        : item?.description ?? "Unknown"}
                    </Typography>
                        
                    
                      <Typography variant="body2" color="text.error" mt={2}>
                        <Chip
                          label={
                            format(
                              new Date(item?.dateandtime),
                              "dd-MM-yyyy HH:mm"
                            ) ?? "Unknown"
                          }
                          color={"success"}
                        />
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
                  {user_id.id === item?.user_id || user_id.role=== 'super_admin' && (
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
                  )}
                  {user_id.id === item?.user_id || user_id.role=== 'super_admin' && (
                    <Button
                      variant="contained"
                      onClick={() => handleDelete(item.id)}
                      size="small"
                      startIcon={<Edit />}
                      color="error"
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      {pagination && crime && !isLoading && (
        <Pagination
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
          count={crime.total_pages}
          page={page}
          onChange={handleChange}
        />
      )}

      {editCompany && (
        <ModalBox open={openModal} handleClose={handleClose}>
          <h2>Edit Crime</h2>
          {message.message && (
            <Notice
              message={message.message}
              status={message.type}
              onClose={handleClose}
            />
          )}
          <Card sx={{ height: "100%" }}>
            <Carousel>
              {typeof formValues.image === "string" && formValues.image ? (
                JSON.parse(formValues?.image).map((file, index) => (
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
                    src={`${BASE_URL}uploads/${formValues.image}`}
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
                  id="location"
                  label="location"
                  type="text"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                />
                <InputCom
                  id="description"
                  label="description"
                  type="text"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
                <InputCom
                  id="dateandtime"
                  label="Company Email"
                  type="datetime-local"
                  value={formik.values.dateandtime}
                  onChange={formik.handleChange}
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

Crime.propTypes = {
  gridnum: PropTypes.number,
  pagination: PropTypes.bool,
};

export default Crime;
