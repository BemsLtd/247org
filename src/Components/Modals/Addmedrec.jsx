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

function Addmedrec({ open, handleClose }) {
   const { data: companies, isLoading: companyLoading, error: companyError} = useCompany();
  const [message, setMessage] = useState({ status: "", message: null });
  const [adduser, setAddUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    hospital_id: Yup.number()
      .required("Company ID is required")
      .positive("Company ID must be a positive number"),
    // branch_id: Yup.string().nullable(),
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
      hospital_id: "",
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
    onSubmit: async (values) => {
      setMessage({ type: "", message: null });
      const medicalrecord = {
        hospital_id: values.hospital_id,
        follow_up_date: values.follow_up_date,
        patient_email: values.patient_email,
        diagnosis: values.diagnosis,
        treatment: values.treatment,
        medications: values.medications,
        notes: values.notes,
        record_date: values.record_date,
        discharge_date: values.discharge_date,
      };
      try {
        if (adduser) {
          await addUser(
            values.first_name,
            values.middle_name,
            values.last_name,
            values.patient_email,
            values.phone,
            values.address
          );
        }

        const res = await makeAPIRequest.post(
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
    const user = async () => {
      try {
        setLoading(true);
        const response = await makeAPIRequest.post(ENDPOINTS.verifyUser, {
          email: formik.values.patient_email,
        });
        const { success } = response.data;
        if (success) {
          setMessage({ type: "success", message: "User found" });
          setLoading(false);
          setAddUser(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setMessage({ type: "error", message: error.message });
        setAddUser(true);
      }
    };
    user();
    const IntervalId = setInterval(user(), 5000);

    return () => clearInterval(IntervalId);
  }, [formik.values.patient_email]);

  const addUser = async (
    first_name,
    middle_name,
    last_name,
    email,
    phone,
    address
  ) => {
    await makeAPIRequest
      .post(ENDPOINTS.minireg, {
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        email: email,
        phone: phone,
        address: address,
      })
      .then((res) => {
        const { success, message } = res.data;
        if (success) {
          setMessage({ type: "success", message: message });
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
      <h2>Add New Record</h2>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          {/* hospital_id Select Component */}
          <SelectCom
            id="hospital_id"
            name="hospital_id"
            value={formik.values.hospital_id}
            label="Select Hospital"
            options={
              companyLoading
                ? [{ value: "", text: "Loading companies..." }]
                : companyError ||
                  (companies.companies && companies.companies.length === 0)
                ? [{ value: "", text: "No companies available" }]
                : companies.companies.map((item) => ({
                    value: item.id,
                    text: item.company_name,
                  }))
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.hospital_id && formik.errors.hospital_id}
            helperText={
              formik.touched.hospital_id && formik.errors.hospital_id
                ? formik.errors.hospital_id
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
                type="email"
                error={formik.touched.address && formik.errors.address}
                helperText={
                  formik.touched.address && formik.errors.address
                    ? formik.errors.address
                    : null
                }
                endAdornmentIcon={loading && <CircularProgress size="30px" />}
              />
            </>
          )}

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
