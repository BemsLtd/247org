import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { CircularProgress } from "@mui/material";
// Lazy load the components
const WantedPerson = lazy(() => import("../pages/Wantedperson"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Home = lazy(() => import("../pages/Home"));
const Profile = lazy(() => import("../pages/Profile"));
const Managecompanies = lazy(() => import("../pages/admin/Managecompany"));
const Managestaffs = lazy(() => import("../pages/admin/Managestaffs"));
const Manageevents = lazy(() => import("../pages/admin/Manageevents"));
const Manageattendee = lazy(() => import("../pages/admin/Manageattendee"));
const Managebranches = lazy(() => import("../pages/admin/Managebranches"));
const ManageManifest = lazy(() => import("../pages/ManageManifest"));
const Managereport = lazy(() => import("../pages/admin/Medicalreports"));
const RequestReport = lazy(() => import("../pages/admin/Requestreport"));
const Crimediary = lazy(() => import("../pages/CrimeDiary"));
const Users = lazy(() => import("../Components/Users"));
const ManageForce = lazy(() => import("../pages/admin/Manageforce"));
const Onboarding = lazy(() => import("../pages/admin/Onboarding"));

const CircularLoading = () => (
  <>
    <CircularProgress
      size={70}
      sx={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
      }}
    />
    
  </>
);

export default function AdminRoute() {
  return (
    <Suspense fallback={<CircularLoading />}>
      <Routes>
        <Route element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
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
          <Route path="/missing-persons" element={<WantedPerson />} />
          <Route path="/users" element={<Users />} />
          <Route path="/manage-force" element={<ManageForce />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
