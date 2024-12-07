//import React from "react";
import { useSelector } from "react-redux";
import Adminside from "./Adminside";
import Landlordside from "./Branchadminside";
import PropTypes from "prop-types";
import Ceoside from "./unitadminside";


export default function Aside({ setAside }) {
  const userRole = useSelector((state) => state.userDetails.user.user?.role);
  console.log(userRole);
  
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