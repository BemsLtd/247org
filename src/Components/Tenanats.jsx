import { Alert, Slide, Snackbar, Typography } from "@mui/material";
import useTenants from "../data/Tenants";
import Table from "./Table";
import { useState } from "react";
import Edittenants from "./Modals/Edittenats";
import makeAPIRequest from "../data";
import { ENDPOINTS } from "../data/Endpoints";

export default function Tenanats() {
  const { data: Tenants, isLoading, error } = useTenants();
  const [edit, setEdit] = useState(null);
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState({ status: "success", message: "this is an alert" });

  if (error) {
    console.log(".....");
  }

  const rows = Tenants?.data.map((data, i) => ({
    id: i + 1,
    Itemid: data.tenant_id,
    firstName: data.tenant_first_name,
    lastName: data.tenant_last_name,
    property: data.property_name,
    flate_number: data.unit_number,
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "Itemid", headerName: "Item id", width: 90 },
    { field: "firstName", headerName: "First name", width: 150 },
    { field: "lastName", headerName: "Last name", width: 150 },
    { field: "property", headerName: "Property", width: 150 },
    { field: "flate_number", headerName: "Flate Number", width: 150 },
  ];

  const handleEdit = (id) => {
    setEdit(id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await makeAPIRequest.delete(
        `${ENDPOINTS.deletetenant}?tenant_id=${id}`);
      if (res.data) {
        setMessage({type: "success", message: res.data.message})
      }
    } catch (error) {
      setMessage({ type: "success", message: error.response.data.message });
    }
  };
  const handleCloseEdit = () => {
    setEdit(null);
  };

   const handleClose = (event, reason) => {
     if (reason === "clickaway") {
       return;
     }
     setOpen(false);
   };

   const SlideTransition = (props) => {
     return <Slide {...props} direction="up" />;
   };
  return (
    <>
      <Typography>Tenant</Typography>
      {message.message && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleClose}
            severity={message.status}
            sx={{ width: "100%" }}
          >
            {message.message}
          </Alert>
        </Snackbar>
      )}
      <Table
        isloading={isLoading}
        rows={rows}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {edit && (
        <Edittenants
          id={edit}
          open={edit ? true : false}
          handleClose={() => handleCloseEdit()}
        />
      )}
    </>
  );
}
