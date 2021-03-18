import React from "react";
import Login from "./Login";
import Details from "./Details";
import { connect } from "react-redux";
import {
  postOderApi,
  fetchCartApi,
  editAddressApi,
  fetchAddressApi,
  fetchWishlistApi,
  fetchProductInfoApi,
  postCartApi,
  deleteCartApi,
  postCouponApi,
  fetchPromoApi,
  deleteCouponApi,
  postWishlistApi,
  deleteAddressApi,
  fetchAllAddressApi,
  postMoveToBagApi,
  fetchProductById,
  fetchCityAndStateByPincodeApi
} from "../../../api/callCenter";
import Notify from "../../../components/Notify";
import { dataCombine, hasProp } from "../../../helpers";
import { fetchUserApi } from "../../../api/callCenter";
import { Typography, Fab, withStyles, Grid,Button } from "@material-ui/core";
import { CallCenterProvider } from "../../../context/CallCenter/UserCart";

const style = theme => ({
  paper: { ...theme.paper,marginTop:"10px",padding:"10px" },
  fab: { margin: theme.spacing.unit },
  header: { margin: theme.spacing.unit },
  section: { marginTop: theme.spacing.unit * 2 },
  cover: { width: 100, height: 150 },
  tableWrapper: { ...theme.tableWrapper, height: "400px" },
  table:{textAlign:"center"},
  card: { maxWidth: 345 },
  wrapper:{
    marginTop:"10px"
  },
  anchor: { textDecoration: "none" },
  flex: { display: "flex" },
  middle: { marginTop: "auto", marginBottom: "auto" },
  icon: { margin: theme.spacing.unit, cursor: "pointer" },
  counter: { margin: "auto" },
  red: { color: "red" },
  green: { color: "green" },
  cursor: { cursor: "pointer" },
  control:{padding:"10px"},
  helperText: {
    cursor: "pointer",
    fontSize: "10px",
    color: "red",
    fontWeight: "bold"
  },
  button: { marginRight: theme.spacing.unit },
  media: { width: "unset", margin: "auto" },
  relative: { position: "relative" },
  absolute: { position: "absolute", top: 0, right: "5px" },
  wishlist: { position: "absolute", top: 0, right: "50px" }
});

class UserCart extends React.Component {
  initialState = {
    isLoggedIn: false,
    value: 0,
    email: "",
    data: {},
    loading: false,
    message: "",
    cartData: {
      promoCode: []
    },
    promoData: {
      promoCode: "",
      applied: false
    },
    address: [],
    wishlist: [],
    isSubmitted: false,
    product: "",
    show: false,
    searchProductInfo: [],
    productMap: {},
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
    showAddressModal: false,
    editAddress: {},
    isEdit: false
  };

  state = { ...this.initialState };

  handleFetchCart = () => {
    const that = this;
    const userId = this.state.data.id;
    this.setState({ loading: true, cartData: {}, message: "" }, () => {
      if (userId) {
        fetchCartApi(userId).then(res => {
          let cartData = {};
          if (
            res &&
            res.status < 350 &&
            res.data &&
            res.data.cart &&
            res.data.cart.itemCount > 0
          ) {
            cartData = res.data.cart;
            let promoData = res.data.promoCodeData
              ? res.data.promoCodeData[0]
              : {};
            cartData.items &&
              cartData.items.length > 0 &&
              cartData.items.map((v, k) =>
                fetchProductInfoApi(that.props.userId, v.id).then(response => {
                  if (response && response.status < 350 && response.data) {
                    cartData.items[k]["productInfo"] = response.data.data[0];
                    cartData.items[k]["productInfo"].combined = dataCombine(
                      response.data.data[0]
                    );
                    that.setState({
                      cartData: cartData,
                      promoData: promoData,
                      loading: false
                    });
                  } else {
                    that.setState({
                      loading: false,
                      message: "Error from batch api"
                    });
                  }
                })
              );
          } else {
            this.setState({ loading: false, message: "No item in cart" });
          }
        });
      } else {
        that.setState({
          loading: false,
          message: "No user found with provided email"
        });
      }
    });
  };

  handleWishList = () => {
    const that = this;
    const userId = this.state.data.id;
    fetchWishlistApi(userId).then(res => {
      if (res.status < 350) {
        const arr = [];
        res.data.data.map(v => arr.push(v.sku));
        fetchProductInfoApi(that.props.userId, arr.join(",")).then(response =>
          response.status < 350
            ? that.setState({ wishlist: response.data.data })
            : []
        );
      }
    });
  };

  handleFetchAllAddress = () => {
    const userId = this.state.data.id;
    fetchAddressApi(this.props.userId, userId).then(res =>
      this.setState({ address: res })
    );
  };

  handleLogin = () => {
    const that = this;
    this.setState(
      { loading: true, message: "", searchProductInfo: [], value: 0 },
      () => {
        that.state.email.indexOf("@") > -1
          ? fetchUserApi(that.props.userId, [`email=${that.state.email}`]).then(
              res => {
                if (res && res.status < 350 && res.data && res.data[0]) {
                  that.setState(
                    {
                      data: res.data[0],
                      loading: false,
                      isLoggedIn: true
                    },
                    () => {
                      that.handleFetchCart();
                      that.handleFetchAllAddress();
                      that.handleWishList();
                    }
                  );
                } else {
                  that.setState({
                    loading: false,
                    message:
                      (res && res.data && res.data.message) ||
                      "Something went wrong"
                  });
                }
              }
            )
          : that.setState({
              loading: false,
              message: "Please enter valid email id"
            });
      }
    );
  };

  handleKeyDown = e => {
    if (e.key == "Enter") {
      this.handleLogin();
    }
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleEmailChange = e => {
    if (
      e.target.value &&
      e.target.value.length > 0 &&
      e.target.value.trim() == ""
    ) {
      this.setState({ message: "Nothing found to search" });
    } else {
      this.setState({ email: e.target.value });
    }
  };

  handleLogout = () => {
    this.setState({ ...this.initialState, message: "Logged out successfully" });
  };

  handleQuantity = (arr, count) => {
    let data = {};
    if (arr.length > 0 && count > 0) {
      data.addItemList = [
        {
          sku: arr[0].skuId,
          qty: count,
          lot: arr[0].feDetails.lot,
          vendor: arr[0].feDetails.vendor,
          warehouse: arr[0].feDetails.warehouse
        }
      ];
    }
    postCartApi(this.state.data.id, data).then(() => this.handleFetchCart());
  };

  handleApplyCoupon = e => {
    if (e.key == "Enter") {
      this.handleCouponRequest();
    }
  };

  handleCouponRequest = () => {
    const that = this;
    that.state.promoData &&
      that.state.promoData.promoCode &&
      that.state.promoData.promoCode.trim() &&
      that.setState({ message: "", loading: true }, () =>
        postCouponApi(that.state.data.id, {
          promoCode: that.state.promoData.promoCode
        }).then(res => {
          if (
            res &&
            res.status < 350 &&
            res.data &&
            res.data.promoCodeData &&
            res.data.promoCodeData[0]
          ) {
            that.handleFetchCart();
            res.data.promoCodeData[0].applied
              ? that.setState({
                  promoData: res.data.promoCodeData[0],
                  loading: false
                })
              : that.setState({
                  message: res.data.promoCodeData[0].promoCodeMessage,
                  loading: false
                });
          } else {
            that.setState({ message: "Error occured", loading: false });
          }
        })
      );
  };

  handleDeleteCoupon = () => {
    deleteCouponApi(this.state.data.id).then(res => {
      if (res.status < 350) {
        this.handleFetchCart();
        this.setState({ promoData: { promoCode: "" } });
      }
    });
  };

  handleDeleteItemFromCart = skuId => {
    deleteCartApi(this.state.data.id, skuId).then(res => {
      if (res.status < 350) {
        this.handleFetchCart();
      }
    });
  };

  handleCouponChange = e => {
    const promoData = { ...this.state.promoData };
    promoData.promoCode = e.target.value;
    this.setState({ promoData });
  };

  handleMoveToWishlist = data => {
    this.setState({ loading: true }, () => {
      const formData = {
        sku: data.sku,
        line: data.lineId,
        product: data.id,
        isSelected: true
      };
      const userId = this.state.data.id;
      postWishlistApi(userId, formData);
      this.handleDeleteItemFromCart(data.sku);
      this.handleLogin();
    });
  };

  handleCheckout = () => {
    const that = this;
    const data = {
      payment: {
        method: "COD",
        gateway: "PAYU"
      }
    };
    that.setState({ loading: true, message: "" }, () =>
      postOderApi(that.state.data.id, data).then(res =>
        res.status < 350
          ? that.setState({
              ...this.initialState,
              loading: false,
              message: `Order has been placed with order id ${res.data.orderId}.`,
              isSubmitted: true
            })
          : that.setState({
              loading: false,
              message: res.data.error.message || "Error occured"
            })
      )
    );
  };

  handleAddress = id => {
    const that = this;
    fetchAllAddressApi(that.state.data.id, "put", {
      id: id
    }).then(res =>
      fetchAddressApi(that.props.userId, that.state.data.id).then(res =>
        that.setState({ address: res })
      )
    );
  };

  handleMoveToBag = (data, quantity) => {
    const form = {
      line: data.lineId,
      sku: data.sku,
      qty: 1,
      lot: quantity[0].feDetails.lot,
      vendor: quantity[0].feDetails.vendor,
      warehouse: quantity[0].feDetails.warehouse
    };
    postMoveToBagApi(this.state.data.id, form).then(res => {
      if (res && res.status && res.status < 350) {
        this.handleLogin();
      }
    });
  };

  handleSearchProduct = e => {
    if (e.key === "Enter") {
      this.handleSearchSubmit();
    } else {
      this.setState({ product: e.target.value });
    }
  };

  handleSearchSubmit = () => {
    const that = this;
    that.setState({ message: "", loading: true }, () =>
      fetchProductById(that.props.userId, that.state.product).then(resp => {
        if (resp && resp.status < 350 && resp.data && resp.data.data) {
          const skus =
            resp.data.data &&
            resp.data.data[0] &&
            resp.data.data[0].data &&
            resp.data.data[0].data[0] &&
            resp.data.data[0].data[0].sku;
          fetchProductInfoApi(that.props.userId, skus).then(
            res =>
              res &&
              res.status < 350 &&
              res.data &&
              res.data.data &&
              res.data.data[0] &&
              that.setState({
                searchProductInfo:
                  resp.data.data && resp.data.data[0] && resp.data.data[0].data
                    ? resp.data.data[0].data
                    : [],
                loading: false,
                productMap: dataCombine(res.data.data[0])
              })
          );
        } else {
          that.setState({
            message: resp.data.messsage || "Error occured",
            loading: false
          });
        }
      })
    );
  };

  handleFetchPromoCodes = () => {
    const that = this;
    that.setState({ message: "", loading: true }, () =>
      fetchPromoApi(that.props.userId, that.state.data.id).then(res => {
        const cartData = { ...this.state.cartData };
        cartData.promoCode =
          res && res.response
            ? res.response.filter(v => v.status === "ACTIVE")
            : [];
        this.setState({ cartData, loading: false });
      })
    );
  };

  handleModalToggle = () => {
    this.setState({ show: !this.state.show });
  };

  handleAttrChange = (e, product) => {
    const that = this;
    const oldSku = product.product.sku;
    const sizeId = product.productInfo.attributes.sizes.filter(
      v => v.code == e.target.value
    )[0].id;
    const skuId = product.productInfo.mapping.data.filter(
      v => v.sizeId == sizeId
    )[0].skuId;
    const inventoryDetaiil = product.productInfo.quantity.data.filter(
      v => v.skuId == skuId
    )[0];
    this.setState({ message: "", loading: true }, () => {
      if (
        (oldSku,
        inventoryDetaiil.feDetails && inventoryDetaiil.feDetails.quantity > 0)
      ) {
        let data = {};
        data.addItemList = [
          {
            sku: inventoryDetaiil.skuId,
            qty: product.qty,
            lot: inventoryDetaiil.feDetails.lot,
            vendor: inventoryDetaiil.feDetails.vendor,
            warehouse: inventoryDetaiil.feDetails.warehouse
          }
        ];
        data.removeItemList = [oldSku];
        postCartApi(that.state.data.id, data).then(() =>
          that.handleFetchCart()
        );
      } else {
        that.setState({ message: "Inventory not available", loading: false });
      }
    });
  };

  handleProductSelect = skuId => {
    fetchProductInfoApi(this.props.userId, skuId).then(
      v =>
        v &&
        v.status &&
        v.status < 350 &&
        v.data &&
        v.data.data &&
        v.data.data[0] &&
        this.handleMoveToBag(
          v.data.data[0].product,
          v.data.data[0].quantity.data.filter(x => x.skuId == skuId)
        )
    );
  };

  handleColorChange = (e, key) => {
    const items = this.state.cartData.items;
    items[key].product.lineId = e.target.value;
    this.setState(prevState => ({
      ...prevState,
      cartData: {
        ...prevState.cartData,
        items: items
      }
    }));
  };

  handleAddressModalToggle = () => {
    this.setState({
      isEdit: false,
      editAddress: {},
      form: this.initialState.form,
      showAddressModal: !this.state.showAddressModal
    });
  };

  handleFormChange = e => {
    this.setState({ message: "" });
    const { form, editAddress, isEdit } = this.state;
    const formData = !isEdit ? { ...form } : { ...editAddress.shippingAddress };
    if (e.target.name == "zip" && e.target.value.length == 6) {
      let zip = e.target.value;
      fetchCityAndStateByPincodeApi(this.props.userId, zip).then(res => {
        if (res.status !== 200) {
          formData.city = "";
          formData.state = "";
          this.setState({ message: res.data.message });
        } else {
          formData.zip = zip;
          formData.city = res.data.city;
          formData.state = res.data.state;
          !isEdit
            ? this.setState({ form: formData })
            : this.setState(prevState => ({
                ...prevState,
                editAddress: {
                  ...prevState.editAddress,
                  billingAddress: formData,
                  shippingAddress: formData
                }
              }));
        }
      });
    }
    formData[e.target.name] = e.target.value;
    !isEdit
      ? this.setState({ form: formData })
      : this.setState(prevState => ({
          ...prevState,
          editAddress: {
            ...prevState.editAddress,
            billingAddress: formData,
            shippingAddress: formData
          }
        }));
  };

  handleNewAddressSubmit = e => {
    e.preventDefault();
    const that = this;
    this.setState({ message: "" }, () => {
      const form = that.state.form;
      if (form.zip.length == 6 && form.mobile.length == 10) {
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
            userId: that.state.data.id,
            isBillingSameAsShipping: true,
            shippingAddress: form
          };
          fetchAllAddressApi(that.state.data.id, "post", data).then(res => {
            if (res.status !== 200) {
              that.setState({
                message: res.data.message
              });
            } else {
              that.setState({
                message: "Address added successfully",
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
              that.handleFetchAllAddress();
              that.handleAddressModalToggle();
            }
          });
        } else {
          that.setState({ message: `All fields are mandatory.` });
        }
      } else if (form.city == "" || form.mobile.length != 10) {
        that.setState({
          message:
            form.mobile.length != 10
              ? `Enter servicable zipcode only.`
              : `Enter valid 10 digit mobile number`
        });
      } else {
        that.setState({ message: `Enter valid data` });
      }
    });
  };

  handleAddressEdit = id => {
    this.setState(prevState => ({
      ...prevState,
      isEdit: true,
      editAddress: prevState.address.filter(v => v.id == id)[0],
      form: prevState.address.filter(v => v.id == id)[0].shippingAddress,
      showAddressModal: !this.state.showAddressModal
    }));
  };

  handleAddressDelete = id => {
    const that = this;
    this.setState({ loading: true, message: "" }, () =>
      deleteAddressApi(that.state.data.id, id).then(res => {
        if (res && res.status < 350) {
          that.handleFetchAllAddress();
          that.setState({
            loading: false,
            message: "Address deleted successfully"
          });
        } else {
          that.setState({
            loading: false,
            message: res.data.message || "Error occured"
          });
        }
      })
    );
  };

  handleEditAddressSubmit = e => {
    const that = this;
    const { data, editAddress } = this.state;
    const formData = {
      ...editAddress,
      userId: data.id,
      isServiceable: true,
      isBillingSameAsShipping: true
    };
    this.setState({ loading: true, message: "" }, () =>
      editAddressApi(data.id, formData).then(res => {
        if (res && res.status < 350) {
          that.handleFetchAllAddress();
          that.setState({
            loading: false,
            message: "Address updated successfully",
            showAddressModal: !this.state.showAddressModal
          });
        } else {
          that.setState({
            loading: false,
            message:
              (res && res.data && res.data.message) || "Error in address update"
          });
        }
      })
    );
  };

  render() {
    const { classes } = this.props;
    const { email, data, loading, message, isLoggedIn } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid container justify="space-between" className={classes.wrapper}>
          <Grid item>
            <Typography variant="h5" gutterBottom component="h5">
              Customer Cart - {data.name ? "User : " + data.name : ""}
            </Typography>
          </Grid>
          <Grid item>
            {isLoggedIn && (
              <Button
                size="small"
                color="primary"
                className={classes.fab}
                variant="contained"
                onClick={this.handleLogout}
              >
                Logout
              </Button>
            )}
          </Grid>
        </Grid>
        {!isLoggedIn ? (
          <Login
            email={email}
            classes={classes}
            loading={loading}
            handleLogin={this.handleLogin}
            handleKeyDown={this.handleKeyDown}
            handleChange={this.handleEmailChange}
          />
        ) : (
          <CallCenterProvider
            value={{
              classes,
              ...this.state,
              handleLogin: this.handleLogin,
              handleChange: this.handleChange,
              handleLogout: this.handleLogout,
              handleAddress: this.handleAddress,
              handleCheckout: this.handleCheckout,
              handleQuantity: this.handleQuantity,
              handleMoveToBag: this.handleMoveToBag,
              handleFormChange: this.handleFormChange,
              handleAttrChange: this.handleAttrChange,
              handleModalToggle: this.handleModalToggle,
              handleAddressEdit: this.handleAddressEdit,
              handleColorChange: this.handleColorChange,
              handleApplyCoupon: this.handleApplyCoupon,
              handleSearchSubmit: this.handleSearchSubmit,
              handleDeleteCoupon: this.handleDeleteCoupon,
              handleCouponChange: this.handleCouponChange,
              handleProductSelect: this.handleProductSelect,
              handleSearchProduct: this.handleSearchProduct,
              handleCouponRequest: this.handleCouponRequest,
              handleAddressDelete: this.handleAddressDelete,
              handleMoveToWishlist: this.handleMoveToWishlist,
              handleFetchPromoCodes: this.handleFetchPromoCodes,
              handleNewAddressSubmit: this.handleNewAddressSubmit,
              handleEditAddressSubmit: this.handleEditAddressSubmit,
              handleAddressModalToggle: this.handleAddressModalToggle,
              handleDeleteItemFromCart: this.handleDeleteItemFromCart
            }}
          >
            <Details />
          </CallCenterProvider>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  userList: state.callCenter.userList
});

export default withStyles(style)(connect(mapStateToProps)(UserCart));