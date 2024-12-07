import { Box, Breadcrumbs, Button, Grid, Link, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { Link as Linker } from "react-router-dom";
import Force from "../../Components/Forces";  // Assuming you have a Forces component
import AddForce from "../../Components/Modals/AddForce";  // Assuming you'll create this modal

function ManageForces() {
    const [openModal, setOpenModal] = useState(false);

    const handleAddForce = (value) => {
      setOpenModal(value);
    };

  return (
    <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography sx={{ marginBottom: "20px" }}>Manage Forces</Typography>
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
        <Typography sx={{ color: "text.primary" }}>
          Manage Forces
        </Typography>
      </Breadcrumbs>
      <Box
        sx={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}
      >
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => handleAddForce(true)}
        >
          Add Force
        </Button>
      </Box>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Force limit={9} gridnum={4} pagination={true} />
        </Grid>
      </Grid>
      {/* modal for adding forces */}
      <AddForce
        open={openModal}
        handleClose={() => handleAddForce(false)}
      />
    </Box>
  );
}

export default ManageForces;