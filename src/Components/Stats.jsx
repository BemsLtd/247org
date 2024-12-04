import { Home } from "@mui/icons-material";
import {  Box, Card, CardContent,Grid, Stack, Typography } from "@mui/material";

export default function Stats() {

  const stats = [
    {
      title: "Total Rent",
      numbers: 23,
      icon: <Home fontSize="large" sx={{ color: "#73C076" }}  />,
    },
    {
      title: "Total Rent",
      numbers: 23,
      icon: <Home fontSize="large" sx={{ color: "#73C076" }}  />,
    },
    {
      title: "Total Rent",
      numbers: 23,
      icon: <Home fontSize="large" sx={{ color: "#73C076" }}  />,
    },
    {
      title: "Total Rent",
      numbers: 23,
      icon: <Home fontSize="large" sx={{ color: "#73C076" }}  />,
    },
  ];

  return (
    <>
      {/* <StatContatiner sx={{ py: "10px",px: "10px" }} bgcolor={"primary"} position={"relative"}>
        <StatsBox>
          <Box>
            <Typography variant="body1" fontWeight={"bold"} sx={{ pb: "15px" }}>
              Total Tenants
            </Typography>
            <Typography variant="h5">32K</Typography>
          </Box>
          <Box>
            <Fab color="primary" aria-label="add">
              <UsbRounded fontSize="large" sx={{ color: "white" }} />
            </Fab>
          </Box>
        </StatsBox>
        <Divider sx={{ pt:"10px" }}/>
        <Typography sx={{ pt:"10px" }}><span style={{ color: "Orange" }}>20</span> New Tenants Today</Typography>
      </StatContatiner> */}
      <Grid container spacing={2} sx={{ width: "100%" , height:"100%"}}>
        {stats.map(({ title, numbers, icon }, i) => (
          <Grid item xs={12} md={6} key={i}>
           <Card sx={{ height: "100%",  border: "1px solid #73C076" }}>
              <CardContent>
              <Stack direction={'row'} justifyContent={"space-between"} alignItems={"center"}>
                <Box>
                <Typography
                  gutterBottom
                  sx={{ color: "text.secondary", fontSize: 14 }}
                >
                  {title}
                </Typography>
                <Typography variant="h5" component="div">
                  {numbers}
                </Typography>
                </Box>
                <Typography variant="body2">{icon}</Typography>
              </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
