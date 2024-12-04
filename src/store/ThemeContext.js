import { createContext, useContext } from "react";

// Create the context
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Custom hook to use the theme toggle context
export const useColorMode = () => useContext(ColorModeContext);
