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
  TableCell,
  Button,
  TableRow
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CustomTableCell from "../../../components/CustomTableCell";

export default function CancelPopup(props) {
  const {
    classes,
    modalData,
    showModal,
    handleModalClose,
    handleSubmit,
    handleDataChange
  } = props;

  return (
    <Modal
      open={showModal}
      onClose={handleModalClose}
      title="Order cancellation"
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
                  {modalData.txnId}
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
          <Typography gutterBottom className={classes.amount} color="error">
            Please make sure the old order is not picked up from customer. If
            its picked then don't cancel this order until we receive the old
            item back
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="Reason"
            name="reason"
            variant="outlined"
            margin="none"
            fullWidth
            required
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              maxLength: "50"
            }}
            value={modalData.reason}
            onChange={handleDataChange}
          />
        </Grid>
        <Grid item xs={12} className={classes.right}>
          <Button
            disabled={!modalData.reason}
            color="primary"
            className={classes.fab}
            variant="contained"
            onClick={handleSubmit}
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
