import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem
} from '@material-ui/core';
import Error from "@material-ui/icons/ErrorOutline";
import axios from 'axios';
import { getCookie } from "../../helpers/localstorage";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  control:{
    padding:"10px"
  },
  button: {
    margin: theme.spacing.unit * 4
  }
});

class CreateVendor extends React.Component {
  state = {
    type :  "add",
    edit_id : "",
    vendorId : "",
    name:"",
    city:"",
    address1:"",
    address2:"",
    pincode:"",
    state:"",
    mobile:"",
    gstRegistrationNo:"",
    email:"",
    alternateEmail:"",
    // buyerEmail:"",
    blocked: "BLOCKED_NONE",
    status:"ACTIVE",
    loading : false,
    id:""
};

  

componentDidMount = () => {
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
        this.get_vendor_byId(this.state.edit_id)
      }
  })
};

get_vendor_byId(id){
  this.setState({ loading : true })
  var self = this;
  var headers = {
    headers: {
      "Content-Type": "Application/json",
      "x-api-client": "OPS",
      "X-AUTH-TOKEN": getCookie("_koovs_token"),
      "X-API-KEY": "RDx7JDUtZCU/SDVlfSE8WA=="
    }
  }
  let formdata = {};
  if(this.state.selected_filter || this.state.searched_text){
      formdata["vendorName"] =  this.state.searched_text
      formdata["status"] =  this.state.selected_filter === 0 ? "INACTIVE"  : "ACTIVE" 
  }
  axios.get("/koovs-auth-service/internal/v1/vendor/get?id="+id,headers).then((res)=>{
     self.setState({ loading : false })
     if(res.data.data){
         this.setState({ 
            vendorId:res.data.data.vendorId,
            id:res.data.data.id,
            name:res.data.data.name,
            city:res.data.data.city,
            address1:res.data.data.address1,
            address2:res.data.data.address2,
            pincode:res.data.data.pincode,
            state:res.data.data.state,
            mobile:res.data.data.mobile,
            gstRegistrationNo:res.data.data.gstRegistrationNo,
            email:res.data.data.email,
            alternateEmail:res.data.data.alternateEmail,
            // buyerEmail:res.data.data.buyerEmail,
            blocked: res.data.data.blocked, 
            status : res.data.data.status
         })
     }
  }).catch((error)=>{   
    self.setState({ loading : false })
  })
}


UNSAFE_componentWillReceiveProps = (newProps) => {
    if(newProps.match.params.type != this.props.match.params.type){
        this.setState({ type :  newProps.match.params.type },()=>{
          if(this.state.type == "add"){
              this.setState({ 
                type :  "add",
                edit_id : "",
                vendorId:"",
                name:"",
                city:"",
                address1:"",
                address2:"",
                pincode:"",
                state:"",
                mobile:"",
                gstRegistrationNo:"",
                email:"",
                alternateEmail:"",
                // buyerEmail:"",
                blocked: "BLOCKED_NONE",
                status:"ACTIVE"
              })
          }
        })
    }
}

  handlefooterdata(value){
    this.setState({ footerContent : value })
  }

  handleform(event){
    event.preventDefault();
    var self = this;
      var formdata = {
        "vendorDetails" :{
          "name":this.state.name,
          "city":this.state.city,
          "address1":this.state.address1,
          "address2":this.state.address2,
          "pincode":this.state.pincode,
          "state":this.state.state,
          "mobile":this.state.mobile,
          "gstRegistrationNo":this.state.gstRegistrationNo,
          "email":this.state.email,
          "alternateEmail":this.state.alternateEmail,
          // "buyerEmail":this.state.buyerEmail,
          "blocked":this.state.blocked,
          "status":this.state.status,
        }
      }
      if(this.state.type == "edit" && this.state.edit_id){
        formdata.vendorDetails["id"]= this.state.id;
        formdata.vendorDetails["vendorId"]= this.state.vendorId;
        formdata.vendorDetails["updatedBy"]= this.props.email;
      }
      if(this.state.type == "add" || this.state.type == "create"){
        formdata.vendorDetails["createdBy"]= this.props.email;
      }
      this.setState({ loading : true })
        var self = this;
        var headers = {
          headers: {
            "Content-Type": "Application/json",
            "x-api-client": "OPS",
            "X-AUTH-TOKEN": getCookie("_koovs_token"),
            "X-API-KEY": "RDx7JDUtZCU/SDVlfSE8WA=="
          }
        }
        let apiUrl = "";
        if(this.state.type == "edit" && this.state.edit_id){
          apiUrl = "/koovs-auth-service/internal/v1/vendor/create"
        }
        else{
          apiUrl =  "/koovs-auth-service/internal/v1/vendor/create"
        }
        axios.post(apiUrl, formdata , headers).then((res)=>{
            self.setState({ loading : false })
            alert(res.data.data.status)  
            if(res.data.data.successful){
              self.props.history.push("/vendor/list/all")
            }
        }).catch((error)=>{
          alert(error.response.data.errorMessage)
          self.setState({ loading : false })

        })
  }


  render() {
    const { classes, match } = this.props;
    return (
      <React.Fragment>
        {this.state.loading &&
            <LinearProgress className="linear_loader" color="secondary"/>
        }
        {!this.state.loading && (
          <React.Fragment>
            <Grid lg={12} container justify="space-between" className={classes.wrapper}>
              <Typography variant="h5" gutterBottom component="h5">
                {this.state.type == "edit" ? "Edit" : "Create"} Vendor {this.state.edit_id}
              </Typography>
              <Button color="primary" variant="contained" className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>

            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={12}>
               {/* <Grid item xs={4} sm={4}>
                  <TextField
                    label="VendorId"
                    value={this.state.vendorId || ""}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="vendorId"
                    type="number"
                    rows={2}
                    onChange={(e) => { this.setState({ vendorId : (e.target.value) })}}
                    placeholder="Enter VendorId"
                    required={true}
                    inputProps={{
                      maxLength : "100"
                    }}
                  />
                </Grid>  */}
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Name"
                    value={this.state.name || ""}
                    fullWidth
                    name="name"
                    rows={2}
                    variant="outlined"
                    onChange={(e) => { this.setState({ name : (e.target.value) })}}
                    required={true}
                    inputProps={{
                      maxLength : "512",
                    }}
                  />
                </Grid>              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Email"
                    value={this.state.email || ""}
                    fullWidth
                    variant="outlined"
                    type="email"
                    name="email"
                    rows={2}
                    onChange={(e) => { this.setState({ email : (e.target.value) })}}
                    required={true}
                    inputProps={{
                    }}
                  />
                </Grid>              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Alternate Email"
                    value={this.state.alternateEmail || ""}
                    fullWidth
                    variant="outlined"
                    type="alternateEmail"
                    name="alternateEmail"
                    rows={2}
                    onChange={(e) => { this.setState({ alternateEmail : (e.target.value) })}}
                    inputProps={{
                    }}
                  />
                </Grid>              
                {/* <Grid item xs={4} sm={4}>
                  <TextField
                    label="Buyer Email"
                    value={this.state.buyerEmail || ""}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    type="buyerEmail"
                    name="buyerEmail"
                    rows={2}
                    onChange={(e) => { this.setState({ buyerEmail : (e.target.value) })}}
                    placeholder="Enter Buyer Email"
                    inputProps={{
                    }}
                  />
                </Grid>               */}
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter City"
                    value={this.state.city || ""}
                    fullWidth
                    variant="outlined"
                    name="city"
                    rows={2}
                    onChange={(e) => { this.setState({ city : (e.target.value) })}}
                    required={true}
                    inputProps={{
                      maxLength : "250"
                    }}
                  />
                </Grid>              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Adress Line 1"
                    value={this.state.address1 || ""}
                    fullWidth
                    variant="outlined"
                    name="address1"
                    multiline
                    rows={2}
                    onChange={(e) => { this.setState({ address1 : (e.target.value) })}}
                    required={true}
                    inputProps={{
                      maxLength : "250"
                    }}
                  />
                </Grid>              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Address Line 2"
                    value={this.state.address2 || ""}
                    fullWidth
                    multiline
                    variant="outlined"
                    name="address2"
                    rows={2}
                    onChange={(e) => { this.setState({ address2 : (e.target.value) })}}
                    required={false}
                    inputProps={{
                      maxLength : "250"
                    }}
                  />
                </Grid>              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Pincode"
                    value={this.state.pincode || ""}
                    fullWidth
                    variant="outlined"
                    name="pincode"
                    rows={2}
                    onChange={(e) => { this.setState({ pincode : (e.target.value) })}}
                    required={true}
                    inputProps={{
                      maxLength : "6",
                      minLength : "6"
                    }}
                  />
                </Grid>              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter State"
                    value={this.state.state || ""}
                    fullWidth
                    variant="outlined"
                    name="state"
                    rows={2}
                    onChange={(e) => { this.setState({ state : (e.target.value) })}}
                    required={true}
                    inputProps={{
                      maxLength : "100"
                    }}
                  />
                </Grid>              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Mobile"
                    value={this.state.mobile || ""}
                    fullWidth
                    name="mobile"
                    variant="outlined"
                    rows={2}
                    onChange={(e) => { this.setState({ mobile : (e.target.value) })}}
                    inputProps={{
                      maxLength : "10",
                      minLength : "10"
                    }}
                  />
                </Grid>    
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter GST Registration No"
                    value={this.state.gstRegistrationNo || ""}
                    fullWidth
                    variant="outlined"
                    name="gstRegistrationNo"
                    rows={2}
                    required={false}
                    onChange={(e) => { this.setState({ gstRegistrationNo : (e.target.value) })}}
                    inputProps={{
                      maxLength : "20",
                    }}
                  />
                </Grid>    
                <Grid item xs={4} sm={4} className={classes.control}>
                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Select Status*</InputLabel>
                    <Select
                      value={this.state.status}
                      onChange={(e)=> { this.setState({ status :  e.target.value })}}
                      required
                      label="Select Status*"
                    >
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>          
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Select Block Level</InputLabel>
                    <Select
                      select
                      value={this.state.blocked}
                      onChange={(e)=> { this.setState({ blocked :  e.target.value })}}
                      label="Select Block Level"
                      fullWidth
                    >
                    <MenuItem value="BLOCKED_NONE">Select Block Level</MenuItem>
                    <MenuItem value="BLOCKED_ALL">ALL</MenuItem>
                    <MenuItem value="BLOCKED_PAYMENT">PAYMENT</MenuItem>
                    </Select>
                    </FormControl>
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
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(CreateVendor));