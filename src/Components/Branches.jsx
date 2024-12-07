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
import { Edit, Save, Visibility } from "@mui/icons-material";
import ModalBox from "./Modal";
import { useCallback, useEffect, useState } from "react";
import InputCom from "./InputCom";
import { BASE_URL, ENDPOINTS } from "../data/Endpoints";
import makeAPIRequest from "../data";
import Notice from "./Notice";
import useBranch from "../data/Branch";
import Carousel from "react-material-ui-carousel";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import useCompany from "../data/Company";
import SelectCom from "./SelectCom";

function Branch({ gridnum, pagination, id }) {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState({ status: "", message: null });
  const { data: branch, isLoading, error } = useBranch({user_id: id});
  const { data: companies, isLoading: companyLoading} = useCompany();

  const [openModal, setOpenModal] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [formValues, setFormValues] = useState({
    image: "",
    user_id: "",
    id:"",
    name: "",
    address: "",
  });

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = (Branch) => {
    console.log("h",Branch)
    setEditBranch(Branch);
    setFormValues({
      id: Branch.id,
      user_id: Branch.user_id,
      name: Branch.name,
      address: Branch.address,
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setEditBranch(null);
    setOpenModal(false);
  };

  const formik = useFormik({
    initialValues: {
      user_id: formValues.user_id,
      id : formValues.id,
      name: formValues.name,
      address: formValues.address,
      image: [],
    },
    onSubmit: async (values) => {
      console.log("valses",values)
      const formData = new FormData();
      formData.append("user_id", values.user_id);
      formData.append("id", values.id);
      formData.append("name", values.name);
      formData.append("address", values.address);
      values.image.forEach((file) => {
        formData.append(`image`, file);
      });
      try {
        await makeAPIRequest.put(ENDPOINTS.updatebranch, values);
        setMessage({ type: "success", message: message });
        handleClose();
      } catch (error) {
        console.error("Failed to save Unit:", error);
        setMessage({ type: "success", message: "Failed to save Branch" });
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
    formik.setFieldValue("user_id", formValues.user_id)
    formik.setFieldValue("id" , formValues.id)  
    formik.setFieldValue("name", formValues.name)  
    formik.setFieldValue("address", formValues.address)                
  }, [formValues]);

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
        {(isLoading ? Array.from(new Array(10)) : branch.data || []).map(
          (item, i) => (
            <Grid item xs={12} sm={gridnum} key={item?.id ?? `loading-${i}`}>
              {" "}
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
                            src={`${BASE_URL}storage/${file}`}
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
                          src={`${BASE_URL}storage/${item.image}`}
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
                        Industry: {item?.industry ?? "Unknown"}
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

      {pagination && branch && !isLoading && (
        <Pagination
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
          count={branch.total_pages}
          page={page}
          onChange={handleChange}
        />
      )}

      {editBranch && (
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
                  id="user_id"
                  name="user_id"
                  value={formValues.user_id}
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
                  error={formik.touched.user_id && formik.errors.user_id}
                  helperText={
                    formik.touched.user_id && formik.errors.user_id
                      ? formik.errors.user_id
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
{          console.log('this is the branch', branch)}

        </ModalBox>
      )}
    </Box>
  );
}

Branch.propTypes = {
  gridnum: PropTypes.number,
  pagination: PropTypes.bool,
  id:  PropTypes.number,
};

export default Branch;
