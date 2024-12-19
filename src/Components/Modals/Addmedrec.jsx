import ModalBox from "../Modal";
import { Button, CircularProgress, Stack } from "@mui/material";
import InputCom from "../InputCom";
import PropTypes from "prop-types";
import makeAPIRequest from "../../data";
import { ENDPOINTS } from "../../data/Endpoints";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Notice from "../Notice";
import SelectCom from "../SelectCom";
import useCompany from "../../data/Company";
// import useBranch from "../../data/Branch";
import Textarea from "../Textarea";
import makeAPIRequest2 from "../../data/endpoint2";


function Addmedrec({ open, handleClose }) {
   const { data: companies, isLoading: companyLoading, error: companyError} = useCompany();
  const [message, setMessage] = useState({ status: "", message: null });
  const [adduser, setAddUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    org_id: Yup.number()
      .required("Company ID is required")
      .positive("Company ID must be a positive number"),
    doctorId: Yup.number()
      .required("Doc ID is required")
      .positive("Doc ID must be a positive number"),
    // branch_id: Yup.string().nullable(),
    user_id: Yup.string().nullable(),
    patient_email: Yup.string()
      .email("Must be a valid email")
      .required("Email is required"),
    diagnosis: Yup.string().required("Diagnosis is required"),

    treatment: Yup.string().required("Treatment is required"),
    medications: Yup.string().nullable(),
    notes: Yup.string().nullable(),
    record_date: Yup.date()
      .required("Admission date is required")
      .max(new Date(), "Admission date cannot be in the future"),
    discharge_date: Yup.date().nullable().notRequired(),
    follow_up_date: Yup.date().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      org_id: "",
      user_id: "",
      doctorId: "",
      // branch_id: "",
      patient_email: "",
      address: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phone: "",
      diagnosis: "",
      treatment: "",
      medications: "",
      notes: "",
      record_date: "",
      discharge_date: "",
      follow_up_date: "",
    },
    validationSchema,
    onSubmit: async () => {
      setMessage({ type: "", message: null });
      const medicalrecord = { 
        org_id: formik.values.org_id,
      doctorId: formik.values.doctorId,
      // branch_id: formik.values.branch_id,
      user_id: formik.values.user_id,
      patient_email: formik.values.patient_email,
      diagnosis: formik.values.diagnosis,
      treatment: formik.values.treatment,
      medications: formik.values.medications,
      notes: formik.values.notes,
      record_date: formik.values.record_date,
      discharge_date: formik.values.discharge_date,
      follow_up_date: formik.values.follow_up_date};
      
      try {
       

        const res = await makeAPIRequest2.post(
          ENDPOINTS.addmedical,
          medicalrecord
        );
        const { success, message } = res.data;

        if (success) {
          setMessage({ type: "success", message });
          handleClose();
        } else {
          console.log(message);
          setMessage({ type: "error", message });
        }
      } catch (error) {
        setMessage({ type: "error", message: error.message });
      }
    },
  });

  useEffect(() => {
    if (!formik.values.patient_email) {
      return;
    }
    let timeoutId;
    const user = async () => {
      try {
        setLoading(true);
        const response = await makeAPIRequest.get(`${ENDPOINTS.verifyUser}?email=${formik.values.patient_email}`);
        const { success, data } = response.data;
        
        if (success) {
          setMessage({ type: "success", message: "User found" });
          formik.setFieldValue("user_id", data);
          setAddUser(false);
        } else {
          setMessage({ type: "error", message: "User not found" });
          setAddUser(true);
        }
      } catch (error) {
        setMessage({ type: "error", message: error.message });
        setAddUser(true);
      } finally {
        setLoading(false);
      }
    };
    
    

    timeoutId = setTimeout(user, 500); // Debounce API call
  
    return () => clearTimeout(timeoutId); // Clear debounce timeout
  }, [formik.values.patient_email]);

  

  // const addUser = async (
  //   first_name,
  //   middle_name,
  //   last_name,
  //   email,
  //   phone,
  //   address
  // ) => {
  //   await makeAPIRequest
  //     .post(ENDPOINTS.minireg, {
  //       first_name: first_name,
  //       middle_name: middle_name,
  //       last_name: last_name,
  //       email: email,
  //       phone: phone,
  //       address: address,
  //     })
  //     .then((res) => {
  //       const { success, message } = res.data;
  //       if (success) {
  //         setMessage({ type: "success", message: message });
  //       } else {
  //         setMessage({ type: "error", message: message });
  //       }
  //     });
  // };

  return (
    <ModalBox open={open} handleClose={handleClose}>
      {message.message && (
        <Notice
          message={message.message}
          status={message.type}
          onClose={handleClose}
        />
      )}
      <h2>Add New Record</h2>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          {/* hospital_id Select Component */}
          <SelectCom
            id="org_id"
            name="org_id"
            value={formik.values.org_id}
            label="Select Hospital"
            options={
              companyLoading
                ? [{ value: "", text: "Loading companies..." }]
                : companyError ||
                  (companies.data && companies.data.length === 0)
                ? [{ value: "", text: "No companies available" }]
                : companies.data.map((item) => ({
                    value: item.id,
                    text: item.org_name,
                  }))
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.org_id && formik.errors.org_id}
            helperText={
              formik.touched.org_id && formik.errors.org_id
                ? formik.errors.org_id
                : null
            }
          />
          {/* branch_id Select Component */}
          {/* <SelectCom
            id="branch_id"
            name="branch_id"
            value={formik.values.branch_id}
            label={branchLoading ? "Loading Branches" : "Select Branch"}
            options={
              branchLoading
                ? [{ value: "", text: "Loading branches..." }]
                : branchError
                ? [{ value: "", text: "Error loading branches" }]
                : branch && branch.subBranches.length > 0
                ? branch.subBranches.map((item) => ({
                    value: item.id,
                    text: item.branch_name,
                  }))
                : [{ value: "", text: "No Branches Available" }]
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.branch_id && formik.errors.branch_id}
            helperText={
              formik.touched.branch_id && formik.errors.branch_id
                ? formik.errors.branch_id
                : null
            }
          /> */}
          {/* patient_email Input Component */}
          <InputCom
            id="patient_email"
            name="patient_email"
            label="Paitent Email"
            value={formik.values.patient_email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="email"
            error={formik.touched.patient_email && formik.errors.patient_email}
            helperText={
              formik.touched.patient_email && formik.errors.patient_email
                ? formik.errors.patient_email
                : null
            }
            endAdornmentIcon={loading && <CircularProgress size="30px" />}
          />
          {adduser && (
            <>
              <InputCom
                id="first_name"
                name="first_name"
                label="First Name"
                value={formik.values.first_name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
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
                error={
                  formik.touched.phone && formik.errors.phone ? true : false
                }
                helperText={
                  formik.touched.phone && formik.errors.phone
                    ? formik.errors.phone
                    : null
                }
              />
              <InputCom
                id="address"
                name="address"
                label="Employee Address"
                value={formik.values.address}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                error={formik.touched.address && formik.errors.address}
                helperText={
                  formik.touched.address && formik.errors.address
                    ? formik.errors.address
                    : null
                }
               
              />
            </>
          )}

<InputCom
                id="doctorId"
                name="doctorId"
                label="Doctor Id"
                value={formik.values.doctorId}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                error={formik.touched.doctorId && formik.errors.doctorId}
                helperText={
                  formik.touched.doctorId && formik.errors.doctorId
                    ? formik.errors.doctorId
                    : null
                }
               
              />

          <Textarea
            id="diagnosis"
            name="diagnosis"
            label="Diagnosis"
            value={formik.values.diagnosis}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.diagnosis && formik.errors.diagnosis}
            helperText={
              formik.touched.diagnosis && formik.errors.diagnosis
                ? formik.errors.diagnosis
                : null
            }
            rows={6}
          />

          {/* Treatment Input */}
          <Textarea
            id="treatment"
            name="treatment"
            label="Treatment"
            value={formik.values.treatment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.treatment && formik.errors.treatment}
            helperText={
              formik.touched.treatment && formik.errors.treatment
                ? formik.errors.treatment
                : null
            }
            rows={6}
          />

          {/* Prescribed Medications Input */}
          <Textarea
            id="medications"
            name="medications"
            label="Prescribed Medications"
            value={formik.values.medications}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.medications &&
              formik.errors.medications
            }
            helperText={
              formik.touched.medications &&
              formik.errors.medications
                ? formik.errors.medications
                : null
            }
            rows={6}
          />
          {/* Doctor Notes Input */}
          <Textarea
            id="notes"
            name="notes"
            label="Doctors Note"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.notes && formik.errors.notes}
            helperText={
              formik.touched.notes && formik.errors.notes
                ? formik.errors.notes
                : null
            }
            rows={6}
          />

          {/* Admission Date Input */}
          <InputCom
            id="record_date"
            name="record_date"
            label="Date"
            value={formik.values.record_date}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="date"
            error={
              formik.touched.record_date && formik.errors.record_date
            }
            helperText={
              formik.touched.record_date && formik.errors.record_date
                ? formik.errors.record_date
                : null
            }
          />
          {/* Discharge Date Input */}
          <InputCom
            id="discharge_date"
            name="discharge_date"
            label="Discharge Date"
            value={formik.values.discharge_date || ""}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="date"
            error={
              formik.touched.discharge_date && formik.errors.discharge_date
            }
            helperText={
              formik.touched.discharge_date && formik.errors.discharge_date
                ? formik.errors.discharge_date
                : null
            }
          />
          {/* Follow-Up Date Input */}
          <InputCom
            id="follow_up_date"
            name="follow_up_date"
            label="Follow-Up Date"
            value={formik.values.follow_up_date || ""}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="date"
            error={
              formik.touched.follow_up_date && formik.errors.follow_up_date
            }
            helperText={
              formik.touched.follow_up_date && formik.errors.follow_up_date
                ? formik.errors.follow_up_date
                : null
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add record"
            )}
          </Button>
        </Stack>
      </form>
    </ModalBox>
  );
}

export default Addmedrec;

Addmedrec.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
