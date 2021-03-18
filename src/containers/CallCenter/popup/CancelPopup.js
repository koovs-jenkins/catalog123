import React from "react";
import Modal from "../../../components/Modal";
import { Grid, TextField, Fab,Select,MenuItem,InputLabel,FormControl,Button } from "@material-ui/core";

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
      title="Cancel Transaction"
    >
      <Grid container spacing={40}>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
          <InputLabel id="demo-simple-select-outlined-label">Please select reason type</InputLabel>
          <Select
            label="Please select reason type"
            name="reasonId"
            fullWidth
            required
            onChange={handleDataChange}
          >
            <MenuItem value="">Select Reason</MenuItem>
            {modalData.options &&
              modalData.options.length > 0 &&
              modalData.options.map(v => (
                <MenuItem key={v.id} value={v.id}>
                  {v.title}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        </Grid>
        {/* <Grid item xs={12}>
          <TextField
            label="Reason"
            name="reasonText"
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
            onChange={handleDataChange}
          />
        </Grid> */}

        <Grid item xs={12} className={classes.right}>
          <Button
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
