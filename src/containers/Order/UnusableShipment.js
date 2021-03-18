import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Typography,
  Fab,
  Table,
  Button,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TextField,
  LinearProgress,
  ButtonGroup
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  fetchUnusableShipmentAction,
  putUnusableShipmentAction
} from "../../store/actions/order";
import Pagination from "react-js-pagination";
import {
  unusableShipmentOrderHeader,
  statusMeta,
  paymentMethodMeta
} from "../../../metadata";
import { getSelectedItem } from "../../helpers";
import { Link } from "react-router-dom";
import ViewShipmentDetails from "./popup/ViewShipmentDetails";
import CustomTableCell from "../../components/CustomTableCell";
import UnusableShipmentPopup from "./popup/UnusableShipmentPopup";
import Notify from "../../components/Notify";
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
  control:{
    padding:"10px",
  },
  right: {
    textAlign: "right"
  }
});

class UnusableShipment extends React.Component {
  initialState = {
    orderId: "",
    txnId: "",
    searchParams: { txnStatus: "31", shippingStatus: "7,12,14" },
    showModal: false,
    shipment: {
      show: false,
      data: {}
    },
    modalData: {
      returnType: ""
    },
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
    this.props
      .dispatch(fetchUnusableShipmentAction(this.props.userId, row.txnId))
      .then(() => {
        this.setState({
          showModal: !this.state.showModal,
          modalData: {
            txnId: row.txnId,
            productName: row.productName,
            quantity: row.quantity,
            returnType: this.props.order.unusable.data || 0
          }
        });
      });
  };

  handleFormSubmit = () => {
    const that = this;
    this.props
      .dispatch(
        putUnusableShipmentAction(
          this.props.userId,
          this.state.modalData.txnId,
          this.state.modalData.returnType
        )
      )
      .then(() => {
        this.handleOrderFetch(that.state.activePage);
        this.handleModalActions();
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
      count,
      loading
    } = this.state;

    return (
      <React.Fragment>
         {loading && <LinearProgress />}
        {order.unusableStatus && <Notify message={order.unusableStatus} />}
        <Grid lg={12} container className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Unusable Shipment
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <TextField
                label="Order Id"
                type="number"
                fullWidth
                name="orderId"
                className={classes.textField}
                variant="outlined"
                onChange={this.handleSearchChange}
                value={orderId}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}  className={classes.control}>
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
            </Grid>
          </Grid>
        </Paper>
        <Grid lg={12} container className={classes.wrapper}>
          <Typography
            variant="h5"
            gutterBottom
            component="h5"
            align="left"
          >
            Unusable Shipment Order List{" "}
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
                {unusableShipmentOrderHeader.map((v, k) => (
                  <CustomTableCell key={k} align="center" >
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
                          Refund
                        </Link>
                      </CustomTableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <CustomTableCell
                    colSpan={unusableShipmentOrderHeader.length}
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
        <ViewShipmentDetails
          classes={classes}
          modalData={shipment.data}
          showModal={shipment.show}
          handleModalClose={this.handleShipmentModalToggle}
        />
        <UnusableShipmentPopup
          classes={classes}
          handleModalClose={this.handleModalActions}
          value={this.state.value}
          showModal={showModal}
          modalData={this.state.modalData}
          handleChange={this.handleChange}
          handleFormSubmit={this.handleFormSubmit}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  order: state.order,
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(connect(mapStateToProps)(UnusableShipment));
