import React from "react";
import Modal from "../../../components/Modal";
import {
  Grid,
  TextField,
  Typography,
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
  RadioGroup,
  CircularProgress
} from "@material-ui/core";
import { hasProp } from "../../../helpers";
import CustomTableCell from "../../../components/CustomTableCell";

export default function TxnUpdatePopUp(props) {
  const {
    classes,
    handleModalClose,
    showModal,
    handleChange,
    modalData,
    formData,
    handleFormSubmit,
    loading
  } = props;

  return (
    <Modal
      open={showModal}
      onClose={handleModalClose}
      title={modalData.title || ""}
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
              {modalData.data &&
                modalData.data.length &&
                modalData.data.map(v => (
                  <TableRow key={v.txnId} hover>
                    <TableCell align="center" padding="dense">
                      {v.txnId}
                    </TableCell>
                    <TableCell align="center" padding="dense">
                      {v.productName}
                    </TableCell>
                    <TableCell align="center" padding="dense">
                      {v.quantity}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={6} md={12} style={{padding:"10px"}}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              Please select a refund option
            </FormLabel>
            <RadioGroup
              aria-label="refundOption"
              name="refundOption"
              className={classes.group}
              value={modalData.refundOption}
            >
              <FormControlLabel
                value={modalData.refundOption}
                control={<Radio color="primary" />}
                label={modalData.refundOption.split("_").join(" ")}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} style={{padding:"10px"}}>
          <Typography gutterBottom>
            BANK DETAILS :{" "}
            <span className={classes.red}>
              (Mandatory for "REFUND BY CASH")
            </span>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3} style={{padding:"10px"}}>
          <TextField
            label="A/c holder's name"
            name="acHolderName"
            variant="outlined"
            margin="none"
            fullWidth
            required
            InputLabelProps={{
              shrink: true
            }}
            value={formData.bankDetails.acHolderName}
            onChange={e => handleChange(e, true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} style={{padding:"10px"}}>
          <TextField
            label="Bank Account Number"
            name="acNumber"
            variant="outlined"
            margin="none"
            fullWidth
            required
            InputLabelProps={{
              shrink: true
            }}
            value={formData.bankDetails.acNumber}
            onChange={e => handleChange(e, true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} style={{padding:"10px"}}>
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
            value={formData.bankDetails.bankName}
            onChange={e => handleChange(e, true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} style={{padding:"10px"}}>
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
            value={formData.bankDetails.branchName}
            onChange={e => handleChange(e, true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} style={{padding:"10px"}}>
          <TextField
            label="IFSC Code"
            name="ifscCode"
            variant="outlined"
            margin="none"
            fullWidth
            required
            InputLabelProps={{
              shrink: true
            }}
            value={formData.bankDetails.ifscCode}
            onChange={e => handleChange(e, true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} style={{padding:"10px"}}>
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
            value={formData.bankDetails.comment}
            onChange={e => handleChange(e, true)}
          />
        </Grid>
        <Grid item xs={12} className={classes.right} style={{padding:"10px"}}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Button
                disabled={
                  !hasProp(formData.bankDetails, "acHolderName") ||
                  !hasProp(formData.bankDetails, "acNumber") ||
                  !hasProp(formData.bankDetails, "bankName") ||
                  !hasProp(formData.bankDetails, "branchName") ||
                  !hasProp(formData.bankDetails, "ifscCode")
                }
                color="primary"
                className={classes.fab}
                variant="contained"
                onClick={handleFormSubmit}
              >
                Revert
              </Button>
              <Button
                color="primary"
                className={classes.fab}
                variant="contained"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Modal>
  );
}
