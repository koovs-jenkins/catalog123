import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  Paper,
  Grid,
  TextField,
  Fab,
  Typography,
  Divider,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  Tooltip
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { paymentMethodMeta, statusMeta } from "../../../../metadata";
import { fetchOrderListApi } from "../../../api/order";
import { getSelectedItem } from "../../../helpers";
import Modal from "../../../components/Modal";
import { fetchTrackOrderApi } from "../../../api/callCenter";
import Notify from "../../../components/Notify";

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: { ...theme.paper,marginTop:"10px",padding:"10px" },
  section: {
    marginTop: theme.spacing.unit * 2,
    width: "100%",
    padding: theme.spacing.unit * 4,
    margin: "auto"
  },
  control:{padding:"10px"},
  bold: { fontWeight: "bold" },
  link: { textDecoration: "none" },
  image: { width: "80%", height: 100, textAlign: "center" },
  subheading: { textDecoration: "underline" }
});

class TrackOrder extends React.Component {
  state = {
    data: {},
    orderId: "",
    count: 0,
    loading: false,
    show: false,
    rows: [],
    message: ""
  };

  handleRequest = () => {
    const that = this;
    this.setState({ message: "", loading: true }, () => {
      if (that.state.orderId) {
        fetchOrderListApi(
          1,
          10,
          { orderId: that.state.orderId },
          that.props.userId
        ).then(res =>
          res && (res.status > 350 || !res.data)
            ? that.setState({
                message: `No data for order id : ${that.state.orderId}`,
                loading: false
              })
            : that.setState({
                data: res.data.data,
                count: res.data.count,
                loading: false
              })
        );
      } else {
        that.setState({
          message: `Please enter Order Id`,
          loading: false
        });
      }
    });
  };

  handleSubmit = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleRequest();
    }
  };

  handleModalToggle = () => {
    this.setState({ show: !this.state.show });
  };

  handleModalOpen = row => {
    fetchTrackOrderApi(this.props.userId, row.txnId, row.userId).then(res =>
      this.setState({
        rows: res.data != "" ? res.data.trackingInfo.milestones : [],
        show: !this.state.show
      })
    );
  };

  handleChange = e => {
    var value = e.target.value;
    this.setState({ message: "" }, () => {
      value.match(/[^a-zA-Z0-9]/) == null
        ? this.setState({ orderId: value })
        : this.setState({ message: "Enter correct format of orderId" });
    });
  };

  calculateAmount = (data, key1, key2) => {
    let totalAmount = 0;
    if (data.length > 0) {
      let result = [];
      data.map(v =>
        result.push((v[key1] ? v[key1] : 0) + (v[key2] ? v[key2] : 0))
      );
      totalAmount = result.reduce((a, b) => parseInt(a) + parseInt(b)) || 0;
    }
    return totalAmount;
  };

  render() {
    const { classes } = this.props;
    const { data, loading, count, show, rows, message, orderId } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid contianer lg={12} className={classes.wrapper}>
        <Typography variant="h5" gutterBottom component="h5">
          Track Order
        </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={12} className={classes.control}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                fullWidth
                label="OrderId"
                name="orderId"
                variant="outlined"
                value={orderId}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
              />
            </Grid>
          </Grid>
          <Grid container spacing={12}>
          <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <Button
                color="primary"
                variant="contained"
                onClick={this.handleRequest}
              >
                List Details
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading && <LinearProgress />}
        {count > 0 && (
          <Paper className={classes.paper}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Grid container spacing={24}>
                  <Grid item>
                    <Typography variant="h6">ORDER ID</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">: {data[0].orderId}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider variant="fullWidth" />
              </Grid>
              <Grid item xs={12} style={{marginTop:"10px"}}>
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <Typography>Date</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.bold}>
                      : {data[0].purchaseDate}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <Typography>Total Amount</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.bold}>
                      : Rs.{" "}
                      {this.calculateAmount(
                        data,
                        "actualPrice",
                        "shippingPrice"
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <Typography>Mode Of Payment</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.bold}>
                      :{" "}
                      {getSelectedItem(
                        paymentMethodMeta,
                        data[0].paymentMethod
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <Typography>Customer Name</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.bold}>
                      : {data[0].shipName}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={24}>
                  <Grid item xs={4}>
                    <Typography>Shipping Address</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.bold}>
                      : {data[0].shipAddress && data[0].shipAddress}
                      {data[0].shipCity && ", " + data[0].shipCity}
                      {data[0].shipState && ", " + data[0].shipState}
                      {data[0].shipZip && ", " + data[0].shipZip}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">ITEMS ({count})</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider variant="fullWidth" />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={24} style={{marginTop:"10px"}}>
                  {data.map(v => (
                    <Grid item xs={12} sm={6} md={3} key={v.txnId}>
                      <Card raised>
                        <CardContent>
                          <Typography>{v.productName}</Typography>
                          <Typography variant="caption">
                            Txn Id: <b>{v.txnId}</b>
                          </Typography>
                          <Typography>
                            Courier Name/AWB No.:{" "}
                            {v.shipServiceName && v.docketNo && (
                              <b>{v.shipServiceName + " / " + v.docketNo}</b>
                            )}
                          </Typography>
                          <Typography>
                            Pick Up Date: <b>{v.pickupdate}</b>
                          </Typography>
                          <Typography>
                            Order Status:{" "}
                            <b>{getSelectedItem(statusMeta, v.status)}</b>
                          </Typography>
                        </CardContent>
                        <CardActions>
                          {[1, 6, 28, 33, 37, 40].indexOf(v.status) > -1 && (
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              fullWidth
                              onClick={() => this.handleModalOpen(v)}
                            >
                              Track
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )}
        <Modal
          open={show}
          title="SHIPMENT STATUS"
          onClose={this.handleModalToggle}
        >
          <Grid container>
            <Grid item xs={12}>
              <Stepper activeStep={0} alternativeLabel>
                {rows.map((v, k) => (
                  <Step key={k} active={v.status != "future" ? true : false}>
                    <Tooltip
                      title={v.informationTexts.map(
                        j =>
                          j.title +
                          "\n" +
                          (j.date ? " : " + j.date + "\n" : "") +
                          (j.provider
                            ? "Provider : " + j.provider + "\n"
                            : "") +
                          (j.trackingId
                            ? "Tracking Id : " + j.trackingId + "\n"
                            : "") +
                          (j.pickupDate
                            ? "Pickup Date : " + j.pickupDate + "\n"
                            : "") +
                          (j.expectedDeliveryDate
                            ? "Expected Delivery Date : " +
                              j.expectedDeliveryDate +
                              "\n"
                            : "")
                      )}
                    >
                      <StepLabel>{v.title}</StepLabel>
                    </Tooltip>
                  </Step>
                ))}
              </Stepper>
            </Grid>
            <Grid item xs={12}>
              <Button
                color="primary"
                variant="contained"
                onClick={this.handleModalToggle}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  order: state.order
});

export default withStyles(style)(connect(mapStateToProps)(TrackOrder));
