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
  TableRow,
  TextField,
  LinearProgress
} from "@material-ui/core";
import { connect } from "react-redux";
import { putUpdateShipment } from "../../store/actions/order";
import Pagination from "react-js-pagination";
import {
  ShipmentStatusUpdate,
  statusMeta,
  paymentMethodMeta
} from "../../../metadata";
import { getSelectedItem } from "../../helpers";
import { Link } from "react-router-dom";
import ViewShipmentDetails from "./popup/ViewShipmentDetails";
import CustomTableCell from "../../components/CustomTableCell";
import UpdateShipmentPopup from "./popup/UpdateStatus";
import Notify from "../../components/Notify";
import { fetchOrderListApi } from "../../api/order";
import axios from "axios";

const style = theme => ({
  paper: {
    ...theme.paper
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
    margin: theme.spacing.unit * 1
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

class StatusUpdate extends React.Component {
  initialState = {
    orderId: "",
    txnId: "",
    searchParams: { shippingStatus: "2", txnStatus: "28" },
    showModal: false,
    shipment: {
      show: false,
      data: {}
    },
    modalData: {
      returnType: ""
    },
    message: "",
    count: 0,
    loading: false
  };

  state = {
    activePage: 1,
    rows: [],
    rtoReasonData: [],
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
    this.get_return_reasons();
  };

  get_return_reasons() {
    axios.get("/jarvis-order-service/v1/order/rto_status/reasons").then(res => {
      this.setState({ rtoReasonData: res.data.data });
    });
  }

  handleSubmit = () => {
    this.setState({ activePage: 1 }, () => this.handleOrderFetch(null));
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber }, () =>
      this.handleOrderFetch(pageNumber)
    );
  };

  handleModalActions = () => {
    this.setState({ showModal: !this.state.showModal });
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

  handleModalOpen = row => {
    this.setState({
      showModal: !this.state.showModal,
      modalData: {
        txnId: row.txnId,
        productName: row.productName
      }
    });
  };

  handleFormSubmit = data => {
    const that = this;
    this.setState({ message: "" }, () =>
      that.props
        .dispatch(putUpdateShipment(that.props.userId, data))
        .then(() => {
          alert(that.props.order.updateStatus);
          that.handleOrderFetch(that.state.activePage);
          that.handleModalActions();
        })
    );
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
      loading
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Typography variant="h5" gutterBottom component="h5">
          Shipped Delivery Status Update
        </Typography>
        <Paper className={classes.paper}>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Order Id"
                type="number"
                name="orderId"
                className={classes.textField}
                variant="outlined"
                onChange={this.handleSearchChange}
                margin="none"
                value={orderId}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Txn Id"
                type="number"
                name="txnId"
                className={classes.textField}
                variant="outlined"
                onChange={this.handleSearchChange}
                margin="none"
                value={txnId}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Fab
                color="primary"
                onClick={this.handleClear}
                className={classes.fab}
                variant="extended"
              >
                Clear
              </Fab>
              <Fab
                color="primary"
                onClick={this.handleSubmit}
                className={classes.fab}
                variant="extended"
              >
                Search
              </Fab>
            </Grid>
          </Grid>
        </Paper>
        <Typography
          className={classes.heading}
          variant="h5"
          gutterBottom
          component="h5"
          align="center"
        >
          Shipped Products{" "}
          <span className={classes.subText}>
            {count && `(Transaction Count - ${count})`}
          </span>
        </Typography>
        {loading && <LinearProgress />}
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {ShipmentStatusUpdate.map((v, k) => (
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
                      <TableCell align="center" padding="dense">
                        {row.orderId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.txnId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {getSelectedItem(paymentMethodMeta, row.paymentMethod)}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.productName}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.purchaseDate}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {getSelectedItem(statusMeta, row.status)}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.ndrStatus || "N/A"}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.quantity}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.price}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.sellingPrice}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.actualPrice}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.promocodeDiscount}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        <Link
                          to="#"
                          onClick={() => this.handleShipmentModalToggle(row)}
                        >
                          View
                        </Link>
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        <Link to="#" onClick={() => this.handleModalOpen(row)}>
                          Update
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={ShipmentStatusUpdate.length}
                    align="center"
                    padding="dense"
                  >
                    No Record Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          activePage={activePage}
          itemsCountPerPage={countPerPage}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
        <ViewShipmentDetails
          classes={classes}
          modalData={shipment.data}
          showModal={shipment.show}
          handleModalClose={this.handleShipmentModalToggle}
        />
        <UpdateShipmentPopup
          classes={classes}
          handleModalClose={this.handleModalActions}
          value={this.state.value}
          showModal={showModal}
          modalData={this.state.modalData}
          handleChange={this.handleChange}
          handleFormSubmit={this.handleFormSubmit}
          rtoReasonData={this.state.rtoReasonData}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  order: state.order,
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(connect(mapStateToProps)(StatusUpdate));
