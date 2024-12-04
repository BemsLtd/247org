//import { useState } from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import './App.css'
import RoleBasedRoutes from "./Routes/RoleBasedRoutes";
import "@fontsource/roboto";
import { ThemeToggleProvider } from "./store/Darkmode";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {

  return (
    <ThemeToggleProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <RoleBasedRoutes />
        </Router>
      </QueryClientProvider>
    </ThemeToggleProvider>
  );
}

export default App
