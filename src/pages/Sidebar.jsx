import { Box, Stack } from "@mui/material";
import Logo from "/logo.png";
import PropTypes from "prop-types";
import { MenuOpen } from "@mui/icons-material";
import { Typography, Divider } from "@mui/material";

import Aside from "./Sidebar/Aside";

export default function Sidebar({ setAside }) {
  return (
    <Box
      height={{ md: "100%" }}
      width={"100%"}
      sx={{
        overflowY: "auto", // Enable vertical scrolling
        overflowX: "hidden", // Prevent horizontal scrolling
        "&::-webkit-scrollbar": {
          width: "8px", // Scrollbar width
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888", // Scrollbar thumb color
          borderRadius: "4px", // Rounded corners
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555", // Thumb hover color
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1", // Scrollbar track color
        },
        scrollbarWidth: "thin", // Firefox: Use thin scrollbar
        scrollbarColor: "#888 #f1f1f1", // Thumb color and track color for Firefox
      }}
    >
      <Box height={"100%"} width={"100%"}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
          p={2}
        >
        <Stack direction={'row'} spacing={1}>
          <img
            src={Logo}
            srcSet={Logo}
            alt="Logo"
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            loading="lazy"
          />
          <Typography variant="p" component="h3" sx={{ color: 'white' }}>
            247 Security <br/><span style={{ color : 'lightgreen' }}>Dashboard</span>
          </Typography>
        </Stack>
          
          <MenuOpen
            onClick={() => setAside("-500px")}
            sx={{ display: { sx: "block", md: "none" } }}
          />
        </Stack>
        <Divider/>
        <Aside setAside={setAside} />
      </Box>
    </Box>
  );
}

Sidebar.propTypes = {
  aside: PropTypes.any,
  setAside: PropTypes.any,
};
