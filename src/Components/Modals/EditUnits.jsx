import ModalBox from "../Modal";
import InputCom from "../InputCom";
import PropTypes from "prop-types";
import { Button, CircularProgress, Skeleton, Stack } from "@mui/material";
import makeAPIRequest from "../../data";
import { useFormik } from "formik";
import * as yup from "yup";
import { ENDPOINTS } from "../../data/Endpoints";
import { useState } from "react";
import Notice from "../Notice";
import SelectCom from "../SelectCom";
import { format } from "date-fns";
import useStaff from "../../data/Staff";
// import useBranch from "../../data/Branch";
// import useCompany from "../../data/Company";

function Editunits({ open, handleClose, id }) {
  const { data: staff, isLoading, error } = useStaff(id);
  // const { data: companies, isLoading: companyLoading, error: companyError} = useCompany();
  const [message, setMessage] = useState({ status: null, message: null });

  error ? setMessage({status:"error", message:error}):""

  const validationSchema = yup.object({
    company_id: yup.number().required("Company ID is required").positive("Company ID must be a positive number"),
    branch_id: yup.string().required("Branch ID is required"), 
    employee_email: yup.string().email("Must be a valid email").required("Email is required"),
    job_role: yup.string().required("Job role is required"),
    job_description: yup.string().required("Job description is required"),
    resume_date: yup.date().required("Resume date is required").max(new Date(), "Resume date cannot be in the future"),
    stopping_date: yup.string().nullable().notRequired(),
    work_type: yup.string().oneOf(
        ["on-site", "remote", "hybrid"],
        "Work type must be either on-site, remote, or hybrid"
      ).required("Work type is required"),
    employment_type: yup.string()
      .oneOf(
        ["fulltime", "parttime", "contract"],
        "Employment type must be full-time, part-time, or contract"
      )
      .required("Employment type is required"),
    is_staff: yup.boolean().oneOf([true, false], "Is staff must be a boolean value").required("Is staff is required"),
  });

  // const response = await makeAPIRequest.post(ENDPOINTS.addproperty, values)
  const formik = useFormik({
    initialValues: {
      company_id: staff?.employee.company_id || "",
      branch_id: staff?.employee.branch_id || "",
      employee_email: staff?.employee.employee_email || "",
      job_role: staff?.employee.job_role || "",
      job_description: staff?.employee.job_description || "",
      work_type: staff?.employee.work_type || "on-site",
      employment_type: staff?.employee.employment_type || "fulltime",
      resume_date: staff?.employee?.resume_date 
                      ? format(new Date(staff.employee.resume_date), "yyyy-MM-dd") 
                      : "",
    stopping_date : staff?.employee?.stopping_date 
                      ? format(new Date(staff.employee.stopping_date), "yyyy-MM-dd") 
                      : "",
      is_staff: staff?.employee.is_staff || "1",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setMessage({ type: "", message: null });
      await makeAPIRequest.put(ENDPOINTS.updateemployee, values).then((res) => {
        const { success, message } = res.data;
        if (success) {
          setMessage({ type: "success", message: message });
        } else {
          setMessage({ type: "error", message: message });
        }
      });
    },
  });
  
  // const { data: branch, isLoading: branchLoading, error: branchError} = useBranch({company_id: formik.values.company_id});
  

  return (
    <ModalBox open={open} handleClose={handleClose}>
      {message.message && (
        <Notice message={message.message} onClose={handleClose} />
      )}
      <h2>Edit Staff</h2>
      <Stack spacing={2}>
        {isLoading && <Skeleton variant="rectangular" />}
        {!isLoading && (
          <>
            {/* <SelectCom
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
            /> */}
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
            />
            {/* job_role Input Component */}
            <InputCom
              id="job_role"
              name="job_role"
              label="Job Role"
              value={formik.values.job_role}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              error={formik.touched.job_role && formik.errors.job_role}
              helperText={
                formik.touched.job_role && formik.errors.job_role
                  ? formik.errors.job_role
                  : null
              }
            />
            {/* job_description Input Component */}
            <InputCom
              id="job_description"
              name="job_description"
              label="Job Description"
              value={formik.values.job_description}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              error={
                formik.touched.job_description && formik.errors.job_description
              }
              helperText={
                formik.touched.job_description && formik.errors.job_description
                  ? formik.errors.job_description
                  : null
              }
            />
            {/* resume_date Date Input Component */}

            <InputCom
              id="resume_date"
              name="resume_date"
              label="Resume Date"
              value={formik.values.resume_date}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="date"
              error={formik.touched.resume_date && formik.errors.resume_date}
              helperText={
                formik.touched.resume_date && formik.errors.resume_date
                  ? formik.errors.resume_date
                  : null
              }
            />
            {/* stopping_date Date Input Component (with optional value handling) */}
            <InputCom
              id="stopping_date"
              name="stopping_date"
              label="Stopping Date"
              value={formik.values.stopping_date || ""}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="date"
              error={
                formik.touched.stopping_date && formik.errors.stopping_date
              }
              helperText={
                formik.touched.stopping_date && formik.errors.stopping_date
                  ? formik.errors.stopping_date
                  : null
              }
            />
            {/* work_type Select Component */}
            <SelectCom
              id="work_type"
              name="work_type"
              value={formik.values.work_type}
              label="Work Type"
              options={[
                { value: "on-site", text: "On-Site" },
                { value: "remote", text: "Remote" },
                { value: "hybrid", text: "Hybrid" },
              ]}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.work_type && formik.errors.work_type}
              helperText={
                formik.touched.work_type && formik.errors.work_type
                  ? formik.errors.work_type
                  : null
              }
            />
            {/* employment_type Select Component */}
            <SelectCom
              id="employment_type"
              name="employment_type"
              value={formik.values.employment_type}
              label="Employment Type"
              options={[
                { value: "fulltime", text: "Full-Time" },
                { value: "parttime", text: "Part-Time" },
                { value: "contract", text: "Contract" },
              ]}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.employment_type && formik.errors.employment_type
              }
              helperText={
                formik.touched.employment_type && formik.errors.employment_type
                  ? formik.errors.employment_type
                  : null
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={formik.handleSubmit}
              // disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save Staff"
              )}
            </Button>
          </>
        )}
      </Stack>
    </ModalBox>
  );
}

export default Editunits;

Editunits.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};
