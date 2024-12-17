import ModalBox from "../Modal";
import { Button, CircularProgress, Stack } from "@mui/material";
import InputCom from "../InputCom";
import SelectCom from "../SelectCom";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import makeAPIRequest from "../../data";
import { ENDPOINTS } from "../../data/Endpoints";
import * as Yup from "yup";
import useCompany from "../../data/Company";
import useBranch from "../../data/Branch";
import { useState, useEffect } from "react";
import Notice from "../Notice";

function Addunits({ open, handleClose }) {
  const [message, setMessage] = useState({ type: "", message: null });

  const { data: companies, isLoading: companyLoading } = useCompany();
  const [branches, setBranches] = useState([]);
  const { isLoading: branchLoading, 
    error: branchError, } = useBranch(); // Assuming you have a function to fetch branches
    
  // Validation schema for the form
  const validationSchema = Yup.object({
    org_id: Yup.string().required("Please select a company"),
    branch_id: Yup.string().nullable(),
    name: Yup.string().required("Unit name is required"),
    address: Yup.string().required("Unit address is required"),
    phone: Yup.string().required("Unit phone number is required"),
    avatar: Yup.mixed()
  });

  // Formik hook for handling form values and submission
  const formik = useFormik({
    initialValues: {
      org_id: "",
      branch_id: "",
      name: "",
      address: "",
      phone: "",
      avatar: null,
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("org_id", values.org_id);
        formData.append("branch_id", values.branch_id);
        formData.append("address", values.address);
        formData.append("image", values.avatar);
        formData.append("phone", values.phone);
        formData.append("name", values.name);
        formData.append("email", values.email);

        const response = await makeAPIRequest.post(
          ENDPOINTS.createunit,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const { status, message } = response.data;

        if (status) {
          setMessage({ type: "success", message });
          formik.resetForm();
          handleClose();
        } else {
          setMessage({ type: "error", message });
        }
      } catch (error) {
        setMessage({ type: "error", message: "Something went wrong, please try again." });
        console.log(error)
      }
    },
  });

  useEffect(() => {
    if (formik.values.org_id) {
      const fetchBranches = async (orgId) => {
        try {
          const response = await makeAPIRequest.get(`${ENDPOINTS.allbranch}?org_id=${orgId}`);
          setBranches(response?.data || []);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      };
      fetchBranches(formik.values.org_id);
    }
  }, [formik.values.org_id]);
  
  return (
    <ModalBox open={open} handleClose={handleClose}>
      {message.message && (
        <Notice
          message={message.message}
          status={message.type}
          onClose={() => setMessage({ type: "", message: null })}
        />
      )}
      <h2>Add New Unit</h2>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          {/* Company Selection */}
          <SelectCom
            id="org_id"
            name="org_id"
            label="Select Company"
            value={formik.values.org_id}
            options={
              companyLoading
                ? [{ value: "", text: "Loading companies..." }]
                : companies?.data?.map((company) => ({
                    value: company.id,
                    text: company.org_name,
                  })) || []
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.org_id && formik.errors.org_id}
            helperText={formik.touched.org_id && formik.errors.org_id}
          />

          {/* Branch Selection */}
          <SelectCom
            id="branch_id"
            name="branch_id"
            label={
              branchLoading ? "Loading Branches..." : "Select Branch (Optional)"
            }
            value={formik.values.branch_id}
            options={
              branchLoading
                ? [{ value: "", text: "Loading branches..." }]
                : branchError
                ? [{ value: "", text: "Error loading branches" }]
                : branches?.data?.length > 0
                ? branches?.data.map((branch) => ({
                    value: branch.id,
                    text: branch.name,
                  }))
                : [{ value: "", text: "No branches available" }]
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={branchLoading} // Disable until branches are loaded
            error={formik.touched.branch_id && formik.errors.branch_id}
            helperText={formik.touched.branch_id && formik.errors.branch_id}
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

          {/* Unit phone Input */}
          <InputCom
            id="email"
            name="email"
            label="Unit email"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="mail"
            error={formik.touched.email && formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />

          {/* Unit Name Input */}
          <InputCom
            id="name"
            name="name"
            label="Unit Name"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name && formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
          />
          {/* Unit Address Input */}
          <InputCom
            id="address"
            name="address"
            label="Unit Address"
            value={formik.values.address}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.address && formik.errors.address}
            helperText={formik.touched.address && formik.errors.address}
          />
          {/* Unit phone Input */}
          <InputCom
            id="phone"
            name="phone"
            label="Unit Phone"
            value={formik.values.phone}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.phone && formik.errors.phone}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting || message.type === "error"}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Unit"
            )}
          </Button>
        </Stack>
      </form>
    </ModalBox>
  );
}

Addunits.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Addunits;
