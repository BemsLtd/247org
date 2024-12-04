import ModalBox from "../Modal";
import { Button, CircularProgress,  Stack,} from "@mui/material";
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

function Addstaff({ open, handleClose }) {
  const { data: companies, isLoading: companyLoading, error: companyError} = useCompany();
  const [message, setMessage] = useState({ status: "", message: null });
  const [adduser, setAddUser]= useState(false)
  const [loading, setLoading] = useState(false);
  
  const validationSchema = Yup.object({
      company_id: Yup.number().required("Company ID is required"),
      branch_id: Yup.string().nullable(), 
      employee_email: Yup.string().email("Must be a valid email").required("Email is required"),
      job_role: Yup.string().required("Job role is required"),
      job_description: Yup.string().required("Job description is required"),
      resume_date: Yup.date().required("Resume date is required").max(new Date(), "Resume date cannot be in the future"),
      stopping_date: Yup.date().nullable().notRequired(),
      address: Yup.string().nullable(),
      work_type: Yup.string().oneOf(
          ["on-site", "remote", "hybrid"],
          "Work type must be either on-site, remote, or hybrid"
        ).required("Work type is required"),
      employment_type: Yup.string()
        .oneOf(
          ["fulltime", "parttime", "contract"],
          "Employment type must be full-time, part-time, or contract"
        )
        .required("Employment type is required"),
  });

  const formik = useFormik({
    initialValues: {
      company_id: "",
      branch_id: "",
      employee_email: "",
      job_role: "",
      job_description: "",
      resume_date: "",
      stopping_date: "",
      address: "",
      work_type: "on-site",
      employment_type: "fulltime",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setMessage({ type: "", message: null });
      const employee = {
        company_id: values.company_id,
        branch_id: values.branch_id,
        employee_email: values.employee_email,
        job_role: values.job_role,
        job_description: values.job_description,
        resume_date: values.resume_date,
        stopping_date: values.stopping_date,
        work_type: values.work_type,
        employment_type: values.employment_type,
      };
      try {
        if (adduser) {
          await addUser(
            values.first_name,
            values.middle_name,
            values.last_name,
            values.employee_email,
            values.phone,
            values.address
          );
        }

        const res = await makeAPIRequest.post(ENDPOINTS.addemployee, employee);
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
      const IntervalId = setInterval(user, 5000);

      return () => clearInterval(IntervalId);
    }, [formik.values.employee_email]);


    const addUser = async ( first_name,  middle_name, last_name, email, phone, address) => {
      try {
        const res = await makeAPIRequest.post(ENDPOINTS.minireg, {
          first_name,
          middle_name,
          last_name,
          email,
          phone,
          address,
        });
        const { success, message } = res.data;
        if (success) {
          setMessage({ type: "success", message });
        } else {
          setMessage({ type: "error", message });
        }
      } catch (error) {
        setMessage({ type: "error", message: error.message });
      }
    };

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
      <h2>Add New Staff</h2>
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
                    value: item.id,
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
            value={formik.values.stopping_date}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="date"
            error={formik.touched.stopping_date && formik.errors.stopping_date}
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
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add staff"
            )}
          </Button>
        </Stack>
      </form>
    </ModalBox>
  );
}

export default Addstaff;

Addstaff.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
