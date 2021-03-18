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
  Button,
  TableCell,
  TableRow,
  TextField,
  LinearProgress
} from "@material-ui/core";
import { connect } from "react-redux";
import { postExchangeReplace } from "../../store/actions/order";
import Pagination from "react-js-pagination";
import {
  returnExchangeSelfShipsOrderHeader,
  statusMeta,
  paymentMethodMeta
} from "../../../metadata";
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
  control:{padding:"10px"},
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
  },
  red: {
    color: "red"
  },
  right: {
    textAlign: "right"
  }
});

class ReturnExchangeSelfShips extends React.Component {
  initialState = {
    orderId: "",
    txnId: "",
    searchParams: {
      txnStatus: "33,40",
      shippingMode: 1,
      reversePickIsActive: 1
    },
    showModal: false,
    modalData: {
      txnId: null,
      quantity: null,
      productName: null,
      reason: "",
      orderId: null
    },
    status: false,
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
    this.setState({ activePage: pageNumber }, () =>
      this.handleOrderFetch(pageNumber)
    );
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
        reason: ""
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
      .dispatch(postExchangeReplace(data, this.props.userId, orderId))
      .then(() => {
        this.handleModalClose();
        this.setState({ status: true });
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
      status,
      count,
      loading
    } = this.state;

    return (
      <React.Fragment>
        {loading && <LinearProgress />}
        {status && <Notify message="Data submitted successfully" />}
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Self Shipment
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={12} alignItems="center">
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <TextField
                label="Order Id"
                type="number"
                name="orderId"
                fullWidth
                variant="outlined"
                onChange={this.handleSearchChange}
                value={orderId}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
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
         <Grid container lg={12} className={classes.wrapper}>
          <Typography
            variant="h5"
            gutterBottom
            component="h5"
            align="center"
          >
            Revert Transaction Status for Self Ship{" "}
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
                {returnExchangeSelfShipsOrderHeader.map((v, k) => (
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
                        {row.requestedDate}
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
                        <Link to="#" onClick={() => this.handleModalOpen(row)}>
                          Cancel
                        </Link>
                      </CustomTableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <CustomTableCell
                    colSpan={returnExchangeSelfShipsOrderHeader.length}
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
        <CancelPopup
          classes={classes}
          showModal={showModal}
          handleModalClose={this.handleModalClose}
          modalData={modalData}
          handleSubmit={this.handleSubmit}
          handleDataChange={this.handleDataChange}
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

export default withStyles(style)(
  connect(mapStateToProps)(ReturnExchangeSelfShips)
);
