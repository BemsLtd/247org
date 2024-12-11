import  { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  Grid,
  Divider,
  Container,
  Stack,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { Medicaldata } from '../../data/Medicaldata';



const Requestreport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredRecords = Medicaldata.filter(record => 
    (record.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toString().includes(searchTerm) // Convert `id` to string for comparison
  );
  

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Medical Records Search
            </Typography>
            <TextField
              fullWidth
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredRecords.map((record) => (
            <Card
              key={record.id}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={() => handlePatientClick(record)}
            >
              <CardContent>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="subtitle1" component="h3">
                      {record.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {record.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {record.id}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" align="right">
                      Last Visit: {record.lastVisit}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="right"
                    >
                      {record.doctor}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          {filteredRecords.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                No medical records found matching your search.
              </Typography>
            </Box>
          )}
        </Box>

        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedPatient && (
            <>
              <DialogTitle>
                Medical Profile - {selectedPatient.name}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ pt: 2 }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Stack direction={'row'} spacing={2}>
                        <Box
                          sx={{
                            width: 150, 
                            height: 150, 
                            borderRadius: "8px", 
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: 2, // Optional: add some shadow around the image
                          }}
                        >
                          <img
                            src={selectedPatient.image || 'https://via.placeholder.com/150'} // Fallback to placeholder if no image URL
                            alt="Patient"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover', // Ensures the image covers the entire box without distortion
                            }}
                            />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>
                            Patient Information
                          </Typography>
                          <Typography>ID: {selectedPatient.id}</Typography>
                          <Typography>
                            Email: {selectedPatient.email}
                          </Typography>
                          <Typography>Age: {selectedPatient.age}</Typography>
                          <Typography>
                            Blood Type: {selectedPatient.bloodType}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Medical Details
                      </Typography>
                      <Typography>
                        Diagnosis: {selectedPatient.diagnosis}
                      </Typography>
                      <Typography>
                        Allergies:{" "}
                        {selectedPatient.allergies.join(", ") || "None"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" gutterBottom>
                        Medications
                      </Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        {selectedPatient.medications.map((med, index) => (
                          <Typography component="li" key={index}>
                            {med}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" gutterBottom>
                        Appointments
                      </Typography>
                      <Typography>
                        Last Visit: {selectedPatient.lastVisit}
                      </Typography>
                      <Typography>
                        Next Appointment: {selectedPatient.nextAppointment}
                      </Typography>
                      <Typography>
                        Attending Doctor: {selectedPatient.doctor}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </Container>
  );
};

export default Requestreport;