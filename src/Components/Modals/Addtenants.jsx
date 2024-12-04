import { useEffect, useState } from "react";
import ModalBox from "../Modal";
import Notice from "../Notice";
import PropTypes from "prop-types";
import InputCom from "../InputCom";
import { useFormik } from "formik";
import * as Yup from "yup";
import makeAPIRequest from "../../data";
import { ENDPOINTS } from "../../data/Endpoints";
import SelectCom from "../SelectCom";
import { Button, CircularProgress, Stack } from "@mui/material";
import useProperties from "../../data/Properties";
import useUnits from "../../data/Units";


export default function Addtenants({ open, handleClose }) {
  const [message, setMessage] = useState({ status: null, message: null });
  const { data: properties, isLoading, error } = useProperties();
  const [loading, setLoading] = useState(false);
  // const [property, setProperty] = useState(3)

  if (error) console.log(error);

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
    // gender: Yup.string()
    //   .oneOf(["male", "female", "other"], "Invalid gender")
    //   .required("Gender is required"),
    // nin: Yup.string()
    //   .matches(/^[A-Z0-9]+$/, "NIN is not valid")
    //   .required("NIN is required"),
    start_date: Yup.date().required("Start date is required").nullable(),
    end_date: Yup.date()
      .required("End date is required")
      .nullable()
      .min(Yup.ref("start_date"), "End date must be later than start date"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      property_unit_id: "",
      property_id: "",
      middle_name: "",
      phone: "",
      user_id: "",
      email: "",
      // gender: "",
      // nin: "",
      start_date: "",
      end_date: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setMessage({ type: "", message: null });

      const formRequest= {
        first_name: values.first_name,
        middle_name:values.middle_name,
        last_name:values.last_name,
        email:values.email,
        phone:values.phone
      }
      if(values.user_id){
        addTenant(
          values.user_id,
          values.property_unit_id,
          values.start_date,
          values.end_date
        );
      }else{
        await makeAPIRequest
        .post(ENDPOINTS.registertenat, formRequest)
        .then((res) => {
          const { success, message , data} = res.data;
          if (success) {
            addTenant(
              data.id,
              values.property_unit_id,
              values.start_date,
              values.end_date
            );
            setMessage({ type: "success", message: message });
          } else {
            setMessage({ type: "error", message: message });
          }
        });
      }
      
    },
  });
  const {
    data: Units,
    isLoading: unitLoading,
    error: unitError,
  } = useUnits({ property_id: formik.values.property_id || 0 });
  if (unitError) console.log(unitError);

  useEffect(() => {
    if (!formik.values.email) {
      return;
    }
    const user = async () => {
      try {
        setLoading(true);
        const response = await makeAPIRequest.post(ENDPOINTS.verifyUser, {
          email: formik.values.email,
        });
        const { success, data } = response.data;
        if (success) {
          setMessage({ type: "success", message: "User found" });
          formik.setFieldValue("user_id", data.id || "");
          formik.setFieldValue("first_name", data.first_name || "");
          formik.setFieldValue("last_name", data.last_name || "");
          formik.setFieldValue("middle_name", data.middle_name || "");
          formik.setFieldValue("phone", data.phone || "");
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
         setMessage({ type: "error", message: error.response.data.message });
        }
    };
    user();
    const IntervalId = setInterval(user(), 5000);

    return () => clearInterval(IntervalId);
  }, [formik.values.email]);

  const addTenant = async (user_id, property_unit_id, start_date, end_date) => {
    await makeAPIRequest
      .post(ENDPOINTS.addtenantunit, {
        user_id: user_id,
        property_unit_id: property_unit_id,
        start_date: start_date,
        end_date: end_date,
      })
      .then((res) => {
        const { success, message } = res.data;
        if (success) {
          setMessage({ type: "success", message: message });
          handleClose();
        } else {
          setMessage({ type: "error", message: message });
        }
      });
  };

  return (
    <ModalBox open={open} handleClose={handleClose}>
      {message.message && (
        <Notice
          message={message.message}
          status={message.type}
          onClose={handleClose}
        />
      )}
      <h2>Add New Tenant</h2>
      <Stack spacing={2}>
        <SelectCom
          id="property_id"
          name="property_id"
          label={isLoading ? "Loading.." : "Select property"}
          options={
            properties && properties?.data.length > 0
              ? properties.data.map((property) => ({
                  value: property.id,
                  text: property.name,
                }))
              : [{ value: "", text: "No property found" }]
          }
          value={formik.values.property_id}
          onBlur={formik.handleBlur}
          onChange={(e) => {
            formik.handleChange(e),
              formik.setFieldValue("property_unit_id", "");
            // setProperty(e)
          }}
          error={formik.touched.type && formik.errors.type ? true : false}
          helperText={
            formik.touched.type && formik.errors.type
              ? formik.errors.type
              : null
          }
        />
        <SelectCom
          id="property_unit_id"
          name="property_unit_id"
          label={unitLoading ? "Loading" : "Select Unit"}
          options={
            Units && Units.property_units.length > 0
              ? Units.property_units.map((unit) => ({
                  value: unit.id,
                  text: unit.unit_number,
                }))
              : [{ value: "", text: "No Units Available" }]
          }
          value={formik.values.property_unit_id}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={
            formik.touched.property_unit_id && formik.errors.property_unit_id
          }
          helperText={
            formik.touched.property_unit_id && formik.errors.property_unit_id
              ? formik.errors.property_unit_id
              : null
          }
          disabled={!formik.values.property_id} // Disable if no property is selected
        />
        {/* Email */}
        <InputCom
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          error={formik.touched.email && formik.errors.email ? true : false}
          helperText={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : null
          }
          endAdornmentIcon={loading && <CircularProgress size="30px" />}
        />
        <InputCom
          id="first_name"
          name="first_name"
          label="First Name"
          value={formik.values.first_name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.first_name && formik.errors.first_name ? true : false
          }
          helperText={
            formik.touched.first_name && formik.errors.first_name
              ? formik.errors.first_name
              : null
          }
        />

        {/* Last Name */}
        <InputCom
          id="last_name"
          name="last_name"
          label="Last Name"
          value={formik.values.last_name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.last_name && formik.errors.last_name ? true : false
          }
          helperText={
            formik.touched.last_name && formik.errors.last_name
              ? formik.errors.last_name
              : null
          }
        />

        {/* Middle Name */}
        <InputCom
          id="middle_name"
          name="middle_name"
          label="Middle Name"
          value={formik.values.middle_name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={
            formik.touched.middle_name && formik.errors.middle_name
              ? true
              : false
          }
          helperText={
            formik.touched.middle_name && formik.errors.middle_name
              ? formik.errors.middle_name
              : null
          }
        />

        {/* Phone */}
        <InputCom
          id="phone"
          name="phone"
          label="Phone Number"
          value={formik.values.phone}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="tel"
          error={formik.touched.phone && formik.errors.phone ? true : false}
          helperText={
            formik.touched.phone && formik.errors.phone
              ? formik.errors.phone
              : null
          }
        />

        {/* Date of Birth */}
        {/* <InputCom
          id="dob"
          name="dob"
          label="Date of Birth"
          value={formik.values.dob}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="date"
          error={formik.touched.dob && formik.errors.dob ? true : false}
          helperText={
            formik.touched.dob && formik.errors.dob ? formik.errors.dob : null
          }
        /> */}

        {/* Gender */}
        {/* <SelectCom
          id="gender"
          name="gender"
          label="Gender"
          value={formik.values.gender}
          options={[
            { value: "male", text: "male" },
            { value: "female", text: "female" },
          ]}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={formik.touched.gender && formik.errors.gender ? true : false}
          helperText={
            formik.touched.gender && formik.errors.gender
              ? formik.errors.gender
              : null
          }
        /> */}

        {/* NIN */}
        {/* <InputCom
          id="nin"
          name="nin"
          label="National Identification Number (NIN)"
          value={formik.values.nin}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          error={formik.touched.nin && formik.errors.nin ? true : false}
          helperText={
            formik.touched.nin && formik.errors.nin ? formik.errors.nin : null
          }
        /> */}
        <InputCom
          id="start_date"
          name="start_date"
          label="Checkin date"
          value={formik.values.start_date}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="date"
          error={formik.touched.start_date && formik.errors.start_date ? true : false}
          helperText={
            formik.touched.start_date && formik.errors.start_date ? formik.errors.start_date : null
          }
        />
        <InputCom
          id="end_date"
          name="end_date"
          label="Expires At"
          value={formik.values.end_date}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="date"
          error={formik.touched.end_date && formik.errors.end_date ? true : false}
          helperText={
            formik.touched.end_date && formik.errors.end_date ? formik.errors.end_date : null
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save Tenant"
          )}
        </Button>
      </Stack>
    </ModalBox>
  );
}
Addtenants.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
