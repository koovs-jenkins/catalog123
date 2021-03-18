import React from "react";
import {Typography,FormControl,MenuItem,InputLabel,Select} from "@material-ui/core";
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
    margin: theme.spacing.unit * 2
  }
});

class AddZone extends React.Component {
  state = {
    id  : "",
    zone : "",
    isActive:"",
    loading:false,
    type:"",
    errorMessage:"",
};


componentDidMount = () => {
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : "",
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
           var self = this;
           axios.get("/pincode-service/internal/zone?id=" + this.state.edit_id, {headers: {'Content-Type': 'application/json'}}).then(res => {
             self.setState({
              zone: res.data.data.zone,
              isActive : res.data.data.isActive,
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
  console.log(this.props);
  var self = this;
  var file = event.target.files[0].name.split(".");
  var name = file[file.length - 1].toLowerCase();
  if (name == "csv") {
    var formdata = new FormData();
    formdata.append("file", event.target.files[0]);
    formdata.append("userId", this.props.email);
    this.props.dispatch(batchValidatePincode(formdata,"/pincode-service/internal/upload-bulk-pincode?userEmailId=" + this.props.email)).then(res => {
      if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
      console.log(this.props.batch_success.data);
      if (!self.props.batch_error) {
        alert(this.props.batch_success.data.data.message);
        window.location.reload();
      } else {
        if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
        var message = this.props.batch_error.error.split(",").join("\n");
        alert("ERROR UPLOADING BATCH FILE:\n" + message);
      }
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
    if(this.state.zone.trim() === ""){
      alert("zone cannot be empty")
    }else{
      if(this.state.type == "create"){
        var formdata = {
          "isActive": this.state.isActive ,
          "zone":   this.state.zone.replace(/\s*$/,""),
        }
        this.setState({ loading : true},()=> {
          axios.post("/pincode-service/internal/add-zone" ,formdata, {headers: {'Content-Type': 'application/json'}}).then(res => {
            if(!res.data.error){
              self.setState({ loading : false})
              self.props.history.push("/lsp/zones/list/all")
            }
          }).catch(error => { 
            alert(error.response.data.errorMessage)
            self.setState({ loading : false , errorMessage : error.response.data.errorMessage})
          });;
        })
        
      }
      else if(this.state.type == "edit" && this.state.edit_id){
        var formdata = {
          "id":this.state.edit_id,
          "isActive": this.state.isActive ,
          "zone":   this.state.zone.replace(/\s*$/,""),
        }
        this.setState({ loading : true},()=> {
          axios.post("/pincode-service/internal/update-zone" ,formdata, {headers: {'Content-Type': 'application/json'}}).then(res => {
            
            if(!res.data.error){
              self.setState({ loading : false })
              self.props.history.push("/lsp/zones/list/all")
            }
          }).catch(error => { 
            alert(error.response.data.errorMessage); self.setState({ loading : false })});
        })
      }
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
             <Grid container spacing={12} className={classes.wrapper} justify="space-between">
                  <Typography variant="h5"  gutterBottom component="h5">
                  {this.state.type == "edit" ? "Edit" : "Create"} Zone {this.state.edit_id}  
                  </Typography>
                    <Button variant="contained" color="primary" className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
              </Grid>
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={12}>
              <Grid item xs={8} sm={8} className={classes.control}>
                <TextField
                      label="Enter Zone"
                      value={this.state.zone || ""}
                      fullWidth
                      variant="outlined"
                      name="zone"
                      rows={2}
                      onChange={(e) => { this.setState({ zone : (e.target.value) })}}
                      required={true}
                      inputProps={{
                      pattern: "^[A-Za-z -]+$",
                      maxLength : 20
                      }}
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.isActive}
                      onChange={(e)=> { this.setState({ isActive :  e.target.value })}}
                      label="Status"
                      fullWidth
                      required
                    >
                      <MenuItem value="">Status</MenuItem>
                      <MenuItem value="true">YES</MenuItem>
                      <MenuItem value="false">NO</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
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
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({ 
  email: state.signin.data.body.data.user.email,

});

export default withStyles(styles)(connect(mapStateToProps)(AddZone));