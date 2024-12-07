import { Route, Routes } from "react-router-dom";
import WantedPerson from "../pages/Wantedperson";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Managecompanies from "../pages/admin/Managecompany";
import Managestaffs from "../pages/admin/Managestaffs";
import Manageevents from "../pages/admin/Manageevents";
import Manageattendee from "../pages/admin/Manageattendee";
import Managebranches from "../pages/admin/Managebranches";
import ManageManifest from "../pages/ManageManifest";
import Managereport from "../pages/medicals/Medicalreports";
import RequestReport from "../pages/medicals/Requestreport";
import Crimediary from "../pages/CrimeDiary";
import Managetenats from "../pages/Managetenats";
import Manageunits from "../pages/Manageunits";
import Users from "../Components/Users";
import ManageForce from "../pages/admin/Manageforce";
import Onboarding from "../pages/admin/Onboarding";

export default function AdminRoute() {
  return (
    <Routes>
      

      <Route element={<Dashboard />}>
        <Route index element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/manage-companies" element={<Managecompanies />} />
      <Route path="/manage-staffs" element={<Managestaffs />} />
      <Route path="/manage-events" element={<Manageevents />} />
      <Route path="/manage-attendees" element={<Manageattendee />} />
      <Route path="/manage-branches" element={<Managebranches />} />
      <Route path="/manage-manifest" element={<ManageManifest />} />
      <Route path="/medical-reports" element={<Managereport />} />
      <Route path="/request-report" element={<RequestReport />} />
      <Route path="/crime-diary" element={<Crimediary />} />
      <Route path="/manage-tenants" element={<Managetenats />} />
      <Route path="/manage-units" element={<Manageunits />} />
      <Route path="/missing-persons" element={<WantedPerson />} />
      <Route path="/users" element={<Users />} />
      <Route path="/manage-force" element={<ManageForce />} />
      <Route path="/onboarding" element={<Onboarding />} />

      
      </Route>
    </Routes>
  );
}
