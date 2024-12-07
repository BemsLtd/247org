import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { Link as Linker } from "react-router-dom";
import SelectCom from "../../Components/SelectCom";
import useCompany from "../../data/Company";
import Branch from "../../Components/Branches";
import Addbranch from "../../Components/Modals/Addbranch";

function Managebranches() {
  const {
    data: companies,
    isLoading: companyLoading,
    error: companyError,
  } = useCompany();
  const [openModal, setOpenModal] = useState(false);
  const [company, setCompany] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleAddCompany = (value) => {
    setOpenModal(value);
  };

  return (
    <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography sx={{ marginBottom: "20px" }}>Manage Branches</Typography>
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
        <Typography sx={{ color: "text.primary" }}>Manage Branches</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          display: { xs: "grid", md: "flex" },
          justifyContent: { md: "space-between", xs: "start" },
          marginBottom: "10px",
          marginTop: "10px",
        }}
      >

        
        <Box sx={{ width: "300px", paddingBottom: "10px" }}>
          <SelectCom
            id="user_id"
            name="user_id"
            label="Select Company"
            options={
              companyLoading
                ? [{ value: "", text: "Loading companies..." }]
                : companies.data?.length
  ? companies.data.map((item) => ({
      value: String(item.id),
      text: item.org_name,
    }))
  : [{ value: "", text: "No companies available" }]




            }
            onBlur={""}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Box>
        <Button
          startIcon={<Add />}
          variant="contained"
          sx={{
            width: { xs: "50%", sm: "auto" },
            
          }}
          onClick={() => handleAddCompany(true)}
        >
          {isSmallScreen ? "" : "Add Branch"}
        </Button>
      </Box>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Branch limit={9} gridnum={4} pagination={true} id={company} />
    {console.log('company', company)}
          
        </Grid>
      </Grid>
      {/* modal for adding properties */}
      <Addbranch open={openModal} handleClose={() => handleAddCompany(false)} />
    </Box>
  );
}

export default Managebranches;
