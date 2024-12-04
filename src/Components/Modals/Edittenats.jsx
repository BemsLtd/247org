import ModalBox from "../Modal";
import InputCom from "../InputCom";
import PropTypes from "prop-types";
import { Button, CircularProgress, Skeleton, Stack } from "@mui/material";
import makeAPIRequest from "../../data";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ENDPOINTS } from "../../data/Endpoints";
import { useState } from "react";
import Notice from "../Notice";
import SelectCom from "../SelectCom";
import useUnits from "../../data/Units";
import useTenants from "../../data/Tenants";
import { format } from "date-fns";

function Edittenants({ open, handleClose, id }) {
  const { data: Tenants, isLoading, error } = useTenants(id);
  const [message, setMessage] = useState({ status: null, message: null });
console.log(error);
  const validationSchema = Yup.object({
    property_name: Yup.string().required("Property name is required"),
    type: Yup.string().required("Type is required"),
    property_address: Yup.string().required("Property address is required"),
    // units: Yup.number()
    //   .required("Number of units is required")
    //   .positive("Number of units must be a positive number")
    //   .integer("Number of units must be an integer"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Unsupported File Format", (value) => {
        return value && ["image/jpeg", "image/png"].includes(value.type);
      }),
  });

  // const response = await makeAPIRequest.post(ENDPOINTS.addproperty, values)
  const formik = useFormik({
    initialValues: {
      tenant_id: Tenants?.data[0].tenant_id || "",
      property_unit_id: Tenants?.data[0].property_unit_id || "",
      property_id: Tenants?.data[0].property_id || "",
      startDate: Tenants?.data && Tenants.data.length > 0 
      ? format(new Date(Tenants.data[0].start_date), "yyyy-MM-dd")
      : "",

      endDate : Tenants?.data && Tenants.data.length > 0 
      ? format(new Date(Tenants.data[0].end_date), "yyyy-MM-dd")
      : "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("property_name", values.property_name);
      formData.append("type", values.type);
      formData.append("property_address", values.property_address);
      // formData.append("units", values.units);
      formData.append("image", values.image);
      formData.append("user_id", values.user_id);

      setMessage({ type: "", message: null });

      await makeAPIRequest
        .post(ENDPOINTS.addproperty, values, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
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

  
  const {
    data: Units,
    isLoading: unitLoading,
    error: unitError,
  } = useUnits({ property_id: Tenants?.data[0].property_id || 0 });
  if (unitError) console.log(unitError);

  return (
    <ModalBox open={open} handleClose={handleClose}>
      {message.message && (
        <Notice message={message.message} onClose={handleClose} />
      )}
      <h2>Edit Tenants</h2>
      <Stack spacing={2}>
        {isLoading && <Skeleton variant="rectangular" />}
        {!isLoading && (
          <>
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
                formik.touched.property_unit_id &&
                formik.errors.property_unit_id
              }
              helperText={
                formik.touched.property_unit_id &&
                formik.errors.property_unit_id
                  ? formik.errors.property_unit_id
                  : null
              }
              disabled={!formik.values.property_id} 
            />
            <InputCom
              id="start_date"
              name="start_date"
              label="Checkin date"
              value={formik.values.start_date}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="date"
              error={
                formik.touched.start_date && formik.errors.start_date
                  ? true
                  : false
              }
              helperText={
                formik.touched.start_date && formik.errors.start_date
                  ? formik.errors.start_date
                  : null
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
              error={
                formik.touched.end_date && formik.errors.end_date ? true : false
              }
              helperText={
                formik.touched.end_date && formik.errors.end_date
                  ? formik.errors.end_date
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
                "Save Property"
              )}
            </Button>
          </>
        )}
      </Stack>
    </ModalBox>
  );
}

export default Edittenants;

Edittenants.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.object.isRequired,
};
