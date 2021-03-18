import React from "react";
import Modal from "../../../components/Modal";
import {
  Grid,
  TextField,
  Typography,
  Fab,
  Table,
  TableHead,
  TableBody,
  Button,
  TableCell,
  TableRow
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CustomTableCell from "../../../components/CustomTableCell";

export default function ProcessRefundPopUp(props) {
  const {
    classes,
    modalData,
    formData,
    handleModalClose,
    handleProcessRefundSubmit,
    handleFormChange
  } = props;

  return (
    <Modal
      open={modalData.show}
      onClose={handleModalClose}
      title="You are about to process refund option for following transactions"
    >
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="center" padding="dense">
                  Transaction Id
                </TableCell>
                <TableCell align="center" padding="dense">
                  Product Name
                </TableCell>
                <TableCell align="center" padding="dense">
                  Quantity
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell align="center" padding="dense">
                  {formData.txnId}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {modalData.productName}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {modalData.quantity}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12}>
          {modalData.amount && (
            <div className={classes.amount}>
              <Typography gutterBottom>
                Maximum refundable amount :{" "}
                {modalData.amount.amount}
              </Typography>
              <Typography gutterBottom>
                Coupon amount : {modalData.amount.promoCodeAmount}
              </Typography>
              <Typography gutterBottom>
                Shipping charges : {modalData.amount.shippingCharge}
              </Typography>
            </div>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4} style={{padding:"10px"}}>
          <TextField
            label="Refund reference no"
            name="refundReferenceNo"
            variant="outlined"
            margin="none"
            fullWidth
            required
            InputLabelProps={{
              shrink: true
            }}
            value={formData.refundReferenceNo}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} style={{padding:"10px"}}>
          <TextField
            label="Refund date"
            name="date"
            variant="outlined"
            margin="none"
            fullWidth
            required
            InputLabelProps={{
              shrink: true
            }}
            type="date"
            value={formData.date}
            onChange={handleFormChange}
            inputProps={{
              max: new Date().toISOString().split("T")[0]
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} style={{padding:"10px"}}>
          <TextField
            label="Refund amount"
            name="amount"
            variant="outlined"
            margin="none"
            fullWidth
            required
            InputLabelProps={{
              shrink: true
            }}
            value={formData.amount}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item xs={12} className={classes.right}>
          <Button
            color="primary"
            className={classes.fab}
            variant="contained"
            onClick={handleProcessRefundSubmit}
            disabled={
              !formData.refundReferenceNo || !formData.date || !formData.amount
            }
          >
            Submit
          </Button>
          <Button
            color="primary"
            className={classes.fab}
            variant="contained"
            onClick={handleModalClose}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
