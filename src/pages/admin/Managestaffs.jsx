import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Link as Linker } from "react-router-dom";
import { Add, Business, Search } from "@mui/icons-material";
import { useState } from "react";
import Staffs from "../../Components/Staffs";
import useCompany from "../../data/Company";
import useBranch from "../../data/Branch";
import Addstaff from "../../Components/Modals/AddStaffs"

export default function Managestaffs() {
  const [openModal, setOpenModal] = useState(false);
  const [companydetail, setCompanydetail] = useState({org_id: null, branch_id: null});
  const { data: companies, isLoading: companiesLoading, error: companiesError} = useCompany();
  const { data: branch, isLoading: branchLoading, error: branchError} = useBranch({ org_id: companydetail.org_id });

  const handleAddSTaffs = (value) => {
    setOpenModal(value);
  };

  const renderUnits = () => {
    // if (!companydetail.org_id && !companydetail.branch_id) {
    //   return (
    //     <Typography>Select a company and branch to view staffs</Typography>
    //   );
    // }

    return <Staffs  />;
  };

  return (
    <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography sx={{ marginBottom: "20px" }}>Manage Staffs</Typography>
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
        <Typography sx={{ color: "text.primary" }}>Manage Staffs</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
          alignItems: "center",
          width: "80%",
        }}
      >
        {/* search Bar */}
        <Box marginTop={2}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              marginTop: 2,
              paddingLeft: 3,
              minWidth: 300,
            }}
          >
            {companiesLoading && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            )}

            <Grid container gap={2}>
              {companies?.data.length > 0
                ? companies.data.map((company) => (
                    <Chip
                      key={company.id}
                      label={company.org_name}
                      
                      icon={<Business />}
                      onClick={() =>
                        setCompanydetail({
                          ...companydetail,
                          org_id: company.id,
                        })
                      }
                      color={
                        companydetail.org_id === company.id
                          ? "primary"
                          : "default"
                      }
                    />
                  ))
                : !companiesLoading && <div>{companiesError?.message}</div>}
            </Grid>
          </Box>
          <Divider sx={{ marginTop: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              marginTop: 2,
              paddingLeft: 3,
              minWidth: 300,
            }}
          >
            {branchLoading && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            )}

            <Grid container gap={2}>
              {branch?.data.length > 0
                ? branch.data.map((branches) => (
                    <Chip
                      key={branches.id}
                      label={branches.name}
                      
                      icon={<Business />}
                      onClick={() =>
                        setCompanydetail({
                          ...companydetail,
                          branch_id: branches.id,
                        })
                      }
                      color={
                        companydetail.branch_id === branches.id
                          ? "primary"
                          : "default"
                      }
                    />
                  ))
                : !branchLoading && <div>{branchError?.message}</div>}
            </Grid>
          </Box>
        </Box>
      </Box>
      {/* search bar end */}
      <Box
        sx={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}
      >
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => handleAddSTaffs(true)}
        >
          Add Staffs
        </Button>
      </Box>
      {renderUnits()}
      <Addstaff open={openModal} handleClose={() => handleAddSTaffs(false)} />
    </Box>
  );
}
