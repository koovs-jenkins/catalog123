import React from "react";
import {
  getSessionStorage,
  setSessionStorage
} from "../../../helpers/sessionStorage";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  TextField,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Button,
  Fab
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  ReturnExchangeHeader,
  paymentMethodMeta,
  statusMeta
} from "../../../../metadata";
import { fetchOrderListApi } from "../../../api/order";
import { getSelectedItem } from "../../../helpers";
import { Link } from "react-router-dom";
import CustomTableCell from "../../../components/CustomTableCell";
import ViewShipmentDetails from "../../Order/popup/ViewShipmentDetails";
import {
  postOverrideReturnItem,
  fetchReturnExchangeApi
} from "../../../api/callCenter";
import Notify from "../../../components/Notify";
import Pagination from "react-js-pagination";

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: { ...theme.paper,marginTop:"10px",padding:"10px" },
  fab: { margin: theme.spacing.unit },
  tableWrapper: { ...theme.tableWrapper },
  bold: { fontWeight: "bold" },
  control:{padding:"10px"},
});

class ReturnExchange extends React.Component {
  state = {
    rows: [],
    form: {
      emailId: getSessionStorage("form")
        ? getSessionStorage("form").emailId
        : "",
      orderId: getSessionStorage("form")
        ? getSessionStorage("form").orderId
        : ""
    },
    loading: false,
    show: false,
    type: "",
    shipment: {
      show: false,
      data: {}
    },
    showAddress: false,
    message: "",
    showNewAddressFields: false,
    buttonType: {},
    activePage: 1,
    countPerPage: 10,
    count: 0
  };

  componentDidMount = () => {
    (this.state.form.orderId || this.state.form.emailId) &&
      this.handleRequest(this.state.form);
  };

  handleRequest = (data, pageNum = null) => {
    const that = this;
    const { activePage, countPerPage } = this.state;
    this.setState({ loading: true, message: "" }, () =>
      fetchOrderListApi(
        pageNum ? pageNum : activePage,
        countPerPage,
        data,
        that.props.userId
      ).then(response => {
        let txns = [];
        let result = {};
        if (response && response.data && response.data.count > 0) {
          response.data.data.map(v => txns.push(v.txnId));
          that.setState({
            rows: response.data.data,
            count: response.data.count
          });
          let i,
            temparray,
            j,
            chunk = 50;
          j =
            txns.length % chunk ? txns.length / chunk + 1 : txns.length / chunk;
          for (i = 0; i < txns.length; i += chunk) {
            temparray = txns.slice(i, i + chunk);
            fetchReturnExchangeApi(that.props.userId, temparray.join(",")).then(
              res => {
                if (res && res.status < 350 && res.data) {
                  Object.assign(result, res.data);
                  that.setState({ buttonType: result || {}, loading: false });
                } else {
                  that.setState({
                    message: "Error in fetcing returnable and exchangable info",
                    loading: false
                  });
                }
              }
            );
            j--;
          }
        } else {
          that.setState({
            loading: false,
            message: response.data.message
          });
        }
      })
    );
  };

  handlePageChange = pageNumber => {
    const that = this;
    this.setState({ activePage: pageNumber }, () =>
      that.handleRequest(that.state.form)
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
      const form = this.state.form;
      form[e.target.name] = e.target.value;
      this.setState({ form: form });
      setSessionStorage("form", form);
    }
  };

  handleSubmit = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleRequest({ [e.target.name]: e.target.value }, 1);
    }
  };

  handleShipmentModal = (e, row = null) => {
    e.preventDefault();
    if (row) {
      this.setState({
        shipment: { show: !this.state.shipment.show, data: row }
      });
    } else {
      this.setState({
        shipment: { ...this.state.shipment, show: !this.state.shipment.show }
      });
    }
  };

  handleReturnOverride = row => {
    const that = this;
    this.setState({ message: "" });
    if (
      window.confirm(
        "Are you sure you want to forcefully allow this txn to be eligible for return/exchange ?"
      )
    ) {
      postOverrideReturnItem(this.props.userId, row.txnId, {}).then(res =>
        that.setState({
          message:
            res.status != 200
              ? res.data.message
              : "Transaction override successful"
        })
      );
    }
  };

  render() {
    const { classes } = this.props;
    const {
      rows,
      form,
      count,
      loading,
      shipment,
      message,
      buttonType,
      activePage,
      countPerPage
    } = this.state;

    return (
      <React.Fragment>
         {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Return/Exchange
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={12}>
            <Grid item xs={12} sm={6} md={6} className={classes.control}>
              <TextField
                fullWidth
                label="OrderId"
                name="orderId"
                variant="outlined"
                id="outlined-basic"       
                value={form.orderId}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}  className={classes.control}>
              <TextField
                fullWidth
                label="Email"
                name="emailId"
                variant="outlined"
                value={form.emailId}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12} className={classes.control}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => this.handleRequest(form, 1)}
              >
                Search
              </Button>
            </Grid>
          </Grid>

        </Paper>
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Total Results: {rows && rows.length && count}
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
         
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {ReturnExchangeHeader.map((v, k) => (
                    <TableCell key={k}>{v}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows && rows.length > 0 ? (
                  rows.map(row => (
                    <TableRow key={row.txnId}>
                      <TableCell component="th" scope="row">
                        {row.orderId}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.txnId}
                      </TableCell>
                      <TableCell>
                        {getSelectedItem(paymentMethodMeta, row.paymentMethod)}
                      </TableCell>
                      <TableCell>{row.productName}</TableCell>
                      <TableCell>
                        Size : {row.productSize}, Color : {row.productColor}
                      </TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>
                        {getSelectedItem(statusMeta, row.status)}
                      </TableCell>
                      <TableCell>{row.purchaseDate}</TableCell>
                      <TableCell>
                        <Link
                          to="#"
                          onClick={e => this.handleShipmentModal(e, row)}
                        >
                          View
                        </Link>
                      </TableCell>
                      <TableCell>
                        {buttonType[row.txnId] &&
                          buttonType[row.txnId].isExchangeable && (
                            <Link
                              to={`/call_center/return_exchange/exchange/${row.orderId}/${row.txnId}`}
                            >
                              Exchange
                            </Link>
                          )}
                        {buttonType[row.txnId] &&
                          buttonType[row.txnId].isExchangeable &&
                          buttonType[row.txnId].isReturnable &&
                          " / "}
                        {buttonType[row.txnId] &&
                          buttonType[row.txnId].isReturnable && (
                            <Link
                              to={`/call_center/return_exchange/return/${row.orderId}/${row.txnId}`}
                            >
                              Return
                            </Link>
                          )}
                      </TableCell>
                      <TableCell>
                        <Link
                          to="#"
                          onClick={() => this.handleReturnOverride(row)}
                        >
                          Override Return
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={ReturnExchangeHeader.length}>
                      No Order Found
                    </TableCell>
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
        {rows && (
          <ViewShipmentDetails
            classes={classes}
            modalData={shipment.data}
            showModal={shipment.show}
            handleModalClose={this.handleShipmentModal}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  order: state.order,
  reasons: state.callCenter.reasons
});

export default withStyles(style)(connect(mapStateToProps)(ReturnExchange));
