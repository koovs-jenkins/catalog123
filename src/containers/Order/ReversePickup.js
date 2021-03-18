import React from "react";

import {
  AppBar,
  Tabs,
  Tab,
  Paper,
  Grid,
  TextField,
  Typography,
  Fab,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  CircularProgress,
  LinearProgress
} from "@material-ui/core";
import CustomTableCell from "../../components/CustomTableCell";
import Pagination from "react-js-pagination";
import {
  reversePickupHeader,
  statusMeta,
  paymentMethodMeta,
  bulkCsvHeader
} from "../../../metadata";
import { withStyles,Button } from "@material-ui/core";
import { connect } from "react-redux";
import {
  fetchAvailableCouriers,
  postReversePickUp,
  postRpuCancelled,
  postBulkCsvAction
} from "../../store/actions/order";
import {
  getSelectedItem,
  validateCsvData,
  arraysIdentical
} from "../../helpers";
import { Link } from "react-router-dom";
import ReversePickupPopup from "./popup/ReversePickupPopup";
import Notify from "../../components/Notify";
import RpuCancelled from "./popup/RpuCancelled";
import ViewShipmentDetails from "./popup/ViewShipmentDetails";
import { fetchOrderListApi } from "../../api/order";
import Papa from "papaparse";
import axios from "axios";

function LinkTab(props) {
  return (
    <Tab component="a" onClick={event => event.preventDefault()} {...props} />
  );
}

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 1,
    marginTop: "5px",
    maxWidth: "100%"
  },
  select: {
    width: "100%",
    height: "56px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "white"
  },
  fab: {
    margin: theme.spacing.unit
  },
  heading: {
    margin: theme.spacing.unit * 2
  },
  control:{
    padding:"0px 10px"
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    ...theme.tableWrapper
  },
  subText: {
    fontSize: "15px"
  }
});

class ReversePickup extends React.Component {
  initialState = {
    orderId: "",
    txnId: "",
    startDate: "",
    endDate: "",
    searchParams: { shippingStatus: 8, txnStatus: "33,40,37" },
    showModal: false,
    modalData: {
      txnId: null,
      quantity: null,
      productName: null,
      courier: "",
      couriers: [],
      reason: "",
      userId: 0
    },
    loading: false,
    rpuModal: false,
    rpuData: {
      txnId: null,
      quantity: null,
      productName: null,
      reason: ""
    },
    csvFile: {},
    shipment: {
      show: false,
      data: {}
    },
    count: 0,
    loading: false,
    reasonData: []
  };

  state = {
    activePage: 1,
    rows: [],
    countPerPage: 10,
    value: 0,
    ...this.initialState
  };

  handleOrderFetch = activePage => {
    const that = this;
    that.setState({ message: "", loading: true }, () =>
      fetchOrderListApi(
        activePage,
        that.state.countPerPage,
        that.state.searchParams,
        that.props.userId
      ).then(res =>
        res && res.status < 350
          ? that.setState({
              rows: res.data.data,
              count: res.data.count,
              loading: false
            })
          : that.setState({
              message: (res.data && res.data.message) || res.statusText,
              loading: false
            })
      )
    );
  };

  handleSearchChange = e => {
    if (
      e.target.value &&
      e.target.value.length > 0 &&
      e.target.value.trim() == ""
    ) {
      this.setState({ message: "Nothing found to search" });
    } else {
      this.setState({
        [e.target.name]: e.target.multiple
          ? this.state[e.target.name].concat(e.target.value)
          : e.target.value,
        searchParams: {
          ...this.state.searchParams,
          [e.target.name]: e.target.value
        }
      });
      if (e.key == "Enter") {
        this.handleSearchSubmit();
      }
    }
  };

  handleClear = () => {
    this.setState({ ...this.initialState }, () =>
      this.handleOrderFetch(this.state.activePage)
    );
  };

  componentDidMount = () => {
    this.handleOrderFetch(this.state.activePage);
    this.get_return_reasons();
  };

  get_return_reasons() {
    axios
      .get("/jarvis-order-service/v1/order/RETURN_REQUEST_CANCEL/reasons")
      .then(res => {
        this.setState({ reasonData: res.data.data });
      });
  }

  handleSearchSubmit = () => {
    this.handleOrderFetch(null);
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber }, () =>
      this.handleOrderFetch(pageNumber)
    );
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleModalClose = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  handleModalOpen = row => {
    this.props
      .dispatch(fetchAvailableCouriers(this.props.userId, row.reversePincode))
      .then(() =>
        this.setState({
          showModal: !this.state.showModal,
          modalData: {
            txnId: row.txnId,
            productName: row.productName,
            quantity: row.quantity,
            userId: row.userId,
            reversePincode: row.reversePincode,
            couriers: this.props.order.couriers,
            reason: ""
          }
        })
      );
  };

  handleSubmit = () => {
    const { txnId, courier, userId } = this.state.modalData;
    const that = this;
    that.setState({ message: "", loading: true }, () =>
      that.props
        .dispatch(postReversePickUp({ txnId, courier }, userId))
        .then(() => {
          that.setState(
            {
              message: this.props.order.pickupStatus,
              rpuData: that.initialState.rpuData
            },
            () => {
              that.handleOrderFetch(that.state.activePage);
              that.handleModalClose();
            }
          );
        })
    );
  };

  handleDataChange = e => {
    this.setState({
      modalData: {
        ...this.state.modalData,
        [e.target.name]: e.target.value
      }
    });
  };

  handleRpuModalClose = () => {
    this.setState({ rpuModal: !this.state.rpuModal });
  };

  handleRpuModalOpen = row => {
    this.setState({
      rpuModal: !this.state.rpuModal,
      rpuData: {
        txnId: row.txnId,
        productName: row.productName,
        quantity: row.quantity,
        ...row
      }
    });
  };

  handleRpuSubmit = () => {
    const { txnId, other } = this.state.rpuData;
    const that = this;
    var reason = this.state.rpuData.reason.split("_")[1];
    var id = this.state.rpuData.reason.split("_")[0];
    if (this.state.rpuData.reason.split("_")[1] == "Others") {
      id = this.state.rpuData.reason.split("_")[0];
      reason = "other::" + other;
    }
    this.props
      .dispatch(postRpuCancelled({ txnId, reason, id }, this.props.userId))
      .then(() =>
        that.setState(
          {
            status: that.props.order.rpuStatus,
            message: "Data submitted successfully"
          },
          () => {
            that.handleOrderFetch();
            that.handleRpuModalClose();
          }
        )
      );
  };

  handleRpuDataChange = e => {
    this.setState({
      rpuData: {
        ...this.state.rpuData,
        [e.target.name]: e.target.value
      }
    });
  };

  handle_upload_csv = e => {
    e.preventDefault();
    const that = this;
    this.setState({ loading: false, message: "" }, () => {
      const { csvFile } = this.state;
      const ext = csvFile && csvFile.name ? csvFile.name.split(".").pop() : "";
      if (csvFile && csvFile.name && ext === "csv") {
        Papa.parse(csvFile, {
          header: true,
          complete: function(results) {
            if (arraysIdentical(results.meta.fields, bulkCsvHeader.reverse)) {
              const validate = validateCsvData(
                results.data,
                results.meta.fields
              );
              if (validate.error) {
                that.setState({
                  message: "Found error in line " + validate.line,
                  loading: false
                });
              } else {
                that.handleCsvSubmit();
                that.setState({
                  loading: false
                });
              }
            } else {
              that.setState({
                message:
                  "Found error in headers " + results.meta.fields.join(", "),
                loading: false
              });
            }
          }
        });
      } else {
        that.setState({
          message: "Please upload valid file",
          loading: false
        });
      }
    });
  };

  handleCsvSubmit = () => {
    const that = this;
    const { csvFile } = this.state;
    var file = csvFile.name.split(".");
    var name = file[file.length - 1].toLowerCase();
    if (name === "csv") {
      var formdata = new FormData();
      formdata.append("file", csvFile);
      that.props
        .dispatch(
          postBulkCsvAction(
            formdata,
            that.props.userId,
            that.props.emailId,
            "/jarvis-order-service/internal/v1/order/cancel/bulk"
          )
        )
        .then(() => {
          that.setState({
            loading: false,
            message: that.props.csvStatus,
            csvFile: {}
          });
        });
    }
  };

  handleShipmentModalToggle = (row = null) => {
    if (row) {
      this.setState({
        shipment: { show: !this.state.shipment.show, data: row }
      });
    } else {
      this.setState({ shipment: { show: !this.state.shipment.show } });
    }
  };

  render() {
    const { classes, order } = this.props;
    const {
      orderId,
      txnId,
      startDate,
      endDate,
      rows,
      activePage,
      countPerPage,
      value,
      showModal,
      modalData,
      rpuModal,
      rpuData,
      message,
      shipment,
      count,
      loading
    } = this.state;

    return (
      <React.Fragment>
          {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Reverse Pickup
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          {value === 0 && (
            <Grid container spacing={12} alignItems="center" >
              <Grid item xs={12} sm={6} md={4} className={classes.control}>
                <TextField
                  label="Order Id"
                  type="number"
                  name="orderId"
                  fullWidth
                  variant="outlined"
                  onChange={this.handleSearchChange}
                  value={orderId}
                  onKeyDown={this.handleSearchChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} className={classes.control}>
                <TextField
                  label="Txn Id"
                  type="number"
                  name="txnId"
                  fullWidth
                  variant="outlined"
                  onChange={this.handleSearchChange}
                  value={txnId}
                  onKeyDown={this.handleSearchChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  color="primary"
                  onClick={this.handleClear}
                  className={classes.fab}
                  variant="contained"
                >
                  Clear
                </Button>
                <Button
                  color="primary"
                  onClick={this.handleSearchSubmit}
                  className={classes.fab}
                  variant="contained"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          )}
          {value === 1 && (
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Date started"
                  className={classes.textField}
                  variant="outlined"
                  type="date"
                  InputLabelProps={{
                    shrink: true
                  }}
                  name="startDate"
                  onChange={this.handleSearchChange}
                  margin="none"
                  value={startDate}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Date ended"
                  className={classes.textField}
                  variant="outlined"
                  type="date"
                  InputLabelProps={{
                    shrink: true
                  }}
                  name="endDate"
                  onChange={this.handleSearchChange}
                  margin="none"
                  value={endDate}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Fab color="primary" className={classes.fab} variant="extended">
                  Download
                </Fab>
              </Grid>
            </Grid>
          )}
          {value === 2 && (
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="file"
                  label="CSV file"
                  name="csv_file"
                  variant="outlined"
                  onChange={e =>
                    this.setState({ csvFile: e.target.files[0], message: "" })
                  }
                  margin="none"
                  InputLabelProps={{
                    shrink: true
                  }}
                  helperText="File Format : txnid,orderid,reason"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Fab
                  color="primary"
                  className={classes.fab}
                  variant="extended"
                  onClick={this.handle_upload_csv}
                >
                  Cancel Reverse Pickup
                </Fab>
              </Grid>
            </Grid>
          )}
        </Paper>
        <Grid container lg={12} className={classes.paper}>
          <Typography
            variant="h5"
            gutterBottom
            component="h5"
            align="center"
          >
            Assign Reverse Pickup Status{" "}
            <span className={classes.subText}>
              {count && `(Txn Count - ${count})`}
            </span>
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {reversePickupHeader &&
                  reversePickupHeader.map((v, k) => (
                    <CustomTableCell key={k} align="center" padding="dense">
                      {v}
                    </CustomTableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.length > 0 ? (
                rows.map((row, k) => {
                  return (
                    <TableRow key={k + 1} hover>
                      <CustomTableCell align="center" component="th" scope="row">
                        {row.orderId}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.txnId}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {getSelectedItem(paymentMethodMeta, row.paymentMethod)}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.productName}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.purchaseDate}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {getSelectedItem(statusMeta, row.status)}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.quantity}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.price}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.sellingPrice}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.actualPrice}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.promocodeDiscount}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        <Link
                          to="#"
                          onClick={() => this.handleShipmentModalToggle(row)}
                        >
                          View
                        </Link>
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {(row.status == 33 || row.status == 40) && (
                          <React.Fragment>
                            <Link
                              to="#"
                              onClick={() => this.handleRpuModalOpen(row)}
                            >
                              RPU Cancelled
                            </Link>
                            <hr />
                          </React.Fragment>
                        )}
                        {(row.status == 33 ||
                          row.status == 40 ||
                          row.status == 37) && (
                          <Link
                            to="#"
                            onClick={() => this.handleModalOpen(row)}
                          >
                            Reassign Reverse Pickup
                          </Link>
                        )}
                      </CustomTableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <CustomTableCell
                    colSpan={reversePickupHeader.length}
                    align="center"
                    padding="dense"
                  >
                    No Record Found
                  </CustomTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        </Paper>
        <Pagination
          activePage={activePage}
          itemsCountPerPage={countPerPage}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
        
        <ReversePickupPopup
          classes={classes}
          showModal={showModal}
          handleModalClose={this.handleModalClose}
          modalData={modalData}
          handleSubmit={this.handleSubmit}
          handleDataChange={this.handleDataChange}
        />
        <RpuCancelled
          classes={classes}
          showModal={rpuModal}
          handleModalClose={this.handleRpuModalClose}
          modalData={rpuData}
          handleSubmit={this.handleRpuSubmit}
          handleDataChange={this.handleRpuDataChange}
          reasonData={this.state.reasonData}
        />
        <ViewShipmentDetails
          classes={classes}
          modalData={shipment.data}
          showModal={shipment.show}
          handleModalClose={this.handleShipmentModalToggle}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  order: state.order,
  userId: state.signin.data.body.data.user.id,
  csvStatus: state.order.csvStatus,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(style)(connect(mapStateToProps)(ReversePickup));
