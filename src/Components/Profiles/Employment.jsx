import { Box, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import MainIds from "../../idCards/Main";

export default function Employment({user}) {
    const steps = user.abbr;
    console.log(user);
    
  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"} marginTop={2}>
        <Box>
          
          <Typography variant="body2">Organisation ID sample</Typography>
        </Box>
      </Stack>
        <MainIds company={steps} />
    </>
  );
}

Employment.propTypes = {
  user: PropTypes.array.isRequired,
};