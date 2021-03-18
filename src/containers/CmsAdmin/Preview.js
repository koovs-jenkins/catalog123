import React from "react";
import Modal from "../../components/Modal";
import { Button, withStyles } from "@material-ui/core";
import MobileMenu from "./Menu/MobileMenu";
import WebMenu from "./Menu/WebMenu";

const styles = theme => ({
  root: { width: "100%" },
  mobile: { maxWidth: "350px" }
});

const Preview = props => {
  const { open, onClose, data, classes, platform } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      fullScreen
      actions={
        <Button autoFocus onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      }
    >
      <div className={classes.root}>
        {platform === "WEB" ? (
          <WebMenu header={data} />
        ) : (
          <MobileMenu data={data} root={classes.mobile} />
        )}
      </div>
    </Modal>
  );
};

export default withStyles(styles)(Preview);
