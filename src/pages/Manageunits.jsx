import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  InputAdornment,
  LinearProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Home, Search } from "@mui/icons-material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useProperties from "../data/Properties";
import Addunit from "../Components/Modals/AddUnits";
import Units from "../Components/Units";

function Manageunits() {
  const [openModal, setOpenModal] = useState(false);
  const [propertyId, setPropertyId] = useState(null); 

  // Fetch properties
  const {
    data: properties,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useProperties();

  const handleAddproperty = (value) => {
    setOpenModal(value);
  };

  const renderUnits = () => {
    if (!propertyId) {
      return <Typography>Select a property to view units</Typography>;
    }

    return (
      <Units limit={9} gridnum={4} pagination={true} property_id={propertyId} />
    );
  };

  return (
    <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography sx={{ marginBottom: "20px" }}>
        Manage Property Units
      </Typography>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          to="/landlord"
          component={RouterLink}
        >
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="text.primary"
          to=""
          component={RouterLink}
          aria-current="page"
        >
          Manage Units
        </Link>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
          alignItems: "center",
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
            sx={{ width: "100%", maxWidth: 400 }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              marginTop: 2,
              maxWidth:300
            }}
          >
            {propertiesLoading && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            )}

            <Grid container gap={2}>
              {properties?.data.length > 0
              ? properties.data.map((property) => (
                  <Chip
                    key={property.id}
                    label={property.name}
                    icon={<Home />}
                    onClick={() => setPropertyId(property.id)}
                    color={propertyId === property.id ? "primary" : "default"}
                  />
                ))
              : !propertiesLoading && (
                  <div>{propertiesError?.message}</div>
                )}
            </Grid>
          </Box>
        </Box>
      </Box>
      {/* search bar end */}

      {/* add Button starts */}
      <Box
        sx={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}
      >
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          Add Unit
        </Button>
      </Box>
      {/* Button ends */}

      {/* Units display */}
      <Grid container>
        <Grid item xs={12} md={12}>
          {renderUnits()}
        </Grid>
      </Grid>

      {/* modal for adding units */}
      <Addunit open={openModal} handleClose={() => handleAddproperty(false)} />
    </Box>
  );
}

export default Manageunits;
