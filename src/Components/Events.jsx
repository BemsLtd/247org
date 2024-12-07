import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { Edit, Save, Visibility } from "@mui/icons-material";
import ModalBox from "./Modal";
import { useState } from "react";
import InputCom from "./InputCom";
import SelectCom from "./SelectCom";
import { BASE_URL, ENDPOINTS } from "../data/Endpoints";
import makeAPIRequest from "../data";
import Notice from "./Notice";
import { Link } from "react-router-dom";

function Events({ gridnum, pagination }) {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState({ status: "", message: null });
  const { data: properties, isLoading, error } = useProperties();

  const [openModal, setOpenModal] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [formValues, setFormValues] = useState({
    property_name: "",
    units: "",
    property_address: "",
    type: "",
    image: "",
  });

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = (property) => {
    setEditProperty(property);
    setFormValues({
      property_id: property.id,
      property_name: property.name,
      units: property.number_of_units,
      property_address: property.address,
      type: property.type,
      image: property.image,
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setEditProperty(null);
    setOpenModal(false);
  };

  const handleSave = async () => {
    try {
      await makeAPIRequest.post(ENDPOINTS.editproperty, formValues);
      setMessage({ type: "success", message: message });
      setEditProperty(null);
    } catch (error) {
      console.error("Failed to save property:", error);
      setMessage({ type: "success", message: "Failed to save property" });
    }

    handleClose();
  };
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box>
      <Grid container spacing={2}>
        {error && <Typography color="error">{error.message}</Typography>}
        {(isLoading ? Array.from(new Array(10)) : properties?.data || []).map(
          (item, i) => (
            <Grid item xs={12} sm={gridnum} key={item?.id ?? `loading-${i}`}>
              {" "}
              {/* Use a unique key */}
              <Card sx={{ height: "100%" }}>
                {isLoading ? (
                  <Skeleton variant="rectangular" height={200} />
                ) : (
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      item?.image
                        ? `${BASE_URL}uploads/${item.image}`
                        : "default_image_url"
                    }
                    alt={item?.name ?? "Default description"}
                    style={{ objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton animation="wave" height={30} width="80%" />
                      <Skeleton animation="wave" height={20} width="60%" />
                    </>
                  ) : (
                    <>
                      <Typography gutterBottom variant="h6" component="div">
                        {item?.name?.length > 30
                          ? `${item.name.substr(0, 25)}...`
                          : item?.name ?? "247 Building"}
                      </Typography>
                      <Typography variant="body2" color="text.error">
                        by: {item?.user_id ?? "Unknown"}
                      </Typography>
                    </>
                  )}
                </CardContent>
                <CardActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Visibility />}
                    disabled={isLoading}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleOpen(item)}
                    size="small"
                    startIcon={<Edit />}
                    color="warning"
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      {pagination && properties && !isLoading && (
        <Pagination
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
          count={properties.total_pages}
          page={page}
          onChange={handleChange}
        />
      )}

      {editProperty && (
        <ModalBox open={openModal} handleClose={handleClose}>
          <h2>Edit Property</h2>
          {message.message && (
            <Notice
              message={message.message}
              status={message.type}
              onClose={handleClose}
            />
          )}
          <Card sx={{ height: "100%" }}>
            <CardMedia
              component="img"
              height="200"
              image={
                formValues?.image
                  ? `${BASE_URL}uploads/${formValues.image}`
                  : "default_image_url"
              }
              alt={formValues?.name ?? "Default description"}
              style={{ objectFit: "cover" }}
            />
            <CardContent>
              <Stack spacing={2}>
                <InputCom
                  id="property_name"
                  label="Property Name"
                  type="text"
                  value={formValues.property_name}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      property_name: e.target.value,
                    })
                  }
                />
                {formValues.units && (
                  <Link
                    style={{ display: "inline-flex", justifyContent: "right" }}
                  >
                    View Units
                  </Link>
                )}

                <InputCom
                  id="units"
                  label="Number of flats"
                  disabled={true}
                  type="text"
                  value={formValues.units}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      units: e.target.value,
                    })
                  }
                />

                <InputCom
                  id="property_address"
                  label="Location"
                  type="text"
                  value={formValues.property_address}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      property_address: e.target.value,
                    })
                  }
                />
                <SelectCom
                  id="type"
                  name="type"
                  label="Property Type"
                  value={formValues.type}
                  options={[
                    { value: "tenancy", text: "Tenancy" },
                    { value: "commercial", text: "Commercial" },
                  ]}
                  onChange={(e) =>
                    setFormValues({ ...formValues, type: e.target.value })
                  }
                />
              </Stack>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </ModalBox>
      )}
    </Box>
  );
}

Events.propTypes = {
  gridnum: PropTypes.number,
  pagination: PropTypes.bool,
};

export default Events;
