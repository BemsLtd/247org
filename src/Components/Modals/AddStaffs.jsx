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
import useBranch from "../../data/Branch";
import Omit from "../../Services/Omit";

function Addstaff({ open, handleClose }) {
  const {
    data: companies,
    isLoading: companyLoading,
    error: companyError,
  } = useCompany();
  const [message, setMessage] = useState({ status: "", message: null });
  const [adduser, setAddUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    avatar: Yup.mixed()
      .required("avatar is required")
      .test("fileType", "Unsupported File Format", (value) => {
        return (
          value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
        );
      }),
    org_id: Yup.string().nullable(),
    branch_id: Yup.string().nullable(),
    user_id: Yup.string().nullable(),
    unit_id: Yup.string().nullable(),
    rank: Yup.string().nullable(),
    email: Yup.string().email("Must be a valid email").nullable(),
    position: Yup.string().required("Job role is required"),
    nin: Yup.string().required("NIN is required"),
    job_description: Yup.string().required("Job description is required"),
    dateofemployment: Yup.date()
      .required("Resume date is required")
      .max(new Date(), "Resume date cannot be in the future"),
    stopping_date: Yup.date().nullable().notRequired(),
    gender: Yup.string()
      .oneOf(
        ["male", "female"],
        "Gender must be either Male or Female"
      )
      .required("Gender is required"),
    work_type: Yup.string()
      .oneOf(
        ["on-site", "remote", "hybrid"],
        "Work type must be either on-site, remote, or hybrid"
      )
      .required("Work type is required"),
    employment_type: Yup.string()
      .oneOf(
        ["fulltime", "parttime", "contract"],
        "Employment type must be full-time, part-time, or contract"
      )
      .required("Employment type is required"),
  });

  const formik = useFormik({
    initialValues: {
      avatar: null,
      org_id: "",
      branch_id: "",
      user_id: "",
      unit_id: "",
      rank: "",
      position: "",
      nin: "",
      job_description: "",
      dateofemployment: "",
      gender: "male",
      work_type: "on-site",
      employment_type: "fulltime",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phone: "",
      status: 1,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setMessage({ type: "", message: null });
      const tosubmit = Omit(values);
      try {
        const res = await makeAPIRequest.post(ENDPOINTS.addstaff, tosubmit);
        const { status, message } = res.data;

        if (status) {
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
    if (!formik.values.email) {
      return;
    }
  
    let timeoutId;
    const user = async () => {
      try {
        setLoading(true);
        const response = await makeAPIRequest.get(`${ENDPOINTS.verifyUser}?email=${formik.values.email}`);
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
  }, [formik.values.email]);
  

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

  const {
    data: branch,
    isLoading: branchLoading,
    error: branchError,
  } = useBranch({ org_id: formik.values.org_id });

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
            id="branch_id"
            name="branch_id"
            value={formik.values.branch_id}
            label={branchLoading ? "Loading Branches" : "Select Branch"}
            options={
              branchLoading
                ? [{ value: "", text: "Loading branches..." }]
                : branchError
                ? [{ value: "", text: "Error loading branches" }]
                : branch?.data?.length > 0
                ? branch.data.map((item) => ({
                    value: item.id,
                    text: item.name,
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
          <InputCom
          id="avatar"
          name="avatar"
          label="avatar"
          defaultValue={formik.values.avatar}
          onBlur={formik.handleBlur}
          onChange={(event) => {
            formik.setFieldValue("avatar", event.currentTarget.files[0]);
          }}
          type="file"
          error={formik.touched.avatar && formik.errors.avatar ? true : false}
          helperText={
            formik.touched.avatar && formik.errors.avatar
              ? formik.errors.avatar
              : null
          }
          />
          {/* employee_email Input Component */}
          <InputCom
            id="email"
            name="email"
            label="Employee Email"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="email"
            error={formik.touched.email && formik.errors.email}
            helperText={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
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
            error={formik.touched.rank && formik.errors.rank ? true : false}
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
              formik.touched.unit_id && formik.errors.unit_id ? true : false
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
            id="position"
            name="position"
            label="Job Role"
            value={formik.values.position}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.position && formik.errors.position}
            helperText={
              formik.touched.position && formik.errors.position
                ? formik.errors.position
                : null
            }
          />
          <InputCom
            id="nin"
            name="nin"
            label="NIN"
            value={formik.values.nin}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.nin && formik.errors.nin}
            helperText={
              formik.touched.nin && formik.errors.nin
                ? formik.errors.nin
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
          {/* dateofemployment Date Input Component */}
          <InputCom
            id="dateofemployment"
            name="dateofemployment"
            label="Resume Date"
            value={formik.values.dateofemployment}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="date"
            error={
              formik.touched.dateofemployment && formik.errors.dateofemployment
            }
            helperText={
              formik.touched.dateofemployment && formik.errors.dateofemployment
                ? formik.errors.dateofemployment
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
           <SelectCom
            id="gender"
            name="gender"
            value={formik.values.gender}
            label="Gender"
            options={[
              { value: "male", text: "Male" },
              { value: "female", text: "Female" },
            ]}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={
              formik.touched.gender && formik.errors.gender
            }
            helperText={
              formik.touched.gender && formik.errors.gender
                ? formik.errors.gender
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
