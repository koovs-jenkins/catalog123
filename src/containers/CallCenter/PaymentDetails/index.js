import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  Paper,
  Grid,
  TextField,
  Fab,
  Typography,
  Table,
  Button,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";
import CustomTableCell from "../../../components/CustomTableCell";
import {
  refundInfoListHeader,
  orderPaymentInfoListHeader
} from "../../../../metadata";
import { fetchPaymentDetailsApi } from "../../../api/callCenter";
import Notify from "../../../components/Notify";
import { getCompleteDateMonth } from "../../../helpers";

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: { ...theme.paper,marginTop:"10px",padding:"10px" },
  tableWrapper: {
    ...theme.tableWrapper,
    marginTop: theme.spacing.unit * 2,
    height: "none"
  },
  control:{padding:"10px"},
});

class PaymentDetails extends React.Component {
  state = {
    refundInfoList: [],
    orderPaymentInfoList: [],
    loading: false,
    orderId: "",
    message: "",
    
  };

  handleSearch = e => {
    if (e.key === "Enter") {
      this.handleRequest(e);
    }
  };

  handleRequest = e => {
    e.preventDefault();
    const that = this;
    this.setState(
      {
        message: "",
        loading: true,
        refundInfoList: [],
        orderPaymentInfoList: []
      },
      () => {
        if (
          that.state.orderId &&
          that.state.orderId.length > 0 &&
          that.state.orderId.trim() == ""
        ) {
          this.setState({ message: "Nothing found to search" });
        } else {
          fetchPaymentDetailsApi(that.props.userId, that.state.orderId).then(
            res => {
              if (typeof res.data == "object") {
                if (
                  res.data.refundInfoList &&
                  res.data.refundInfoList.length > 0 &&
                  res.data.orderPaymentInfoList.length > 0
                ) {
                  that.setState({
                    refundInfoList: res.data.refundInfoList,
                    orderPaymentInfoList: res.data.orderPaymentInfoList,
                    loading: false
                  });
                } else if (
                  res.data.refundInfoList &&
                  res.data.refundInfoList.length > 0 &&
                  res.data.orderPaymentInfoList.length == 0
                ) {
                  that.setState({
                    refundInfoList: res.data.refundInfoList,
                    message: `No Order payment info found for orderId ${that.state.orderId}`,
                    loading: false
                  });
                } else if (
                  res.data.refundInfoList &&
                  res.data.refundInfoList.length == 0 &&
                  res.data.orderPaymentInfoList.length > 0
                ) {
                  that.setState({
                    orderPaymentInfoList: res.data.orderPaymentInfoList,
                    message: `No Refund info found for orderId ${that.state.orderId}`,
                    loading: false
                  });
                } else {
                  that.setState({
                    message: `No record exist for orderId ${that.state.orderId}`
                  });
                }
              } else {
                that.setState({
                  message: `No result found for orderId ${that.state.orderId}`
                });
              }
            }
          );
        }
      }
    );
  };

  handleChange = e => {
    if (
      e.target.value &&
      e.target.value.length > 0 &&
      e.target.value.trim() == ""
    ) {
      this.setState({ message: "Nothing found to search" });
    } else {
      this.setState({ orderId: e.target.value });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      refundInfoList,
      orderPaymentInfoList,
      orderId,
      message
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Payment Details
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={12}>
            <Grid item xs={12} sm={6} md={12} className={classes.control}>
              <TextField
                fullWidth
                label="orderId"
                name="orderId"
                variant="outlined"
                margin="none"
                value={orderId}
                onChange={this.handleChange}
                onKeyDown={this.handleSearch}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12} className={classes.control}>
              <Button
                color="primary"
                className={classes.fab}
                variant="contained"
                onClick={this.handleRequest}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>
          {orderPaymentInfoList.length > 0 &&   (
           <div className={classes.tableWrapper}>
            <Paper className={classes.paper}> 
              <Typography variant="h6" gutterBottom component="h6">
                Payment Details
              </Typography>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    {orderPaymentInfoListHeader.map((v, k) => (
                      <TableCell key={k + v}>{v}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderPaymentInfoList.map(orderPaymentInfo => (
                    <TableRow key={orderPaymentInfo.id} hover>
                      <TableCell>{orderPaymentInfo.orderId}</TableCell>
                      <TableCell>{orderPaymentInfo.netCollectable}</TableCell>
                      <TableCell>{orderPaymentInfo.orderTotal}</TableCell>
                      <TableCell>{orderPaymentInfo.paymentGatewayId}</TableCell>
                      <TableCell>
                        {orderPaymentInfo.paymentGatewayTxnId}
                      </TableCell>
                      <TableCell>
                        {orderPaymentInfo.paymentLineAmount}
                      </TableCell>
                      <TableCell>
                        {orderPaymentInfo.paymentLineStatus}
                      </TableCell>
                      <TableCell>{orderPaymentInfo.paymentType}</TableCell>
                      <TableCell>{orderPaymentInfo.refunded}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            </div>
          )}
          {refundInfoList.length > 0 && (
            <div className={classes.tableWrapper}>
               <Paper className={classes.paper}> 
                  <Typography variant="h6" gutterBottom component="h6">
                    Refund Details
                  </Typography>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        {refundInfoListHeader.map((v, k) => (
                          <CustomTableCell key={k + v}>{v}</CustomTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {refundInfoList.map(refundInfo => (
                        <TableRow key={refundInfo.id} hover>
                          <TableCell>{refundInfo.orderId}</TableCell>
                          <TableCell>{refundInfo.orderTxnId}</TableCell>
                          <TableCell>{refundInfo.orderActualAmount}</TableCell>
                          <TableCell>{refundInfo.refundAmount}</TableCell>
                          <TableCell>{refundInfo.refundMethod}</TableCell>
                          <TableCell>{refundInfo.gatewayRefundStatus}</TableCell>
                          <TableCell>{refundInfo.refundStatus}</TableCell>
                          <TableCell>{refundInfo.refundRef}</TableCell>
                          <TableCell>{refundInfo.paymentSrc}</TableCell>
                          <TableCell>{refundInfo.paymentDest}</TableCell>
                          <TableCell>{refundInfo.refundRetrial}</TableCell>
                          <TableCell>
                            {refundInfo.creationDate &&
                              getCompleteDateMonth(refundInfo.creationDate)}
                          </TableCell>
                          {/* <TableCell>
                            {refundInfo.creationDate &&
                              getCompleteDateMonth(refundInfo.modifiedDate)}
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </Paper>
            </div>
          )
          }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(connect(mapStateToProps)(PaymentDetails));
