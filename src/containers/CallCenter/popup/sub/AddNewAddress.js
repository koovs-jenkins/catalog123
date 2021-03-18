import React from "react";
import { Grid, TextField, Fab,Button } from "@material-ui/core";
import Modal from "../../../../components/Modal";

class AddNewAddress extends React.Component {
  render() {
    const {
      isEdit,
      showModal,
      handleModalClose,
      classes,
      handleNewAddressSubmit,
      handleChange,
      formData
    } = this.props;

    return (
      <Modal
        open={showModal}
        onClose={handleModalClose}
        title={isEdit ? "Edit Address" : "Add new address"}
      >
        <Grid container spacing={12} >
          <Grid item xs={12} sm={6} md={4} style={{padding:"10px"}}>
            <TextField
              fullWidth
              variant="outlined"
              name="name"
              label="Name"
              onChange={handleChange}
              value={formData.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} style={{padding:"10px"}}>
            <TextField
              variant="outlined"
              name="zip"
              label="Zip"
              type="number"
              onChange={handleChange}
              inputProps={{ min: 0, max: 999999 }}
              value={formData.zip}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} style={{padding:"10px"}}>
            <TextField
              variant="outlined"
              disabled
              name="city"
              label="City"
              onChange={handleChange}
              value={formData.city}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} style={{padding:"10px"}}>
            <TextField
               variant="outlined"
              disabled
              name="state"
              label="State"
              onChange={handleChange}
              value={formData.state}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} style={{padding:"10px"}}>
            <TextField
               variant="outlined"
              name="address"
              label="Address"
              onChange={handleChange}
              value={formData.address}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} style={{padding:"10px"}}>
            <TextField
              variant="outlined"
              name="email"
              label="Email"
              type="email"
              onChange={handleChange}
              value={formData.email}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} style={{padding:"10px"}}>
            <TextField
              variant="outlined"
              name="mobile"
              label="mobile"
              type="number"
              onChange={handleChange}
              value={formData.mobile}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={8} md={8} style={{padding:"10px"}}>
            <Button
              className={classes.fab}
              color="primary"
              variant="contained"
              onClick={handleNewAddressSubmit}
            >
              Submit
            </Button>
            <Button
              className={classes.fab}
              color="primary"
              variant="contained"
              onClick={() =>
                handleModalClose(isEdit ? "editAddress" : "newAddress")
              }
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Modal>
    );
  }
}
export default AddNewAddress;
