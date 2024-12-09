import ModalBox from "../Modal";
import { Button, CircularProgress,  Stack,} from "@mui/material";
import InputCom from "../InputCom";
import PropTypes from "prop-types";
import makeAPIRequest from "../../data";
import makeAPIRequest2 from "../../data/endpoint2";
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
      org_id: Yup.number().nullable(),
      branch_id: Yup.string().nullable(), 
      user_id: Yup.string().nullable(), 
      unit_id: Yup.string().nullable(), 
      rank: Yup.string().nullable(), 
      employee_email: Yup.string().email("Must be a valid email").required("Email is required"),
      position: Yup.string().required("Job role is required"),
      job_description: Yup.string().required("Job description is required"),
      dateofemployment: Yup.date().required("Resume date is required").max(new Date(), "Resume date cannot be in the future"),
      stopping_date: Yup.date().nullable().notRequired(),
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
      org_id: "",
      branch_id: "",
      user_id: "",
      unit_id: "",
      rank: "",
      employee_email: "",
      position: "",
      job_description: "",
      dateofemployment: "",
      stopping_date: "",
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
      
      try {
        
        const res = await makeAPIRequest.post(ENDPOINTS.addstaff, values);
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
        const response = await makeAPIRequest2.post(ENDPOINTS.verifyUser, {
          email: formik.values.employee_email,
        });
        const { success, data } = response.data;
        if (success) {
          setMessage({ type: "success", message: "User found" });
          // Save the user_id to formik values
          console.log(data);
          
          formik.setFieldValue('user_id', data);
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


    // const addUser = async ( first_name,  middle_name, last_name, email, phone) => {
    //   try {
    //     const res = await makeAPIRequest.post(ENDPOINTS.addstaff, {
    //       first_name,
    //       middle_name,
    //       last_name,
    //       email,
    //       phone,
    //     });
    //     const { success, message } = res.data;
    //     if (success) {
    //       setMessage({ type: "success", message });
    //     } else {
    //       setMessage({ type: "error", message });
    //     }
    //   } catch (error) {
    //     setMessage({ type: "error", message: error.message });
    //   }
    // };

  const { data: branch, isLoading: branchLoading, error: branchError} = useBranch({org_id: formik.values.org_id});


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
          {/* org_id Select Component */}
          <SelectCom
            id="org_id"
            name="org_id"
            value={formik.values.org_id}
            label="Select Company"
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
          {/* id Select Component */}
          <SelectCom
            id="id"
            name="id"
            value={formik.values.id}
            label={branchLoading ? "Loading Branches" : "Select Branch"}
            options={
              branchLoading
                ? [{ value: "", text: "Loading branches..." }]
                : branchError
                ? [{ value: "", text: "Error loading branches" }]
                : branch && branch.data.length > 0
                ? branch.data.map((item) => ({
                    value: item.id,
                    text: item.name,
                  }))
                : [{ value: "", text: "No Branches Available" }]
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.id && formik.errors.id}
            helperText={
              formik.touched.id && formik.errors.id
                ? formik.errors.id
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
          <InputCom
                id="rank"
                name="rank"
                label="Rank"
                value={formik.values.rank}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                error={
                  formik.touched.rank && formik.errors.rank
                    ? true
                    : false
                }
                helperText={
                  formik.touched.rank && formik.errors.rank
                    ? formik.errors.rank
                    : null
                }
              />
               
              <InputCom
                id="unit_id"
                name="unit_id"
                label="Unit Id"
                value={formik.values.unit_id}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                error={
                  formik.touched.unit_id && formik.errors.unit_id
                    ? true
                    : false
                }
                helperText={
                  formik.touched.unit_id && formik.errors.unit_id
                    ? formik.errors.unit_id
                    : null
                }
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
