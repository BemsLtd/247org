// ThemeToggleProvider.js
import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { ColorModeContext } from "./ThemeContext";
import { green } from "@mui/material/colors";

export const ThemeToggleProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

const theme = useMemo(
  () =>
    createTheme({
      palette: {
        mode: mode,
        primary: {
          main: green[700],
          light: green[400],
          dark: green[800]
        },
      },
    }),
  [mode]
);


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

ThemeToggleProvider.propTypes = {
  children: PropTypes.node.isRequired, // Ensures `children` is provided and is a valid React node
};
