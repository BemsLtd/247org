import { Box, Breadcrumbs, Button, Link, Typography } from "@mui/material";
import { Link as Linker } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import Addtenants from "../Components/Modals/Addtenants";
import Tenanats from "../Components/Tenanats";


export default function Managetenats() {
    const [openModal, setOpenModal] = useState(false);

    const handleAddproperty = (value) => {
      setOpenModal(value);
    };

  return (
    <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography sx={{ marginBottom: "20px" }}>Manage Occupants</Typography>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          component={Linker}
          color="inherit"
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
          onClick={() => handleAddproperty(true)}
        >
          Add Tenants
        </Button>
      </Box>
      <Tenanats/>
      <Addtenants
        open={openModal}
        handleClose={() => handleAddproperty(false)}
      />
    </Box>
  );
}
