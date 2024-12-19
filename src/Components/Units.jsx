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
  // CardMedia,
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

// import SelectCom from "./SelectCom";
import Carousel from "react-material-ui-carousel";
import Notice from "./Notice";
import useUnits from "../data/Units";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
// import useCompany from "../data/Company";

function Units({ gridnum, pagination, companydetails }) {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState({ status: "", message: null });
  const { data: Units, isLoading, error } = useUnits( {companydetails} );

  // useEffect(() => {
  //   if (units) {
  //     console.log("Fetched Units Data:", units);
  //   }
  // }, [units]);
  // const { data: companies, isLoading: companyLoading } = useCompany();
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
    enableReinitialize: true,
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
        await makeAPIRequest.put(ENDPOINTS.createunit, formData);
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
        {Units?.error && <Typography color="error">{Units.error}</Typography>}
        {(isLoading ? Array.from(new Array(10)) : Units?.data || []).map(
          (item, i) => (
            <Grid item xs={12} sm={gridnum ?? 4} key={item?.id ?? `loading-${i}`}>
              {/* Use a unique key */}
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
          )
        )}
      </Grid>

      {pagination && Units && !isLoading && (
        <Pagination
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
          count={Units.total_pages}
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
      <CardContent>
        <Stack spacing={2}>
          {/* Image Upload Section */}
          <div
            {...getRootProps()}
            style={{
              border: isDragActive ? "2px dashed #2196f3" : "2px dashed #cccccc",
              padding: "20px",
              textAlign: "center",
              backgroundColor: isDragActive ? "rgba(33, 150, 243, 0.1)" : "transparent",
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag & drop image here, or click to select file</p>
            )}
          </div>

          {/* Image Preview Section */}
          {(formik.values.image || formValues.image) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {/* Existing images from server */}
              {typeof formValues.image === 'string' && (
                <Paper sx={{ position: 'relative', width: 200, height: 200 }}>
                  <img
                    src={`${BASE_URL}uploads/${formValues.image}`}
                    alt="Existing Unit Image"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 5, 
                      right: 5,
                      minWidth: 'auto',
                      padding: '4px 8px'
                    }}
                    onClick={() => {
                      setFormValues(prev => ({ ...prev, image: null }));
                      formik.setFieldValue("image", []);
                    }}
                  >
                    X
                  </Button>
                </Paper>
              )}

              {/* Newly uploaded files */}
              {formik.values.image && formik.values.image.map((file, index) => (
                <Paper key={index} sx={{ position: 'relative', width: 200, height: 200 }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 5, 
                      right: 5,
                      minWidth: 'auto',
                      padding: '4px 8px'
                    }}
                    onClick={() => {
                      const newFiles = formik.values.image.filter((_, i) => i !== index);
                      formik.setFieldValue("image", newFiles);
                    }}
                  >
                    X
                  </Button>
                </Paper>
              ))}
            </Box>
          )}

          {/* Input Fields */}
          <InputCom
            id="name"
            label="Branch Name"
            type="text"
            value={formValues.name}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                name: e.target.value,
              })
            }
          />

          <InputCom
            id="address"
            label="Branch Address"
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

      {/* Card Actions with Save Button */}
      <CardActions sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={formik.handleSubmit}
          fullWidth
        >
          Save Changes
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
  id: PropTypes.number,
  companydetails: PropTypes.object, 
};

export default Units;
