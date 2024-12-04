import { Box, CssBaseline, Grid } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@emotion/react";

export default function DashboardLayout() {
  const [aside, setAside] = useState("-500px");
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow:"hidden" }}>
      <CssBaseline />

      <Box
        component="nav"
        bgcolor={
          theme.palette.mode === "dark"
            ? theme.palette.primary.dark
            : theme.palette.primary.light
        }
        sx={{
          display: { xs: "none", md: "block" },
          width: { sm: "300px" },
          flexShrink: { sm: 0 },
          zIndex: 999,
        }}
      >
        <Sidebar />
      </Box>

      <Box
        component="nav"
        // hidden
        bgcolor={
          theme.palette.mode === "dark"
            ? theme.palette.primary.dark
            : theme.palette.primary.light
        }
        sx={{
          display: { xs: "block", md: "none" },
          width: { sm: "300px" },
          flexShrink: { sm: 0 },
          zIndex: 999,
          position: "fixed",
          left: aside,
          bottom: 0,
          top:0
        }}
      >
        <Sidebar setAside={setAside} />
      </Box>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          width: "100%",
          // marginLeft:{md: "300px", xs :  "0px"},
          overflow: "scroll",
        }}
      >
        {/* Header */}
        <Box position="sticky" top={0} zIndex={888}>
          <Navbar aside={aside} setAside={setAside} />
        </Box>
        

        {/* Main content */}
        <Grid container p={2}>
          <Grid item xs={12}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}