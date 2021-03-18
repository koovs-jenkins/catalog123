import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Paper, Grid, TextField, Button } from "@material-ui/core";
import { changePasswordApi } from "../api/login";
import Notify from "../components/Notify";

const style = theme => ({
  paper: { ...theme.paper,padding:"10px",marginTop:"10px" },
  control:{padding:"10px"}
});

class ChangePassword extends React.Component {
  state = {
    currentPassword: "",
    newPassword: "",
    message: "",
    loading: false
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    this.setState({ message: "", loading: true }, () => {
      const { currentPassword, newPassword } = this.state;
      const isValid = newPassword.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%])[A-Za-z\d@$!%*?&]{6,20}$/
      );
      isValid
        ? changePasswordApi({ currentPassword, newPassword }).then(res => {
            console.log("res.status", res);
            this.setState({
              message:
                res.data == null
                  ? "Password Changed Successfully"
                  : res.data.errorMessage,
              loading: false
            });
          })
        : this.setState({
            message:
              "New Password must contain at least one lowercase one uppercase letter a number a special character(@#$%) and length must be in between 6-20",
            loading: false
          });
    });
  };

  render() {
    const { classes } = this.props;
    const { currentPassword, newPassword, message, loading } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Paper className={classes.paper}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6} md={6} className={classes.control}>
              <TextField
                label="Current Password"
                name="currentPassword"
                fullWidth
                variant="outlined"
                value={currentPassword}
                onChange={this.handleChange}
                type="password"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} className={classes.control}>
              <TextField
                label="New Password"
                name="newPassword"
                variant="outlined"
                fullWidth
                value={newPassword}
                onChange={this.handleChange}
                type="password"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12} className={classes.control}>
              <Button
                onClick={this.handleSubmit}
                color="primary"
                className={classes.fab}
                disabled={loading}
                variant="contained"
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(connect(mapStateToProps)(ChangePassword));
