import { Mail, Notifications, SyncAlt } from "@mui/icons-material";
import { AppBar, Avatar, Badge, Box, Divider, InputBase, Menu, MenuItem,  Toolbar, Tooltip, Typography, styled } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateUserDetails } from "../store/userinfo";
import makeAPIRequest from "../data";
import { ENDPOINTS, TOKEN_KEY } from "../data/Endpoints";

export default function Navbar({setAside}) {
  const user = useSelector((state) => state.userDetails); 
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState(false)
console.log(user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(updateUserDetails({ user: "" }));
    navigate("/", { replace: true });
  };

  const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
  });

  const SAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    // width: "100wp"
  }));

  const Search = styled("div")(({theme}) => ({
    backgroundColor: "white",
    padding: "0px, 10px",
    borderRadius: theme.shape.borderRadius,
    width: "40%",
    color:"black"
  }))

  const Icons = styled(Box)(({theme}) => ({
    // backgroundColor: "white",
    display: "none",
    alignItems: "center",
    gap: "20px",
    [theme.breakpoints.up("sm")]:{
        display: "flex"
    }
  }));

   const Userbox = styled(Box)(({ theme }) => ({
     // backgroundColor: "white",
     display: "flex",
     alignItems: "center",
     gap: "10px",
     [theme.breakpoints.up("sm")]: {
       display: "none",
     },
   }));

   const switchuser = async(newrole) => {
    const response = await makeAPIRequest.post(ENDPOINTS.switchUser, {
      new_role: newrole,
    });
    if (!response.data) {
      throw new Error("Network response was not ok");
    }
    const {data, token} = response.data
    localStorage.setItem(TOKEN_KEY, token);
    dispatch(updateUserDetails({ user: data }));
   }
  return (
    <SAppBar position="relative">
      <StyledToolbar>
        <MenuIcon
          sx={{ display: { xs: "block", md: "none" }, color:'green' }}
          onClick={() => setAside("0px")}
        />
        <Search>
          <InputBase placeholder="Search...." color="secondary" />
        </Search>
        <Icons>
          <Badge badgeContent={4} color="primary">
            <Mail color="action" />
          </Badge>

          <Badge badgeContent={4} color="primary">
            <Notifications color="action" />
          </Badge>
          <Avatar
            sx={{ width: 30, height: 30 }}
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            onClick={() => setOpen(true)}
          />
        </Icons>
        <Userbox onClick={() => setOpen(true)}>
          <Avatar
            sx={{ width: 30, height: 30 }}
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <Typography>{user?.middle_name}</Typography>
        </Userbox>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem>
          <Avatar src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />{" "}
          {user?.first_name}
        </MenuItem>
        <MenuItem sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="p">{user?.role}</Typography>
          <Tooltip title="Switch Account">
            <SyncAlt onClick={() => setRole((prev) => !prev)} />
          </Tooltip>
        </MenuItem>
        {role && (
          <Box>
            <MenuItem>
              <Typography variant="p" onClick={() => switchuser("landlord")}>
                Landlord
              </Typography>
            </MenuItem>
            <MenuItem>
              <Typography variant="p" onClick={() => switchuser("ceo")}>
                Ceo
              </Typography>
            </MenuItem>
          </Box>
        )}
        <Divider />

        <MenuItem>
          <Link to="profile">Profile</Link>
        </MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </SAppBar>
  );
}

Navbar.propTypes = {
  setAside : PropTypes.any
}