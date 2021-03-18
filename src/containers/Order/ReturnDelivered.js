import React from "react";
import axios from "axios";
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from "react-redux";
import {Typography,Button} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 1,
    marginTop: "10px",
    maxWidth: "100%"
  },
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

class ReturnDelivered extends React.Component {
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
      let header = {
        headers: {
          "Content-Type": "application/json",
          "x-api-client": "OPS",
          "x-user-id": this.props.userId
        }
      }
      axios.get("/jarvis-order-service/internal/v1/order/revert-delivered/"+self.state.orderid, header).then(function(res){
        self.setState({ is_loading :  false})
        if(res.status == 200){
          alert("Done")
          window.location.reload();
        }
        else{
          alert(res.data.message)
        }
      }).catch(function(error){
        self.setState({ is_loading :  false})
        alert(error.response.data.message)
      })
    }
    else{
      alert("Please enter order id.")
    }
  }



  render() {
    const { classes } = this.props;
     return (
      <React.Fragment>
        {this.state.is_loading && (
          <LinearProgress />
        )}
        <Grid container className={classes.wrapper} lg={12} justify="space-between">
        <Typography variant="h5" gutterBottom component="h5">
            Return Delivered
        </Typography>
          <Button style={{"float":"right"}} variant="contained" justify="right" color="primary" onClick={() =>{ this.props.history.goBack()}}> Go Back </Button>
        </Grid>

        <form onSubmit={this.handleform.bind(this)}>
       
              <Grid container spacing={12}>
                <Grid item xs={4}>
                <Paper className={classes.paper}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        id="outlined-basic" 
                        variant="outlined"
                        label="Enter Txn ID"
                        value={this.state.orderid || ""}
                        name="orderid"
                        onChange={(e) => { this.setState({ orderid :  (e.target.value).trim() })}}
                        required
                        fullWidth
                      />
                    </Grid>
                      <Grid container justify="right">
                        <Grid item  xs={4} sm={4}>
                          <Button className={classes.button} variant="contained" color="primary" type="submit">
                            Save
                          </Button>
                        </Grid>
                    </Grid>
                    </Paper>
                </Grid>
                
                  
                  
               
              </Grid>
            
            </form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  email: state.signin.data.body.data.user.email,
  userId: state.signin.data.body.data.user.id
});

export default connect(mapStateToProps)(withStyles(styles)(ReturnDelivered));
