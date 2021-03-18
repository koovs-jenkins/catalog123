import React from "react";
import {Typography} from "@material-ui/core";
import DatePicker from "react-datepicker";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import Upload from "@material-ui/icons/CloudUpload";
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from "axios";
import Select, { Async } from 'react-select-v1';

import {
  batchValidatePincode,
} from "../../store/actions/product";
var dateFormat = require('dateformat');
import sanitizeHtml from 'sanitize-html'
import ReactQuill from 'react-quill'; 
const allowed = {
  allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ,'pre'],
  allowedAttributes: {
    'a': [ 'href' ]
  },
  allowedIframeHostnames: ['www.youtube.com']
}
const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'indent': '-1'}, {'indent': '+1'}],
    ['link'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  },
}
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]
const styles = theme => ({
  select:{
    marginTop:"0px",
    border:"1px solid #ccc",
    height: "52px",
    borderRadius: "5px",
  },
  wrapper:{
    marginTop:"10px"
  },
  control:{
    padding:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  }
});

class AddPincode extends React.Component {
  state = {
    pincode  : "",
    zone : [],
    city : "",
    state : "",
    stateCode : "",
    country : "", 
    loading:false,
    type:"",
    errorMessage:"",
    zonesList:[]
};


componentDidMount = () => {
    var self = this;
    axios.get("/pincode-service/internal/all-zones", {headers: {'Content-Type': 'application/json'}}).then(res => {
      self.setState({
        zonesList  : res.data.data ,
      })
    }).catch(error => { self.setState({ loading : false })});;

  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : "",
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
           var self = this;
           axios.get("/pincode-service/internal/pincode?id="+this.state.edit_id, {headers: {'Content-Type': 'application/json'}}).then(res => {
             self.setState({
              pincode  : res.data.data.zipCode ,
              zone : res.data.data.zone,
              city : res.data.data.city,
              state : res.data.data.state,
              stateCode : res.data.data.stateCode,
              country : res.data.data.country,
              loading:false,
             })
          }).catch(error => { self.setState({ loading : false })});;
      }
  })
};


UNSAFE_componentWillReceiveProps = (newProps) => {
    if(newProps.match.params.type != this.props.match.params.type){
        this.setState({ type :  newProps.match.params.type },()=>{
          if(this.state.type == "add"){
              this.setState({ 
                type :  "add",
                title : "",
                referralType : "",
                noOfInvite : "",
                thresholdOrderAmount : "",
                programExpiryTime : "",
                status : "",
                referrerCashbackType : "",
                referredCashbackType : "",
                referrerCashbackAmount : "",
                referredCashbackAmount : "",
                referredCashbackExpiryTime : "",
                referrerCashbackExpiryTime : "",
                edit_id : "",
                emailSubject : "",
                emailLink : "",
                smsLink : "",
                screenLink : "",
                emailText : "",
                smsText : "",
                screenText : "",
                referrerMaxCashbackAmount : "",
                referredMaxCashbackAmount : "",
                referral : "",
              })
          }
        })
    }
    if(newProps.match.params.id != this.props.match.params.id){
      this.setState({ id :  newProps.match.params.id },()=>{
          if(this.state.type  == "edit" && this.state.edit_id){
            var self = this;
           axios.get("/referral/programs/"+this.state.edit_id, {headers: {'Content-Type': 'application/json'}}).then(res => {
             self.setState({
              "title": res.data.data[0].title,
              "referralType":   res.data.data[0].referralType,
              "noOfInvite":   res.data.data[0].noOfInvite,
              "thresholdOrderAmount":   res.data.data[0].thresholdOrderAmount,
              "programExpiryTime":   res.data.data[0].programExpiryTime,
              "status":   res.data.data[0].status, 
              "referrerCashbackType":   res.data.data[0].referrerCashbackType, 
              "referredCashbackType":   res.data.data[0].referredCashbackType, 
              "referrerCashbackAmount":   res.data.data[0].referrerCashbackAmount,
              "referredCashbackAmount":   res.data.data[0].referredCashbackAmount,
              "referredCashbackExpiryTime" : res.data.data[0].referredCashbackExpiryTime,
              "referrerCashbackExpiryTime" : res.data.data[0].referrerCashbackExpiryTime,
              "emailSubject" : res.data.data[0].emailSubject,
              "emailLink" : res.data.data[0].emailLink,
              "smsLink" : res.data.data[0].smsLink,
              "screenLink" : res.data.data[0].screenLink,
              "emailText" : res.data.data[0].emailText,
              "smsText" : res.data.data[0].smsText,
              "screenText" : res.data.data[0].screenText,
              "referrerMaxCashbackAmount" : res.data.data[0].referrerMaxCashbackAmount,
              "referredMaxCashbackAmount" : res.data.data[0].referredMaxCashbackAmount,
              "referral" : res.data.data[0].referral,
             })
          }).catch(error => { self.setState({ loading : false })});
          }
      })
    }
}

handlefooterdata(value){
  this.setState({ footerContent : value })
}


handle_upload_csv_new(event) {
  var self = this;
  var file = event.target.files[0].name.split(".");
  var name = file[file.length - 1].toLowerCase();
  if (name == "csv") {
    var formdata = new FormData();
    formdata.append("file", event.target.files[0]);
    formdata.append("userId", this.props.email);
    this.props.dispatch(batchValidatePincode(formdata,"/pincode-service/internal/upload-bulk-pincode?userEmailId=" + this.props.email)).then(res => {
      if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
        if (!self.props.batch_error) {
          if(self.props.batch_success.data.data.errorMessage){
            alert(self.props.batch_success.data.data.errorMessage);
          }
          else{
            alert(self.props.batch_success.data.data.message || self.props.batch_success.data.data.data.Success || self.props.batch_success.data.data.data.errorMessage);
          }
       }else{
        if(self.props.batch_error.error.response.data.errorMessage){
          alert(self.props.batch_error.error.response.data.errorMessage);
        }
       }
         window.location.reload();
    });
  } else {
    if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
    alert("Please upload the file in .csv file format only.");
  }
}

downloadCsv(){
  var that = this;
  axios({
    method: "get",
    url: "/pincode-service/internal/download-pincode-sample",
    headers: {
      "Content-Type": "multipart/form-data",
      "x-api-client": "OPS",
      "x-user-id": that.props.userId,
      "X-USER-EMAIL": that.props.emailId,
      "x-api-url":  "/pincode-service/internal/download-pincode-sample",
      "x-api-method": "post"
    }
  }).then(res => {
    var blob = new Blob([res.data], {
      type: "text/csv;charset=utf-8;"
    });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob,"pincode_service.csv");
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "pincode_service.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }).catch((res) => {
  });
}



  handleform(event){
    event.preventDefault();
    var self = this;
    if(this.state.zone && this.state.zone.length == 0){
      alert("Please select Zone.")
      return false;
    }
    if(this.state.type == "create"){
      var formdata = {
        "pincode": this.state.pincode ,
        "zone":   this.state.zone,
        "city":   this.state.city,
        "state":   this.state.state,
        "stateCode":   this.state.stateCode, 
        "country":   this.state.country, 
      }
      this.setState({ loading : true},()=> {
        axios.post("/pincode-service/internal/update-pincode" ,formdata, {headers: {'Content-Type': 'application/json'}}).then(res => {
          if(!res.data.error){
            self.setState({ loading : false})
            self.props.history.push("/lsp/pincode/list/all")
          }
        }).catch(error => { 
   
          alert(error.response.data.message)
          self.setState({ loading : false , errorMessage : error.response.data.errorMessage})
        });;
      })
      
    }
    else if(this.state.type == "edit" && this.state.edit_id){
      var formdata = {
        "id":this.state.edit_id,
        "pincode": this.state.pincode ,
        "zone":   this.state.zone,
        "city":   this.state.city,
        "state":   this.state.state,
        "stateCode":   this.state.stateCode, 
        "country":   this.state.country, 
      }
      this.setState({ loading : true},()=> {
        axios.post("/pincode-service/internal/update-pincode" ,formdata, {headers: {'Content-Type': 'application/json'}}).then(res => {
          if(!res.data.error){
            self.setState({ loading : false })
            self.props.history.push("/lsp/pincode/list/all")
          }
        }).catch(error => { 
          alert(error.response.data.message); self.setState({ loading : false })});;
      })
    } 
  }



  
  handle_type(value){
    if(value){
      this.setState({ zone : value })
    }
    else{
      this.setState({ zone : [] })
    }
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
             <Grid container spacing={12} lg={12} justify="space-between" className={classes.wrapper}>
                  <Typography variant="h5"  gutterBottom component="h5">
                  {this.state.type == "edit" ? "Edit" : "Create"} Pincode Program {this.state.edit_id}  
                  </Typography>
                    <Button variant="contained" color="primary" className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
              </Grid>
              <Paper className={classes.paper}>
                <Grid container spacing={12}>
                  <Grid item xs={4} sm={4}>
                      <TextField
                        type="file"
                        label="CSV file"
                        name="csv_file"
                        variant="outlined"
                        onChange={this.handle_upload_csv_new.bind(this)}
                        margin="none"
                        InputLabelProps={{
                          shrink: true
                        }}
                        helperText={
                          <a
                            href="#"
                            onClick={() =>{ this.downloadCsv()}}
                          >
                            Download Sample File
                          </a>
                        }
                      />
                  </Grid>
                </Grid>
              </Paper>
              
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={24}>
              <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                      variant="outlined"
                      label="Enter ZipCode"
                      value={this.state.pincode  || ""}
                      fullWidth
                      disabled={this.state.type == "edit" ? true : false}
                      name="title"
                      rows={2}
                      onChange={(e) => { this.setState({ pincode  : (e.target.value) })}}
                      required={true}
                      inputProps={{
                        maxLength : "6",
                        minLength : "6"
                      }}
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                    <Select
                      className={classes.select}
                      name="select_type"
                      simpleValue
                      value={this.state.zone || ""}
                      onChange={this.handle_type.bind(this)}
                      placeholder="Search and Select Zone"
                      backspaceRemoves={false}
                      cache={false}
                      required={true}
                      multi={true}
                      searchPromptText = "Enter type name to search"
                      noResultsText = "No type found."
                      loadingPlaceholder = "Searching type"
                      options={this.state.zonesList.map(function(i,index){
                        return  {"value":i,"label":i}
                      })}
                  />
                </Grid>
            
              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                      label="city"
                      value={this.state.city || ""}
                      variant="outlined"
                      fullWidth
                      name="title"
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
                      label="state"
                      value={this.state.state || ""}
                      fullWidth
                      variant="outlined"
                      name="title"
                      rows={2}
                      onChange={(e) => { this.setState({ state : (e.target.value) })}}
                      required={true}
                      inputProps={{
                      maxLength : "250"
                      }}
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                      label="State Code"
                      value={this.state.stateCode || ""}
                      fullWidth
                     variant="outlined"
                      name="title"
                      rows={2}
                      onChange={(e) => { this.setState({ stateCode : (e.target.value) })}}
                      required={true}
                      inputProps={{
                      maxLength : "250"
                      }}
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                      label="Enter Country"
                      value={this.state.country || ""}
                      fullWidth
                       variant="outlined"
                      name="title"
                      rows={2}
                      onChange={(e) => { this.setState({ country : (e.target.value) })}}
                      required={true}
                      inputProps={{
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
  email: state.signin.data.body.data.user.email,
  batch_success : state.product.batch_success,
  batch_error : state.product.batch_error,
});

export default withStyles(styles)(connect(mapStateToProps)(AddPincode));