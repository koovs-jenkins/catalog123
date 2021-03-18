import React from "react";

import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Tabs,
  Tab,
  Paper,
  Typography,
  Grid,
  LinearProgress
} from "@material-ui/core";
import { connect } from "react-redux";
import Address from "./Address";
import PromoCode from "./PromoCode";
import {
  fetchAddressApi,
  fetchPromoCodesApi,
  postCancelItem
} from "../../../api/callCenter";
import { fetchOrderListApi } from "../../../api/order";
import { genderMeta } from "../../../../metadata";
import CancelPopup from "../popup/CancelPopup";
import { fetchReasonsApi, fetchUserApi } from "../../../api/callCenter";
import TxnDetails from "./TxnDetails";
import ViewShipmentDetails from "../../Order/popup/ViewShipmentDetails";
import Notify from "../../../components/Notify";
import BackButton from "../../../components/BackButton";
import Pagination from "react-js-pagination";

function LinkTab(props) {
  return (
    <Tab component="a" onClick={event => event.preventDefault()} {...props} />
  );
}

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: { ...theme.paper,marginTop:"10px",padding:"10px" },
  tableWrapper: { ...theme.tableWrapper },
  fab: { margin: theme.spacing.unit }
});

class CallCenterSearch extends React.Component {
  state = {
    rows: [],
    address: [],
    value: 0,
    promoCodes: {},
    txnModal: false,
    modalData: {
      options: [],
      orderId: "",
      txnId: "",
      reasonId: "",
      reasonText: ""
    },
    shipment: {
      show: false,
      data: {}
    },
    message: "",
    activePage: 1,
    activePromoPage: 0,
    countPerPage: 10,
    orders: {
      data: [],
      count: 0
    },
    loadingAddress: false,
    loadingOrders: false,
    loadingPromos: false,
    loadingResons: false
  };

  componentDidMount = () => {
    const that = this;
    const { match, userId } = this.props;
    this.setState(
      {
        loading: true,
        loadingAddress: true,
        loadingOrders: true,
        loadingResons: true,
        message: "",
        rows: []
      },
      () =>
        fetchUserApi(this.props.userId, [`id=${match.params.id}`]).then(
          response => {
            response && response.status < 350
              ? that.setState({
                  rows: response.data,
                  loading: false
                })
              : that.setState({
                  loading: false,
                  message: response.data.message || "No user found"
                });
            fetchAddressApi(userId, match.params.id).then(res =>
              that.setState({ address: res, loadingAddress: false })
            );
            that.handlePromoRequest(that.state.activePromoPage);
            that.handleRequest(that.state.activePage);
            fetchReasonsApi(userId, "cancel_cc").then(res => {
              if (res && res.status < 350 && res.data && res.data.data) {
                that.setState(prevState => ({
                  ...prevState,
                  modalData: {
                    ...prevState.modalData,
                    options: res.data.data
                  },
                  loadingResons: false
                }));
              }
            });
          }
        )
    );
    //this.setState({ rows: userDetails });
  };

  handleRequest = activePage => {
    const { match, userId } = this.props;
    fetchOrderListApi(
      activePage,
      this.state.countPerPage,
      { userId: match.params.id },
      userId
    ).then(res =>
      res && res.status < 350 && res.data
        ? this.setState({ orders: res.data, loadingOrders: false })
        : this.setState({
            message: res.data.message || "No transaction found for user"
          })
    );
  };

  handlePromoRequest = activePromoPage => {
    const { match, userId } = this.props;
    this.setState({ loadingPromos: true, message: "" }, () =>
      fetchPromoCodesApi(
        userId,
        match.params.id,
        activePromoPage,
        this.state.countPerPage
      ).then(res =>
        this.setState({
          promoCodes: res && res.data ? res.data : {},
          loadingPromos: false,
          message:
            res && res.data && res.data.errorExists
              ? "Error in promo fetch"
              : ""
        })
      )
    );
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleTxnModalOpen = row => {
    this.setState(prevState => ({
      ...prevState,
      txnModal: !this.state.txnModal,
      modalData: {
        ...prevState.modalData,
        txnId: row.txnId,
        orderId: row.orderId
      }
    }));
  };

  handleTxnToggle = () => {
    this.setState({ txnModal: !this.state.txnModal });
  };

  handleDataChange = e => {
    const modalData = { ...this.state.modalData };
    modalData[e.target.name] = e.target.value;
    this.setState({ modalData: modalData });
  };

  handleTxnModalSubmit = () => {
    const that = this;
    this.setState({ message: "" }, () => {
      const { txnId, orderId, reasonId, reasonText } = that.state.modalData;
      const data = {
        cancelItems: [
          {
            orderItemId: txnId,
            reasonId: reasonId,
            reasonText: reasonText
          }
        ]
      };
      postCancelItem(that.props.userId, orderId, data).then(res => {
        that.setState({
          message: res.data.message ? res.data.message : "Error Occured.",
          txnModal: !that.state.txnModal
        });
        this.handleRequest(that.state.activePage);
      });
    });
  };

  handleShipmentModal = (row = null) => {
    if (row) {
      this.setState({
        shipment: { show: !this.state.shipment.show, data: row }
      });
    } else {
      this.setState({ shipment: { show: !this.state.shipment.show } });
    }
  };

  handlePageChange = (pageNumber, key) => {
    if (key == "activePromoPage") {
      pageNumber = Math.max(0, pageNumber - 1);
      this.handlePromoRequest(pageNumber);
    }else{
      this.handleRequest(pageNumber);
    }
    this.setState({ [key]: pageNumber });
  };

  render() {
    const { classes, match, history } = this.props;
    const {
      rows,
      value,
      address,
      promoCodes,
      orders,
      txnModal,
      modalData,
      shipment,
      message,
      activePage,
      countPerPage,
      loadingAddress,
      loadingOrders,
      loadingPromos,
      loading,
      activePromoPage
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid className={classes.wrapper} container>
          <BackButton text="User Details" history={history} />
        </Grid>
      

        <AppBar color="inherit" position="static" className={classes.wrapper}> 
          <Tabs
            indicatorColor="primary"
            value={value}
            onChange={this.handleChange}
          >
            <LinkTab label="Profile" href="#" />
            <LinkTab label="Address Details" href="#" />
            <LinkTab label="Promo Code" href="#" />
            <LinkTab label="Txn Details" href="#" />
          </Tabs>
        </AppBar>
        <Paper className={classes.paper}>
          {value === 0 &&
            rows &&
            rows.length > 0 &&
            rows.map((row, key) => (
              <Grid container key={key}>
                {loading && <LinearProgress />}
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5} md={2}>
                      <Typography gutterBottom>User Id :</Typography>
                    </Grid>
                    <Grid item xs={7} md={10}>
                      <Typography gutterBottom>{row.id}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5} md={2}>
                      <Typography gutterBottom>Name :</Typography>
                    </Grid>
                    <Grid item xs={7} md={10}>
                      <Typography gutterBottom>
                        {row.name || row.userName.split("-", 1)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5} md={2}>
                      <Typography gutterBottom>Gender :</Typography>
                    </Grid>
                    <Grid item xs={7} md={10}>
                      <Typography gutterBottom>
                        {genderMeta[row.gender]}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5} md={2}>
                      <Typography gutterBottom>Email :</Typography>
                    </Grid>
                    <Grid item xs={7} md={10}>
                      <Typography gutterBottom>{row.email}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5} md={2}>
                      <Typography gutterBottom>Mobile :</Typography>
                    </Grid>
                    <Grid item xs={7} md={10}>
                      <Typography gutterBottom>{row.phone}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5} md={2}>
                      <Typography gutterBottom>Registered from :</Typography>
                    </Grid>
                    <Grid item xs={7} md={10}>
                      <Typography gutterBottom>
                        {"Web/MWAP" || "App" || row.registeredFrom}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5} md={2}>
                      <Typography gutterBottom>Last Login :</Typography>
                    </Grid>
                    <Grid item xs={7} md={10}>
                      <Typography gutterBottom>{row.lastLogin}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5} md={2}>
                      <Typography gutterBottom>Date created :</Typography>
                    </Grid>
                    <Grid item xs={7} md={10}>
                      <Typography gutterBottom>{row.dateCreated}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          {value === 1 && (
            <Address
              classes={classes}
              rows={address}
              loading={loadingAddress}
            />
          )}
          {value === 2 && (
            <React.Fragment>
              <PromoCode
                classes={classes}
                rows={promoCodes.response}
                loading={loadingPromos}
              />
              <Pagination
                activePage={activePromoPage + 1}
                itemsCountPerPage={countPerPage}
                totalItemsCount={promoCodes && promoCodes.totalElement}
                pageRangeDisplayed={5}
                onChange={page =>
                  this.handlePageChange(page, "activePromoPage")
                }
              />
            </React.Fragment>
          )}
          {value === 3 && (
            <React.Fragment>
              <TxnDetails
                classes={classes}
                rows={orders}
                handleTxnModalOpen={this.handleTxnModalOpen}
                handleShipmentModal={this.handleShipmentModal}
                loading={loadingOrders}
              />
              <Pagination
                activePage={activePage}
                itemsCountPerPage={countPerPage}
                totalItemsCount={orders.data && orders.count}
                pageRangeDisplayed={5}
                onChange={page => this.handlePageChange(page, "activePage")}
              />
            </React.Fragment>
          )}
        </Paper>
        <CancelPopup
          classes={classes}
          showModal={txnModal}
          handleModalClose={this.handleTxnToggle}
          modalData={modalData}
          handleDataChange={this.handleDataChange}
          handleSubmit={this.handleTxnModalSubmit}
        />
        <ViewShipmentDetails
          classes={classes}
          modalData={shipment.data}
          showModal={shipment.show}
          handleModalClose={this.handleShipmentModal}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  userDetails: state.callCenter.userList.data.data,
  reasons: state.callCenter.reasons
});

export default withStyles(style)(connect(mapStateToProps)(CallCenterSearch));
