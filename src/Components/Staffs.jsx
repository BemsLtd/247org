import  { useState } from "react";
import Table from "./Table";
import { Alert, Slide, Snackbar, Typography } from "@mui/material";
import { ENDPOINTS } from "../data/Endpoints";
import makeAPIRequest from "../data";
import useStaffs from "../data/Staffs";
import Editstaffs from "./Modals/Editstaffs";

function Staffs() {
  const { data: Staffs, isLoading, error } = useStaffs();
  const [edit, setEdit] = useState(null);
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState({ status: "success", message: "this is an alert" });

  if (error) {
    console.log(".....");
  }

  const rows = Staffs?.data.map((data, i) => ({
    id: i + 1,
    Itemid: data.employee_id,
    fullname: data.employee_firstname + " " + data.employee_lastname,
    role: data.position,
    email: data.employee_email,
    type: data.employment_type,
    address: data.branch.address,
    status: data.status ? "Active" : "Inactive",
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "Itemid", headerName: "Item id", width: 90 },
    { field: "fullname", headerName: "Fullname", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "type", headerName: "Employment type", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  const handleEdit = (id) => {
    setEdit(id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await makeAPIRequest.put(
        `${ENDPOINTS.terminate}?employee_id=${id}`
      );
      if (res.data) {
        setMessage({type: "success", message: res.data.message})
      }
    } catch (error) {
      setMessage({ type: "error", message: error.message });
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
      <Typography>Manage Staffs</Typography>
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
      {rows && 
        <Table
          isloading={isLoading}
          rows={rows}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      }
      {edit && (
        <Editstaffs
          id={edit}
          open={edit ? true : false}
          handleClose={() => handleCloseEdit()}
        />
      )}
    </>
  );
}

export default Staffs;
