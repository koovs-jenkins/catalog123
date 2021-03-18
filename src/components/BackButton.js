import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  Button
} from "@material-ui/core";

const styles = theme => ({
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
    fontWeight: "500",
    cursor: "pointer",
    border: 0
  },
  wrapper:{
    marginBottom:"10px"
  },
  margin: {
    margin: theme.spacing.unit
  }
});

const BackButton = ({ classes, history, text, title }) => {
  return (
    <Grid container justify="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h6" gutterBottom component="h6">
          {text}
        </Typography>
      </Grid>
      <Grid className={classes.wrapper}>
        <Button variant="contained" color="primary" onClick={() => history.goBack()}> {title || "Back"}</Button>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(BackButton);
