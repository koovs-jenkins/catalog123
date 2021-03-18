import React from "react";
import {
  Fab,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Grid,
  IconButton,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  LinearProgress,
  Button,
  Paper 
} from "@material-ui/core";
import CustomTableCell from "../../../../components/CustomTableCell";
import {
  Add as AddIcon,
  Remove,
  Clear,
  Delete,
  FavoriteBorder
} from "@material-ui/icons";
import { CallCenterConsumer } from "../../../../context/CallCenter/UserCart";

const Cart = props => {
  return (
    <CallCenterConsumer>
      {context =>
        context.cartData.items ? (
          <React.Fragment>
            {context.loading && <LinearProgress />}
            <div className={context.classes.tableWrapper}>
             <Paper square className={context.classes.section}>
              <Table className={context.classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Item Description</TableCell >
                    <TableCell align="center">Your Selections</TableCell >
                    <TableCell  align="center">Amount</TableCell >
                  </TableRow>
                </TableHead>
                <TableBody className={context.classes.tableBody}>
                  {context.cartData.items &&
                    context.cartData.items.length > 0 &&
                    context.cartData.items.map((v, k) => (
                      <TableRow hover key={v.id}>
                        <TableCell >
                          <Grid container spacing={24}>
                            <Grid item>
                              <img
                                className={context.classes.cover}
                                src={v.product.cartImageUrl}
                                title={v.product.productName}
                              />
                            </Grid>
                          </Grid>
                        </TableCell >
                        <TableCell>
                          <Grid
                            container
                            justify="space-between"
                            alignItems="center"
                            direction="row"
                          >
                            <Grid item xs={12}>
                              <Typography
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                {v.product.productName}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              className={context.classes.middle}
                              sm={7}
                            >
                              <Typography variant="button" gutterBottom>
                                Color:
                              </Typography>
                            </Grid>
                            <Grid item sm={4} style={{marginTop:"10px"}}>
                              <FormControl fullWidth variant="outlined">
                               <InputLabel id="demo-simple-select-outlined-label">Please select product color</InputLabel>
                              <Select
                                label="Please select product color"
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                name="color"
                                helperText="Please select product color"
                                value={v.product.lineId}
                                onChange={e => context.handleColorChange(e, k)}
                              >
                                <MenuItem value="">Select Color</MenuItem>
                                {v.productInfo &&
                                  v.productInfo.attributes &&
                                  v.productInfo.attributes.colors.map(val => (
                                    <MenuItem
                                      key={val.id}
                                      value={val.id}
                                      disabled={val.isOutOfStock}
                                    >
                                      {`${val.mainColor[0] || val.code}`}
                                      {val.isOutOfStock && " (Out of stock)"}
                                    </MenuItem>
                                  ))}
                              </Select>
                              </FormControl>
                            </Grid>
                            {v.productInfo && v.productInfo.attributes && (
                              <Grid item sm={1}>
                                <div
                                  style={{
                                    backgroundColor:
                                      v.productInfo.attributes.colors.filter(
                                        z => v.product.lineId == z.id
                                      )[0].code ||
                                      v.productInfo.attributes.colors.filter(
                                        z => v.product.lineId == z.id
                                      )[0].mainColor[0],
                                    width: "25px",
                                    height: "25px",
                                    borderRadius: "100%"
                                  }}
                                />
                              </Grid>
                            )}
                          </Grid>
                          <Grid container justify="space-between">
                            <Grid
                              item
                              sm={7}
                              className={context.classes.middle}
                            >
                              <Typography variant="button" gutterBottom>
                                Size:
                              </Typography>
                            </Grid>
                            <Grid item sm={5}>
                            <FormControl fullWidth variant="outlined" style={{marginTop:"10px"}}>
                               <InputLabel id="demo-simple-select-outlined-label">Please select product size</InputLabel>
                              <Select
                                label="Please select product size"
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                name="size"
                                helperText="Please select product size"
                                value={v.product.sizeCode}
                                onChange={e => context.handleAttrChange(e, v)}
                              >
                                <MenuItem value="">Select Size</MenuItem>
                                {v.productInfo &&
                                  v.productInfo.combined &&
                                  v.productInfo.combined[
                                    v.product.lineId
                                  ].combine.map(val => (
                                    <MenuItem
                                      key={val.id}
                                      value={val.code}
                                      disabled={val.isOutOfStock}
                                    >
                                      {val.code}{" "}
                                      {val.isOutOfStock && "(Out of stock)"}
                                    </MenuItem>
                                  ))}
                              </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container justify="space-between">
                            <Grid
                              item
                              sm={7}
                              className={context.classes.middle}
                            >
                              <Typography variant="button" gutterBottom>
                                Qty:
                              </Typography>
                            </Grid>
                            <Grid item sm={5} className={context.classes.flex}>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  context.handleQuantity(
                                    context.cartData.items[
                                      k
                                    ].productInfo.quantity.data.filter(
                                      j =>
                                        j.skuId ==
                                        context.cartData.items[k].product.sku
                                    ),
                                    v.qty - 1
                                  )
                                }
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <div className={context.classes.counter}>
                                {v.qty}
                              </div>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  context.handleQuantity(
                                    context.cartData.items[
                                      k
                                    ].productInfo.quantity.data.filter(
                                      j =>
                                        j.skuId ==
                                        context.cartData.items[k].product.sku
                                    ),
                                    v.qty + 1
                                  )
                                }
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell
                          align="right"
                          className={context.classes.relative}
                        >
                          <IconButton
                            className={context.classes.wishlist}
                            title="Move to wishlist"
                            onClick={() =>
                              context.handleMoveToWishlist(v.product)
                            }
                          >
                            <FavoriteBorder />
                          </IconButton>
                          <IconButton
                            className={context.classes.absolute}
                            title="Delete"
                            onClick={() =>
                              context.handleDeleteItemFromCart(v.product.sku)
                            }
                          >
                            <Delete />
                          </IconButton>
                          <Typography gutterBottom>
                            {v.product.discountPrice}
                          </Typography>
                          {v.product.discountPrice != v.product.price && (
                            <React.Fragment>
                              <Typography gutterBottom>
                                <strike>{v.product.price}</strike>
                              </Typography>
                              <Typography gutterBottom>
                                {Math.round(
                                  ((v.product.price - v.product.discountPrice) /
                                    v.product.price) *
                                    100
                                ) + " % OFF"}
                              </Typography>
                            </React.Fragment>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow hover>
                    <TableCell colSpan={3}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Order Summary
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell colSpan={2}>
                      Apply promo code(
                      <span
                        className={context.classes.helperText}
                        onClick={context.handleFetchPromoCodes}
                      >
                        List Promo Codes
                      </span>
                      )
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        name="promocode"
                        variant="outlined"
                        label="Apply"
                        onKeyDown={context.handleApplyCoupon}
                        onChange={context.handleCouponChange}
                        value={context.promoData.promoCode}
                        helperText={
                          <span
                            className={
                              context.promoData.applied
                                ? context.classes.green
                                : context.classes.red
                            }
                          >
                            {context.promoData.promoCodeMessage}
                          </span>
                        }
                      />
                      {context.promoData.applied ? (
                        <IconButton
                          aria-label="Remove coupon"
                          onClick={context.handleDeleteCoupon}
                        >
                          <Clear />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="Add coupon"
                          onClick={context.handleCouponRequest}
                        >
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                  {context.cartData.promoCode && (
                    <TableRow hover>
                      <TableCell colSpan={3}>
                        <b>Active Promo List</b>
                        {context.cartData.promoCode.map((v, k) => (
                          <p key={v.id}>
                            {k + 1}. {v.code}
                          </p>
                        ))}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow hover>
                    <TableCell colSpan={2}>
                      <Typography>Sub Total</Typography>
                      {context.cartData.discount > 0 && (
                        <Typography color="secondary">Discount</Typography>
                      )}
                      {context.cartData.promoCodeDiscount > 0 && (
                        <Typography color="secondary">
                          Coupon Discount
                        </Typography>
                      )}
                      <Typography>Shopping Bag Items</Typography>
                      <Typography>Shipping Charges</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>Rs {context.cartData.total}</Typography>
                      {context.cartData.discount > 0 && (
                        <Typography color="secondary">
                          - Rs {context.cartData.discount}
                        </Typography>
                      )}
                      {context.cartData.promoCodeDiscount > 0 && (
                        <Typography color="secondary">
                          - Rs {context.cartData.promoCodeDiscount}
                        </Typography>
                      )}
                      <Typography>{context.cartData.itemCount}</Typography>
                      <Typography>
                        {context.cartData.shippingAmount == 0
                          ? "Free"
                          : context.cartData.shippingAmount}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell colSpan={2}>
                      <Typography variant="h5" color="textSecondary">
                        Pay Amount
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h5" color="textSecondary">
                        Rs {context.cartData.payAmount}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </Paper>
            </div>
            <Button
             style={{marginTop:"10px"}}
              color="primary"
              variant="contained"
              onClick={e => context.handleChange(e, 1)}
            >
              Confirm Details
            </Button>
          </React.Fragment>
        ) : null
      }
    </CallCenterConsumer>
  );
};

export default Cart;
