import React from "react";
import {
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
import {
  revertFTRefundStatusOrderHeader,
  paymentMethodMeta,
  bulkCsvHeader
} from "../../../metadata";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postTxnUpdate, postBulkCsvAction } from "../../store/actions/order";
import {
  getSelectedItem,
  validateCsvData,
  arraysIdentical
} from "../../helpers";
import { Link } from "react-router-dom";
import Notify from "../../components/Notify";
import CustomTableCell from "../../components/CustomTableCell";
import ViewShipmentDetails from "./popup/ViewShipmentDetails";
import Papa from "papaparse";
import { fetchOrderListApi } from "../../api/order";

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 1,
    marginTop: "10px",
    maxWidth: "100%"
  },
  control:{
    padding:"10px"
  },
  fab: {
    margin: "10px"
  },
  heading: {
    margin: theme.spacing.unit * 4
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
  }
});

class RevertFTRefundStatus extends React.Component {
  initialState = {
    orderId: "",
    txnId: "",
    orderStartDate: "",
    orderEndDate: "",
    refundRequestStartDate: "",
    refundRequestEndDate: "",
    searchParams: { txnStatus: "20,29", refundReferenceNo: "IS_NOT_EMPTY" },
    shipment: {
      show: false,
      data: {}
    },
    message: "",
    count: 0,
    loading: false,
    parentOrderId: ""
  };

  state = {
    activePage: 1,
    rows: [],
    countPerPage: 10,
    csvFile: {},
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
    if (e.key == "Enter") {
      this.handleSubmit();
    }
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

  handleFormSubmit = (e, row) => {
    e.preventDefault();
    const that = this;
    this.setState({ message: "" });
    const data = {
      txnId: row.txnId,
      revertFor: "PG",
      bankDetails: {
        acHolderName: "",
        acNumber: "",
        bankName: "",
        branchName: "",
        ifscCode: "",
        comment: ""
      }
    };
    if (
      window.confirm(
        "Are you sure you want to make it eligible to refund again ? Note : old reference number will be gone"
      )
    ) {
      this.props
        .dispatch(postTxnUpdate(data, this.props.userId))
        .then(() =>
          that.setState({ message: that.props.order.txnUpdateStatus })
        );
    }
    this.handleOrderFetch(this.state.activePage);
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

  handle_upload_csv = e => {
    e.preventDefault();
    const that = this;
    this.setState({ status: false, message: "" }, () => {
      const { csvFile } = this.state;
      const ext = csvFile && csvFile.name ? csvFile.name.split(".").pop() : "";
      if (csvFile && csvFile.name && ext === "csv") {
        Papa.parse(csvFile, {
          header: true,
          complete: function(results) {
            if (arraysIdentical(results.meta.fields, bulkCsvHeader.revert)) {
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
                that.handleCsvSubmit();
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
            "/jarvis-order-service/internal/v1/refund/revert/bulk"
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
      rows,
      activePage,
      countPerPage,
      shipment,
      message,
      count,
      loading,
      parentOrderId
    } = this.state;

    return (
      <React.Fragment>
          {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid continer lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Revert Refund
          </Typography>
        </Grid>
        
        <Paper className={classes.paper}>
          <Grid
            container
            spacing={12}
            alignItems="left"
            justify="flex-start"
          >
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                type="file"
                label="CSV file"
                name="csvFile"
                variant="outlined"
                onChange={e =>
                  this.setState({ csvFile: e.target.files[0], message: "" })
                }
                margin="none"
                InputLabelProps={{
                  shrink: true
                }}
                helperText="File Format : txnid,orderid"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} className={classes.control}>
              <Button
                color="primary"
                onClick={this.handle_upload_csv}
                variant="contained"
              >
                Move to Process refund screen(FT yet to refund)
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.paper}>
          <Grid container spacing={12} alignItems="left">
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
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
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                label="Order Id"
                fullWidth
                type="number"
                name="orderId"
                variant="outlined"
                onChange={this.handleSearchChange}
                value={orderId}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                label="Txn Id"
                type="number"
                name="txnId"
                variant="outlined"
                fullWidth
                onChange={this.handleSearchChange}
                value={txnId}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <Button
                color="primary"
                className={classes.fab}
                onClick={this.handleClear}
                variant="contained"
              >
                Clear
              </Button>
              <Button
                className={classes.fab}
                color="primary"
                onClick={this.handleSubmit}
                variant="contained"
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Grid lg={12} container className={classes.paper}>
          <Typography
            variant="h5"
            gutterBottom
            component="h5"
            align="center"
          >
            REFUNDED Txns{" "}
            <span className={classes.subText}>
              {count && `(Txn Count - ${count})`}
            </span>
          </Typography>
        </Grid>
       <Paper className={classes.paper}>
       <Grid lg={12} style={{overflow:"scroll"}}>
          <Table >
            <TableHead>
              <TableRow>
                {revertFTRefundStatusOrderHeader.map((v, k) => (
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
                        {row.status == 20 && "Refund By PG"}
                        {row.status == 29 && "Refund By Cash"}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        <Link
                          to="#"
                          onClick={e => this.handleFormSubmit(e, row)}
                        >
                          Change status
                        </Link>
                      </CustomTableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <CustomTableCell
                    colSpan={revertFTRefundStatusOrderHeader.length}
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
        <ViewShipmentDetails
          classes={classes}
          modalData={shipment.data}
          showModal={shipment.show}
          handleModalClose={this.handleShipmentModalToggle}
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
  userId: state.signin.data.body.data.user.id,
  csvStatus: state.order.csvStatus,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(style)(
  connect(mapStateToProps)(RevertFTRefundStatus)
);
