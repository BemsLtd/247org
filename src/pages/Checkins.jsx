import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import AddVisitor from '../Components/Modals/Addvisitor';
import { Formik } from 'formik';
import { Search } from '@mui/icons-material';

const Checkins = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddVisitor = (newVisitor) => {
    // Generate a unique id and add check-in timestamp
    const visitorWithDetails = {
      ...newVisitor,
      id: Date.now(),
      checkIn: new Date().toLocaleString(),
      status: 'checked-in',
      name: `${newVisitor.first_name} ${newVisitor.last_name}`,
    };

    setVisitors([visitorWithDetails, ...visitors]);
    setNotifications([
      { id: Date.now(), message: `Visitor ${visitorWithDetails.name} has checked in.` },
      ...notifications,
    ]);
  };

  const handleCheckout = (visitorId) => {
    setVisitors(
      visitors.map((visitor) =>
        visitor.id === visitorId
          ? { ...visitor, status: 'checked-out', checkOut: new Date().toLocaleString() }
          : visitor
      )
    );
  };

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.purpose_of_visit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Visitor Check-In
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setDialogOpen(true)}
            >
              Add Visitor
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Notification Panel */}
      {notifications.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            {notifications.slice(0, 3).map((notification) => (
              <Typography key={notification.id} color="text.secondary">
                {notification.message}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AddVisitor Modal Dialog */}
      <Dialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Add New Visitor</DialogTitle>
  <DialogContent>
    <Formik
      initialValues={{
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        purpose_of_visit: '',
      }}
      onSubmit={(values, { resetForm }) => {
        handleAddVisitor(values);
        resetForm();
        setDialogOpen(false);
      }}
    >
      {(formikProps) => (
        <AddVisitor
          formik={{
            ...formikProps,
            handleSubmit: formikProps.handleSubmit,
          }}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </Formik>
  </DialogContent>
</Dialog>

      {/* Visitor List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Visitor List
          </Typography>
          <TextField
            placeholder="Search visitors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>{visitor.name}</TableCell>
                    <TableCell>
                      <Typography>{visitor.email}</Typography>
                      <Typography color="text.secondary">{visitor.phone}</Typography>
                    </TableCell>
                    <TableCell>{visitor.purpose_of_visit}</TableCell>
                    <TableCell>
                      <Typography>{visitor.checkIn}</Typography>
                    </TableCell>
                    <TableCell>
                      {visitor.checkOut && <Typography>{visitor.checkOut}</Typography>}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          bgcolor: visitor.status === 'checked-in' ? 'success.light' : 'grey.300',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        {visitor.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {visitor.status === 'checked-in' && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleCheckout(visitor.id)}
                          size="small"
                        >
                          Check Out
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Checkins;