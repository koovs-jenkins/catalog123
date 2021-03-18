import React from "react";
import axios from "axios";
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from "react-redux";
import {Typography,FormControl,MenuItem,InputLabel,Select} from "@material-ui/core";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

class NavSync extends React.Component {
  state = {
    orderid: "",
    is_loading : false,
    type : ""
  };


  handleform(event){
    event.preventDefault();
    var self = this;
    var formdata = {};
    this.setState({ is_loading : true})
    if(self.state.orderid != ""){
      if(self.state.type == "create"){
         formdata = [self.state.orderid]
      }
      else{
         formdata = JSON.stringify({
          "retrySyncList": [
            {
              "orderId": self.state.orderid,
              "txnIds": [self.state.txnid],
            }
          ]
         })
         
      }
      let header = {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": this.props.userId
        }
      }
      axios.post("/jarvis-order-service/internal/v1/order/sync/retry/bulk/"+self.state.type, formdata, header).then(function(res){
        self.setState({ is_loading :  false})
        if(res.status == 200){
          alert("Done")
          window.location.reload();
        }
        else{
          alert("Something went wrong !")
        }
      }).catch(function(error){
        self.setState({ is_loading :  false})
        alert("Something went wrong !")
      })
    }
    else{
      alert("Please enter order id's.")
    }
  }



  render() {
    const { classes } = this.props;
     return (
      <React.Fragment>
        {this.state.is_loading && (
          <LinearProgress />
        )}
        <Grid lg={12} container justify="space-between" className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Sync Orders
          </Typography>
          <Button variant="contained" color="primary" className="go_back_create" onClick={() =>{ this.props.history.goBack()}}> Go Back </Button>
        </Grid>
        <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={12}>
                <Grid item xs={12} sm={12}>
                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Please Select Type</InputLabel>
                  <Select
                    label="Please Select Type"
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                      value={this.state.type ? this.state.type : ""}
                      onChange={(e) => { this.setState({ type :  e.target.value})}}
                      required={true}
                      >
                      <MenuItem value="create">Create</MenuItem>
                      <MenuItem value="return">Return</MenuItem>
                      <MenuItem value="refund">Refund</MenuItem>
                      <MenuItem value="cancel">Cancel</MenuItem>
                  </Select>
                  </FormControl>
                </Grid>
                {this.state.type &&
                  <Grid item xs={12} sm={12} className={classes.wrapper}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={this.state.orderid || ""}
                      name="orderid"
                      onChange={(e) => { this.setState({ orderid :  (e.target.value).trim() })}}
                      label={ (this.state.type != "create") ? "Enter Order ID" : "Enter Order Id's comma (,) seprated."}
                      required
                    />
                  </Grid>
                }
                  {(this.state.type != "create" && this.state.type != "") &&
                    <Grid item xs={12} sm={12} className={classes.wrapper}>
                      <TextField
                        value={this.state.txnid || ""}
                        variant="outlined"
                        name="txnid"
                        onChange={(e) => { this.setState({ txnid :  (e.target.value).trim() })}}
                        label="Enter Txn Id's comma (,) seprated."
                        required
                        fullWidth
                      />
                  </Grid>
                  }
              </Grid>
              <Grid container justify="left">
                <Grid item>
                  <Button variant="contained" color="primary" type="submit" className={classes.button}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            </form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  email: state.signin.data.body.data.user.email,
  userId: state.signin.data.body.data.user.id
});

export default connect(mapStateToProps)(withStyles(styles)(NavSync));
