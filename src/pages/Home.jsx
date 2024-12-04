import { Box,  Button,  Fab, Grid, Paper, Typography } from "@mui/material";
import Stats from "../Components/Stats";
import {  ContactPhoneRounded, LocalParkingRounded, LocalTaxiRounded, PersonSearchRounded, ReportRounded, Settings } from "@mui/icons-material";
// import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import Properties from "../Components/Properties";
import { BarChart, PieChart } from "@mui/x-charts";
import ad from "../assets/ad.jpg"
import {Link, Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state) => state.userDetails.user); 
  const [userData, setUserData] = useState(null);
  console.log(userData);
console.log(user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://randomuser.me/api/?inc=gender,name,nat,picture"
        );
        const data = await response.json();
        setUserData(data.results[0]); // Assuming you want the first result
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

 const Quicklinks = [
   {
     icon: <PersonSearchRounded />,
     text: "Wanted Persons",
   },
   {
     icon: <ContactPhoneRounded />,
     text: "Dpo Contacts",
   },
   {
     icon: <ReportRounded />,
     text: "Report Crime",
   },
   {
     icon: <LocalTaxiRounded />,
     text: "Cab Services",
   },
   {
     icon: <LocalParkingRounded />,
     text: "Car Parks",
   },
   {
     icon: <Settings />,
     text: "Settings",
   },
 ];


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
      <Typography variant="body3" sx={{ mt: 3 }}>Quick Links</Typography>
      <Grid container spacing={2}>
      {Quicklinks.map((link, index) => (
        <Grid item xs={6} md={3} key={index}>
          <Link to={link.url} style={{ textDecoration: "none", display: "block" }}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Fab size="small" sx={{ zIndex: 0, backgroundColor: "#73C076", color: "white" }}>
                {link.icon}
              </Fab>
              <Typography variant="body2" sx={{ mt: 2, color: "text.primary" }}>
                {link.text}
              </Typography>
            </Paper>
          </Link>
        </Grid>
      ))}
        </Grid>
      </Box>
      <Box>
        <Typography>Recent activities</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Properties gridnum={6} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
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
