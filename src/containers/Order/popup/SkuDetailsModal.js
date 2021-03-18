import React from "react";
import Modal from "../../../components/Modal";
import {
  Grid,
  Fab,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "@material-ui/core";
import { skuDetailsHeader } from "../../../../metadata";
import CustomTableCell from "../../../components/CustomTableCell";

export default function SkuDetailsModal(props) {
  const { classes, modalData, showModal, handleModalClose } = props;
  return (
    <Modal
      open={showModal}
      onClose={handleModalClose}
      title={"Sku Details for Order Id: " + modalData.orderId}
      fullWidth
      maxWidth="xl"
    >
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {skuDetailsHeader.map((v, k) => (
                  <TableCell key={k} align="center" padding="dense">
                    {v}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {modalData.inventory.length > 0 &&
              modalData.inventory[0].length > 0 ? (
                modalData.inventory[0].map((v, k) => (
                  <TableRow key={k} hover>
                    <TableCell align="center" padding="dense">
                      {k + 1}
                    </TableCell>
                    <TableCell align="center" padding="dense">
                      {modalData.productId}
                    </TableCell>
                    <TableCell align="center" padding="dense">
                      {modalData.productSKU}
                    </TableCell>
                    <TableCell align="center" padding="dense">
                      {v.bookableInventory}
                    </TableCell>
                    <TableCell align="center" padding="dense">
                      {v.lot}
                    </TableCell>
                    <TableCell align="center" padding="dense">
                      {v.warehouse}
                    </TableCell>
                    <TableCell align="center" padding="dense">
                      {v.vendor}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow hover>
                  <TableCell align="center" padding="dense">
                    1
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    {modalData.productId}
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    {modalData.productSKU}
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    {modalData.bookableInventory}
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    {modalData.lot}
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    {modalData.warehouse}
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    {modalData.vendor}
                  </TableCell>
                </TableRow>
              )}
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
