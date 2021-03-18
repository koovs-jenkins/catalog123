import React from "react";
import Modal from "../../../components/Modal";
import {
  Grid,
  Button,
  Table,
  TableHead,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  TextField
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CustomTableCell from "../../../components/CustomTableCell";

export default function RpuCancelled(props) {
  const {
    classes,
    modalData,
    showModal,
    handleModalClose,
    handleSubmit,
    handleDataChange,
    reasonData,
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
          <Typography variant="body2">Reverse Pickup Status: </Typography>
          <Typography>Assigned Courier - {modalData.reverseShipServiceName}</Typography>
          <Typography>Reverse AWB - {modalData.reverseDocketNo}</Typography>
          <Typography>Pickup Token No - {modalData.reverseTokenNo}</Typography>
          <Typography variant="body2">
            Note : Reverse pickup with courier service will be cancelled
            automatically.
          </Typography>
        </Grid>
        <Grid item xs={12}>
        <Grid item xs={12} sm={12} style={{padding:"10px"}}>
        <FormControl variant="outlined" fullWidth >
            <InputLabel id="demo-simple-select-outlined-label">Select Reason for Cancellation</InputLabel>
            <Select
              name="reason"
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={modalData.reason}
              onChange={e => handleDataChange(e, true)}
              margin="normal"
              fullWidth
              required
              label="Select Reason for Cancellation"
              >
              <MenuItem value="">Select Reason for Cancellation*</MenuItem>
              {reasonData && reasonData.map(option => (
                  <MenuItem key={option.id} value={option.id+"_"+option.title}>
                    {option.title}
                  </MenuItem>
              ))}
              </Select>
          </FormControl>
        </Grid>
        </Grid>
        {modalData.reason &&
            <React.Fragment>
              {(modalData.reason.split("_")[1] == "Others" )&& 
                <Grid item xs={12}>
                  <TextField
                    label="Other Reason"
                    name="other"
                    variant="outlined"
                    margin="none"
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true
                    }}
                    value={modalData.other}
                    onChange={e => handleDataChange(e, true)}
                  />
                </Grid>
              }
            </React.Fragment>
        }
        <Grid item xs={12} className={classes.right}>
          <Button
            disabled={modalData.reason ? (modalData.reason == "Others" ? !modalData.other : !modalData.reason) : true}
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
