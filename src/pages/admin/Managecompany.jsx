import { Box, Breadcrumbs, Button, Grid, Link, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { Link as Linker } from "react-router-dom";
import Company from "../../Components/Companies";
import Addcompany from "../../Components/Modals/Addcompany";

function Managecompanies() {
    const [openModal, setOpenModal] = useState(false);

    const handleAddCompany = (value) => {
      setOpenModal(value);
    };

  return (
    <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography sx={{ marginBottom: "20px" }}>Manage Companies</Typography>
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
          Manage Company
        </Typography>
      </Breadcrumbs>
      <Box
        sx={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}
      >
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => handleAddCompany(true)}
        >
          Add Company
        </Button>
      </Box>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Company limit={9} gridnum={4} pagination={true} />
        </Grid>
      </Grid>
      {/* modal for adding properties */}
      <Addcompany
        open={openModal}
        handleClose={() => handleAddCompany(false)}
      />
    </Box>
  );
}

export default Managecompanies;
