import React from "react";
import {
  Grid,
  TextField,
  Fab,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography
} from "@material-ui/core";
import Address from "../popup/sub/Address";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  postReturnItem,
  editAddressApi,
  checkReverseApi,
  deleteAddressApi,
  selectAddressApi,
  postExchangeItem,
  fetchAllAddressApi,
  fetchProductInfoApi,
  fetchCityAndStateByPincodeApi
} from "../../../api/callCenter";
import { fetchOrderListApi } from "../../../api/order";
import { fetchReasons } from "../../../store/actions/callCenter";
import Notify from "../../../components/Notify";
import { hasProp } from "../../../helpers";
import classNames from "classnames";

const style = theme => ({
  paper: { ...theme.paper },
  fab: { margin: theme.spacing.unit },
  group: { display: "block" },
  action: { position: "absolute", bottom: "0", width: "100%" },
  card: { height: "100%", position: "relative" },
  content: { padding: "16px 16px 40px 16px" },
  bold: { fontWeight: "bold" },
  title: { display: "flex" },
  button: { marginLeft: "auto" },
  hidden: { display: "none" },
  green: { color: "#28a745" }
});

class ReturnExchangeType extends React.Component {
  state = {
    modalData: {
      product: [],
      options: [],
      address: [],
      row: {},
      orderId: "",
      txnId: "",
      userId: "",
      reason: "",
      size: "",
      color: "",
      reasonId: "",
      shippingAddress: {},
      pickupAddress: {},
      subReasonId: "",
      reasonText: "",
      editAddress: {}
    },
    message: "",
    step: 0,
    newAddress: false,
    form: {
      name: "",
      zip: "",
      city: "",
      state: "",
      address: "",
      email: "",
      mobile: "",
      country: "IND"
    },
    formData: {
      accountHolderName: "",
      bankAcNo: "",
      bankName: "",
      branchName: "",
      ifsc: "",
      comment: "",
      refundOption: "",
      selfShip: "0"
    },
    show: true,
    editAddress: false,
    checkReverse: {}
  };

  handleNext = () => {
    this.setState({ step: this.state.step + 1 });
  };

  handlePrev = () => {
    if (this.state.step == 0) {
      this.props.history.goBack();
    }
    this.setState({ step: this.state.step - 1 });
  };

  handleAddressRequest = data => {
    const that = this;
    fetchAllAddressApi(data.userId, "get").then(res => {
      if (res && res.status < 350 && res.data) {
        const selectedAddress = res.data.filter(v => v.isSelected)[0];
        res.data.map(k =>
          k.isSelected
            ? checkReverseApi(that.props.userId, k.shippingAddress.zip).then(
                response => {
                  if (response && response.status < 350 && response.data) {
                    let pickupAddress = {
                      ...selectedAddress,
                      reversePickupMessage: response.data.isServiceable
                        ? "This pincode is reverse servicable"
                        : response.data.message
                    };
                    that.setState(prevState => ({
                      ...prevState,
                      checkReverse: response.data,
                      modalData: {
                        ...prevState.modalData,
                        address: res.data || [],
                        pickupAddress: pickupAddress,
                        shippingAddress: selectedAddress
                      }
                    }));
                  } else {
                    that.setState(prevState => ({
                      ...prevState,
                      checkReverse: response.data
                    }));
                  }
                }
              )
            : that.setState(prevState => ({
                ...prevState,
                modalData: {
                  ...prevState.modalData,
                  address: res.data || [],
                  pickupAddress: selectedAddress,
                  shippingAddress: selectedAddress
                }
              }))
        );
      }
    });
  };

  componentDidMount = () => {
    const { match } = this.props;
    const that = this;
    this.props
      .dispatch(fetchReasons(that.props.userId, match.params.type))
      .then(
        () =>
          that.props.reasons &&
          that.props.reasons.data &&
          that.props.reasons.data.data &&
          that.setState(prevState => ({
            ...prevState,
            modalData: {
              ...prevState.modalData,
              options: that.props.reasons.data.data.data || []
            },
            type: match.params.type
          }))
      );
    fetchOrderListApi(
      1,
      10,
      { txnId: match.params.txnId, orderId: match.params.orderId },
      this.props.userId
    ).then(res => {
      if (res && res.status < 350 && res.data) {
        const result = res.data[0] || res.data.data[0];
        this.handleAddressRequest(result);
        fetchProductInfoApi(that.props.userId, result.productSKU).then(
          response =>
            response &&
            response.status < 350 &&
            response.data &&
            response.data.data &&
            that.setState(prevState => ({
              ...prevState,
              modalData: {
                ...prevState.modalData,
                product: response.data.data[0] || [],
                row: result
              }
            }))
        );
      }
    });
  };

  handleToggle = varType => {
    this.setState({
      [varType]: !this.state[varType],
      form: {
        name: "",
        zip: "",
        city: "",
        state: "",
        address: "",
        email: "",
        mobile: "",
        country: "IND"
      }
    });
  };

  handleAddressSelect = (data, isShipping) => {
    const that = this;
    if (!isShipping) {
      checkReverseApi(this.props.userId, data.shippingAddress.zip).then(
        response => {
          if (response && response.status < 350) {
            data.reversePickupMessage = response.data.isServiceable
              ? "This pincode is reverse servicable"
              : response.data.message;
            selectAddressApi(that.props.userId, data).then(res => {
              if (res && res.status < 350 && res.data.isServiceable) {
                that.setState(prevState => ({
                  ...prevState,
                  checkReverse: response.data,
                  modalData: {
                    ...prevState.modalData,
                    pickupAddress: data || {}
                  }
                }));
              } else {
                that.setState({ message: "Address is not servicable" });
              }
            });
          } else {
            data.reversePickupMessage = res.data.isServiceable
              ? "This pincode is reverse servicable"
              : res.data.message;
            that.setState(prevState => ({
              ...prevState,
              checkReverse: response.data,
              modalData: {
                ...prevState.modalData,
                pickupAddress: data || {}
              }
            }));
          }
        }
      );
    } else {
      selectAddressApi(that.props.userId, data).then(res => {
        if (res && res.status < 350 && res.data.isServiceable) {
          that.setState(prevState => ({
            ...prevState,
            modalData: {
              ...prevState.modalData,
              shippingAddress: data || {}
            }
          }));
        } else {
          that.setState({ message: "Address is not servicable" });
        }
      });
    }
  };

  findSkuId = (color, size) => {
    const { modalData } = this.state;
    const sku = modalData.product.mapping.data.filter(
      v => v.colorId == color && v.sizeId == size
    );
    return (
      modalData.product.quantity.data.filter(v => v.skuId == sku[0].skuId)[0] ||
      {}
    );
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const that = this;
    let details = {};
    this.setState({ message: "" });
    const { modalData, type, formData } = this.state;
    if (type == "exchange") {
      details = this.findSkuId(modalData.color, modalData.size);
    }
    let data = {
      selfShip: that.state.formData.selfShip == 1,
      reasonId: modalData.subReasonId,
      reasonText: modalData.reasonText,
      pickupAddress: modalData.pickupAddress.shippingAddress,
      reversePickupMessage: ""
    };
    let req = "";
    if (type == "return") {
      req = postReturnItem;
      data = {
        ...data,
        storeCredit: formData.refundOption === "0",
        returnItemId: modalData.row.txnId,
        refundMsg: formData.comment,
        bankDetail: {
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          bankAcNo: formData.bankAcNo,
          branchName: formData.branchName,
          ifsc: formData.ifsc
        },
        storeCreditMsg: ""
      };
    } else {
      req = postExchangeItem;
      data = {
        ...data,
        exchangeItemId: modalData.row.txnId,
        newItemSku: details.skuId,
        shippingAddress: modalData.shippingAddress.shippingAddress,
        reorder: "",
        newItemVendorId: details.feDetails.vendor,
        newItemWarehouseId: details.feDetails.warehouse,
        newItemLotId: details.feDetails.lot
      };
    }
    req(
      that.props.userId,
      modalData.row.orderId,
      modalData.row.userId,
      data
    ).then(res => {
      that.setState({
        message:
          res.status != 200
            ? res.data.message
            : `Your return reference number is ${res.data.returnRefNo}. Redirecting to list in 5s...`,
        show: false
      });
      setTimeout(
        () => that.props.history.push("/call_center/return_exchange"),
        5000
      );
    });
  };

  handleDataChange = e => {
    const modalData = { ...this.state.modalData };
    modalData[e.target.name] = e.target.value;
    this.setState({ modalData });
  };

  handleFormChange = e => {
    this.setState({ message: "" });
    const edit = this.state.editAddress;
    const form = edit
      ? { ...this.state.editAddress.shippingAddress }
      : { ...this.state.form };
    form[e.target.name] = e.target.value;
    if (e.target.name == "zip" && e.target.value.length == 6) {
      let zip = e.target.value;
      fetchCityAndStateByPincodeApi(this.props.userId, zip).then(res => {
        if (res.status !== 200) {
          form.city = "";
          form.state = "";
          this.setState({
            message: res.data.message,
            form: { ...this.state.form, ...form }
          });
        } else {
          form.zip = zip;
          form.city = res.data.city;
          form.state = res.data.state;
          edit
            ? this.setState(prevState => ({
                ...prevState,
                modalData: {
                  ...prevState.modalData,
                  editAddress: {
                    ...prevState.modalData.editAddress,
                    shippingAddress: {
                      ...prevState.modalData.editAddress.shippingAddress,
                      ...form
                    }
                  }
                }
              }))
            : this.setState({
                message: "",
                form: { ...this.state.form, ...form }
              });
        }
      });
    } else if (e.target.name == "zip" && e.target.value.length > 6) {
      alert("Zipcode length cannot be greater than 6");
    } else {
      edit
        ? this.setState(prevState => ({
            ...prevState,
            modalData: {
              ...prevState.modalData,
              editAddress: {
                ...prevState.modalData.editAddress,
                shippingAddress: {
                  ...prevState.modalData.editAddress.shippingAddress,
                  ...form
                }
              }
            }
          }))
        : this.setState({ form });
    }
  };

  handleNewAddressSubmit = e => {
    e.preventDefault();
    const that = this;
    this.setState({ message: "" }, () => {
      const form = that.state.form;
      if (form.zip.length == 6) {
        if (
          hasProp(form, "name") &&
          hasProp(form, "zip") &&
          hasProp(form, "city") &&
          hasProp(form, "state") &&
          hasProp(form, "address") &&
          hasProp(form, "email") &&
          hasProp(form, "mobile")
        ) {
          const data = {
            isDefault: false,
            isSelected: true,
            isServiceable: true,
            userId: that.state.modalData.row.userId,
            isBillingSameAsShipping: true,
            shippingAddress: form
          };
          fetchAllAddressApi(that.props.userId, "post", data).then(res => {
            this.handleAddressRequest(that.state.modalData.row);
            if (res.status !== 200) {
              that.setState({
                message: res.data.message
              });
            } else {
              that.setState({
                message: "Address added successfully",
                newAddress: false,
                form: {
                  name: "",
                  zip: "",
                  city: "",
                  state: "",
                  address: "",
                  email: "",
                  mobile: "",
                  country: "IND"
                }
              });
            }
          });
        } else {
          that.setState({ message: `All fields are mandatory.` });
        }
      } else if (form.city == "") {
        that.setState({ message: `Enter servicable zipcode only.` });
      } else {
        that.setState({ message: `Zipcode is invalid` });
      }
    });
  };

  handleChange = e => {
    this.setState({
      formData: {
        ...this.state.formData,
        [e.target.name]: e.target.value
      }
    });
  };

  handleAddressEdit = id => {
    this.setState(prevState => ({
      ...prevState,
      modalData: {
        ...prevState.modalData,
        editAddress: prevState.modalData.address.filter(v => v.id == id)[0]
      }
    }));
    this.handleToggle("editAddress");
  };

  handleAddressDelete = id => {
    const that = this;
    this.setState({ message: "" }, () =>
      deleteAddressApi(this.state.modalData.row.userId, id).then(res => {
        if (res && res.status < 350) {
          that.handleAddressRequest(that.state.modalData.row);
          that.setState({ message: "Address deleted successfully" });
        } else {
          that.setState({ message: res.data.message || "Error occured" });
        }
      })
    );
  };

  handleEditAddressSubmit = () => {
    const address = this.state.modalData.editAddress;
    const data = {
      userId: this.state.modalData.row.userId,
      isBillingSameAsShipping: true,
      isServiceable: true,
      ...address
    };
    const that = this;
    this.setState({ message: "" }, () =>
      editAddressApi(that.state.modalData.row.userId, data).then(res => {
        if (res && res.status < 350) {
          that.handleAddressRequest(that.state.modalData.row);
          that.setState({ message: "Address updated successfully" });
          that.handleToggle("editAddress");
        } else {
          that.setState({ message: res.data.message || "Error occured" });
        }
      })
    );
  };

  render() {
    const { classes, history } = this.props;
    const {
      modalData,
      type,
      step,
      message,
      newAddress,
      editAddress,
      form,
      show,
      formData,
      checkReverse
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Paper className={classes.paper}>
          <form onSubmit={this.handleFormSubmit} method="post">
            <Grid container spacing={40}>
              {step == 0 && (
                <React.Fragment>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      select
                      name="reasonId"
                      SelectProps={{
                        native: true
                      }}
                      margin="normal"
                      fullWidth
                      required
                      value={modalData.reasonId}
                      helperText="Please select reason type"
                      onChange={this.handleDataChange}
                    >
                      <option value="">Select Reason</option>
                      {modalData.options &&
                        modalData.options.length > 0 &&
                        modalData.options.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.title}
                          </option>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      select
                      name="subReasonId"
                      SelectProps={{
                        native: true
                      }}
                      margin="normal"
                      fullWidth
                      required
                      value={modalData.subReasonId}
                      helperText="Please select reason type"
                      onChange={this.handleDataChange}
                    >
                      <option value="">Select Sub Reason</option>
                      {modalData.options &&
                        modalData.reasonId &&
                        modalData.options.length > 0 &&
                        modalData.options.map(
                          v =>
                            v.id == modalData.reasonId &&
                            v.subReasons.map(val => (
                              <option key={val.id} value={val.id}>
                                {val.title}
                              </option>
                            ))
                        )}
                    </TextField>
                  </Grid>
                  {modalData.reasonId == 56 && modalData.subReasonId == 9 && (
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="reasonText"
                        margin="normal"
                        label="Reason Comment"
                        fullWidth
                        value={modalData.reasonText}
                        helperText="Comment"
                        onChange={this.handleDataChange}
                        hidden
                      />
                    </Grid>
                  )}
                </React.Fragment>
              )}
              {step == 1 && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      How do you want to {type}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-label="selfShip"
                        name="selfShip"
                        className={classes.group}
                        value={formData.selfShip}
                        onChange={this.handleChange}
                      >
                        <FormControlLabel
                          value="0"
                          control={<Radio color="primary" />}
                          label="Pick-up from my address"
                        />
                        <FormControlLabel
                          value="1"
                          control={<Radio color="primary" />}
                          label="I will ship it myself"
                        />
                      </RadioGroup>
                    </FormControl>
                    {formData.selfShip == "0" ? (
                      <Typography>
                        A reverse pickup will take 3-5 days from the completion
                        of this request
                      </Typography>
                    ) : (
                      <Typography>
                        Get a self shipping credit of Rs. 100
                      </Typography>
                    )}
                  </Grid>
                  {formData.selfShip == "0" && (
                    <Grid item xs={12}>
                      <Address
                        type={type}
                        modalData={modalData}
                        classes={classes}
                        handleAddressSelect={this.handleAddressSelect}
                        handleToggle={this.handleToggle}
                        title="Select pickup address"
                        newAddress={newAddress}
                        editAddress={editAddress}
                        handleAddressEdit={this.handleAddressEdit}
                        handleAddressDelete={this.handleAddressDelete}
                        handleNewAddressSubmit={this.handleNewAddressSubmit}
                        handleEditAddressSubmit={this.handleEditAddressSubmit}
                        handleFormChange={this.handleFormChange}
                        formData={form}
                      />
                    </Grid>
                  )}
                  {type === "exchange" && (
                    <Grid item xs={12}>
                      <Address
                        type={type}
                        modalData={modalData}
                        classes={classes}
                        handleAddressSelect={this.handleAddressSelect}
                        handleToggle={this.handleToggle}
                        title="Select shipping address"
                        newAddress={newAddress}
                        editAddress={editAddress}
                        handleAddressEdit={this.handleAddressEdit}
                        handleAddressDelete={this.handleAddressDelete}
                        handleNewAddressSubmit={this.handleNewAddressSubmit}
                        handleEditAddressSubmit={this.handleEditAddressSubmit}
                        handleFormChange={this.handleFormChange}
                        formData={form}
                      />
                    </Grid>
                  )}
                </React.Fragment>
              )}
              {step == 2 && (
                <React.Fragment>
                  {type == "exchange" && (
                    <React.Fragment>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          select
                          name="color"
                          SelectProps={{
                            native: true
                          }}
                          margin="normal"
                          fullWidth
                          required
                          helperText="Please select product color"
                          onChange={this.handleDataChange}
                        >
                          <option value="">Select Color</option>
                          {modalData.product &&
                            modalData.product.attributes &&
                            modalData.product.attributes.colors.map(v => (
                              <option
                                key={v.id}
                                value={v.id}
                                disabled={v.mainColor[0].isOutOfStock}
                              >
                                {v.mainColor[0]}{" "}
                                {v.mainColor[0].isOutOfStock &&
                                  "(Out of stock)"}
                              </option>
                            ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          select
                          name="size"
                          SelectProps={{
                            native: true
                          }}
                          margin="normal"
                          fullWidth
                          required
                          helperText="Please select product size"
                          onChange={this.handleDataChange}
                        >
                          <option value="">Select Size</option>
                          {modalData.product &&
                            modalData.product.attributes &&
                            modalData.product.attributes.sizes.map(v => (
                              <option
                                key={v.id}
                                value={v.id}
                                disabled={v.isOutOfStock}
                              >
                                {v.code} {v.isOutOfStock && "(Out of stock)"}
                              </option>
                            ))}
                        </TextField>
                      </Grid>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {type === "return" && step == 2 && (
                <React.Fragment>
                  {modalData.row.paymentMethod === 1 ? (
                    <React.Fragment>
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            Please select a refund option
                          </FormLabel>
                          <RadioGroup
                            aria-label="refundOption"
                            name="refundOption"
                            className={classes.group}
                            value={formData.refundOption}
                            onChange={this.handleChange}
                          >
                            <FormControlLabel
                              value="0"
                              control={<Radio color="primary" />}
                              label="Refund by promo"
                            />
                            <FormControlLabel
                              value="1"
                              control={<Radio color="primary" />}
                              label="Refund by cash"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      {formData.refundOption === "1" && (
                        <React.Fragment>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="A/c holder's name"
                              name="accountHolderName"
                              variant="outlined"
                              margin="none"
                              fullWidth
                              required
                              InputLabelProps={{
                                shrink: true
                              }}
                              value={formData.accountHolderName}
                              onChange={this.handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Bank Account Number"
                              name="bankAcNo"
                              variant="outlined"
                              margin="none"
                              fullWidth
                              required
                              InputLabelProps={{
                                shrink: true
                              }}
                              value={formData.bankAcNo}
                              onChange={this.handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Bank Name"
                              name="bankName"
                              variant="outlined"
                              margin="none"
                              fullWidth
                              required
                              InputLabelProps={{
                                shrink: true
                              }}
                              value={formData.bankName}
                              onChange={this.handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Branch Name"
                              name="branchName"
                              variant="outlined"
                              margin="none"
                              fullWidth
                              required
                              InputLabelProps={{
                                shrink: true
                              }}
                              value={formData.branchName}
                              onChange={this.handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="IFSC Code"
                              name="ifsc"
                              variant="outlined"
                              margin="none"
                              fullWidth
                              required
                              InputLabelProps={{
                                shrink: true
                              }}
                              value={formData.ifsc}
                              onChange={this.handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              label="Comment"
                              name="comment"
                              variant="outlined"
                              margin="none"
                              fullWidth
                              required
                              InputLabelProps={{
                                shrink: true
                              }}
                              value={formData.comment}
                              onChange={this.handleChange}
                            />
                          </Grid>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            Please select a refund option
                          </FormLabel>
                          <RadioGroup
                            aria-label="refundOption"
                            name="refundOption"
                            className={classes.group}
                            value={formData.refundOption}
                            onChange={this.handleChange}
                          >
                            <FormControlLabel
                              value="0"
                              control={<Radio color="primary" />}
                              label="Refund by promo"
                            />
                            <FormControlLabel
                              value="2"
                              control={<Radio color="primary" />}
                              label="Refund by pg"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              <Grid item xs={12}>
                {(step == 0 || step == 1 || step == 2) && show && (
                  <Fab
                    color="primary"
                    className={classes.fab}
                    variant="extended"
                    onClick={this.handlePrev}
                  >
                    Back
                  </Fab>
                )}
                {(step == 0 || step == 1) && show && (
                  <Fab
                    disabled={
                      !modalData.reasonId ||
                      !modalData.subReasonId ||
                      (step == 1 &&
                        !checkReverse.isServiceable &&
                        formData.selfShip == "0")
                    }
                    color="primary"
                    className={classNames(
                      classes.fab
                      // type == "return" &&
                      //   modalData.row.paymentMethod == 0 &&
                      //   step == 1 &&
                      //   classes.hidden
                    )}
                    variant="extended"
                    onClick={this.handleNext}
                  >
                    Next
                  </Fab>
                )}
                {step == 2 && show && (
                  <Fab
                    color="primary"
                    className={classes.fab}
                    variant="extended"
                    type="submit"
                    disabled={
                      formData.refundOption === "1" &&
                      (!modalData.row.paymentMethod === 1 ||
                        !hasProp(formData, "accountHolderName") ||
                        !hasProp(formData, "bankAcNo") ||
                        !hasProp(formData, "bankName") ||
                        !hasProp(formData, "branchName") ||
                        !hasProp(formData, "ifsc"))
                    }
                  >
                    Confirm
                  </Fab>
                )}
                {!show && (
                  <Fab
                    color="primary"
                    className={classes.fab}
                    variant="extended"
                    onClick={() => history.push("/call_center/return_exchange")}
                  >
                    Back to return exchange
                  </Fab>
                )}
              </Grid>
            </Grid>
          </form>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  reasons: state.callCenter.reasons
});

export default withStyles(style)(connect(mapStateToProps)(ReturnExchangeType));
