import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

const styles = {
  button: {
    width: "auto",
    height: "48px",
    padding: "0 16px",
    minWidth: "48px",
    minHeight: "auto",
    borderRadius: "24px",
    color: "#fff",
    backgroundColor: "#3f51b5",
    fontSize: "0.875rem",
    fontWeight: "500"
  }
};

const Button = ({ className, classes, name, type, value, onClick }) => {
  return (
    <input
      className={classNames(classes.button, className)}
      type={type}
      name={name}
      value={value}
      onClick={onClick}
    />
  );
};

export default withStyles(styles)(Button);
