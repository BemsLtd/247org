import { useState } from "react";
import Table from "./Table";
import { Alert, Slide, Snackbar, Typography } from "@mui/material";
// import { ENDPOINTS } from "../data/Endpoints";
// // import makeAPIRequest from "../data";
import EditUsers from "./Modals/EditUsers";

// Dummy data generation
const generateDummyUsers = () => {
  return [
    {
      id: 1,
      first_name: "John",
      middle_name: "Michael",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      dob: "1990-05-15T00:00:00.000Z",
      gender: "male",
      nin: "12345678901",
      role: "admin",
      address: "123 Main St, Anytown, USA"
    },
    {
      id: 2,
      first_name: "Jane",
      middle_name: "Elizabeth",
      last_name: "Smith",
      email: "jane.smith@example.com",
      phone: "+0987654321",
      dob: "1988-09-22T00:00:00.000Z",
      gender: "female",
      nin: "98765432109",
      role: "user",
      address: "456 Oak Avenue, Somewhere City, Country"
    },
    {
      id: 3,
      first_name: "Alex",
      middle_name: "",
      last_name: "Johnson",
      email: "alex.johnson@example.com",
      phone: "+1122334455",
      dob: "1995-03-10T00:00:00.000Z",
      gender: "non-binary",
      nin: "56789012345",
      role: "manager",
      address: "789 Pine Road, Another Town, State"
    },
    {
      id: 4,
      first_name: "Emily",
      middle_name: "Rose",
      last_name: "Williams",
      email: "emily.williams@example.com",
      phone: "+5544332211",
      dob: "1992-11-30T00:00:00.000Z",
      gender: "female",
      nin: "45678901234",
      role: "user",
      address: "321 Maple Street, Somewhere Else, Country"
    },
    {
      id: 5,
      first_name: "Michael",
      middle_name: "James",
      last_name: "Brown",
      email: "michael.brown@example.com",
      phone: "+9988776655",
      dob: "1987-07-18T00:00:00.000Z",
      gender: "male",
      nin: "67890123456",
      role: "admin",
      address: "654 Elm Lane, Big City, State"
    }
  ];
};

function Users() {
  // Use dummy data instead of fetching from an API
  const Users = generateDummyUsers();
  const isLoading = false;
  const error = null;

  const [edit, setEdit] = useState(null);
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState({ status: "success", message: "this is an alert" });

  if (error) {
    console.log("Error fetching users:", error);
  }

  const rows = Users.map((data, i) => ({
    id: i + 1,
    userId: data.id,
    fullName: `${data.first_name} ${data.middle_name || ''} ${data.last_name}`.trim(),
    email: data.email,
    phoneNumber: data.phone,
    dateOfBirth: new Date(data.dob).toLocaleDateString(),
    gender: data.gender,
    nin: data.nin,
    role: data.role,
    address: data.address,
  }));

  const columns = [
    { field: "id", headerName: "No.", width: 50 },
    { field: "userId", headerName: "User ID", width: 90 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phoneNumber", headerName: "Phone Number", width: 150 },
    { field: "dateOfBirth", headerName: "Date of Birth", width: 120 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "nin", headerName: "NIN", width: 150 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "address", headerName: "Address", width: 250 },
  ];

  const handleEdit = (id) => {
    setEdit(id);
  };

  const handleDelete = async (id) => {
    try {
      // Simulating delete request
      console.log(`Deleting user with ID: ${id}`);
      setMessage({type: "success", message: `User ${id} deleted successfully`});
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
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
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
        <EditUsers
          id={edit}
          open={edit ? true : false}
          handleClose={() => handleCloseEdit()}
        />
      )}
    </>
  );
}

export default Users;