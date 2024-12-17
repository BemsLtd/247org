import {
    Box,
    Breadcrumbs,
    Button,
    Grid,
    Link,
    Typography,
  } from "@mui/material";
  import { useState } from "react";
  import { Link as Linker } from "react-router-dom";
  import SelectCom from "../../Components/SelectCom";
  import useCompany from "../../data/Company";
  import Units from "../../Components/Units";
  import Addunits from "../../Components/Modals/Addunits";
  
  function Manageunits() {
    const { data: companies, isLoading: companyLoading, error: companiesError} = useCompany();
    const [openModal, setOpenModal] = useState(false);
    const [companydetail, setCompanydetail] = useState({org_id: "", branch_id: ""});
console.log(companydetail);

  
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
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              gap: 1,
              marginTop: 2,
              paddingLeft: 3,
              minWidth: 300,
            }}
          >
            <Grid container gap={2}>
              <SelectCom
                id="company_id"
                name="company_id"
                label="Select Company"
                value={companydetail.org_id}
                options={
                  companyLoading
                    ? [{ value: "", text: "Loading companies..." }]
                    : companiesError ||
                      (companies.data && companies.data.length === 0)
                    ? [{ value: "", text: "No companies available" }]
                    : companies.data.map((item) => ({
                        value: String(item.id),
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
                label="Select Branch"
                value={companydetail.branch_id}
                options={
                  companyLoading
                    ? [{ value: "", text: "Loading branches..." }]
                    : companiesError ||
                      (companies.data && companies.data.length === 0)
                    ? [{ value: "", text: "No branched available" }]
                    : companies.data
                        .filter(
                          (item) => item.id == companydetail.org_id
                        )[0]
                        ?.branches?.map((item) => ({
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
          </Box>
          <Button
            // startIcon={<Add />}
            variant="contained"
            onClick={() => handleAddUnits(true)}
          >
            Add Units
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
  