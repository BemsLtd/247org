import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import InputCom from "../InputCom";
import { EditNote } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import makeAPIRequest from "../../data";
import { ENDPOINTS } from "../../data/Endpoints";
import SelectCom from "../SelectCom";
import {
  bloodGroupOptions,
  eyeColorOptions,
  genotypeOptions,
  hairColorOptions,
} from "../../data/Dropdown";

export default function Medical({ user, edit, setEdit, setMessage }) {
  const validationSchema = Yup.object({
    blood_group: Yup.string()
      .required("Blood group is required")
      .oneOf(
        ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        "Invalid blood group"
      ),

    genotype: Yup.string()
      .required("Genotype is required")
      .oneOf(["AA", "AS", "SS", "AC"], "Invalid genotype"),

    skin_color: Yup.string()
      .required("Skin color is required")
      .matches(/^[a-zA-Z ]*$/, "Skin color can only contain letters"),

    eye_color: Yup.string()
      .required("Eye color is required")
      .oneOf(["brown", "blue", "green", "hazel"], "Invalid eye color"),

    hair_color: Yup.string()
      .required("Hair color is required")
      .oneOf(["black", "brown", "blonde", "red"], "Invalid hair color"),

    height: Yup.number()
      .required("Height is required")
      .min(0.5, "Height must be at least 0.5 ft")
      .max(10, "Height must be 10 ft or less"),

    weight: Yup.number()
      .required("Weight is required")
      .min(1, "Weight must be at least 1 kg")
      .max(500, "Weight must be 500 kg or less"),

    health_condition: Yup.string()
      .optional()
      .max(255, "Health condition description too long"),

    user_id: Yup.string().required("health_condition name is required"),
  });
  const formik = useFormik({
    initialValues: {
      blood_group: user.blood_group || "",
      genotype: user.genotype || "",
      skin_color: user.skin_color || "",
      eye_color: user.eye_color || "",
      hair_color: user.hair_color || "",
      height: user.height || "",
      weight: user.weight || "",
      health_condition: user.health_condition || "",
      user_id: user.id || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setMessage({ type: "", message: null });
      await makeAPIRequest.post(ENDPOINTS.update_medical, values).then((res) => {
        const { success, message } = res.data;
        if (success) {
          setMessage({ type: "success", message: message });
        } else {
          setMessage({ type: "error", message: message });
        }
      });
    },
  });

  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"} marginTop={2}>
        <Box>
          <Typography variant="body3">
            <b>Medical Informations</b>
          </Typography>
          <br />
          {edit && (
            <Typography variant="body2">
              Update your Medical informations here
            </Typography>
          )}
        </Box>
        <Box>
          {edit ? (
            <Box flex justifyContent={"center"} alignItems={"center"}>
              <Button
                variant="contained"
                sx={{
                  marginRight: "10px",
                  marginBottom: { xs: "10px", sm: "0px" },
                }}
                skin_color="error"
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                skin_color="success"
                onClick={formik.handleSubmit}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Box>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<EditNote />}
                skin_color="success"
                onClick={() => setEdit(true)}
              >
                Edit
              </Button>
            </>
          )}
        </Box>
      </Stack>
      {edit && (
        <Box marginTop={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {/* Vehicle Name */}
                <Grid item xs={12} sm={6} md={4}>
                  <SelectCom
                    id="blood_group"
                    name="blood_group"
                    label="Blood Group"
                    value={formik.values.blood_group}
                    options={bloodGroupOptions}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.blood_group &&
                      Boolean(formik.errors.blood_group)
                    }
                    helperText={
                      formik.touched.blood_group && formik.errors.blood_group
                        ? formik.errors.blood_group
                        : null
                    }
                  />
                </Grid>

                {/* Genotype */}
                <Grid item xs={12} sm={6} md={4}>
                  <SelectCom
                    id="genotype"
                    name="genotype"
                    label="Genotype"
                    value={formik.values.genotype}
                    options={genotypeOptions}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.genotype && Boolean(formik.errors.genotype)
                    }
                    helperText={
                      formik.touched.genotype && formik.errors.genotype
                        ? formik.errors.genotype
                        : null
                    }
                  />
                </Grid>

                {/* Skin Color */}
                <Grid item xs={12} sm={6} md={4}>
                  <InputCom
                    id="skin_color"
                    name="skin_color"
                    label="Skin Color"
                    value={formik.values.skin_color}
                    type="text"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.skin_color &&
                      Boolean(formik.errors.skin_color)
                    }
                    helperText={
                      formik.touched.skin_color && formik.errors.skin_color
                        ? formik.errors.skin_color
                        : null
                    }
                  />
                </Grid>

                {/* Eye Color */}
                <Grid item xs={12} sm={6} md={4}>
                  <SelectCom
                    id="eye_color"
                    name="eye_color"
                    label="Eye Color"
                    value={formik.values.eye_color}
                    options={eyeColorOptions}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.eye_color &&
                      Boolean(formik.errors.eye_color)
                    }
                    helperText={
                      formik.touched.eye_color && formik.errors.eye_color
                        ? formik.errors.eye_color
                        : null
                    }
                  />
                </Grid>

                {/* Hair Color */}
                <Grid item xs={12} sm={6} md={4}>
                  <SelectCom
                    id="hair_color"
                    name="hair_color"
                    label="Hair Color"
                    value={formik.values.hair_color}
                    options={hairColorOptions}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.hair_color &&
                      Boolean(formik.errors.hair_color)
                    }
                    helperText={
                      formik.touched.hair_color && formik.errors.hair_color
                        ? formik.errors.hair_color
                        : null
                    }
                  />
                </Grid>

                {/* Height */}
                <Grid item xs={12} sm={6} md={4}>
                  <InputCom
                    id="height"
                    name="height"
                    label="Height (ft)"
                    value={formik.values.height}
                    type="number"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.height && Boolean(formik.errors.height)
                    }
                    helperText={
                      formik.touched.height && formik.errors.height
                        ? formik.errors.height
                        : null
                    }
                  />
                </Grid>

                {/* Weight */}
                <Grid item xs={12} sm={6} md={4}>
                  <InputCom
                    id="weight"
                    name="weight"
                    label="Weight (kg)"
                    value={formik.values.weight}
                    type="number"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.weight && Boolean(formik.errors.weight)
                    }
                    helperText={
                      formik.touched.weight && formik.errors.weight
                        ? formik.errors.weight
                        : null
                    }
                  />
                </Grid>

                {/* Health Condition */}
                <Grid item xs={12} sm={6} md={4}>
                  <InputCom
                    id="health_condition"
                    name="health_condition"
                    label="Health Condition"
                    value={formik.values.health_condition}
                    type="text"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.health_condition &&
                      Boolean(formik.errors.health_condition)
                    }
                    helperText={
                      formik.touched.health_condition &&
                      formik.errors.health_condition
                        ? formik.errors.health_condition
                        : null
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Box>
      )}
      {!edit && (
        <Box
          marginTop={2}
          boxShadow={3}
          borderRadius={2}
          sx={{
            bgskin_color: (theme) =>
              theme.palette.mode === "dark" ? "black" : "grey.200", // Dynamic background based on mode
          }}
        >
          <Box display={"flex"} gap={1} p={2}>
            <Typography variant="p">Fullname:</Typography>
            <Typography variant="p">
              {user.first_name} {user.middle_name} {user.last_name}
            </Typography>
          </Box>
          <Box display={"flex"} gap={1} p={2}>
            <Typography variant="p">Email Address:</Typography>
            <Typography variant="p">{user.email}</Typography>
          </Box>
          <Box display={"flex"} gap={1} p={2}>
            <Typography variant="p">Phone:</Typography>
            <Typography variant="p">{user.phone}</Typography>
          </Box>
          <Box display={"flex"} gap={1} p={2}>
            <Typography variant="p">Fullname:</Typography>
            <Typography variant="p">Innocent Ebubechukwu</Typography>
          </Box>
        </Box>
      )}
    </>
  );
}

Medical.propTypes = {
  user: PropTypes.object.isRequired,
  edit: PropTypes.bool.isRequired,
  setEdit: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};
