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
  import useBranch from "../../data/Branch";
  import Units from "../../Components/Units";
  import Addunits from "../../Components/Modals/Addunits";
  
  function Manageunits() {
    const {
      data: companies,
      isLoading: companyLoading,
      error: companiesError,
    } = useCompany();
    const [openModal, setOpenModal] = useState(false);
    const [companydetail, setCompanydetail] = useState({org_id: "", branch_id: ""});
    const isSmallScreen = useMediaQuery("(max-width:600px)");
    const { data: branch, isLoading: branchLoading, error: branchError} = useBranch({ org_id: companydetail.org_id });
  
    const handleAddUnits = (value) => {
      setOpenModal(value);
    };

    const renderUnits = () => {
      // if (!companydetail.org_id && !companydetail.branch_id) {
      //   return (
      //     <Typography>Select a company and branch to view staffs</Typography>
      //   );
      // }
      
      return <Units companydetails={companydetail}  />;
    };
  
  
    return (
      <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
        <Typography sx={{ marginBottom: "20px" }}>Manage Units</Typography>
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
          <Typography sx={{ color: "text.primary" }}>Manage Units</Typography>
        </Breadcrumbs>
        <Box
          sx={{
            display: { xs: "grid", md: "flex" },
            justifyContent: { md: "space-between", xs: "start" },
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
  
          
          <Grid container gap={2}>
            <SelectCom
              id="org_id"
              name="org_id"
              label="Select Company"
              value={companydetail.org_id}
              options={
                companyLoading
                  ? [{ value: "", text: "Loading companies..." }]
                  : companiesError || (companies.data && companies.data.length === 0)
                  ? [{ value: "", text: "No companies available" }]
                  : companies.data.map((item) => ({
                      value: item.id,
                      text: item.org_name,
                    }))
              }
              onBlur={() => {}}
              onChange={(e) =>
                setCompanydetail({
                  ...companydetail,
                  org_id: e.target.value,
                })
              }
            />
          </Grid>
          <Grid container gap={2}>
            <SelectCom
              id="branch_id"
              name="branch_id"
              label={branchLoading ? "Loading Branches" : "Select Branch"}
              value={companydetail.branch_id}
              options={
                branchLoading
                  ? [{ value: "", text: "Loading branches..." }]
                  : branchError || branch.data?.length === 0
                  ? [{ value: "", text: "No branches available" }]
                  : branch.data
                      .filter((item) => item.organization.id === companydetail.org_id)
                      .map((item) => ({
                        value: String(item.id),
                        text: item.name,
                      }))
              }
              
              onBlur={() => {}}
              onChange={(e) =>
                setCompanydetail({
                  ...companydetail,
                  branch_id: e.target.value,
                })
              }
            />
          </Grid>
          <Button
            startIcon={<Add />}
            variant="contained"
            sx={{
              width: { xs: "50%", sm: "auto" },
              
            }}
            onClick={() => handleAddUnits(true)}
          >
            {isSmallScreen ? "aDD" : "Add Branch"}
          </Button>
        </Box>
        <Grid container>
          <Grid item xs={12} md={12}>
          {renderUnits()}
            
          </Grid>
        </Grid>
        {/* modal for adding properties */}
        <Addunits open={openModal} handleClose={() => handleAddUnits(false)} />
      </Box>
    );
  }
  
  export default Manageunits;
  
