import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { Typography,Select,MenuItem,InputLabel,FormControl  } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
import {
  startedOrdersHeader,
  statusMeta,
  paymentMethodMeta
} from "../../../metadata";
import { getSelectedItem } from "../../helpers";
import Modal from "../../components/Modal";
import {Divider,Button} from "@material-ui/core";
import { Link } from "react-router-dom";
import { fetchCryptOrderApi, patchCryptOrderApi } from "../../api/order";
import Notify from "../../components/Notify";
import CustomTableCell from "../../components/CustomTableCell";
import { fetchOrderListApi } from "../../api/order";
import LinearProgress from "@material-ui/core/LinearProgress";

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
  },
  right: {
    textAlign: "right"
  }
});

class StartedList extends React.Component {
  initialState = {
    orderId: "",
    txnId: "",
    startDate: "",
    endDate: "",
    searchParams: { txnStatus: "0,2" },
    crypt: {
      orderId: "",
      status: "",
      paymentId: "",
      paymentGateway: "",
      paymentMode: "",
      paymentInternalGateway: "",
      paymentMerchantName: ""
    },
    showCryptModal: false,
    shipName: "",
    cryptOptions: [],
    count: 0,
    loading: false,
    parentOrderId: ""
  };

  state = {
    activePage: 1,
    rows: [],
    countPerPage: 10,
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

  handleCryptChange = event => {
    if (event.target.name == "status" && isNaN(event.target.value)) {
      this.setState({
        message: "Please select transaction status to continue."
      });
    } else {
      var crypt = this.state.crypt;
      crypt[event.target.name] = event.target.value;
      this.setState({ crypt: crypt, message: "" });
    }
  };

  handleModalOpen = row => {
    const that = this;
    that.setState({ message: "", loading: true }, () =>
      fetchCryptOrderApi(row.txnId, that.props.userId).then(res =>
        res && res.status < 350
          ? that.setState({
              crypt: {
                ...that.initialState.crypt,
                orderId: row.orderId
              },
              shipName: row.shipName,
              cryptOptions: res.data || [],
              message: "",
              showCryptModal: !that.state.showCryptModal,
              loading: false
            })
          : that.setState({ message: "No options found", loading: false })
      )
    );
  };

  handleModalClose = () => {
    this.setState({ showCryptModal: !this.state.showCryptModal, message: "" });
    this.handleOrderFetch(this.state.activePage);
  };

  handleCryptSubmit = () => {
    const that = this;
    const {
      status,
      paymentId,
      paymentGateway,
      paymentMode,
      paymentInternalGateway,
      paymentMerchantName
    } = that.state.crypt;
    this.setState({ loading: true, message: "" }, () => {
      if (
        status &&
        paymentId.trim() &&
        paymentGateway.trim() &&
        paymentMode.trim() &&
        paymentInternalGateway.trim() &&
        paymentMerchantName.trim()
      ) {
        patchCryptOrderApi(that.state.crypt, that.props.userId).then(res => {
          if (res && res.status < 350) {
            that.handleOrderFetch(that.state.activePage);
            that.setState({
              showCryptModal: !that.state.showCryptModal,
              message: "Upated successffully",
              loading: false
            });
          } else {
            that.setState({
              message: "Error occurred in update",
              loading: false
            });
          }
        });
      } else {
        this.setState({
          message: "Please provide all mandatory fields",
          loading: false
        });
      }
    });
  };

  render() {
    const { classes, order } = this.props;
    const {
      orderId,
      txnId,
      startDate,
      endDate,
      rows,
      activePage,
      countPerPage,
      crypt,
      showCryptModal,
      shipName,
      cryptOptions,
      message,
      count,
      loading,
      parentOrderId
    } = this.state;

    return (
      <React.Fragment>
        {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid lg={12} container className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Started/Failed
          </Typography>
        </Grid>
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
                fullWidth
                name="orderId"
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
            <Grid item xs={12} sm={6} md={4}  className={classes.control}>
              <Typography variant="caption" display="block" gutterBottom>
                Date started
              </Typography>
              <TextField
                // helperText="Date started"
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
                Date ended
              </Typography>
              <TextField
                // helperText="Date ended"
                variant="outlined"
                type="date"
                fullWidth
                name="endDate"
                onChange={this.handleSearchChange}
                margin="none"
                value={endDate}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
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
          align="left"
        >
          Started Orders{" "}
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
                {startedOrdersHeader.map((v, k) => (
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
                        {row.shippingPrice}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.promocodeDiscount}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        {row.promoCode}
                      </CustomTableCell>
                      <CustomTableCell align="center" padding="dense">
                        <Link to="#" onClick={() => this.handleModalOpen(row)}>
                          <Typography>Update Crtypt Order</Typography>
                        </Link>
                      </CustomTableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={startedOrdersHeader.length}
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
        </Paper>
        <Modal
          open={showCryptModal}
          onClose={this.handleModalClose}
          title={"Shipping Name: " + shipName}
        >
          {cryptOptions && cryptOptions.length > 0 ? (
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="h5">Edit Order</Typography>
              </Grid>
              {cryptOptions[0].value == 3 && (
                <Typography color="secondary">
                  Below SKUS are out of stock. This Order can not be completed.
                  Please Cancel the order and update payment id to Cancel the
                  order so refund can processed.
                </Typography>
              )}
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography>Shipping Details</Typography>
              </Grid>
              <Grid item xs={12}  md={6} style={{padding:"10px"}}>
              <FormControl variant="outlined" fullWidth>
              <InputLabel id="demo-simple-select-outlined-label">Select Status</InputLabel>
                <Select
                  label="Select Status"
                  name="status"
                  onChange={this.handleCryptChange}
                  value={crypt.status}
                  className={classes.select}
                >
                  {cryptOptions.map((v, k) => (
                    <MenuItem key={k} value={v.value}>
                      {v.label}
                    </MenuItem>
                  ))}
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}  md={6} style={{padding:"10px"}}>
                <TextField
                  label="Payment Id*"
                  name="paymentId"
                  variant="outlined"
                  value={crypt.paymentId}
                  fullWidth
                  onChange={this.handleCryptChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} style={{padding:"10px"}}>
                <TextField
                  label="Payment Gateway*"
                  name="paymentGateway"
                  variant="outlined"
                  value={crypt.paymentGateway}
                  fullWidth
                  helperText="eg: PAYU / PAYTM / BILLDESK"
                  onChange={this.handleCryptChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} style={{padding:"10px"}}>
                <TextField
                  label="Payment Mode*"
                  name="paymentMode"
                  variant="outlined"
                  value={crypt.paymentMode}
                  fullWidth
                  helperText="eg: CC, DC, NETBANKING OR WALLET code"
                  onChange={this.handleCryptChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} style={{padding:"10px"}}>
                <TextField
                  label="Payment Internal Gateway*"
                  name="paymentInternalGateway"
                  variant="outlined"
                  value={crypt.paymentInternalGateway}
                  fullWidth
                  helperText="eg: As provided by gateway like HDFC"
                  onChange={this.handleCryptChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} style={{padding:"10px"}}>
                <TextField
                  label="Payment Merchant Name*"
                  name="paymentMerchantName"
                  variant="outlined"
                  margin="none"
                  value={crypt.paymentMerchantName}
                  fullWidth
                  helperText="eg: VISA, Master etc"
                  onChange={this.handleCryptChange}
                />
              </Grid>
              <Grid item xs={12} className={classes.right}>
                <Button
                  color="primary"
                  onClick={this.handleCryptSubmit}
                  className={classes.fab}
                  variant="contained"
                  disabled={
                    !crypt.paymentId.trim() ||
                    !crypt.paymentGateway.trim() ||
                    !crypt.paymentMode.trim() ||
                    !crypt.paymentInternalGateway.trim() ||
                    !crypt.paymentMerchantName.trim()
                  }
                >
                  Update
                </Button>
                <Button
                  color="primary"
                  onClick={this.handleModalClose}
                  className={classes.fab}
                  variant="contained"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Typography color="secondary">
              Unable to check inventory availability
            </Typography>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  order: state.order,
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(connect(mapStateToProps)(StartedList));