import React from "react";
import {
  Paper,
  Grid,
  TextField,
  Typography,
  Fab,
  Table,
  TableHead,
  TableBody,
  TableCell,
  Button,
  TableRow,
  LinearProgress
} from "@material-ui/core";
import Pagination from "react-js-pagination";
import {
  exchangeReplaceHeader,
  statusMeta,
  paymentMethodMeta
} from "../../../metadata";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postExchangeOrder } from "../../store/actions/order";
import { getSelectedItem } from "../../helpers";
import { Link } from "react-router-dom";
import CancelPopup from "./popup/CancelPopup";
import Notify from "../../components/Notify";
import CustomTableCell from "../../components/CustomTableCell";
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
  }
});

class ExchangeReplace extends React.Component {
  initialState = {
    orderId: "",
    txnId: "",
    startDate: "",
    endDate: "",
    showModal: false,
    modalData: {
      txnId: null,
      quantity: null,
      productName: null,
      reason: "",
      orderId: null
    },
    searchParams: { txnStatus: "38" },
    status: false,
    message: "",
    count: 0,
    loading: false
  };

  state = {
    activePage: 1,
    rows: [],
    countPerPage: 10,
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
  };

  handleSearchSubmit = () => {
    this.setState({ activePage: 1 }, () => this.handleOrderFetch(null));
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber });
    this.handleOrderFetch(pageNumber);
  };

  handleModalClose = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  handleModalOpen = row => {
    this.setState({
      showModal: !this.state.showModal,
      modalData: {
        txnId: row.txnId,
        productName: row.productName,
        quantity: row.quantity,
        orderId: row.orderId,
        message: ""
      }
    });
  };

  handleSubmit = () => {
    const { txnId, reason, orderId } = this.state.modalData;
    const data = {
      cancelItems: [
        {
          orderItemId: txnId,
          reasonId: "",
          reasonText: reason
        }
      ]
    };
    this.props
      .dispatch(postExchangeOrder(data, this.props.userId, orderId))
      .then(() => {
        this.setState({ message: this.props.order.postExchangeStatus });
        this.handleModalClose();
        this.handleOrderFetch(this.state.activePage);
      });
  };

  handleDataChange = e => {
    this.setState({
      modalData: {
        ...this.state.modalData,
        reason: e.target.value
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
      modalData,
      message,
      count,
      loading
    } = this.state;

    return (
      <React.Fragment>
         {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid className={classes.wrapper} container>
          <Typography variant="h5" gutterBottom component="h5">
            Exchange Replace
          </Typography>
        </Grid>
       
        <Paper className={classes.paper}>
          <Grid container spacing={24} alignItems="center">
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
                fullWidth
                name="txnId"
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
        </Paper>
        <Grid className={classes.wrapper} container>
        <Typography
          variant="h5"
          gutterBottom
          component="h5"
          align="left"
        >
          Approve new exchange orders{" "}
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
                {exchangeReplaceHeader.map((v, k) => (
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
                      <CustomTableCell align="center" padding="none">
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
                        {row.oldOrderId}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.oldTxnId}
                      </CustomTableCell>
                      {/* <CustomTableCell align="center" padding="dense">
                        &#160;
                      </CustomTableCell> */}
                      <CustomTableCell align="center" padding="dense">
                        <Link to="#" onClick={() => this.handleModalOpen(row)}>
                          Cancel Transaction
                        </Link>
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        &#160;
                      </CustomTableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <CustomTableCell
                    colSpan={exchangeReplaceHeader.length}
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
        <CancelPopup
          classes={classes}
          showModal={showModal}
          handleModalClose={this.handleModalClose}
          modalData={modalData}
          handleSubmit={this.handleSubmit}
          handleDataChange={this.handleDataChange}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  order: state.order
});

export default withStyles(style)(connect(mapStateToProps)(ExchangeReplace));
