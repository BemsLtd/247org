import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { Link as Linker } from "react-router-dom";
import AddReport from "../Components/Modals/AddReport";
import Crime from "../Components/Crime";

function Crimediary() {
  const [openModal, setOpenModal] = useState(false);

  const handleAddproperty = (value) => {
    setOpenModal(value);
  };

  return (
    <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography sx={{ marginBottom: "20px" }}>Manage Crime</Typography>
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
          Crime Diary
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
          Add crime
        </Button>
      </Box>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Crime limit={9} gridnum={4} pagination={true} />
        </Grid>
      </Grid>
      {/* modal for adding properties */}
      <AddReport
        open={openModal}
        handleClose={() => handleAddproperty(false)}
      />
    </Box>
  );
}

export default Crimediary;
