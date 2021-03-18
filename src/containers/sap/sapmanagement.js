import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import sanitizeHtml from 'sanitize-html'
import axios from 'axios';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 4,
    margin: "auto",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  }
});

class SapManagement extends React.Component {
  state = {
    order_id : "",
};

  

componentDidMount = () => {

};



handleform(event){
    event.preventDefault();
    this.setState({ loading : true}, ()=>{
        this.handleapicall();
    })   
}


handleapicall(){
    var self = this;
    var headers = {
      headers: {
        "Content-Type": "application/json",
        "x-api-client": "OPS",
        "x-user-id": this.props.userId
      }
    }
    axios.get("/jarvis-order-service/internal/v1/order/sync/retry/create/"+ this.state.order_id,headers).then((res)=>{
      self.setState({ loading : false },()=>{
        alert("Done")
        self.setState({ order_id : ""})
      })
    }).catch((error)=>{
      self.setState({ loading : false },()=>{
        alert(error)
      })
    })
}


  render() {
    const { classes, match } = this.props;
    return (
      <React.Fragment>
        {this.state.loading &&
            <LinearProgress />
        }
        {!this.state.loading && (
          <React.Fragment>
            <Typography variant="h4" gutterBottom component="h2">
                Push Order to SAP 
              <div className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </div>
            </Typography>
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Order Id"
                    value={this.state.order_id || ""}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="order_id"
                    onChange={(e) => { this.setState({ order_id :  (e.target.value) })}}
                    placeholder="Enter Order Id"
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
              {this.state.order_id != "" &&
                <Grid container justify="center">
                    <Grid item>
                    <Button variant="contained" color="primary" type="submit" className={classes.button}>
                        Submit
                    </Button>
                    </Grid>
                </Grid>
              }
            </Paper>
            </form>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id
});

export default withStyles(styles)(connect(mapStateToProps)(SapManagement));
