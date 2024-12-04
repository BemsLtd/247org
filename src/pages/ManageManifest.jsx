import { Box, Breadcrumbs, Button, Grid, Link, Typography } from "@mui/material";
import { Link as Linker } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import Manifest from "../Components/Manifest";
import AddManifest from "../Components/Modals/AddManifest";

function ManageManifest() {
    const [openModal, setOpenModal] = useState(false);

    const handleAddManifest = (value) => {
      setOpenModal(value);
    };
  return (
    <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography sx={{ marginBottom: "20px" }}>Manage Properties</Typography>
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
          Manage Properties
        </Typography>
      </Breadcrumbs>
      <Box
        sx={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}
      >
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => handleAddManifest(true)}
        >
          Add Manifest
        </Button>
      </Box>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Manifest limit={9} gridnum={4} pagination={true} />
        </Grid>
      </Grid>
      {/* modal for adding properties */}
      <AddManifest
        open={openModal}
        handleClose={() => handleAddManifest(false)}
      />
    </Box>
  );
}

export default ManageManifest