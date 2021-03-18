import React from "react";
import Modal from "../../../components/Modal";
import {
  Grid,
  TextField,
  Typography,
  Fab,
  Table,
  TableHead,
  Button,
  TableBody,
  TableCell,
  TableRow,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup
} from "@material-ui/core";
import { namespace } from "../../../../config";
import CustomTableCell from "../../../components/CustomTableCell";

export default function RefundPopUp(props) {
  const {
    classes,
    handleModalClose,
    showModal,
    handleChange,
    modalData,
    formData,
    handleFormSubmit
  } = props;

  return (
    <Modal
      open={showModal}
      onClose={handleModalClose}
      title={
        modalData.title ||
        "You are about to assign refund option for following transactions"
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
        <Grid item xs={12} sm={6} md={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              Please select a refund option
            </FormLabel>
            <RadioGroup
              aria-label="refundOption"
              name="refundOption"
              className={classes.group}
              value={formData.refundOption}
              onChange={e => handleChange(e, false)}
            >
              {modalData.options &&
                modalData.options.map((v, k) => {
                  if (namespace === "koovs") {
                    return (
                      <FormControlLabel
                        key={k}
                        value={v}
                        control={<Radio color="primary" />}
                        label={v.split("_").join(" ")}
                      />
                    );
                  } else {
                    return (
                      v != "ASSIGN_BY_CASH" &&
                      v != "ASSIGN_BY_PROMOCODE" && (
                        <FormControlLabel
                          key={k}
                          value={v}
                          control={<Radio color="primary" />}
                          label={v.split("_").join(" ")}
                        />
                      )
                    );
                  }
                })}
            </RadioGroup>
          </FormControl>
        </Grid>
        {formData.refundOption.indexOf("BY_CASH") > -1 && (
          <React.Fragment>
            <Grid item xs={12}>
              <Typography gutterBottom>
                BANK DETAILS :{" "}
                <span className={classes.red}>
                  (Mandatory for "REFUND BY CASH")
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
          </React.Fragment>
        )}
        <Grid item xs={12} className={classes.right}>
          <Button
            disabled={!formData.refundOption}
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
