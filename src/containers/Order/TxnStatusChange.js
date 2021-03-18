import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Typography,
  Fab,
  Table,
  TableBody,
  TableHead,
  TableCell,
  Button,
  TableRow,
  TextField,
  Checkbox,
  LinearProgress
} from "@material-ui/core";
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
import {
  txnStatusChangeOrderHeader,
  statusMeta,
  paymentMethodMeta
} from "../../../metadata";
import { getSelectedItem, hasProp } from "../../helpers";
import { Link } from "react-router-dom";
import TxnUpdatePopUp from "./popup/TxnUpdatePopUp";
import Notify from "../../components/Notify";
import ViewShipmentDetails from "./popup/ViewShipmentDetails";
import CustomTableCell from "../../components/CustomTableCell";
import { fetchOrderListApi, postTxnUpdateApi } from "../../api/order";

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 1,
    marginTop: "10px",
    maxWidth: "100%"
  },
  select: {
    width: "100%",
    height: "56px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "white"
  },
  control:{
    padding:"10px",
  },
  fab: { margin: theme.spacing.unit },
  heading: { margin: theme.spacing.unit * 4 },
  table: { minWidth: 500 },
  tableWrapper: theme.tableWrapper,
  subText: { fontSize: "15px" },
  red: { color: "red" },
  right: { textAlign: "right" }
});

class TxnStatusChange extends React.Component {
  initialState = {
    orderId: "",
    txnId: "",
    searchParams: { txnStatus: "22" },
    showModal: false,
    modalData: {
      data: [],
      options: [],
      refundOption: "REFUND_BY_CASH"
    },
    formData: {
      revertFor: "PROMO_CODE",
      txnId: null,
      bankDetails: {
        acHolderName: "",
        acNumber: "",
        bankName: "",
        branchName: "",
        ifscCode: "",
        comment: ""
      }
    },
    shipment: {
      show: false,
      data: {}
    },
    message: "",
    count: 0,
    loading: false
  };

  state = {
    activePage: 1,
    rows: [],
    countPerPage: 50,
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
        [e.target.name]: e.target.value,
        searchParams: {
          ...this.state.searchParams,
          [e.target.name]: e.target.value
        }
      });
    }
  };

  handleClear = () => {
    this.setState({ ...this.initialState }, () =>
      this.setState({ activePage: 1 }, () => this.handleOrderFetch(null))
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
    this.setState({ ...this.state, showModal: !this.state.showModal });
    this.handleOrderFetch(this.state.activePage);
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
        self.setState({
          showModal: !self.state.showModal,
          modalData: {
            ...self.initialState.modalData,
            data,
            options: ["ASSIGN_BY_CASH"],
            title:
              "You are about to revert the refunded promocode for following transactions"
          },
          formData: {
            ...self.initialState.formData,
            txnId: row.txnId
          }
        });
      } else {
        self.setState({
          message: "Please select a valid transaction to change status"
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
    const self = this;
    const { bankDetails } = self.state.formData;
    self.setState({ message: "", loading: true }, () => {
      if (
        hasProp(bankDetails, "acHolderName") &&
        hasProp(bankDetails, "acNumber") &&
        hasProp(bankDetails, "bankName") &&
        hasProp(bankDetails, "branchName") &&
        hasProp(bankDetails, "ifscCode")
      ) {
        const formsData = [];
        for (let a in self.state.checked) {
          if (self.state.checked[a]) {
            const obj = { ...self.state.formData, txnId: parseInt(a) };
            formsData.push(obj);
          }
        }
        bankDetails.ifscCode.length == 11
          ? postTxnUpdateApi(formsData, self.props.userId).then(res => {
              if (res && res.status < 350) {
                self.handleOrderFetch(self.state.activePage);
                self.handleModalClose();
                const message = [];
                for (let b in res.data) {
                  message.push(
                    b +
                      ": " +
                      (res.data[b].status
                        ? res.data[b].message
                        : res.data[b].error)
                  );
                }
                self.setState({
                  message: message.join(", "),
                  loading: false
                });
              } else {
                self.setState({
                  message: res.data.message || "Something went wrong",
                  loading: false
                });
              }
            })
          : self.setState({ message: "Invalid IFSC code" });
      } else {
        self.setState({ message: "Invalid Bank Details" });
      }
    });
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

  componentDidCatch = (error, errorInfo) => {
    console.log("err", error, errorInfo);
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
    const { classes } = this.props;
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
      checked
    } = this.state;

    return (
      <React.Fragment>
         {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid lg={12} container className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Transaction Status Change
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                label="Order Id"
                type="number"
                name="orderId"
                variant="outlined"
                fullWidth
                onChange={this.handleSearchChange}
                value={orderId}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                label="Txn Id"
                fullWidth
                type="number"
                name="txnId"
                variant="outlined"
                onChange={this.handleSearchChange}
                value={txnId}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
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
            </Grid>
          </Grid>
        </Paper>
        <Grid container lg={12} className={classes.wrapper}>
          <Typography
            variant="h5"
            gutterBottom
            component="h5"
            align="center"
          >
            Change Refund by Promocode status{" "}
            <span className={classes.subText}>
              {count && `(Transaction Count - ${count})`}
            </span>
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {txnStatusChangeOrderHeader.map((v, k) => (
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
                        <Checkbox
                          naame={row.txnId}
                          checked={checked[row.txnId]}
                          onChange={e => this.handleCheckbox(e, row)}
                          color="primary"
                        />
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
                      <CustomTableCell align="center" padding="dense">
                        <Link to="#" onClick={() => this.handleModalOpen(row)}>
                          Change Status
                        </Link>
                      </CustomTableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <CustomTableCell
                    colSpan={txnStatusChangeOrderHeader.length}
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
        <TxnUpdatePopUp
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
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(connect(mapStateToProps)(TxnStatusChange));
