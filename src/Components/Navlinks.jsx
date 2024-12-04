import  { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import PropTypes from "prop-types";

export default function Navlinks({ link, name, icon, setAside, subMenu }) {
  const [open, setOpen] = useState(false); 

  const handleClick = () => {
    if (subMenu) {
      setOpen((prevOpen) => !prevOpen);
    }
  };

  return (
    <List>
      <ListItem disablePadding sx={{ color: "white" }}>
        <ListItemButton
          component={link ? Link : "div"}
          to={link || "#"}
          sx={{
            ":hover": {
              color: "green",
              backgroundColor: "rgba(255, 255, 255)",
            },
          }}
          onClick={() => {
            handleClick();
            if (link) {
              setAside("-500px");
            }
          }}
        >
          <ListItemIcon
            sx={{
              ":hover": {
                color: "green",
                backgroundColor: "rgba(255, 255, 255)",
              },
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={name} />
          {subMenu && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
      {subMenu && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subMenu.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.link}
                  sx={{ pl: 4 }}
                  onClick={() => setAside("-500px")} // Close aside when clicking submenu
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </List>
  );
}

Navlinks.propTypes = {
  link: PropTypes.string,
  name: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  setAside: PropTypes.any,
  subMenu: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    })
  ),
};
