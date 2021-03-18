import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const style = theme => ({
  snackbar: {
    position: "relative"
  },
  snackbarContent: {
    width: 360
  }
});

class Notify extends React.Component {
  state = {
    open: true
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  };

  UNSAFE_componentWillReceiveProps = newProps => {
    if (newProps.message !== this.props.message) {
      this.setState({ open: !this.state.open });
    }
  };

  render() {
    const { message, classes, ...rest } = this.props;
    const { open } = this.state;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={open}
        autoHideDuration={6000}
        onClose={this.handleClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

export default withStyles(style)(Notify);
