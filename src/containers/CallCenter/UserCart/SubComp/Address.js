import React from "react";
import {
  Fab,
  Chip,
  Card,
  Grid,
  Button,
  IconButton,
  CardHeader,
  Typography,
  CardContent,
  CardActions,
  CircularProgress
} from "@material-ui/core";
import Modal from "../../../../components/Modal";
import AddNewAddress from "../../popup/sub/AddNewAddress";
import { Edit, Delete } from "@material-ui/icons";
import { CallCenterConsumer } from "../../../../context/CallCenter/UserCart";

class Address extends React.Component {
  render() {
    const { title } = this.props;
   
    return (
      <CallCenterConsumer>
        {context => (
          <React.Fragment>
            <Grid
              container
              spacing={24}
              className={context.classes.tableWrapper}
            >
              <Grid item xs={12}>
                <Grid
                  container
                  justify="space-between"
                  style={{ margin: "10px 0" }}
                >
                  <Grid item>
                    <Typography variant="h6">{title}</Typography>
                  </Grid>
                  <Grid>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={context.handleAddressModalToggle}
                    >
                      Add New Address
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  {context.address && context.address.length &&
                    context.address.map(v => (
                      <Grid item key={v.id} item xs={12} sm={6} md={4}>
                        <Card
                          raised={v.isSelected}
                          style={{ position: "relative" }}
                        >
                          <CardHeader
                            style={{ paddingBottom: 0 }}
                            avatar={
                              v.isDefault && (
                                <Chip label="Default" color="primary" />
                              )
                            }
                            action={
                              <React.Fragment>
                                <IconButton
                                  variant="contained"
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    context.handleAddressEdit(v.id)
                                  }
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  variant="contained"
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    context.handleAddressDelete(v.id)
                                  }
                                >
                                  <Delete />
                                </IconButton>
                              </React.Fragment>
                            }
                          ></CardHeader>

                          <CardContent>
                            <Typography className={context.classes.bold}>
                              {v.shippingAddress.name}
                            </Typography>
                            <Typography>{v.shippingAddress.address}</Typography>
                            <Typography>
                              {[
                                v.shippingAddress.city,
                                v.shippingAddress.state,
                                v.shippingAddress.zip
                              ].join(" ")}
                            </Typography>
                            <Typography className={context.classes.bold}>
                              {v.shippingAddress.phone}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              disabled={v.isSelected}
                              onClick={() => context.handleAddress(v.id)}
                              fullWidth
                            >
                              Select
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  <Grid item xs={12} sm={6} md={4}></Grid>
                </Grid>
              </Grid>
            </Grid>
            <AddNewAddress
              isEdit={context.isEdit}
              formData={
                context.isEdit
                  ? context.editAddress.shippingAddress
                  : context.form
              }
              classes={context.classes}
              showModal={context.showAddressModal}
              handleChange={context.handleFormChange}
              handleModalClose={context.handleAddressModalToggle}
              handleNewAddressSubmit={
                context.isEdit
                  ? context.handleEditAddressSubmit
                  : context.handleNewAddressSubmit
              }
            />
            <Button
              color="primary"
              variant="contained"
              className={context.classes.fab}
              onClick={context.handleModalToggle}
            >
              Proceed to Place order
            </Button>
            <Modal
              open={context.show}
              title="Confirmation"
              onClose={context.handleModalToggle}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Typography>
                    Are you sure want to place this order ? (payment mode will
                    be COD)
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {context.loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Button
                      color="primary"
                      variant="contained"
                      className={context.classes.fab}
                      onClick={context.handleCheckout}
                    >
                      Okay
                    </Button>
                  )}
                  <Button
                    color="primary"
                    variant="contained"
                    className={context.classes.fab}
                    onClick={context.handleModalToggle}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Modal>
          </React.Fragment>
        )}
      </CallCenterConsumer>
    );
  }
}
export default Address;
