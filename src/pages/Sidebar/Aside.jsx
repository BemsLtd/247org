import { useSelector } from "react-redux";
import Adminside from "./Adminside";
import Landlordside from "./Branchadminside";
import Ceoside from "./unitadminside";
// import CircularProgress from "@mui/material/CircularProgress"; // Importing CircularProgress
import PropTypes from "prop-types";


// const CircularLoading = () => (
//   <CircularProgress
//     size={70}
//     sx={{
//       position: "fixed",
//       left: "50%",
//       top: "50%",
//       transform: "translate(-50%, -50%)",
//       zIndex: 2,
//     }}
//   />
// );

export default function Aside({ setAside }) {
  const userRole = useSelector((state) => state.userDetails.user.user?.role);
  console.log(userRole);

  
  if (!userRole) {
    return window.location.reload();
    // Display loader while waiting for userRole
  }

  return (
    <>
      {userRole === "admin" ? (
        <Adminside setAside={setAside} />
      ) : userRole === "branch_admin" ? (
        <Landlordside setAside={setAside} />
      ) : userRole === "unit_admin" ? (
        <Ceoside setAside={setAside} />
      ) : null}
    </>
  );
}

Aside.propTypes = {
  setAside: PropTypes.any,
};
