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
  const { data: branch, isLoading, error } = useBranch({company_id: id});
  const { data: companies, isLoading: companyLoading, error: companyError} = useCompany();

  const [openModal, setOpenModal] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [formValues, setFormValues] = useState({
    image: "",
    company_id: "",
    branch_id:"",
    branch_name: "",
    branch_address: "",
  });

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = (Branch) => {
    console.log("h",Branch)
    setEditBranch(Branch);
    setFormValues({
      branch_id: Branch.branch_id,
      company_id: Branch.company_id,
      branch_name: Branch.branch_name,
      branch_address: Branch.branch_address,
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setEditBranch(null);
    setOpenModal(false);
  };

  const formik = useFormik({
    initialValues: {
      company_id: formValues.company_id,
      branch_id : formValues.branch_id,
      branch_name: formValues.branch_name,
      branch_address: formValues.branch_address,
      image: [],
    },
    onSubmit: async (values) => {
      console.log("valses",values)
      const formData = new FormData();
      formData.append("company_id", values.company_id);
      formData.append("branch_id", values.branch_id);
      formData.append("branch_name", values.branch_name);
      formData.append("branch_address", values.branch_address);
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
    formik.setFieldValue("company_id", formValues.company_id)
    formik.setFieldValue("branch_id" , formValues.branch_id)  
    formik.setFieldValue("branch_name", formValues.branch_name)  
    formik.setFieldValue("branch_address", formValues.branch_address)                
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
        {(isLoading ? Array.from(new Array(10)) : branch.subBranches || []).map(
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
                        {item?.branch_name?.length > 30
                          ? `${item.branch_name.substr(0, 25)}...`
                          : item?.branch_name ?? "247 Building"}
                      </Typography>
                      <Typography variant="body2" color="text.error">
                        Address: {item?.branch_address ?? "Unknown"}
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
                  id="company_id"
                  name="company_id"
                  value={formValues.company_id}
                  label="Select Company"
                  options={
                    companyLoading
                      ? [{ value: "", text: "Loading companies..." }]
                      : companyError ||
                        (companies.companies &&
                          companies.companies.length === 0)
                      ? [{ value: "", text: "No companies available" }]
                      : companies.companies.map((item) => ({
                          value: String(item.id),
                          text: item.company_name,
                        }))
                  }
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      company_name: e.target.value,
                    })
                  }
                  error={formik.touched.company_id && formik.errors.company_id}
                  helperText={
                    formik.touched.company_id && formik.errors.company_id
                      ? formik.errors.company_id
                      : null
                  }
                />
                <InputCom
                  id="branch_name"
                  label="branch Name"
                  type="text"
                  value={formValues.branch_name}
                  onChange={(e) => setFormValues({
                      ...formValues,
                      branch_name: e.target.value,
                    })
                  }
                />

                <InputCom
                  id="branch_address"
                  label="branch Address"
                  type="text"
                  value={formValues.branch_address}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      branch_address: e.target.value,
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

Branch.propTypes = {
  gridnum: PropTypes.number,
  pagination: PropTypes.bool,
  id:  PropTypes.number,
};

export default Branch;
