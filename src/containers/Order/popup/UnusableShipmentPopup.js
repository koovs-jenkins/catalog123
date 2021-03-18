import React from "react";
import Modal from "../../../components/Modal";
import {
  Grid,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CustomTableCell from "../../../components/CustomTableCell";

export default function UnusableShipmentPopup(props) {
  const {
    classes,
    handleModalClose,
    showModal,
    handleChange,
    modalData,
    handleFormSubmit
  } = props;

  return (
    <Modal
      open={showModal}
      onClose={handleModalClose}
      title={
        modalData.title ||
        "Unusable shipment action"
      }
    >
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Table>
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
          <FormControl component="fieldset">
            <FormLabel component="legend">
              Please select either to reship or to move to damage location(i.e
              amount will be refunded to customer)
            </FormLabel>
            <RadioGroup
              aria-label="returnType"
              name="returnType"
              className={classes.group}
              value={modalData.returnType}
              onChange={e => handleChange(e, false)}
            >
              {modalData.returnType == 1 && (
                <FormControlLabel
                  value={modalData.returnType}
                  control={<Radio color="primary" />}
                  label="Refund"
                />
              )}
              {modalData.returnType == 2 && (
                <FormControlLabel
                  value={modalData.returnType}
                  control={<Radio color="primary" />}
                  label="Confirm"
                />
              )}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} className={classes.right}>
          <Button
            // disabled={!modalData.refundOption}
            color="primary"
            className={classes.fab}
            variant="contained"
            onClick={handleFormSubmit}
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
