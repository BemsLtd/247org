import { Edit,  EditNote } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  Stack,
  Tab,
  Tabs,
  Typography,
  styled,
} from "@mui/material";
import { Link as Linker } from "react-router-dom";
import InputCom from "../Components/InputCom";
import Footer from "../Components/Footer";
import { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import makeAPIRequest from "../data";
import { ENDPOINTS } from "../data/Endpoints";
 import * as Yup from "yup";
import Notice from "../Components/Notice";
import SelectCom from "../Components/SelectCom";
// import Vehicle from "../Components/Profiles/Vehicle";
import Employment from "../Components/Profiles/Employment";
import Medical from "../Components/Profiles/Medical";
import VehicleForm from "../Components/Profiles/Vehicle";
import PhoneForm from "../Components/Profiles/Phone"

const ProfileBox = styled(Box)({
  minHeight: "300px",
  backgroundColor: "green",
  position: "relative",
  borderRadius: "10px",
  backgroundImage: `url("https://images.unsplash.com/photo-1725203574074-a33eae85ba71?q=80&w=1412&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
  backgroundSize: "cover",
  backgroundPosition: "center",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "10px",
    zIndex: 1,
  },
});

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

  const validationSchema = Yup.object({
    first_name: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Required"),
    middle_name: Yup.string(),
    last_name: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    phone: Yup.string().required("Required"),
    address: Yup.string().required("Address is required"),

    gender: Yup.string()
      .oneOf(["male", "female", "other"], "Invalid gender")
      .required("Gender is required"),

    nin: Yup.string()
      .matches(/^[A-Z0-9]+$/, "NIN is not valid")
      .required("NIN is required"),

    plate_number: Yup.string().nullable(), 

    kin_firstname: Yup.string().required("Kin first name is required"),

    kin_middlename: Yup.string().nullable(), 

    kin_lastname: Yup.string().required("Kin last name is required"),

    kin_phone: Yup.string()
      .matches(/^[0-9]+$/, "Kin phone number is not valid")
      .required("Kin phone number is required"),

    kin_email: Yup.string()
      .email("Invalid kin email address")
      .required("Kin email is required"),
  });
  
function Profile() {
  const user = useSelector((state) => state.userDetails.user);
  const [edit, setEdit] =useState(false)
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState({ type: "", message: null });
  const [vehicles, setVehicles] = useState(user.vehicle);
  const [phones, setPhones] = useState(user.phone_gadget);


   const formik = useFormik({
     initialValues: {
       first_name: user.first_name || "",
       last_name: user.last_name || "",
       middle_name: user.middle_name || "",
       phone: user.phone || "",
       email: user.email || "",
       dob: user.dob || "",
       address: user.address || "",
       gender: user.gender || "",
       nin: user.nin || "",
       plate_number: user.plate_number || "",
       kin_firstname: user.kin_firstname || "",
       kin_middlename: user.kin_middlename || "",
       kin_lastname: user.kin_lastname || "",
       kin_phone: user.kin_phone || "",
       kin_email: user.kin_email || "",
     },
     validationSchema,
     onSubmit: async (values) => {
       setMessage({ type: "", message: null });
       await makeAPIRequest
         .post(ENDPOINTS.updateprofile, values)
         .then((res) => {
           const { success, message } = res.data;
           if (success) {
             setMessage({ type: "success", message: message });
           } else {
             setMessage({ type: "error", message: message });
           }
         });
     },
   });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography variant="body1">Profile</Typography>

      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={Linker}
          to="/"
          sx={{ textDecoration: "none" }}
        >
          Dashboard
        </Link>
        <Typography sx={{ color: "text.primary" }}>Profile</Typography>
      </Breadcrumbs>

      <ProfileBox>
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={
            <Edit
              sx={{
                border: `2px solid white`,
                borderRadius: 50,
                backgroundColor: "white",
                color: "black",
                pointer: "cursor",
                zIndex: 6,
              }}
              onClick={() => alert("clicked")}
            />
          }
          sx={{
            position: "absolute",
            bottom: "-50px",
            left: "20px",
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            sx={{
              width: "100px",
              height: "100px",
              border: "3px solid white",
              zIndex: 2,
            }}
          />
        </Badge>
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "-50px", sm: "-50px" },
            left: "130px",
          }}
        >
          <Typography
            fontWeight={"bold"}
            sx={{
              fontWeight: "bold",
              fontSize: {
                xs: "14px",
                sm: "16px",
              },
            }}
          >
            {user.first_name} {user.last_name}
          </Typography>
          <Typography
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
              },
            }}
          >
            {user.email}
          </Typography>
        </Box>
      </ProfileBox>

      <Box
        // bgcolor={grey[300]}
        minHeight={"100vh"}
        marginTop={10}
        marginBottom={9}
      >
        {message.message && (
          <>
            <Notice message={message.message} status={message.type} />
          </>
        )}

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile={true}
            aria-label="basic tabs example"
          >
            <Tab label="Biography" {...a11yProps(0)} />
            <Tab label="Employment" {...a11yProps(1)} />
            <Tab label="Vehicle" {...a11yProps(2)} />
            <Tab label="Phone IMEL" {...a11yProps(3)} />
            <Tab label="Medicals" {...a11yProps(4)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            marginTop={2}
          >
            <Box>
              <Typography variant="body3">
                <b>Profile Details</b>
              </Typography>
              <br />
              {edit && (
                <Typography variant="body2">
                  Update your profile details here
                </Typography>
              )}
            </Box>
            <Box>
              {edit ? (
                <Box flex justifyContent={"center"} alignItems={"center"}>
                  <Button
                    variant="contained"
                    sx={{
                      marginRight: "10px",
                      marginBottom: { xs: "10px", sm: "0px" },
                    }}
                    color="error"
                    onClick={() => setEdit(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={formik.handleSubmit}
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Box>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<EditNote />}
                    color="success"
                    onClick={() => setEdit(true)}
                  >
                    Edit
                  </Button>
                </>
              )}
            </Box>
          </Stack>
          {edit && (
            <Box marginTop={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="first_name"
                        label="First Name"
                        value={formik.values.first_name}
                        type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.first_name && formik.errors.first_name
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.first_name && formik.errors.first_name
                            ? formik.errors.first_name
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="middle_name"
                        label="Middle Name"
                        value={formik.values.middle_name}
                        type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.middle_name &&
                          formik.errors.middle_name
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.middle_name &&
                          formik.errors.middle_name
                            ? formik.errors.middle_name
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="last_name"
                        label="Last Name"
                        value={formik.values.last_name}
                        type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.last_name && formik.errors.last_name
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.last_name && formik.errors.last_name
                            ? formik.errors.last_name
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="phone"
                        label="phone"
                        type="text"
                        value={formik.values.phone}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.phone && formik.errors.phone
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.phone && formik.errors.phone
                            ? formik.errors.phone
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="email"
                        label="Email"
                        type="email"
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.email && formik.errors.email
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.email && formik.errors.email
                            ? formik.errors.email
                            : null
                        }
                      />
                    </Grid>
                    {/* Date of Birth */}
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="dob"
                        label="Date of Birth"
                        type="date"
                        value={formik.values.dob}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.dob && formik.errors.dob ? true : false
                        }
                        helperText={
                          formik.touched.dob && formik.errors.dob
                            ? formik.errors.dob
                            : null
                        }
                      />
                    </Grid>

                    {/* Address */}
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="address"
                        label="Address"
                        value={formik.values.address}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.address && formik.errors.address
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.address && formik.errors.address
                            ? formik.errors.address
                            : null
                        }
                      />
                    </Grid>

                    {/* Gender */}
                    <Grid item xs={12} sm={6} md={4}>
                      <SelectCom
                        id="gender"
                        name="gender"
                        value={formik.values.gender}
                        label="Gender"
                        options={[
                          { value: "male", text: "Male" },
                          { value: "female", text: "Female" },
                        ]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.gender && formik.errors.gender
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.gender && formik.errors.gender
                            ? formik.errors.gender
                            : null
                        }
                      />
                    </Grid>

                    {/* National Identification Number (NIN) */}
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="nin"
                        label="National ID (NIN)"
                        value={formik.values.nin}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.nin && formik.errors.nin ? true : false
                        }
                        helperText={
                          formik.touched.nin && formik.errors.nin
                            ? formik.errors.nin
                            : null
                        }
                      />
                    </Grid>

                    {/* Plate Number */}
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="plate_number"
                        label="Plate Number"
                        value={formik.values.plate_number}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.plate_number &&
                          formik.errors.plate_number
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.plate_number &&
                          formik.errors.plate_number
                            ? formik.errors.plate_number
                            : null
                        }
                      />
                    </Grid>

                    {/* Kin First Name */}
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="kin_firstname"
                        label="Kin First Name"
                        value={formik.values.kin_firstname}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.kin_firstname &&
                          formik.errors.kin_firstname
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.kin_firstname &&
                          formik.errors.kin_firstname
                            ? formik.errors.kin_firstname
                            : null
                        }
                      />
                    </Grid>

                    {/* Kin Middle Name */}
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="kin_middlename"
                        label="Kin Middle Name"
                        value={formik.values.kin_middlename}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.kin_middlename &&
                          formik.errors.kin_middlename
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.kin_middlename &&
                          formik.errors.kin_middlename
                            ? formik.errors.kin_middlename
                            : null
                        }
                      />
                    </Grid>

                    {/* Kin Last Name */}
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="kin_lastname"
                        label="Kin Last Name"
                        value={formik.values.kin_lastname}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.kin_lastname &&
                          formik.errors.kin_lastname
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.kin_lastname &&
                          formik.errors.kin_lastname
                            ? formik.errors.kin_lastname
                            : null
                        }
                      />
                    </Grid>

                    {/* Kin Phone */}
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="kin_phone"
                        label="Kin Phone"
                        value={formik.values.kin_phone}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.kin_phone && formik.errors.kin_phone
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.kin_phone && formik.errors.kin_phone
                            ? formik.errors.kin_phone
                            : null
                        }
                      />
                    </Grid>

                    {/* Kin Email */}
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="kin_email"
                        label="Kin Email"
                        type="email"
                        value={formik.values.kin_email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.kin_email && formik.errors.kin_email
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.kin_email && formik.errors.kin_email
                            ? formik.errors.kin_email
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Box>
          )}
          {!edit && (
            <Box
              marginTop={2}
              boxShadow={3}
              borderRadius={2}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "black" : "grey.200", // Dynamic background based on mode
              }}
            >
              <Box display={"flex"} gap={1} p={2}>
                <Typography variant="p">Fullname:</Typography>
                <Typography variant="p">
                  {user.first_name} {user.middle_name} {user.last_name}
                </Typography>
              </Box>
              <Box display={"flex"} gap={1} p={2}>
                <Typography variant="p">Email Address:</Typography>
                <Typography variant="p">{user.email}</Typography>
              </Box>
              <Box display={"flex"} gap={1} p={2}>
                <Typography variant="p">Phone:</Typography>
                <Typography variant="p">{user.phone}</Typography>
              </Box>
              <Box display={"flex"} gap={1} p={2}>
                <Typography variant="p">Fullname:</Typography>
                <Typography variant="p">Innocent Ebubechukwu</Typography>
              </Box>
            </Box>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Employment user={user.employment} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <VehicleForm
            user={user}
            vehicles={vehicles}
            setVehicles={setVehicles}
            setMessage={setMessage}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <PhoneForm
            user={user}
            phones={phones}
            setPhones={setPhones}
            setMessage={setMessage}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <Medical
            user={user}
            edit={edit}
            setEdit={setEdit}
            setMessage={setMessage}
          />
        </CustomTabPanel>
      </Box>
      <Footer />
    </Container>
  );
}

export default Profile;
