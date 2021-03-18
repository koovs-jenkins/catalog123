import React from "react";
import Modal from "../../../components/Modal";
import {
  Grid,
  Fab,
  Table,
  Button,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  shippingDetailsHeader,
  shippingStatusMeta
} from "../../../../metadata";
import { getSelectedItem, getDateWithMonthName } from "../../../helpers";
import CustomTableCell from "../../../components/CustomTableCell";

export default function ViewShipmentDetails(props) {
  const { classes, modalData, showModal, handleModalClose } = props;

  return (
    <Modal
      open={showModal}
      onClose={handleModalClose}
      title={"Shipping Details for Order Id: " + modalData.orderId}
      fullWidth
      maxWidth="xl"
    >
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {shippingDetailsHeader && shippingDetailsHeader.map((v, k) => (
                  <TableCell key={k} align="center" padding="dense">
                    {v}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell align="center" padding="dense">
                  1
                </TableCell>
                <TableCell align="center" padding="dense">
                  {modalData.txnId}
                </TableCell>
                <TableCell align="left" padding="dense">
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Name:</span>{" "}
                    {modalData.shipName}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Address:</span>{" "}
                    {modalData.shipAddress}, {modalData.shipCity},{" "}
                    {modalData.shipState}, {modalData.shipCountry}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Pincode:</span>{" "}
                    {modalData.shipZip}
                  </Typography>
                </TableCell>
                <TableCell align="center" padding="dense">
                  {modalData.shipPhone || modalData.shipMobile}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {modalData.shipEmail}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {modalData.shipServiceName}
                  <br />
                  {modalData.docketNo}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {getSelectedItem(
                    shippingStatusMeta,
                    modalData.shippingStatus
                  )}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {getDateWithMonthName(modalData.shipBackDate)}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {getDateWithMonthName(modalData.shipDate)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} className={classes.right}>
          <Button
            color="primary"
            className={classes.fab}
            variant="contained"
            onClick={handleModalClose}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
