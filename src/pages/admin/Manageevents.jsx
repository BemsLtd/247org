import { Add } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Grid, Link, Typography } from "@mui/material";
import { useState } from "react";
import {Link as Linker} from "react-router-dom"
import Events from "../../Components/Events";
import Addevent from "../../Components/Modals/Addevent";




function Manageevents() {
  const [openModal, setOpenModal] = useState(false);
  const handleAddEvent = (value) => {
    setOpenModal(value);
  };

  return (
    <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography sx={{ marginBottom: "20px" }}>Manage Events</Typography>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={Linker}
          to="/"
          sx={{ textDecoration: "none" }}
        >
          Dashboard
        </Link>
        <Typography sx={{ color: "text.primary" }}>Manage Events</Typography>
      </Breadcrumbs>
      <Box
        sx={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}
      >
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => handleAddEvent(true)}
        >
          Add Event
        </Button>
      </Box>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Events limit={9} gridnum={4} pagination={true} />
        </Grid>
      </Grid>
      
      <Addevent
        open={openModal}
        handleClose={() => handleAddEvent(false)}
      />
    </Box>
  );
}

export default Manageevents;
