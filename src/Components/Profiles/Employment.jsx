import { Box, Stack, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { format } from "date-fns";
import PropTypes from "prop-types";

export default function Employment({user}) {
    const steps = user
  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"} marginTop={2}>
        <Box>
          <Typography variant="body3">
            <b>Employment</b>
          </Typography>
          <br />
          <Typography variant="body2">Employment data</Typography>
        </Box>
      </Stack>
      <Box marginTop={2}>
        <Box
          marginTop={2}
          boxShadow={3}
          padding={2}
          borderRadius={2}
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "black" : "grey.200",
          }}
        >
          <Stepper activeStep={-1} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel>{step.job_role}</StepLabel>
                <StepContent>
                  <Typography variant="h6">{format(new Date(step.resume_date) , "do MMMM yyyy")}</Typography>
                  <Typography>{step.job_description}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>
    </>
  );
}

Employment.propTypes = {
  user: PropTypes.array.isRequired,
};