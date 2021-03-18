import React from "react";
import { Fab, Grid, TextField,Button } from "@material-ui/core";
import Modal from "../../../components/Modal";

const CreateHsn = props => {
  const { open, onClose, modalData, onChange, classes, onSubmit } = props;
  var isDisabled = modalData.hsnCode === "" || modalData.gstLowPercent === "" || modalData.gstHighPercent === "";
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="HSN Mapping"
      maxWidth="sm"
      fullWidth
    >
      <Grid container spacing={16}>
        <Grid item xs={12} sm={6} className={classes.control}>
          <TextField
            fullWidth
            name="hsnCode"
            label="Hsn Code"
            id="outlined-basic" variant="outlined"
            value={modalData.hsnCode}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}   className={classes.control}>
          <TextField
            fullWidth
            name="gstLowPercent"
            label="GST Low Percentage"
            id="outlined-basic" variant="outlined"
            value={modalData.gstLowPercent}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}    className={classes.control}>
          <TextField
            fullWidth
         
            name="gstHighPercent"
            label="GST High Percentage"
            id="outlined-basic" variant="outlined"
            value={modalData.gstHighPercent}
            onChange={onChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button
            className={classes.fab}
            disabled={isDisabled}
            color="primary"
            variant="contained"
            onClick={onSubmit}
          >
            Submit
          </Button>
          <Button
            className={classes.fab}
            color="primary"
            variant="contained"
            onClick={onClose}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default CreateHsn;
