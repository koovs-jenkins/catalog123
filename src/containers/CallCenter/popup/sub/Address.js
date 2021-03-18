import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  CardHeader
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import AddNewAddress from "./AddNewAddress";

class Address extends React.Component {
  render() {
    const {
      type,
      modalData,
      classes,
      handleAddressSelect,
      handleToggle,
      title,
      newAddress,
      editAddress,
      handleAddressEdit,
      handleAddressDelete,
      handleNewAddressSubmit,
      handleEditAddressSubmit,
      handleFormChange,
      formData
    } = this.props;
    const isShipping = title.indexOf("shipping") > -1;

    return (
      <Grid container spacing={24} alignItems="stretch">
        <Grid item xs={12} className={classes.title}>
          <Typography variant="h6">{title}</Typography>
          <Button
            variant="contained"
            size="small"
            color="primary"
            className={classes.button}
            onClick={() => handleToggle("newAddress")}
          >
            Add New Address
          </Button>
        </Grid>
        {modalData.address &&
          modalData.address.map(v => (
            <Grid item key={v.id} item xs={12} sm={6} md={3}>
              <Card className={classes.card} raised={v.isSelected}>
                <CardHeader
                  style={{ paddingBottom: 0 }}
                  avatar={
                    v.isDefault && <Chip label="Default" color="primary" />
                  }
                  action={
                    <React.Fragment>
                      <IconButton
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleAddressEdit(v.id)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleAddressDelete(v.id)}
                      >
                        <Delete />
                      </IconButton>
                    </React.Fragment>
                  }
                ></CardHeader>
                <CardContent className={classes.content}>
                  <Typography className={classes.bold}>
                    {v.shippingAddress.name}
                  </Typography>
                  <Typography>
                    {v.shippingAddress.address &&
                    v.shippingAddress.address.length > 250
                      ? v.shippingAddress.address.substring(0, 250) + "..."
                      : v.shippingAddress.address}
                  </Typography>
                  <Typography>
                    {[v.shippingAddress.city, v.shippingAddress.state].join(
                      ", "
                    )}
                  </Typography>
                  <Typography>{v.shippingAddress.zip}</Typography>
                  <Typography className={classes.bold}>
                    {v.shippingAddress.phone}
                  </Typography>
                  <Typography variant="caption" className={classes.green}>
                    {((modalData.shippingAddress &&
                      v.id == modalData.shippingAddress.id &&
                      isShipping) ||
                      (modalData.pickupAddress &&
                        v.id == modalData.pickupAddress.id &&
                        !isShipping)) &&
                      ((!isShipping && modalData.pickupAddress.reversePickupMessage) ||
                        v.servicableMsg)}
                  </Typography>
                </CardContent>
                <CardActions className={classes.action}>
                  <Button
                    disabled={
                      (modalData.shippingAddress &&
                        v.id == modalData.shippingAddress.id &&
                        isShipping) ||
                      (modalData.pickupAddress &&
                        v.id == modalData.pickupAddress.id &&
                        !isShipping)
                    }
                    variant="contained"
                    size="small"
                    color="primary"
                    fullWidth
                    onClick={() =>
                      handleAddressSelect(v, isShipping ? true : false)
                    }
                  >
                    {(modalData.shippingAddress &&
                      v.id == modalData.shippingAddress.id &&
                      isShipping) ||
                    (modalData.pickupAddress &&
                      v.id == modalData.pickupAddress.id &&
                      !isShipping)
                      ? "Selected"
                      : "Select"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        <AddNewAddress
          showModal={newAddress}
          handleModalClose={handleToggle}
          classes={classes}
          handleNewAddressSubmit={handleNewAddressSubmit}
          handleChange={handleFormChange}
          formData={formData}
        />
        <AddNewAddress
          isEdit={true}
          showModal={editAddress}
          handleModalClose={handleToggle}
          classes={classes}
          handleNewAddressSubmit={handleEditAddressSubmit}
          handleChange={handleFormChange}
          formData={
            modalData.editAddress && modalData.editAddress.shippingAddress
              ? modalData.editAddress.shippingAddress
              : {}
          }
        />
      </Grid>
    );
  }
}
export default Address;
