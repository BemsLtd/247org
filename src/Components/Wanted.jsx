import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
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
import SelectCom from "./SelectCom";
import { BASE_URL, ENDPOINTS } from "../data/Endpoints";
import makeAPIRequest from "../data";
import Notice from "./Notice";
import tags, { wanted } from '../data/Dropdown'
import useCompany from "../data/Company";
import Carousel from "react-material-ui-carousel";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";

function Wanted({ gridnum, pagination }) {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState({ status: "", message: null });
  const { data: companies, isLoading, error } = useCompany();

  const [openModal, setOpenModal] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [formValues, setFormValues] = useState({
    image: "",
    company_name: "",
    industry: "",
    company_email: "",
    company_address: "",
    company_phone: "",
  });


  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = (company) => {
    setEditCompany(company);
    setFormValues({
      company_id: company.id,
      company_name: company.company_name,
      company_email: company.company_email,
      company_address: company.company_address,
      industry: company.industry,
      company_phone: company.company_phone,
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setEditCompany(null);
    setOpenModal(false);
  };

  const formik = useFormik({
    initialValues: {
      company_id: "",
      company_name: "",
      company_email: "",
      company_address: "",
      industry: "",
      company_phone: "",
      image: [],
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("company_name", values.company_name);
      formData.append("industry", values.industry);
      formData.append("company_address", values.company_address);
      formData.append("company_email", values.company_email);
      formData.append("company_address", values.company_address);
      formData.append("company_phone", values.company_phone);
      values.image.forEach((file) => {
        formData.append(`image`, file);
      });
      try {
        await makeAPIRequest.put(ENDPOINTS.updatecompany, values);
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

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box>
      <Grid container spacing={2}>
        {error && <Typography color="error">{error.message}</Typography>}
        {(isLoading ? Array.from(new Array(10)) : wanted || []).map(
          (item, i) => (
            <Grid item xs={12} sm={gridnum} key={item?.id ?? `loading-${i}`}>
              {" "}
              {/* Use a unique key */}
              <Card sx={{ height: "100%" }}>
                {isLoading ? (
                  <Skeleton variant="rectangular" height={200} />
                ) : (
                  <Carousel>
                    {typeof item.images === "string" &&
                    item.images ? (
                      JSON.parse(item?.images).map((file, index) => (
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
                          src={item.images}
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
                        Note: {item?.note ?? "Unknown"}
                      </Typography>
                      <Typography variant="body2" color="text.error" mt={2}>
                        <Chip label={item?.tag ?? "Unknown"} color={item?.tag === 'wanted'? 'error':'success'} />
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

      {pagination && companies && !isLoading && (
        <Pagination
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
          count={companies.total_pages}
          page={page}
          onChange={handleChange}
        />
      )}

      {editCompany && (
        <ModalBox open={openModal} handleClose={handleClose}>
          <h2>Edit Item</h2>
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
                    : "default_image_url"
                }
                alt={
                  formik.values.unit_name?.alt_description ??
                  "Default description" 
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
                  id="name"
                  label="Name"
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
                  id="note"
                  label="Note"
                  type="text"
                  value={formValues.note}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      note: e.target.value,
                    })
                  }
                />
                
                <SelectCom
                  id="tag"
                  label="Tag"
                  name="tag"
                  value={formValues.tag}
                  options={tags.map((industry) => ({
                    value: industry,
                    text: industry,
                  }))}
                  onChange={(e) =>
                    setFormValues({ ...formValues, tag: e.target.value })
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

Wanted.propTypes = {
  gridnum: PropTypes.number,
  pagination: PropTypes.bool,
};

export default Wanted;
