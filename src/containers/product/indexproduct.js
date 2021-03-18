import React from "react";
import axios from "axios";
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";

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
    marginTop: "20px",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 2
  }
});

class IndexProducts extends React.Component {
  state = {
    indexproducts: "",
    is_loading : false
  };

  handleform(event){
    event.preventDefault();
    var self = this;
    this.setState({ is_loading : true})
    if(this.state.indexproducts != ""){
      axios.post("/product/indexProducts ", {"productIds" : this.state.indexproducts}).then(function(res){
        self.setState({ is_loading :  false})
        if(res.data.statusCode == 200 && !res.data.errorExists){
          alert(res.data.message)
        }
        else{
          alert((res.data.message ? res.data.message : "Something went wrong !"))
        }
      }).catch(function(error){
        self.setState({ is_loading :  false})
        alert("Something went wrong !")
      })
    }
    else{
      alert("Please enter product id's to index.")
    }
  }



  render() {
    const { classes } = this.props;
     return (
      <React.Fragment>
        {this.state.is_loading && (
          <LinearProgress />
        )}
        <Grid container justify="space-between" className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Index Products
          </Typography>
          <Button variant="contained" color="primary" onClick={() =>{ this.props.history.goBack()}}> Go Back </Button>
        </Grid>
        <Paper classe={classes.paper}>
        <form onSubmit={this.handleform.bind(this)}>
          <Grid item xs={6} sm={12}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <TextField
                    value={this.state.indexproducts || ""}
                    margin="normal"
                    variant="outlined"
                    name="indexproducts"
                    onChange={(e) => { this.setState({ indexproducts :  (e.target.value).trim() })}}
                    label="Enter Product Id's comma (,) seprated."
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container justify="right">
                <Grid item>
                  <Button variant="contained" color="primary" type="submit">
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            </Grid>
            </form>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  email: state.signin.data.body.data.user.email,
  userId: state.signin.data.body.data.user.id
});

export default connect(mapStateToProps)(withStyles(styles)(IndexProducts));
