import React from "react";
import {Typography,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
import DatePicker from "react-datepicker";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  uploadTemplateImage,
} from "../../store/actions/sizeMap";
import axios from "axios";
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
  paper: {
    marginTop:"10px",
  padding: theme.spacing.unit * 2,
  maxWidth: "100%"
},
  control:{padding:"10px"},
  button: {
    margin: theme.spacing.unit * 2
  }
});

class AddCourier extends React.Component {
  state = {
    code : "",
    courierService : "",
    enableStatus : "",
    internationalSupported : false,
    courierLogo:"",
    returnSupported : false,
    secretKey : "",
    edit_id:"",
    type:"",
    loading:false,
};

  

componentDidMount = () => {
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : "",
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
           var self = this;
           axios.get("/courier-service/internal/courier-service?id="+this.state.edit_id, {headers: {'Content-Type': 'application/json'}}).then(res => {
            self.setState({
              "loading" : false,
              "courierLogo":res.data.data.courierLogo ? res.data.data.courierLogo.replace(/^.*[\\\/]/, '') : "",
              "code": res.data.data.code,
              "courierService":   res.data.data.courierService,
              "enableStatus":   res.data.data.enableStatus,
              "internationalSupported":   res.data.data.internationalSupported,
              "returnSupported":   res.data.data.returnSupported,
              "secretKey":   res.data.data.secretKey, 
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


handleLogoImageUpload = formData => {
  var _self = this;
  this.props.dispatch(uploadTemplateImage(formData)).then(() => {
    _self.setState({courierLogo:_self.props.templateImage.data.Location});
  });
};


  // var self = this;
  // var file = event.target.files[0].name.split(".");
  // var name = file[file.length - 1].toLowerCase();
  //   var formdata = new FormData();
  //   formdata.append("file", event.target.files[0]);
  //   formdata.append("userId", this.props.email);
  //   this.props.dispatch(batchValidatePincode(formdata,"/courier-service/internal/upload/image")).then(res => {
  //     if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
  //     console.log(this.props.batch_success.data);
  //     if (!self.props.batch_error) {
  //       alert(this.props.batch_success.data.data.message);
  //       window.location.reload();
  //     } else {
  //       if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
  //       var message = this.props.batch_error.error.split(",").join("\n");
  //       alert("ERROR UPLOADING FILE:\n" + message);
  //     }
  //   });


  handleform(event){
    event.preventDefault();
    var self = this;
    if(this.state.type == "create"){
      var formdata = {
        "code": this.state.code,
        "courierService":   this.state.courierService,
        "enableStatus":   this.state.enableStatus,
        "internationalSupported":   this.state.internationalSupported,
        "returnSupported":  this.state.returnSupported,
        "secretKey":   this.state.secretKey ,
        "courierLogo": this.state.courierLogo,
      }

      this.setState({ loading : true},()=> {
        axios.post("/courier-service/internal/create-courier-service" ,formdata, {headers: {'Content-Type': 'application/json'}}).then(res => {
          if(!res.data.error){
            self.setState({ loading : false})
            self.props.history.push("/lsp/courier/list/all")
          }
        }).catch(error => { 
          alert(error.response.data.errorMessage)
          self.setState({ loading : false })
        });;
      })
      
    }
    else if(this.state.type == "edit" && this.state.edit_id){
      var formdata = {
        "id":this.state.edit_id,
        "code":this.state.code,
        "courierService": this.state.courierService,
        "enableStatus":   this.state.enableStatus,
        "internationalSupported":   this.state.internationalSupported,
        "returnSupported":   this.state.returnSupported,
        "secretKey":   this.state.secretKey, 
        "courierLogo": this.state.courierLogo,
      }
      this.setState({ loading : true},()=> {
        axios.post("/courier-service/internal/update-courier-service" ,formdata, {headers: {'Content-Type': 'application/json'}}).then(res => {
          if(!res.data.error){
            self.setState({ loading : false })
            self.props.history.push("/lsp/courier/list/all")
          }
        }).catch(error => { alert(error.response.data.errorMessage); self.setState({ loading : false })});;
      })
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
            <Grid lg={12} container justify="space-between" className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
              {this.state.type == "edit" ? "Edit" : "Create"} Courier Service {this.state.edit_id}
            </Typography>
            <Button variant="contained" color="primary" className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={12}>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                      label="code"
                      variant="outlined"
                      value={this.state.code || ""}
                      fullWidth
                      name="code"
                      rows={2}
                      onChange={(e) => { this.setState({ code : (e.target.value) })}}
                      required={true}
                      inputProps={{
                      maxLength : "5"
                      }}
                  />
                </Grid>
                <Grid item xs={4} sm={4}  className={classes.control}>
                  <TextField
                      label="courierService"
                      variant="outlined"
                      value={this.state.courierService || ""}
                      fullWidth
                      name="courierService"
                      rows={2}
                      onChange={(e) => { this.setState({ courierService : (e.target.value) })}}
                      required={true}
                      inputProps={{
                      maxLength : "250"
                      }}
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                      label="secretKey"
                      value={this.state.secretKey || ""}
                      fullWidth
                      variant="outlined"
                      name="secretKey"
                      rows={2}
                      onChange={(e) => { this.setState({ secretKey : (e.target.value) })}}
                      required={true}
                      inputProps={{
                      maxLength : "250"
                      }}
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Select Status</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.enableStatus}
                      onChange={(e)=> { this.setState({ enableStatus :  e.target.value })}}
                      label="Select Status"
                      required
                    >
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">InActive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Is International Support ? </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.internationalSupported}
                      onChange={(e)=> { this.setState({ internationalSupported :  e.target.value })}}
                      label="Is International Support ? "
                      required
                    >
                      <MenuItem value="true">YES</MenuItem>
                      <MenuItem value="false">NO</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Is Return Support ? </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.returnSupported}
                      onChange={(e)=> { this.setState({ returnSupported :  e.target.value })}}
                      label="Is Return Support ?"
                      required
                    >
                      <MenuItem value="true">YES</MenuItem>
                      <MenuItem value="false">NO</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                      {this.state.courierLogo}
                </Grid>
                <Grid className={classes.gridItem} item xs={4} sm={6} md={4} className={classes.control}>
                    <Typography>Upload</Typography>
                  <TextField
                    variant="outlined"
                    id="uploadFile"
                    type="file"
                    name="logo_file"
                    accept=".png, .jpg, .jpeg"
                    onChange={e => {
                      var formdata = new FormData();
                      let file =
                        e.target.files &&
                        e.target.files[0] &&
                        e.target.files[0].name;
                      let allowedExtension = ["png", "jpg", "jpeg"];
                      let fileExtension = file.split(".");
                      fileExtension = fileExtension[fileExtension.length - 1];
                      if (allowedExtension.indexOf(fileExtension) > -1) {
                        formdata.append("template_upload", e.target.files[0]);
                        this.handleLogoImageUpload(formdata);
                      } else {
                        let fileName = document.getElementById("uploadFile");
                        fileName.value = "";
                        alert(
                          "Please choose the valid file. Choose either png or jpg or jpeg"
                        );
                      }
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
  templateImage: state.sizeMap.uploadImage,
});

export default withStyles(styles)(connect(mapStateToProps)(AddCourier));