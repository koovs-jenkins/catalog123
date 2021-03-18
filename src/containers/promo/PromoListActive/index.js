import React from "react";
import { Grid, Button, withStyles, Paper } from "@material-ui/core";
import Notify from "../../../components/Notify";
import Create from "./Create";
import Edit from "./Edit";

const style = (theme) => ({
  paper: { ...theme.paper,marginTop:"30px" },
  fab: { margin: theme.spacing.unit },
  table: { minWidth: 500 },
  tableWrapper: { ...theme.tableWrapper, marginTop: theme.spacing.unit },
  control:{padding:"10px"},
  selected: {
    position: "absolute",
    top: theme.spacing.unit * 12,
    right: theme.spacing.unit * 6,
  },
  expiry: { fontWeight: "bold" },
});

class PromoListActive extends React.Component {
  state = {
    type: "",
    message: "",
  };

  handleBackButton = (e, message = "") => {
    this.setState({
      type: "",
      message: message ? message : "",
    });
  };

  render() {
    const { classes } = this.props;
    const { type, message } = this.state;

    return (
      <Paper className={classes.paper}>
        {message && <Notify message={message} />}
        <Grid container  justify="flex-start">
          {!type && (
            <Grid item spacing={2} xs={12} sm={3} md={3} className={classes.control}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.setState({ type: "create" })}
                fullWidth
              >
                Create Promo List
              </Button>
            </Grid>
          )}
          {!type && (
            <Grid item spacing={2} xs={12} sm={3} md={3} className={classes.control}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.setState({ type: "edit" })}
                fullWidth
              >
                Edit Promo List
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            {type == "create" && (
              <Create
                handleBackButton={this.handleBackButton}
                classes={classes}
              />
            )}
            {type == "edit" && (
              <Edit
                handleBackButton={this.handleBackButton}
                classes={classes}
              />
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(style)(PromoListActive);
