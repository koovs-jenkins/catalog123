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
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CustomTableCell from "../../../components/CustomTableCell";

export default function ReversePickupPopup(props) {
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
      title={
        "You are about to change shipping status for txnid : " + modalData.txnId
      }
    >
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Table >
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
              Available courier services for reverse pickup :
            </FormLabel>
            <RadioGroup
              aria-label="courier"
              name="courier"
              className={classes.group}
              value={modalData.courier}
              onChange={e => handleDataChange(e, false)}
            >
              {modalData.couriers && modalData.couriers.length > 0 &&
                modalData.couriers.map((v, k) => (
                  <FormControlLabel
                    key={k}
                    value={v.Id}
                    control={<Radio color="primary" />}
                    label={v.Name}
                  />
                ))}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} className={classes.right}>
          <Button
            disabled={!modalData.courier}
            color="primary"
            className={classes.fab}
            variant="contained"
            onClick={handleSubmit}
          >
            Update
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
