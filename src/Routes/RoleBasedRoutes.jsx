//import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoute from "./AdminRoute";
// import UserRoutes from "./UserRoutes";
// import GuestRoutes from "./GuestRoutes";
import PublicRoutes from "./PublicRoutes";
import Notfound from "../pages/Notfound";
import Routeauth from "./Routeauth";
import BranchAdminRoutes from "./BranchAdminRoutes";
import UnitAdminRoutes from "./UnitAdminRoutes";

const RoleBasedRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/*" element={<PublicRoutes />} />

      <Route element={<Routeauth />}>
        {/* Admin route */}
        <Route path="/super_admin/*" element={<AdminRoute />} />

        {/* Landlord route */}
        <Route path="/unit_admin/*" element={<UnitAdminRoutes />} />

        {/* ceo route */}
        <Route path="/branch_admin/*" element={<BranchAdminRoutes />} />

     
        
      </Route>

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
};

export default RoleBasedRoutes;
