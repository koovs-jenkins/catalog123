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
  Button,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  LinearProgress
} from "@material-ui/core";
import Pagination from "react-js-pagination";
import { processRefundHeader, paymentMethodMeta } from "../../../metadata";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  fetchProcessRefund,
  postProcessRefund,
  postMoveToAssignRefund
} from "../../store/actions/order";
import {
  getSelectedItem,
  comaparePrevDate,
  getCompleteDateTime,
  validateCsvData,
  arraysIdentical
} from "../../helpers";
import { bulkCsvHeader } from "../../../metadata";
import { Link } from "react-router-dom";
import ProcessRefundPopUp from "./popup/ProcessRefundPopUp";
import CustomTableCell from "../../components/CustomTableCell";
import Notify from "../../components/Notify";
import ViewShipmentDetails from "./popup/ViewShipmentDetails";
import MoveToAssignPopup from "./popup/MoveToAssignPopup";
import Papa from "papaparse";
import { postBulkCsvAction } from "../../store/actions/order";
import { fetchOrderListApi, fetchProcessRefundApi } from "../../api/order";

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
    ...theme.paper,padding:"10px",
    marginTop: theme.spacing.unit * 1
  },
  control:{
    padding:"10px"
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
  table: {
    minWidth: 500
  },
  tableWrapper: {
    ...theme.tableWrapper
  },
  subText: {
    fontSize: "15px"
  },
  amount: {
    padding: "5px",
    border: "1px solid #b9b9b9",
    margin: "10px 0 15px 0"
  },
  right: {
    textAlign: "right"
  },
  remarks: {
    margin: theme.spacing.unit
  }
});

class ProcessRefund extends React.Component {
  initialState = {
    orderId: "",
    txnId: "",
    startDate: "",
    endDate: "",
    refundRequestStartDate: "",
    refundRequestEndDate: "",
    searchParams: { txnStatus: "20,29", refundReferenceNo: "IS_EMPTY" },
    modalData: {
      show: false
    },
    formData: {
      txnId: null,
      refundReferenceNo: "",
      amount: "",
      date: ""
    },
    shipment: {
      show: false,
      data: {}
    },
    moveToAssign: {
      txnId: null,
      remarks: "",
      show: false
    },
    move_file: {},
    process_file: {},
    count: 0,
    loading: false,
    parentOrderId: ""
  };

  state = {
    activePage: 1,
    rows: [],
    countPerPage: 10,
    value: 0,
    csv: {},
    message: "",
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
        res.status < 350
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
        this.handleSubmit();
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
  };

  handleSubmit = () => {
    this.setState({ activePage: 1 }, () => this.handleOrderFetch(null));
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber }, () =>
      this.handleOrderFetch(pageNumber)
    );
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleFormChange = e => {
    const formData = this.state.formData;
    formData[[e.target.name]] = e.target.value;
    if (e.target.type == "date") {
      comaparePrevDate(e.target.value) &&
        this.setState({
          formData: formData
        });
    } else {
      this.setState({
        formData: formData
      });
    }
  };

  handleModalOpen = (txnId, productName, quantity) => {
    const that = this;
    that.setState({ loading: true, message: "" }, () =>
      fetchProcessRefundApi(that.props.userId, txnId).then(res =>
        res && res.status < 350
          ? that.setState({
              modalData: {
                show: !that.state.modalData.show,
                amount: res.data,
                productName: productName,
                quantity: quantity
              },
              formData: {
                refundReferenceNo: "",
                amount: "",
                date: "",
                txnId: txnId
              },
              message: ""
            })
          : that.setState({
              loading: false,
              message: "Error in fetching refund info"
            })
      )
    );
  };

  handleModalClose = () => {
    this.handleOrderFetch(this.state.activePage);
    this.setState({
      ...this.state,
      modalData: { show: !this.state.modalData.show }
    });
  };

  handleProcessRefundSubmit = () => {
    const { modalData, formData } = this.state;
    const that = this;
    const totalAmount = Object.values(modalData.amount).reduce((v, s) => v + s);
    const data = { ...formData };
    data.date = getCompleteDateTime(data.date);
    if (
      formData.amount <= totalAmount &&
      formData.amount >= modalData.amount.shippingCharge
    ) {
      if (totalAmount - formData.amount != 0) {
        if (
          window.confirm(
            "Refund coupon code will be generated of Rs " +
              (totalAmount - formData.amount)
          )
        ) {
          this.props
            .dispatch(postProcessRefund(data, this.props.userId))
            .then(() =>
              this.setState({
                modalData: { show: !modalData.show },
                message: that.props.order.processRefundStatus
              })
            );
        }
      } else {
        this.props
          .dispatch(postProcessRefund(data, this.props.userId))
          .then(() =>
            this.setState({
              modalData: { show: !modalData.show },
              message: that.props.order.processRefundStatus
            })
          );
      }
      this.handleOrderFetch(this.state.activePage);
    } else {
      this.setState({
        message:
          "Refund amount should be greater than shipping charges and less than or equal to total refund amount."
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

  handleMoveToAssignRefund = (row = null) => {
    if (row) {
      this.setState({
        moveToAssign: {
          show: !this.state.moveToAssign.show,
          txnId: row.txnId,
          remarks: ""
        }
      });
    } else {
      this.setState({
        moveToAssign: { show: !this.state.moveToAssign.show, remarks: "" }
      });
    }
  };

  handleMoveToAssignRefundChange = e => {
    const moveToAssign = this.state.moveToAssign;
    moveToAssign[[e.target.name]] = e.target.value;
    this.setState({
      moveToAssign: moveToAssign
    });
  };

  handleMoveToAssignRefundSubmit = () => {
    const that = this;
    const data = {
      txnId: this.state.moveToAssign.txnId,
      remarks: this.state.moveToAssign.remarks
    };
    this.props
      .dispatch(postMoveToAssignRefund(data, this.props.userId))
      .then(() => {
        that.setState({
          moveToAssign: {
            show: !this.state.moveToAssign.show,
            remarks: ""
          },
          message: that.props.order.moveToAssignStatus
        });
        that.handleOrderFetch(this.state.activePage);
      });
  };

  handle_upload_csv = (e, type) => {
    e.preventDefault();
    const csvFile = this.state[type];
    const that = this;
    this.setState({ status: false, message: "" }, () => {
      const ext = csvFile && csvFile.name ? csvFile.name.split(".").pop() : "";
      if (csvFile && csvFile.name && ext === "csv") {
        Papa.parse(csvFile, {
          header: true,
          complete: function(results) {
            if (arraysIdentical(results.meta.fields, bulkCsvHeader[type])) {
              const validate = validateCsvData(
                results.data,
                results.meta.fields
              );
              if (validate.error) {
                that.setState({
                  message: "Found error in line " + validate.line,
                  status: false
                });
              } else {
                that.handleCsvSubmit(type, csvFile);
                that.setState({
                  status: false
                });
              }
            } else {
              that.setState({
                message:
                  "Found error in headers " + results.meta.fields.join(", "),
                status: false
              });
            }
          }
        });
      } else {
        that.setState({
          message: "Please upload valid file",
          status: false
        });
      }
    });
  };

  handleCsvSubmit = (type, csvFile) => {
    const that = this;
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
            type == "process_file"
              ? "/jarvis-order-service/internal/v1/refund/process/bulk"
              : "/jarvis-order-service/internal/v1/refund/process/move-to-assign-refund/bulk"
          )
        )
        .then(() => {
          that.setState({
            status: false,
            message: that.props.csvStatus,
            csvFile: {}
          });
        });
    }
  };

  render() {
    const { classes, order } = this.props;
    const {
      orderId,
      txnId,
      startDate,
      endDate,
      refundRequestStartDate,
      refundRequestEndDate,
      rows,
      activePage,
      countPerPage,
      value,
      modalData,
      formData,
      shipment,
      moveToAssign,
      message,
      count,
      loading,
      parentOrderId
    } = this.state;

    return (
      <React.Fragment>
          {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Process Refund
          </Typography>
        </Grid>
       
        <AppBar color="inherit" position="static">
          <Tabs
            indicatorColor="primary"
            value={value}
            onChange={this.handleChange}
          >
            <LinkTab
              label="Bulk upload for moving Assign refund screen"
              href="#"
            />
            <LinkTab label="Bulk upload for process refund" href="#" />
          </Tabs>
        </AppBar>
        <Paper className={classes.paper}>
          {value === 0 ? (
            <Grid
              container
              spacing={12}
              alignItems="left"
              justify="flex-start"
            >
              <Grid item xs={12} sm={6} md={3} className={classes.control}>
                <TextField
                  type="file"
                  variant="outlined"
                  name="move_file"
                  variant="outlined"
                  onChange={e =>
                    this.setState({ move_file: e.target.files[0], message: "" })
                  }
                  helperText={
                    "File Format : " + bulkCsvHeader.move_file.join(",")
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} className={classes.control}>
                <Button
                  color="primary"
                  onClick={e => this.handle_upload_csv(e, "move_file")}
                  variant="contained"
                >
                  Move to Assign Refund Screen
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              spacing={12}
              alignItems="left"
              justify="flex-start"
            >
              <Grid item xs={12} sm={6} md={3} className={classes.control}>
                <TextField
                  type="file"
                  fullWidth
                  name="process_file"
                  variant="outlined"
                  onChange={e =>
                    this.setState({
                      process_file: e.target.files[0],
                      message: ""
                    })
                  }
                  helperText={
                    "File Format : " + bulkCsvHeader.process_file.join(",")
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} className={classes.control}>
                <Button
                  color="primary"
                  onClick={e => this.handle_upload_csv(e, "process_file")}
                  variant="contained"
                >
                  Process Refund
                </Button>
              </Grid>
            </Grid>
          )}
        </Paper>

        <Paper className={classes.paper}>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <TextField
                label="Parent Order Id"
                type="text"
                fullWidth
                name="parentOrderId"
                variant="outlined"
                onChange={this.handleSearchChange}
                value={parentOrderId}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
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
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
            <Typography variant="caption" display="block" gutterBottom>
              Start Date(Order create date)
            </Typography>
              <TextField
                // helperText="Start Date(Order create date)"
                variant="outlined"
                type="date"
                fullWidth
                name="startDate"
                onChange={this.handleSearchChange}
                value={startDate}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <Typography variant="caption" display="block" gutterBottom>
                End Date(Order create date)
              </Typography>
              <TextField
                // helperText="End Date(Order create date)"
                variant="outlined"
                type="date"
                fullWidth
                name="endDate"
                onChange={this.handleSearchChange}
                value={endDate}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <Typography variant="caption" display="block" gutterBottom>
                Start Date(refund requested date)
              </Typography>
              <TextField
                // helperText="Start Date(refund requested date)"
                variant="outlined"
                type="date"
                fullWidth
                name="refundRequestStartDate"
                onChange={this.handleSearchChange}
                value={refundRequestStartDate}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
                <Typography variant="caption" display="block" gutterBottom>
                   End Date(refund requested date)
              </Typography>
              <TextField
                // helperText="End Date(refund requested date)"
                className={classes.textField}
                variant="outlined"
                type="date"
                fullWidth
                name="refundRequestEndDate"
                onChange={this.handleSearchChange}
                value={refundRequestEndDate}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} sm={6} md={6} className={classes.control}>
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
                onClick={this.handleSubmit}
                className={classes.fab}
                variant="contained"
              >
                Search
              </Button>
              <Button color="primary" variant="contained">
                Download
              </Button>
            </Grid>
          </Grid>
          
        </Paper>
        <Grid container lg={12}>
        <Typography
          className={classes.heading}
          variant="h5"
          gutterBottom
          component="h5"
          align="center"
        >
          PROCESS REFUND{" "}
          <span className={classes.subText}>
            {count && `(Txn Count - ${count})`}
          </span>
        </Typography>
        </Grid>
        <Paper className={classes.paper}>
        <Grid lg={12} style={{overflow:"scroll"}}>
          <Table>
            <TableHead>
              <TableRow>
                {processRefundHeader.map((v, k) => (
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
                      <CustomTableCell align="center" padding="dense">
                        {row.parentOrderId}
                      </CustomTableCell>
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
                        {row.status == "20"
                          ? row.refundReferenceNo
                            ? "REFUND BY PG"
                            : "REFUND BY PG Finance team yet to refund"
                          : row.status == "29"
                          ? row.refundReferenceNo
                            ? "Refund By Cash"
                            : "Refund By Cash Finance team yet to refund"
                          : ""}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        <Link
                          to="#"
                          onClick={() => this.handleMoveToAssignRefund(row)}
                        >
                          Move to Assign Refund
                        </Link>
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        <Link
                          to="#"
                          onClick={() =>
                            this.handleModalOpen(
                              row.txnId,
                              row.productName,
                              row.quantity
                            )
                          }
                        >
                          Process Refund
                        </Link>
                      </CustomTableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <CustomTableCell
                    colSpan={processRefundHeader.length}
                    align="center"
                    padding="dense"
                  >
                    No Record Found
                  </CustomTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Grid>
       
        <ProcessRefundPopUp
          classes={classes}
          modalData={modalData}
          formData={formData}
          handleModalClose={this.handleModalClose}
          handleProcessRefundSubmit={this.handleProcessRefundSubmit}
          handleFormChange={this.handleFormChange}
        />
        <ViewShipmentDetails
          classes={classes}
          modalData={shipment.data}
          showModal={shipment.show}
          handleModalClose={this.handleShipmentModalToggle}
        />
        <MoveToAssignPopup
          classes={classes}
          modalData={moveToAssign}
          handleModalClose={this.handleMoveToAssignRefund}
          handleSubmit={this.handleMoveToAssignRefundSubmit}
          handleDataChange={this.handleMoveToAssignRefundChange}
        />
        </Paper>
        
        <Pagination
          activePage={activePage}
          itemsCountPerPage={countPerPage}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  order: state.order,
  processRefund: state.order.processRefund,
  userId: state.signin.data.body.data.user.id,
  csvStatus: state.order.csvStatus,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(style)(connect(mapStateToProps)(ProcessRefund));
