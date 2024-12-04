import ModalBox from "../Modal";
import { Button, CircularProgress, Stack } from "@mui/material";
import InputCom from "../InputCom";
import PropTypes from "prop-types";
import makeAPIRequest from "../../data";
import { ENDPOINTS } from "../../data/Endpoints";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Notice from "../Notice"
import SelectCom from "../SelectCom";
import useCompany from "../../data/Company";
import useBranch from "../../data/Branch";

function AddMedicals({ open, handleClose }) {
  const { data: companies, isLoading: companyLoading, error: companyError} = useCompany();
  const [message, setMessage] = useState({ status: "", message: null });
  
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
      company_id: Yup.number().required("Company ID is required").positive("Company ID must be a positive number"),
      branch_id: Yup.string().nullable(), 
      employee_email: Yup.string().email("Must be a valid email").required("Email is required"),
      medical_history: Yup.string().required("Medical history is required"),
      medication: Yup.string().required("Medication information is required"),
      appointment_date: Yup.date().required("Appointment date is required").min(new Date(), "Appointment date cannot be in the past"),
  });

  const formik = useFormik({
    initialValues: {
      company_id: "",
      branch_id: "",
      employee_email: "",
      medical_history: "",
      medication: "",
      appointment_date: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setMessage({ type: "", message: null });
      const medicalInfo = {
        company_id: values.company_id,
        branch_id: values.branch_id,
        employee_email: values.employee_email,
        medical_history: values.medical_history,
        medication: values.medication,
        appointment_date: values.appointment_date,
      };
      try {
        const res = await makeAPIRequest.post(ENDPOINTS.addmedical, medicalInfo);
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
    if (!formik.values.employee_email) {
      return;
    }
    const user = async () => {
      try {
        setLoading(true);
        const response = await makeAPIRequest.post(ENDPOINTS.verifyUser, {
          email: formik.values.employee_email,
        });
        const { success } = response.data;
        if (success) {
          setMessage({ type: "success", message: "User found" });
          setLoading(false);
          // setAddUser(false);
        } else {
          setLoading(false);
          // setAddUser(true);
        }
      } catch (error) {
        setLoading(false);
        setMessage({ type: "error", message: error.message });
      }
    };
    user();
    const IntervalId = setInterval(user(), 5000);

    return () => clearInterval(IntervalId);
  }, [formik.values.employee_email]);

  const { data: branch, isLoading: branchLoading, error: branchError} = useBranch({company_id: formik.values.company_id});

  return (
    <ModalBox open={open} handleClose={handleClose}>
      {message.message && (
        <Notice
          message={message.message}
          status={message.type}
          onClose={handleClose}
        />
      )}
      <h2>Add New Medical Information</h2>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          {/* company_id Select Component */}
          <SelectCom
            id="company_id"
            name="company_id"
            value={formik.values.company_id}
            label="Select Company"
            options={
              companyLoading
                ? [{ value: "", text: "Loading companies..." }]
                : companyError ||
                  (companies.companies && companies.companies.length === 0)
                ? [{ value: "", text: "No companies available" }]
                : companies.companies.map((item) => ({
                    value: String(item.id),
                    text: item.company_name,
                  }))
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.company_id && formik.errors.company_id}
            helperText={
              formik.touched.company_id && formik.errors.company_id
                ? formik.errors.company_id
                : null
            }
          />
          {/* branch_id Select Component */}
          <SelectCom
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
          />
          {/* employee_email Input Component */}
          <InputCom
            id="employee_email"
            name="employee_email"
            label="Employee Email"
            value={formik.values.employee_email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="email"
            error={
              formik.touched.employee_email && formik.errors.employee_email
            }
            helperText={
              formik.touched.employee_email && formik.errors.employee_email
                ? formik.errors.employee_email
                : null
            }
            endAdornmentIcon={loading && <CircularProgress size="30px" />}
          />
          {/* medical_history Input Component */}
          <InputCom
            id="medical_history"
            name="medical_history"
            label="Medical History"
            value={formik.values.medical_history}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.medical_history && formik.errors.medical_history}
            helperText={
              formik.touched.medical_history && formik.errors.medical_history
                ? formik.errors.medical_history
                : null
            }
          />
          {/* medication Input Component */}
          <InputCom
            id="medication"
            name="medication"
            label="Medication"
            value={formik.values.medication}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.medication && formik.errors.medication}
            helperText={
              formik.touched.medication && formik.errors.medication
                ? formik.errors.medication
                : null
            }
          />
          {/* appointment_date Date Input Component */}
          <InputCom
            id="appointment_date"
            name="appointment_date"
            label="Appointment Date"
            value={formik.values.appointment_date}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="date"
            error={formik.touched.appointment_date && formik.errors.appointment_date}
            helperText={
              formik.touched.appointment_date && formik.errors.appointment_date
                ? formik.errors.appointment_date
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
              "Add Medical Information"
            )}
          </Button>
        </Stack>
      </form>
    </ModalBox>
  );
}

export default AddMedicals;

AddMedicals.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};