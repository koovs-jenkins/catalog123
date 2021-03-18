import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog from "@material-ui/core/withMobileDialog";

class Modal extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      fullWidth,
      maxWidth,
      fullScreen,
      open,
      onClose,
      text,
      title,
      children,
      actions,
      style,
    } = this.props;

    return (
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title || ""}</DialogTitle>
        <DialogContent style={style}>
          {text}
          {children}
        </DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </Dialog>
    );
  }
}

Modal.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(Modal);
