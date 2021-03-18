import React from "react";
import Modal from "../../../components/Modal";
import { Grid, TextField, Button } from "@material-ui/core";

export default function MoveToAssignPopup(props) {
  const {
    classes,
    modalData,
    handleModalClose,
    handleSubmit,
    handleDataChange
  } = props;

  return (
    <Modal
      open={modalData.show}
      onClose={handleModalClose}
      title="Are you sure you want to move it on assign refund screen ?"
    >
      <Grid container>
        <Grid item xs={12}>
          <TextField
            label="Remarks"
            name="remarks"
            variant="outlined"
            margin="none"
            value={modalData.remarks}
            fullWidth
            onChange={handleDataChange}
            InputLabelProps={{
              shrink: true
            }}
            className={classes.remarks}
          />
        </Grid>
        <Grid item xs={12} className={classes.right}>
          <Button
            color="primary"
            onClick={handleSubmit}
            className={classes.fab}
            variant="contained"
          >
            Update
          </Button>
          <Button
            color="primary"
            onClick={handleModalClose}
            className={classes.fab}
            variant="contained"
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
