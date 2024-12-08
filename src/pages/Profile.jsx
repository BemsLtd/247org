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
import Employment from "../Components/Profiles/Employment";

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
    org_name: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    org_phone: Yup.string().required("Required"),
    address: Yup.string().required("Address is required"),
    cac: Yup.number().required('Cac number is required')
  });
  
function Profile() {
  const user = useSelector((state) => state.userDetails.user);
  const [edit, setEdit] =useState(false)
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState({ type: "", message: null });
  // const [vehicles, setVehicles] = useState(user.vehicle);
  // const [phones, setPhones] = useState(user.phone_gadget);


   const formik = useFormik({
     initialValues: {
       org_name: user.user.org_name || "",
       org_phone: user.user.org_phone || "",
       org_email: user.user.org_email || "",
       address: user.address || "",
       cac : user.cac
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
            <Tab label="Company Id" {...a11yProps(1)} />
            {/* <Tab label="Vehicle" {...a11yProps(2)} />
            <Tab label="Phone IMEL" {...a11yProps(3)} />
            <Tab label="Medicals" {...a11yProps(4)} /> */}
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
                        id="org_name"
                        label="Organisation Name"
                        value={formik.values.org_name}
                        type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.org_name && formik.errors.org_name
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.org_name && formik.errors.org_name
                            ? formik.errors.org_name
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="org_phone"
                        label="Organisation phone"
                        type="text"
                        value={formik.values.org_phone}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.org_phone && formik.errors.org_phone
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.org_phone && formik.errors.org_phone
                            ? formik.errors.org_phone
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="email"
                        label="Email"
                        type="email"
                        value={formik.values.org_email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.org_email && formik.errors.org_email
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.org_email && formik.errors.org_email
                            ? formik.errors.org_email
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


                    {/* Plate Number */}
                    <Grid item xs={12} sm={6} md={4}>
                      <InputCom
                        id="cac"
                        label="CAC"
                        value={formik.values.cac}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.cac &&
                          formik.errors.cac
                            ? true
                            : false
                        }
                        helperText={
                          formik.touched.cac &&
                          formik.errors.cac
                            ? formik.errors.cac
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
                <Typography variant="p">Organinsation Name:</Typography>
                <Typography variant="p">{user.user.org_name}</Typography>
              </Box>
              <Box display={"flex"} gap={1} p={2}>
                <Typography variant="p">Email Address:</Typography>
                <Typography variant="p">{user.user.org_email}</Typography>
              </Box>
              <Box display={"flex"} gap={1} p={2}>
                <Typography variant="p">Phone:</Typography>
                <Typography variant="p">{user.user.org_phone}</Typography>
              </Box>
              <Box display={"flex"} gap={1} p={2}>
                <Typography variant="p">Address:</Typography>
                <Typography variant="p">{user.address}</Typography>
              </Box>
              <Box display={"flex"} gap={1} p={2}>
                <Typography variant="p">CAC:</Typography>
                <Typography variant="p">{user.cac}</Typography>
              </Box>
              <Box display={"flex"} gap={1} p={2}>
                <Typography variant="p">Industry:</Typography>
                <Typography variant="p">{user.user.industry}</Typography>
              </Box>
            </Box>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Employment user={user.user} />
        </CustomTabPanel>
        {/* <CustomTabPanel value={value} index={2}>
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
        </CustomTabPanel> */}
      </Box>
      <Footer />
    </Container>
  );
}

export default Profile;
