import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  Grid,
  Typography,
  Fab,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  LinearProgress
} from "@material-ui/core";
import { connect } from "react-redux";
import { fetchAssignOrderOptions } from "../../store/actions/order";
import Pagination from "react-js-pagination";
import {
  assignRefundOrderHeader,
  statusMeta,
  paymentMethodMeta
} from "../../../metadata";
import { getSelectedItem, hasProp } from "../../helpers";
import { Link } from "react-router-dom";
import AssignRefundPopUp from "./popup/AssignRefundPopUp";
import Notify from "../../components/Notify";
import ViewShipmentDetails from "./popup/ViewShipmentDetails";
import CustomTableCell from "../../components/CustomTableCell";
import { fetchOrderListApi, postAssignOrderApi } from "../../api/order";

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    marginTop: "5px",
    maxWidth: "100%"
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
  control:{
    padding:"10px"
  },
  tableWrapper: { ...theme.tableWrapper },
  subText: {
    fontSize: "15px"
  },
  red: {
    color: "red"
  },
  right: {
    textAlign: "right"
  }
});

class AssignRefund extends React.Component {
  initialState = {
    orderId: "",
    txnId: "",
    searchParams: { txnStatus: "26,27" },
    showModal: false,
    modalData: {
      data: [],
      options: []
    },
    formData: {
      refundOption: "",
      txnId: null,
      callPaymentGateway: true,
      bankDetails: {
        acHolderName: "",
        acNumber: "",
        bankName: "",
        branchName: "",
        ifscCode: ""
      }
    },
    shipment: {
      show: false,
      data: {}
    },
    count: 0,
    loading: false,
    parentOrderId: "",
    checked: {}
  };

  state = {
    activePage: 1,
    rows: [],
    countPerPage: 50,
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
      ).then(res => {
        if (res.status < 350) {
          const checked = {};
          res.data.data.map(v => (checked[v.txnId] = false));
          that.setState({
            rows: res.data.data,
            count: res.data.count,
            loading: false,
            checked
          });
        } else {
          that.setState({
            message: (res.data && res.data.message) || res.statusText,
            loading: false
          });
        }
      })
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

  handleModalClose = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  handleModalOpen = row => {
    const self = this;
    const arr = [];
    const data = [];
    for (let a in this.state.checked) {
      if (this.state.checked[a]) {
        const singleData = this.state.rows.filter(
          b => b.txnId === parseInt(a)
        )[0];
        arr.push(parseInt(a));
        data.push(singleData);
      }
    }
    this.setState({ message: "" }, () => {
      if (arr.indexOf(row.txnId) > -1) {
        self.props
          .dispatch(
            fetchAssignOrderOptions(
              self.props.userId,
              `/jarvis-order-service/internal/v1/refund/assign-refund/options?txnId=${row.txnId}`
            )
          )
          .then(() =>
            self.setState((prevState, props) => ({
              ...prevState,
              showModal: !prevState.showModal,
              modalData: {
                data,
                options: props.options.data || []
              },
              formData: {
                ...self.initialState.formData,
                txnId: row.txnId
              }
            }))
          );
      } else {
        self.setState({
          message: "Please select a valid transaction to assign refund"
        });
      }
    });
  };

  handleChange = (e, bank) => {
    bank
      ? this.setState({
          formData: {
            ...this.state.formData,
            bankDetails: {
              ...this.state.formData.bankDetails,
              [e.target.name]: e.target.value
            }
          }
        })
      : this.setState({
          formData: { ...this.state.formData, [e.target.name]: e.target.value }
        });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const that = this;
    const {
      refundOption,
      bankDetails,
      callPaymentGateway
    } = this.state.formData;

    if (refundOption.indexOf("BY_CASH") > -1) {
      if (
        hasProp(bankDetails, "acHolderName") &&
        hasProp(bankDetails, "acNumber") &&
        hasProp(bankDetails, "bankName") &&
        hasProp(bankDetails, "branchName") &&
        hasProp(bankDetails, "ifscCode")
      ) {
        bankDetails.ifscCode.length == 11
          ? this.handleSubmitRequest()
          : alert("Invalid IFSC code");
      } else {
        alert("Bank details are mandatory");
      }
    } else if (refundOption.indexOf("BY_PG") > -1) {
      const data = { ...this.state.formData };
      data.callPaymentGateway = callPaymentGateway;
      this.handleSubmitRequest(data);
    } else {
      const data = { ...this.state.formData };
      data.callPaymentGateway = false;
      this.handleSubmitRequest(data);
    }
  };

  handleSubmitRequest = (data = null) => {
    const that = this;
    const form = data || this.state.formData;
    const formsData = [];
    for (let a in this.state.checked) {
      if (this.state.checked[a]) {
        form.txnId = parseInt(a);
        const obj = { ...form, txnId: parseInt(a) };
        formsData.push(obj);
      }
    }
    this.setState({ message: "", loading: true }, () =>
      postAssignOrderApi(formsData, that.props.userId).then(res => {
        if (res && res.status < 350) {
          that.handleOrderFetch(that.state.activePage);
          that.handleModalClose();
          const message = [];
          for (let b in res.data) {
            message.push(
              b +
                ": " +
                (res.data[b].status ? res.data[b].message : res.data[b].error)
            );
          }
          that.setState({
            message: message.join("\n"),
            loading: false
          });
        } else {
          that.setState({
            message: res.data.message || "Something went wrong",
            loading: false
          });
        }
      })
    );
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

  handleChecked = e => {
    this.setState({
      formData: { ...this.state.formData, [e.target.value]: e.target.checked }
    });
  };

  handleCheckbox = (e, row) => {
    const self = this;
    const checked = { ...this.state.checked };
    const check = e.target.checked;
    this.setState({ message: "" }, () => {
      let temp = true;
      for (let i in checked) {
        if (checked[i]) {
          let data = self.state.rows.filter(v => v.txnId == i)[0];
          if (data.orderId != row.orderId) {
            temp = false;
          }
        }
      }
      if (temp) {
        checked[row.txnId] = check;
        self.setState({ checked });
      } else {
        self.setState({
          message: "Selected transaction is not from same order"
        });
      }
    });
  };

  render() {
    const { classes, order } = this.props;
    const {
      orderId,
      txnId,
      rows,
      activePage,
      countPerPage,
      showModal,
      shipment,
      message,
      count,
      loading,
      parentOrderId,
      checked
    } = this.state;

    return (
      <React.Fragment>
        {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Assign Refund
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={12} alignItems="center">
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
                type="number"
                fullWidth
                name="orderId"
                variant="outlined"
                onChange={this.handleSearchChange}
                value={orderId}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                label="Txn Id"
                type="number"
                fullWidth
                name="txnId"
                variant="outlined"
                onChange={this.handleSearchChange}
                value={txnId}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
              {/* <Fab color="primary" className={classes.fab} variant="extended">
                Download txn moved from PR
              </Fab> */}
            </Grid>
          </Grid>
        </Paper>
        <Grid container lg={12} className={classes.wrapper}>
        <Typography
          variant="h5"
          component="h5"
          align="left"
        >
          {order.data &&
            `Assign Refund option (Transaction Count - ${count ? count : ""})`}
        </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {assignRefundOrderHeader.map((v, k) => (
                  <CustomTableCell key={k} align="center">
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
                        <Checkbox
                          naame={row.txnId}
                          checked={checked[row.txnId]}
                          onChange={e => this.handleCheckbox(e, row)}
                          color="primary"
                        />
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.parentOrderId}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
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
                      {/* <CustomTableCell align="center" padding="dense">
                        <Link to="#">View customer remarks</Link>
                      </CustomTableCell> */}
                      <CustomTableCell align="center" padding="dense">
                        <Link to="#" onClick={() => this.handleModalOpen(row)}>
                          Assign Refund
                        </Link>
                      </CustomTableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <CustomTableCell
                    colSpan={assignRefundOrderHeader.length}
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
        
        <AssignRefundPopUp
          classes={classes}
          loading={loading}
          handleModalClose={this.handleModalClose}
          value={this.state.value}
          showModal={showModal}
          modalData={this.state.modalData}
          formData={this.state.formData}
          handleChange={this.handleChange}
          handleFormSubmit={this.handleFormSubmit}
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
  options: state.order.options,
  asignRefundStatus: state.order.asignRefundStatus
});

export default withStyles(style)(connect(mapStateToProps)(AssignRefund));
