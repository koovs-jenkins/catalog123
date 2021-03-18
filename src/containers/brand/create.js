import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import {
    fetchBrandDetail,
    postBrand,
    putBrand,
} from "../../store/actions/brand";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import sanitizeHtml from 'sanitize-html'

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 4,
    margin: "auto",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  }
});

class Brand extends React.Component {
  state = {
    type :  "add",
    edit_id : "",
    brand_name : "",
    brand_description : "",
};

  

componentDidMount = () => {
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
        this.props.dispatch(fetchBrandDetail(this.state.edit_id)).then(() =>
           this.setState({
             brand_name : this.props.brand_data.data.brandDetail.brandName,
             brand_description : this.props.brand_data.data.brandDetail.description
           })
        )
      }
  })
};


UNSAFE_componentWillReceiveProps = (newProps) => {
    if(newProps.match.params.type != this.props.match.params.type){
        this.setState({ type :  newProps.match.params.type },()=>{
          if(this.state.type == "add"){
              this.setState({ 
                type :  "add",
                edit_id : "",
                brand_name : "",
                brand_description : "",
              })
          }
        })
    }
    if(newProps.match.params.id != this.props.match.params.id){
      this.setState({ id :  newProps.match.params.id },()=>{
          if(this.state.type  == "edit" && this.state.edit_id){
            this.props.dispatch(fetchBrandDetail(this.state.edit_id)).then(() =>
            this.setState({
              brand_name : this.props.brand_data.data.brandDetail.brandName,
              brand_description : this.props.brand_data.data.brandDetail.description
            })
            )
          }
      })
    }
}

  handleform(event){
    console.log(event)
    event.preventDefault();
    var self = this;
    if(this.state.type == "create"){
      var formdata = {"brandName" :sanitizeHtml(this.state.brand_name).replace(/amp;/g, ""), "description" : sanitizeHtml(this.state.brand_description).replace(/amp;/g, ""), createdBy: self.props.email}
      this.props.dispatch(postBrand(JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          this.props.history.push("/catalogue/list/brand")
        }
      })
    }
    else if(this.state.type == "edit" && this.state.edit_id){
      var formdata = {"brandId" : this.state.edit_id,"brandName" :sanitizeHtml(this.state.brand_name).replace(/amp;/g, ""), "description" : sanitizeHtml(this.state.brand_description).replace(/amp;/g, ""), updatedBy: self.props.email}
      this.props.dispatch(putBrand(this.state.edit_id,JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          this.props.history.push("/catalogue/list/brand")
        }
      })
    }
   
  }


  render() {
    const { classes, match, loading } = this.props;
    console.log(this.props)
    return (
      <React.Fragment>
        {loading &&
            <LinearProgress />
        }
        {!loading && (
          <React.Fragment>
            <Grid className={classes.wrapper} container justify="space-between">
              <Typography variant="h5" gutterBottom component="h5" >
                {this.state.type == "edit" ? "Edit" : "Create"} Brand
                {this.props.error &&
                    <div className="error_container">
                    {(typeof(this.props.error.error) != "object") &&
                      <p>
                      <Error className="vertical_align_error"/> &nbsp;
                        {this.props.error.error}
                      </p>
                      }
                      {(typeof(this.props.error.error) == "object") &&
                      <p>
                      <Error className="vertical_align_error"/> &nbsp;   &nbsp;
                        {(this.props.error.error.message)}
                      </p>
                      } 
                    </div>
                  }
              </Typography>
              <Button color="primary" variant="contained"  onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>
           
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Enter Brand Name"
                    variant="outlined"
                    value={this.state.brand_name || ""}
                    margin="normal"
                    name="brand_name"
                    onChange={(e) => { this.setState({ brand_name :  (e.target.value) })}}
                    required
                    inputProps={{
                    readOnly: this.state.edit_id ? true : false,
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Brand Description"
                    
                    value={this.state.brand_description || ""}
                    margin="normal"
                    multiline
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="brand_description"
                    rows={2}
                    onChange={(e) => { this.setState({ brand_description : (e.target.value) })}}
                    placeholder="Enter Brand Description"
                    helperText="Upto 250 characters"
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" type="submit" className={classes.button}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            </form>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  brand_data: state.brand.data,
  loading: state.brand.loading,
  error: state.brand.error,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(Brand));