import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Fab,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  CircularProgress
} from "@material-ui/core";
import { ChromePicker } from "react-color";
import { connect } from "react-redux";
import { postAddColorCodeApi } from "../../../api/catalogue";
import Notify from "../../../components/Notify";

const style = theme => ({
  wrapper:{
    marginTop:"20px"
  },
  paper: { ...theme.paper, padding: theme.spacing.unit },
  container: { marginTop: theme.spacing.unit * 2}
});

class AddColorCode extends React.Component {
  state = {
    colorCode: "#000000",
    colorName: "",
    updatedBy: this.props.emailId,
    createdBy: this.props.emailId
  };

  handleSubmit = () => {
    const that = this;
    const { colorCode, colorName, createdBy, updatedBy } = this.state;
    this.setState({ loading: true, message: "" }, () => {
      if (colorCode && colorName && colorName.trim() != "") {
        postAddColorCodeApi(that.props.userId, {
          colorCode,
          colorName,
          createdBy,
          updatedBy
        }).then(res =>
          res.status < 350
            ? this.setState({
                message: res.data.message,
                loading: false,
                colorCode: "",
                colorName: ""
              })
            : this.setState({ message: res.statusText, loading: false })
        );
      } else {
        that.setState({ message: "All fields are mandatory", loading: false });
      }
    });
  };

  render() {
    const { classes } = this.props;
    const { colorCode, colorName, message, loading } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
       
          <Grid container spacing={12} justify="center">
            <Grid container justify="center" item xs={3} sm={3} md={3}>
            <Grid justify="center" container lg={12} spacing={12} className={classes.wrapper}>
              <Typography variant="h5" gutterBottom component="h5">
                Add Color Code
              </Typography>
            </Grid>
              <Paper className={classes.paper} >
                <Grid item xs={12} sm={12} md={12} justify="center" className={classes.wrapper}>
                  <Typography>Select Color Code</Typography>
                  <ChromePicker
                    required
                    color={colorCode}
                    onChangeComplete={color =>
                      this.setState({ colorCode: color.hex })
                    }
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={4} className={classes.wrapper}>
                  <TextField
                    type="text"
                    label="Color Name"
                    name="colorName"
                    variant="outlined"
                    margin="none"
                    value={colorName}
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={e =>
                      this.setState({
                        colorName: e.target.value.replace(/[0-9]/g, "")
                      })
                    }
                  />
                </Grid>
                  <Grid item xs={12} sm={8} md={6} className={classes.wrapper}>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={this.handleSubmit}
                    >
                      Submit
                    </Button>
                  )}
                  </Grid>
              </Paper>
            </Grid>
          </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(style)(connect(mapStateToProps)(AddColorCode));
