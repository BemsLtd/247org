import { useState } from "react";
import Table from "./Table";
import { Alert, Slide, Snackbar, Typography, Avatar } from "@mui/material";
import { ENDPOINTS } from "../data/Endpoints";
import makeAPIRequest from "../data";
import useStaffs from "../data/Staffs";
import Editstaffs from "./Modals/Editstaffs";

// Default broken image URL
const defaultAvatar = "/broken-image.jpg";  // This is your fallback image URL

function Staffs() {
  const { data: Staffs, isLoading, error } = useStaffs();
  const [edit, setEdit] = useState(null);
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState({ status: "", message: "" });

  if (error) {
    console.log(".....");
  }

  const rows = Staffs?.data?.map((data, i) => ({
    id: i + 1,
    Itemid: data.id,
    avatar: data.avatar || defaultAvatar,  // Use default if avatar is missing
    fullname: data.first_name + " " + data.last_name,
    role: data.position,
    email: data.email,
    type: data.employment_type,
    nin: data.nin,
    address: data.address,
    status: data.is_staff ? "Active" : "Inactive",
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "Itemid", headerName: "Item id", width: 90 },
    { field: "avatar", headerName: "Avatar", width: 90, renderCell: (params) => (
      <Avatar src={params.value} alt="Avatar" />
    )},
    { field: "fullname", headerName: "Fullname", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "nin", headerName: "NIN", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "type", headerName: "Employment type", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  const handleEdit = (id) => {
    setEdit(id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await makeAPIRequest.put(
        `${ENDPOINTS.terminate}?id=${id}`
      );
      if (res.data) {
        setMessage({ type: "success", message: res.data.message });
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

      {isLoading ? (
        <Typography>Loading staff data...</Typography>
      ) : rows?.length > 0 ? (
        <Table
          isloading={isLoading}
          rows={rows}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <Typography>No staff in company, please add staff.</Typography>
      )}

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
