import { Box,  Button,  Fab, Grid, Paper, Typography } from "@mui/material";
import Stats from "../Components/Stats";
import {  UsbRounded } from "@mui/icons-material";
// import { DataGrid } from '@mui/x-data-grid';
// import Properties from "../Components/Properties";
import { BarChart, PieChart } from "@mui/x-charts";
import ad from "../assets/ad.jpg"
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state) => state.userDetails.user); 
  
console.log(user);

  return (
    <Box sx={{ m: { xs: 0, sm: 0, md: 0, lg: 2, xl: 3 } }}>
      <Typography variant="body1" component={"h2"}>
        DASHBOARD
      </Typography>
      <Box>
        <Typography variant="body3">User Statistics</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stats />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>Place your adverts</Typography>
            <Box
              sx={{
                backgroundImage: `url(${ad})`,
                height: "300px",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "5px",
              }}
            ></Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Typography variant="body3">Quick Links</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={2}>
            <Paper sx={{ padding: 2 }}>
              <Fab size="small">
                <UsbRounded />
              </Fab>
              <Typography variant="body2" mt={2}>
                Manage Staffs
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2}>
            <Paper sx={{ padding: 2 }}>
              <Fab size="small">
                <UsbRounded />
              </Fab>
              <Typography variant="body2" mt={2}>
                Manage BUsiness
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2}>
            <Paper sx={{ padding: 2 }}>
              <Fab size="small">
                <UsbRounded />
              </Fab>
              <Typography variant="body2" mt={2}>
                Manage Tenants
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2}>
            <Paper sx={{ padding: 2 }}>
              <Fab size="small">
                <UsbRounded />
              </Fab>
              <Typography variant="body2" mt={2}>
                Manage Tenants
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2}>
            <Paper sx={{ padding: 2 }}>
              <Fab size="small">
                <UsbRounded />
              </Fab>
              <Typography variant="body2" mt={2}>
                Manage Tenants
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2}>
            <Paper sx={{ padding: 2 }}>
              <Fab size="small">
                <UsbRounded />
              </Fab>
              <Typography variant="body2" mt={2}>
                Manage Tenants
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Typography>Recent activities</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/* <Properties  gridnum={6} /> */}
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <Button
                component={RouterLink}
                to={"/dashboard/manage-properties"}
                variant="contained"
                color="primary"
              >
                View more
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ width: "100%", height: 350 }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: "Series A" },
                      { id: 1, value: 15, label: "Series B" },
                      { id: 2, value: 20, label: "Series C" },
                    ],
                  },
                ]}
              />
            </Box>

            <Box sx={{ width: "100%", height: 400 }}>
              <BarChart
                series={[
                  { data: [4, 2, 5, 4, 1], stack: "A", label: "Series A1" },
                  { data: [2, 8, 1, 3, 1], stack: "A", label: "Series A2" },
                  { data: [14, 6, 5, 8, 9], label: "Series B1" },
                ]}
                barLabel={(item, context) => {
                  if (item.value > 10) {
                    return "High";
                  }
                  return context.bar.height < 60
                    ? null
                    : item.value?.toString();
                }}
                // Again, no height or width here; let the Box handle it
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
