import React from "react";
import { namespace } from "../../../config";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {TextField,Button} from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import Table from "@material-ui/core/Table";
import {
  TableBody,
  Select,
  FormControl,
  FormHelperText,
  TableContainer,
  MenuItem,
  InputLabel 
} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import { fetchOrderListApi } from "../../api/order";
import Pagination from "react-js-pagination";
import {
  orderDetailsHeader,
  paymentMethodMeta,
  warehouseMeta,
  shippingStatusMeta,
  statusMeta,
  shipingServiceMeta
} from "../../../metadata";
import { getSelectedItem } from "../../helpers";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import CustomTableCell from "../../components/CustomTableCell";
import SkuDetailsModal from "./popup/SkuDetailsModal";
import { postSkuDetail } from "../../api/pricing";
import Notify from "../../components/Notify";
import LinearProgress from "@material-ui/core/LinearProgress";
import { baseUrl } from "../../../config.js";

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
  advanceOption: {
    textAlign: "right"
  },
  advanceOptionText: {
    cursor: "pointer",
    color: "blue",
    width: "fit-content",
    float: "right"
  },
  fab: {
    margin: theme.spacing.unit
  },
  heading: {
    margin: theme.spacing.unit * 2
  },
  table: {
    minWidth: 650
  },
  control:{padding:"10px"},
  // tableWrapper: {
  //   ...theme.tableWrapper
  // },
  modal: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: theme.spacing.unit * 4,
    outline: "none",
    transform: `translate(-50%, -50%)`
  }
});

class OrderDetails extends React.Component {
  initialState = {
    paymentMethodId: "",
    warehouseId: "",
    orderId: "",
    txnId: "",
    shippingStatus: "",
    txnStatus: [],
    startDate: "",
    endDate: "",
    shippingStartDate: "",
    shippingEndDate: "",
    docketNo: "",
    shippingServiceId: "",
    dealId: "",
    searchParams: {
      txnStatus:
        "1,3,4,6,15,16,17,19,20,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,40,41,45,46"
    },
    skuDetails: false,
    skuData: { inventory: [] },
    count: 0,
    loading: false,
    parentOrderId: ""
  };

  state = {
    advance: false,
    activePage: 1,
    rows: [],
    countPerPage: 10,
    customerDetails: false,
    details: {},
    message: "",
    ...this.initialState
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

  handleMultiSelectChange = e => {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({
      txnStatus: value,
      searchParams: {
        ...this.state.searchParams,
        [e.target.name]: value.toString()
      }
    });
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
        res.status < 350 && res.data && res.data.data
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

  handleClear = () => {
    this.setState({ ...this.initialState }, () =>
      this.handleOrderFetch(this.state.activePage)
    );
  };

  componentDidMount = () => {
    this.handleOrderFetch(this.state.activePage);
  };

  handleSubmit = () => {
    this.handleOrderFetch(null);
    this.setState({ activePage: 1 });
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber }, () =>
      this.handleOrderFetch(pageNumber)
    );
  };

  handleSkuModalOpen = row => {
    postSkuDetail(this.props.userId, { skus: [row.productSKU] }).then(res => {
      if (res.statusText == "OK") {
        this.setState({
          skuDetails: true,
          skuData: { ...row, inventory: Object.values(res.data.inventoryMap) }
        });
      } else {
        this.setState({
          skuDetails: true,
          skuData: { ...row, inventory: [] }
        });
      }
    });
  };

  handleSkuModalClose = () => {
    this.setState({ skuDetails: false });
  };

  render() {
    const { classes, order, userId } = this.props;
    const {
      advance,
      paymentMethodId,
      warehouseId,
      orderId,
      txnId,
      shippingStatus,
      txnStatus,
      startDate,
      endDate,
      shippingStartDate,
      shippingEndDate,
      docketNo,
      shippingServiceId,
      dealId,
      rows,
      activePage,
      countPerPage,
      customerDetails,
      skuDetails,
      skuData,
      details,
      message,
      count,
      loading,
      parentOrderId
    } = this.state;

    return (
      <React.Fragment>
          {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Order Details
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={12} alignItems="center">
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label" >Payment Method</InputLabel>
                  <Select
                    label="Payment Method"
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={paymentMethodId}
                    name="paymentMethodId"
                    onChange={this.handleSearchChange}
                  >
                     {paymentMethodMeta.map((v, k) => (
                      <MenuItem key={k} value={v.value}>
                        {v.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6} md={3}>
              <select
                name="warehouseId"
                onChange={this.handleSearchChange}
                value={warehouseId}
                className={classes.select}
              >
                {warehouseMeta.map((v, k) => (
                  <option key={k} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Grid> */}
            <Grid item xs={12} sm={6} md={3} className={classes.control}> 
              <TextField
                label="Parent Order Id"
                type="text"
                name="parentOrderId"
                variant="outlined"
                fullWidth
                onChange={this.handleSearchChange}
                value={parentOrderId}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                label="Order Id"
                type="number"
                name="orderId"
                variant="outlined"
                fullWidth
                onChange={this.handleSearchChange}
                value={orderId}
                onKeyDown={this.handleSearchChange}
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
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}  style={{marginTop:"20px"}}>
              <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label" >Shipping Status</InputLabel>
                  <Select
                    label="Shipping status"
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={shippingStatus}
                    name="shippingStatus"
                    onChange={this.handleSearchChange}
                  >
                     {shippingStatusMeta.map((v, k) => (
                      <MenuItem key={k} value={v.value}>
                        {v.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
                <Typography variant="caption" display="block" gutterBottom>
                  Date started
                </Typography>
                <TextField
                  // helperText="Date started"
                  className={classes.textField}
                  variant="outlined"
                  type="date"
                  fullWidth
                  name="startDate"
                  onChange={this.handleSearchChange}
                  value={startDate}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
                <Typography variant="caption" display="block" gutterBottom>
                  Date ended
                </Typography>
                <TextField
                  // helperText="Date ended"
                  variant="outlined"
                  fullWidth
                  type="date"
                  inputProps={{
                    min: startDate
                      ? new Date(startDate).toISOString().split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }}
                  name="endDate"
                  onChange={this.handleSearchChange}
                  value={endDate}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <Typography margin="none">Status</Typography>
              <select
                name="txnStatus"
                onChange={this.handleMultiSelectChange}
                value={txnStatus}
                multiple
                className={classes.select}
              >
                {statusMeta.map((v, k) => (
                  <option key={k} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Grid>
            {advance && (
              <React.Fragment>
                 <Grid item xs={12} sm={6} md={3} style={{marginTop:"20px"}} className={classes.control}>
                
                  <TextField
                    label="Docket No"
                    fullWidth
                    variant="outlined"
                    name="docketNo"
                    onChange={this.handleSearchChange}
                    value={docketNo}
                    onKeyDown={this.handleSearchChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} className={classes.control}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Shipped started date
                  </Typography>
                  <TextField
                    // helperText="Shipped started date"
                    className={classes.textField}
                    variant="outlined"
                    type="date"
                    fullWidth
                    name="shippingStartDate"
                    onChange={this.handleSearchChange}
                    value={shippingStartDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} className={classes.control}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Shipped end date
                  </Typography>
                  <TextField
                    // helperText="Shipped end date"
                    className={classes.textField}
                    variant="outlined"
                    type="date"
                    fullWidth
                    inputProps={{
                      min: shippingStartDate
                        ? new Date(shippingStartDate)
                            .toISOString()
                            .split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }}
                    name="shippingEndDate"
                    onChange={this.handleSearchChange}
                    value={shippingEndDate}
                  />
                </Grid>
              </React.Fragment>
            )}
          </Grid>
          <div className={classes.advanceOption}>
            <Typography
              className={classes.advanceOptionText}
              onClick={() => this.setState({ advance: !advance })}
            >
              {advance ? "Hide" : "Show"} Advanced Search Options
            </Typography>
          </div>
          <Grid container alignItems="center" justify="flex-start">
            <Grid item xs={12} sm={1} md={1}>
              <Button
                color="primary"
                onClick={this.handleClear}
                className={classes.fab}
                variant="contained"
              >
                Clear
              </Button>
            </Grid>
            <Grid item xs={12} sm={1} md={1}>
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
        <Typography
          className={classes.heading}
          variant="h5"
          gutterBottom
          component="h5"
          align="left"
        >
          Order List ({count > 0 ? count : 0})
        </Typography>
        <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table}  stickyHeader size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                  {orderDetailsHeader.map((item, index) => (
                    <CustomTableCell key={index} align="center">
                        {item}
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
                        {getSelectedItem(paymentMethodMeta, row.paymentMethod)}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.paymentGateway || "NA"}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        <b>{row.brandName}</b>
                        <br />
                        <a
                          href={`${baseUrl}/ops-pdp-preview/${row.productId}-${row.productId}/${row.productSKU}.html`}
                          target="_blank"
                        >
                          {row.productName || "NA"}
                        </a>
                        <br />
                        <b>Size:</b>
                        {row.productSize}
                        &#160;
                        <b>Color:</b> {row.productColor}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.parentOrderId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.orderId}
                        /<br />
                        {row.txnId}
                        /<br />
                        <Link
                          to={`/order/viewTxnHistory/${userId}/${row.txnId}`}
                          target="_blank"
                        >
                          History
                        </Link>
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.purchaseDate || "NA"}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.status == "20"
                          ? row.refundReferenceNo
                            ? "REFUND BY PG"
                            : "REFUND BY PG Finance team yet to refund"
                          : row.status == "29"
                          ? row.refundReferenceNo
                            ? "Refund By Cash"
                            : "Refund By Cash Finance team yet to refund"
                          : getSelectedItem(statusMeta, row.status)}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.quantity || "NA"}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.price}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.sellingPrice}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.shippingPrice}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.shippingRecovery || 0}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.shippingRefund || 0}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.actualPrice}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.promocodeDiscount}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.promoCode || "NA"}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.shipName || "NA"}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {getSelectedItem(
                          shippingStatusMeta,
                          row.shippingStatus
                        )}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        <Link
                          to="#"
                          onClick={() =>
                            this.setState({
                              customerDetails: true,
                              details: row
                            })
                          }
                        >
                          Customer Detail
                        </Link>
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        <Link
                          to="#"
                          onClick={() => this.handleSkuModalOpen(row)}
                        >
                          Sku Details
                        </Link>
                      </TableCell>
                      {/* <TableCell align="center" padding="dense">
                        {row.warehouseName || "NA"}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.cashbackStatus || "NA"}
                      </TableCell> */}
                      <TableCell align="center" padding="dense">
                        {row.newOrderId &&
                          `Exchanged to (order:${row.newOrderId})`}
                        {row.oldOrderId &&
                          `Exchanged by (order:${row.oldOrderId})`}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={orderDetailsHeader.length}
                    align="center"
                    padding="dense"
                  >
                    No Record Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>
        <Pagination
          activePage={activePage}
          itemsCountPerPage={countPerPage}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
        <Modal
          open={customerDetails}
          onClose={() =>
            this.setState({
              customerDetails: !customerDetails
            })
          }
          title="Customer Details"
        >
          <Grid container>
            <Grid item>
              <Typography>To,</Typography>
              <Typography>{details.txnId}</Typography>
              <Typography>Shipname: {details.shipName}</Typography>
              <Typography>Address: {details.shipAddress}</Typography>
              <Typography>City: {details.shipCity}</Typography>
              <Typography>
                State: {details.shipState} {details.shipZip}
              </Typography>
              <Typography>Country: {details.shipCountry}</Typography>
              <Typography>Mob: {details.shipMobile}</Typography>
              <Typography>
                Size: {details.productSize}, Color: {details.productColor}
              </Typography>
              <Typography>
                Shipping service: {details.shipServiceName}
              </Typography>
              <Typography>Shipping service url: </Typography>
              <Typography>Docket no: {details.docketNo}</Typography>
              <Typography>Shipping charge: {details.shippingPrice}</Typography>
              <Typography>Shipping Date: {details.shipDate}</Typography>
              <Typography>
                Status:{" "}
                {getSelectedItem(shippingStatusMeta, details.shippingStatus)}
              </Typography>
              <Button
                color="primary"
                className={classes.fab}
                variant="contained"
                onClick={() =>
                  this.setState({
                    customerDetails: !customerDetails
                  })
                }
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Modal>
        <SkuDetailsModal
          classes={classes}
          showModal={skuDetails}
          modalData={skuData}
          handleModalClose={this.handleSkuModalClose}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  order: state.order,
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(connect(mapStateToProps)(OrderDetails));