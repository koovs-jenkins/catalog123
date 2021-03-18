import React from "react";
import Typography from "@material-ui/core/Typography";
import DatePicker from "react-datepicker";
import {Paper,Select,FormControl,MenuItem,InputLabel} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
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
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  },
  control:{padding:"10px"}
});

class AddReferral extends React.Component {
  state = {
    title : "",
    referralType : "",
    noOfInvite : "",
    thresholdOrderAmount : "",
    programExpiryTime : new Date(),
    status : "",
    referrerCashbackType : "",
    referredCashbackType : "",
    referrerCashbackAmount : "",
    referredCashbackAmount : "",
    referredCashbackExpiryTime : "",
    referrerCashbackExpiryTime : "",
    edit_id : "",
    type :  "add",
    loading : false,
    emailSubject : "",
    emailLink : "",
    screenLink : "",
    emailText : "",
    smsText : "Hey, use this referral code on Koovs and get amazing discounts. Referral Code: $REFER_CODE$. For more details click the link https://koovs.com",
    smsLink : "https://koovs.com",
    screenText : "Share your referral code and earn benefits worth INR 500!",
    screenText2 : "Read the instructions here",
    screenLink2 : "https://koovs.com",
    referrerMaxCashbackAmount : "",
    referredMaxCashbackAmount : "",
    referrerMinCashbackAmount : "",
    referredMinCashbackAmount : "",
    referral : "",
};

  

componentDidMount = () => {
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : "",
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
           var self = this;
           axios.get("/referral/programs/"+this.state.edit_id, {headers: {'Content-Type': 'application/json'}}).then(res => {
             self.setState({
               "loading" : false,
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
              "screenLink" : res.data.data[0].screenLink,
              "emailText" : res.data.data[0].emailText,
              "smsText" : res.data.data[0].smsText,
              "smsLink" : res.data.data[0].smsLink,
              "screenText" : res.data.data[0].screenText,
              "screenText2" : res.data.data[0].screenText2,
              "screenLink2" : res.data.data[0].screenLink2,
              "referrerMaxCashbackAmount" : res.data.data[0].referrerMaxCashbackAmount,
              "referredMaxCashbackAmount" : res.data.data[0].referredMaxCashbackAmount,
              "referrerMinCashbackAmount" : res.data.data[0].referrerMinCashbackAmount,
              "referredMinCashbackAmount" : res.data.data[0].referredMinCashbackAmount,
              "referral" : res.data.data[0].referral,
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
                emailText : "",
                smsText : "",
                smsLink : "",
                screenText : "",
                screenText2 : "",
                screenLink2 : "",
                referrerMaxCashbackAmount : "",
                referredMaxCashbackAmount : "",
                referrerMinCashbackAmount : "",
                referredMinCashbackAmount : "",
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
              "screenLink" : res.data.data[0].screenLink,
              "emailText" : res.data.data[0].emailText,
              "smsText" : res.data.data[0].smsText,
              "smsLink" : res.data.data[0].smsLink,
              "screenText" : res.data.data[0].screenText,
              "screenText2" : res.data.data[0].screenText2,
              "screenLink2" : res.data.data[0].screenLink2,
              "referrerMaxCashbackAmount" : res.data.data[0].referrerMaxCashbackAmount,
              "referredMaxCashbackAmount" : res.data.data[0].referredMaxCashbackAmount,
              "referrerMinCashbackAmount" : res.data.data[0].referrerMinCashbackAmount,
              "referredMinCashbackAmount" : res.data.data[0].referredMinCashbackAmount,
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

  handleform(event){
    event.preventDefault();
    var self = this;
    if(this.state.type == "create"){
      var formdata = {
        "title": this.state.title,
        "referralType":   this.state.referralType,
        "noOfInvite":   this.state.noOfInvite,
        "thresholdOrderAmount":   this.state.thresholdOrderAmount,
        "programExpiryTime":   this.state.programExpiryTime ? dateFormat(this.state.programExpiryTime, "yyyy-mm-dd HH:MM:ss") : "",
        "referredCashbackExpiryTime":   this.state.referredCashbackExpiryTime ,
        "referrerCashbackExpiryTime":   this.state.referrerCashbackExpiryTime,
        "status":   this.state.status, 
        "referrerCashbackType":   this.state.referrerCashbackType, 
        "referredCashbackType":   this.state.referredCashbackType, 
        "referrerCashbackAmount":   this.state.referrerCashbackAmount,
        "referredCashbackAmount":   this.state.referredCashbackAmount,
        "emailSubject" : this.state.emailSubject,
        "emailLink" : this.state.emailLink,
        "emailText" : this.state.emailText,
        "smsText" : this.state.smsText,
        "smsLink" : this.state.smsLink,
        "screenLink" : this.state.screenLink,
        "screenText" : this.state.screenText,
        "screenText2" : this.state.screenText2,
        "screenLink2" : this.state.screenLink2,
        "referrerMaxCashbackAmount" : this.state.referrerMaxCashbackAmount,
        "referredMaxCashbackAmount" : this.state.referredMaxCashbackAmount,
        "referrerMinCashbackAmount" : this.state.referrerMinCashbackAmount,
        "referredMinCashbackAmount" : this.state.referredMinCashbackAmount,
        "referral" : this.state.referral,
      }

      this.setState({ loading : true},()=> {
        axios.post("/referral/programs/" ,formdata, {headers: {'Content-Type': 'application/json'}}).then(res => {
          if(!res.data.error){
            self.setState({ loading : false})
            self.props.history.push("/referral_program/ref/list/all")
          }
        }).catch(error => { 
          alert(error.response.data.errorMessage)
          self.setState({ loading : false })
        });;
      })
      
    }
    else if(this.state.type == "edit" && this.state.edit_id){
      var edit_data = {
        "id":this.state.edit_id,
        "title": this.state.title,
        "referralType":   this.state.referralType,
        "noOfInvite":   this.state.noOfInvite,
        "thresholdOrderAmount":   this.state.thresholdOrderAmount,
        "programExpiryTime":   this.state.programExpiryTime ? dateFormat(this.state.programExpiryTime, "yyyy-mm-dd HH:MM:ss") : "",
        "referredCashbackExpiryTime":   this.state.referredCashbackExpiryTime ,
        "referrerCashbackExpiryTime":   this.state.referrerCashbackExpiryTime,
        "status":   this.state.status, 
        "referrerCashbackType":   this.state.referrerCashbackType, 
        "referredCashbackType":   this.state.referredCashbackType, 
        "referrerCashbackAmount":   this.state.referrerCashbackAmount,
        "referredCashbackAmount":   this.state.referredCashbackAmount,
        "emailSubject" : this.state.emailSubject,
        "emailLink" : this.state.emailLink,
        "emailText" : this.state.emailText,
        "smsText" : this.state.smsText,
        "smsLink" : this.state.smsLink,
        "screenText" : this.state.screenText,
        "screenLink" : this.state.screenLink,
        "referrerMaxCashbackAmount" : this.state.referrerMaxCashbackAmount,
        "referredMaxCashbackAmount" : this.state.referredMaxCashbackAmount,
        "referrerMinCashbackAmount" : this.state.referrerMinCashbackAmount,
        "referredMinCashbackAmount" : this.state.referredMinCashbackAmount,
        "referral" : this.state.referral,
      }
      edit_data["screenText2"] = this.state.screenText2;
      edit_data["screenLink2"] = this.state.screenLink2;
      this.setState({ loading : true},()=> {
        axios.post("/referral/programs/update" ,edit_data, {headers: {'Content-Type': 'application/json'}}).then(res => {
          if(!res.data.error){
            self.setState({ loading : false })
            self.props.history.push("/referral_program/ref/list/all")
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
            <Grid container lg={12} justify="space-between" className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
              {this.state.type == "edit" ? "Edit" : "Create"} Referral Program {this.state.edit_id}
             
            </Typography>
            <Button variant="contained" color="primary" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>
            
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={12}>
                <Grid item xs={12} sm={12}>
                  <p className="product_grouping_headlines">
                     Referral Program Settings
                  </p>
                </Grid>
              <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                      label="Referral Program Title"
                      variant="outlined"
                      value={this.state.title || ""}
                      fullWidth
                      name="title"
                      rows={2}
                      onChange={(e) => { this.setState({ title : (e.target.value) })}}
                      required={true}
                      inputProps={{
                      maxLength : "250"
                      }}
                  />
                </Grid>
              <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                      label="No. of Invites"
                      value={this.state.noOfInvite || ""}
                      fullWidth
                      variant="outlined"
                      name="noOfInvite"
                      type="number"
                      rows={2}
                      onChange={(e) => { this.setState({ noOfInvite : (e.target.value) })}}
                      required={false}
                      inputProps={{
                        min:"0",
                      }}
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">Select Status*</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.status}
                    onChange={(e)=> { this.setState({ status :  e.target.value })}}
                    label="Select Status*"
                    required
                  >
                    <MenuItem value="">Select Status*</MenuItem>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">InActive</MenuItem>
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">Select Referral Type</InputLabel>
                <Select
                       labelId="demo-simple-select-outlined-label"
                       id="demo-simple-select-outlined"
                      value={this.state.referralType}
                      onChange={(e)=> { this.setState({ referralType :  e.target.value })}}
                      label="Select Referral Type"
                      required
                      disabled={this.state.edit_id ? true : false}
                    >
                    <MenuItem value="">Select Referral Type*</MenuItem>
                    <MenuItem value="SIGNUP_BASED">SIGNUP BASED</MenuItem>
                    <MenuItem value="TRANSACTION_BASED">TRANSACTIONAL BASED</MenuItem>
                  </Select>
                    </FormControl>
                </Grid>
                {this.state.referralType == "TRANSACTION_BASED" &&
                  <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                        label="Threshold Amount"
                        value={this.state.thresholdOrderAmount || ""}
                        fullWidth
                        variant="outlined"
                        name="thresholdOrderAmount"
                        type="number"
                        rows={2}
                        onChange={(e) => { this.setState({ thresholdOrderAmount : (e.target.value) })}}
                        required={true}
                        disabled={this.state.edit_id ? true : false}
                        inputProps={{
                          min:"0",
                        }}
                    />
                  </Grid>
                }
                <Grid item xs={4} sm={4} className={classes.control}>
                  <label className="datepicker_label referral">Referral Program Expiry Date</label>
                  <DatePicker
                    variant="outlined"
                    selected={new Date(this.state.programExpiryTime)}
                    onChange={(date) => { this.setState({ programExpiryTime :  (date) }) }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    timeCaption="Time"
                    placeholderText="Enter Referral Program Expiry Date"
                    minDate={ new Date()}
                    required={true}
                  />
                </Grid>
                <Grid item xs={12} sm={12} className={classes.control}>
                  <p className="product_grouping_headlines">
                     Referrer Settings
                  </p>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">Select Referrer Cashback Type</InputLabel>
                  <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={this.state.referrerCashbackType}
                        onChange={(e)=> { this.setState({ referrerCashbackType :  e.target.value })}}
                        label="Select Referrer Cashback Type"
                        disabled={this.state.edit_id ? true : false}
                        required
                    >
                    <MenuItem value="PERCENTAGE">Absolute Percent</MenuItem>
                    <MenuItem value="ABSOLUTE_AMOUNT">Absolute Amount</MenuItem>
                    <MenuItem value="GIFT_COUPON">Gift Card Cashback</MenuItem>
                  </Select>
                    </FormControl>
                </Grid>
                {this.state.referrerCashbackType === "PERCENTAGE" &&
                  <Grid item xs={4} sm={4}  className={classes.control}>
                    <TextField
                        variant="outlined"
                        label="Referrer Cashback Amount"
                        value={this.state.referrerCashbackAmount || ""}
                        fullWidth
                        name="referrerCashbackAmount"
                        type="number"
                        rows={2}
                        onChange={(e) => { this.setState({ referrerCashbackAmount : (e.target.value) })}}
                        required={true}
                        disabled={this.state.edit_id ? true : false}
                        helperText="Value is in Percent.Should be less than 100%"
                        inputProps={{
                          min:"0",
                          max : "99"
                        }}
                    />
                  </Grid>
                }
                {this.state.referrerCashbackType == "GIFT_COUPON" &&
                  <Grid item xs={4} sm={4}>
                    <TextField
                        label="Referrer Gift Card Cashback"
                        value={this.state.referrerCashbackAmount || ""}
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                        name="referrerCashbackAmount"
                        type="number"
                        rows={2}
                        disabled={this.state.edit_id ? true : false}
                        onChange={(e) => { this.setState({ referrerCashbackAmount : (e.target.value) })}}
                        placeholder="Referrer Gift Card Cashback"
                        helperText="Enter Amount"
                        required={true}
                        inputProps={{
                          min:"0",
                        }}
                    />
                </Grid>
                }
                {this.state.referrerCashbackType == "ABSOLUTE_AMOUNT" &&
                  <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                        label="Referrer Cashback Amount"
                        variant="outlined"
                        value={this.state.referrerCashbackAmount || ""}
                        fullWidth
                        name="referrerCashbackAmount"
                        type="number"
                        rows={2}
                        disabled={this.state.edit_id ? true : false}
                        onChange={(e) => { this.setState({ referrerCashbackAmount : (e.target.value) })}}
                        helperText="Enter Absolute Value"
                        required={true}
                        inputProps={{
                          min:"0",
                        }}
                    />
                </Grid>
                }
                 <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                        label="Referrer Max Order Amount"
                        value={this.state.referrerMaxCashbackAmount || ""}
                        fullWidth
                        variant="outlined"
                        name="referrerMaxCashbackAmount"
                        type="number"
                        rows={2}
                        onChange={(e) => { this.setState({ referrerMaxCashbackAmount : (e.target.value) })}}
                        helperText="Enter Absolute Value"
                        inputProps={{
                          min: this.state.referrerMinCashbackAmount,
                          step : "0.01"
                        }}
                    />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                        variant="outlined"
                        label="Referrer Min Order Amount"
                        value={this.state.referrerMinCashbackAmount || ""}
                        name="referrerMinCashbackAmount"
                        fullWidth
                        type="number"
                        rows={2}
                        onChange={(e) => { this.setState({ referrerMinCashbackAmount : (e.target.value) })}}
                        helperText="Enter Absolute Value"
                        inputProps={{
                          min:"0",
                          step : "0.01"
                        }}
                    />
                </Grid>
               
                
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                        label="Enter Referrer Promo Expiry"
                        variant="outlined"
                        value={this.state.referrerCashbackExpiryTime || ""}
                        fullWidth
                        name="referrerCashbackExpiryTime"
                        type="number"
                        rows={2}
                        onChange={(e) => { this.setState({ referrerCashbackExpiryTime : (e.target.value) })}}
                        required={true}
                        helperText="Enter in days"
                        inputProps={{
                          min:"0",
                        }}
                    />
                </Grid>
                
                
                
                <Grid item xs={12} sm={12}>
                  <p className="product_grouping_headlines">
                     Referred Settings
                  </p>
                </Grid>
                
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" >
                  <InputLabel id="demo-simple-select-outlined-label">Select Referred Cashback Type</InputLabel>
                    <Select
                      select
                      value={this.state.referredCashbackType}
                      onChange={(e)=> { this.setState({ referredCashbackType :  e.target.value })}}
                      disabled={this.state.edit_id ? true : false}
                      label="Select Referred Cashback Type"
                      helperText="Please Select Referred Cashback Type"
                      required
                    >
                    <MenuItem value="">Select Referred Cashback Type*</MenuItem>
                    <MenuItem value="PERCENTAGE">Absolute Percent</MenuItem>
                    <MenuItem value="ABSOLUTE_AMOUNT">Absolute Amount</MenuItem>
                    <MenuItem value="GIFT_COUPON">Gift Card Cashback</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                {this.state.referredCashbackType === "PERCENTAGE" &&
                  <Grid item xs={4} sm={4}  className={classes.control}>
                    <TextField
                        variant="outlined"
                        label="Referred Cashback Amount"
                        value={this.state.referredCashbackAmount || ""}
                        fullWidth
                        name="referredCashbackAmount"
                        type="number"
                        rows={2}
                        disabled={this.state.edit_id ? true : false}
                        onChange={(e) => { this.setState({ referredCashbackAmount : (e.target.value) })}}
                        required={true}
                        helperText="Value is in Percent.Should be less than 100%"
                        inputProps={{
                          min:"0",
                          max : "99"
                        }}
                    />
                  </Grid>
                }
                {this.state.referredCashbackType === "ABSOLUTE_AMOUNT" &&
                  <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField 
                    variant="outlined"
                        label="Referred Cashback Amount"
                        value={this.state.referredCashbackAmount || ""}
                        fullWidth
                        name="referredCashbackAmount"
                        type="number"
                        rows={2}
                        disabled={this.state.edit_id ? true : false}
                        onChange={(e) => { this.setState({ referredCashbackAmount : (e.target.value) })}}
                        helperText="Enter Absolute Value"
                        required={true}
                        inputProps={{
                          min:"0",
                        }}
                    />
                </Grid>
                }
                {this.state.referredCashbackType === "GIFT_COUPON" &&
                  <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                        label="Referred Gift Card Cashback"
                        value={this.state.referredCashbackAmount || ""}
                        fullWidth
                        variant="outlined"
                        name="referredCashbackAmount"
                        type="number"
                        rows={2}
                        disabled={this.state.edit_id ? true : false}
                        onChange={(e) => { this.setState({ referredCashbackAmount : (e.target.value) })}}
                        helperText="Enter Absolute Value"
                        required={true}
                        inputProps={{
                          min:"0",
                        }}
                    />
                </Grid>
                }
                <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                        label="Referred Min Order Amount"
                        value={this.state.referredMinCashbackAmount || ""}
                        fullWidth
                        variant="outlined"
                        name="referredMinCashbackAmount"
                        type="number"
                        rows={2}
                        onChange={(e) => { this.setState({ referredMinCashbackAmount : (e.target.value) })}}
                        helperText="Enter Absolute Value"
                        inputProps={{
                          min:"0",
                          step : "0.01"
                        }}
                    />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                        label="Referred Max Order Amount"
                        value={this.state.referredMaxCashbackAmount || ""}
                        fullWidth
                        variant="outlined"
                        name="referredMaxCashbackAmount"
                        type="number"
                        rows={2}
                        onChange={(e) => { this.setState({ referredMaxCashbackAmount : (e.target.value) })}}
                        helperText="Enter Absolute Value"
                        inputProps={{
                          min: this.state.referredMinCashbackAmount,
                          step : "0.01"
                        }}
                    />
                </Grid>
                
                <Grid item xs={4} sm={4} className={classes.control}> 
                  <TextField
                        label="Enter Referred Promo Expiry"
                        value={this.state.referredCashbackExpiryTime || ""}
                        fullWidth
                        variant="outlined"
                        name="referredCashbackExpiryTime"
                        type="number"
                        rows={2}
                        onChange={(e) => { this.setState({ referredCashbackExpiryTime : (e.target.value) })}}
                        helperText="Enter In days"
                        required={true}
                        inputProps={{
                          min:"0",
                        }}
                    />
                </Grid>
                
              <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                        label="Enter Email Subject"
                        value={this.state.emailSubject || ""}
                        fullWidth
                        variant="outlined"
                        name="emailSubject"
                        type="text"
                        rows={2}
                        onChange={(e) => { this.setState({ emailSubject : (e.target.value) })}}
                        required={false}
                    />
                </Grid>
                {/* <Grid item xs={4} sm={4}>
                  <TextField
                        label="Enter Email Link"
                        value={this.state.emailLink || ""}
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                        name="emailLink"
                        type="text"
                        rows={2}
                        onChange={(e) => { this.setState({ emailLink : (e.target.value) })}}
                        placeholder="Enter Email Link"
                        required={false}
                    />
                </Grid> */}
                <Grid item xs={12} sm={12}>
                  <p className="product_grouping_headlines">
                     Communication Settings
                  </p>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                        label="Enter Communication Link"
                        value={this.state.smsLink || ""}
                        fullWidth
                        variant="outlined"
                        name="smsLink"
                        type="url"
                        rows={2}
                        onChange={(e) => { this.setState({ smsLink : (e.target.value) })}}
                        required={false}
                    />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                      <TextField
                        required={true}
                        label="Enter Communication Text"
                        value={this.state.smsText || ""}
                        variant="outlined"
                        multiline
                        fullWidth
                        name="smsText"
                        rows={4}
                        onChange={(e) => { this.setState({ smsText : (e.target.value) })}}
                      />           
                </Grid>
                <Grid item xs={12} sm={12} className={classes.control}>
                  <p className="product_grouping_headlines">
                     Configured Text
                  </p>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                        <TextField
                          required={true}
                          label="Enter Screen Text"
                          value={this.state.screenText || ""}
                          variant="outlined"
                          multiline
                          fullWidth
                          name="screenText"
                          rows={2}
                          onChange={(e) => { this.setState({ screenText : (e.target.value) })}}
                          helperText="Share your referral code screen text"
                        />         
                  </Grid>
                  <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                          label="Enter Screen Link"
                          value={this.state.screenLink || ""}
                          variant="outlined"
                          fullWidth
                          name="screenLink"
                          type="url"
                          rows={2}
                          onChange={(e) => { this.setState({ screenLink : (e.target.value) })}}
                          required={false}
                      />
                  </Grid>


                {/* <Grid item xs={4} sm={4}>
                        <TextField
                          required={true}
                          label="Enter Screen Text for Instructions"
                          value={this.state.screenText2 || ""}
                          margin="normal"
                          multiline
                          fullWidth
                          InputLabelProps={{
                            shrink: true
                          }}
                          name="screenText2"
                          rows={2}
                          onChange={(e) => { this.setState({ screenText2 : (e.target.value) })}}
                          placeholder="Enter Screen Text for Instructions"
                        />         
                  </Grid> */}
                  {/* <Grid item xs={4} sm={4}>
                    <TextField
                          label="Enter Screen Link for Instructions"
                          value={this.state.screenLink2 || ""}
                          margin="normal"
                          fullWidth
                          InputLabelProps={{
                            shrink: true
                          }}
                          name="screenLink2"
                          type="url"
                          rows={2}
                          onChange={(e) => { this.setState({ screenLink2 : (e.target.value) })}}
                          placeholder="Enter Screen Link for Instructions"
                          required={false}
                      />
                  </Grid> */}
                {/* <Grid item xs={4} sm={4}>
                      <ReactQuill
                          required={false}
                          modules={modules}
                          defaultValue={this.state.emailText}
                          preserveWhitespace={true}
                          formats={formats}
                          value={this.state.emailText || ""} 
                          placeholder={"Enter Email Text"}
                          onChange={ (value) => { this.setState({ emailText : value })}} 
                      />
                </Grid> */}
               
               
                {/* <Grid item xs={4} sm={4}>
                    <TextField
                    select
                    value={this.state.referral}
                    onChange={(e)=> { this.setState({ referral :  e.target.value })}}
                    SelectProps={{
                    native: true,
                    }}
                    margin="normal"
                    fullWidth
                    required
                    helperText="Please Select Referral Type"
                    >
                    <option value="">Select Type*</option>
                    <option value="MULTIUSERS">Multiusers</option>
                    <option value="OTHERS">Others</option>
                    <option value="PROMOTIONAL">Promotional</option>
                    <option value="PUBLIC_ACCESS_GENERIC">Public Access Generic</option>
                    <option value="REFUND">Refund</option>
                    </TextField>
                </Grid> */}
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
});

export default withStyles(styles)(connect(mapStateToProps)(AddReferral));