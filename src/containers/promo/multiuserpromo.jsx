import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {Button,Select,FormControl,MenuItem,InputLabel} from '@material-ui/core';
import Error from "@material-ui/icons/ErrorOutline";
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
var dateFormat = require('dateformat');
import DatePicker from "react-datepicker";

import axios from "axios";
import {env} from '../../../config';
var now = new Date();
import {
    postMultiUserPromo,
} from "../../store/actions/userpromo";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import Axios from "axios";

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
    padding:"10px",
  },
  button: {
    margin: theme.spacing.unit * 2
  }
});

class UserPromo extends React.Component {
  state = {
    type :  "add",
    edit_id : "",
    code: "",
    typeid : "",
    discount_type: "", //d
    absolute_percent: "",
    oneTimeUse: "", //d
    status: "", //d
    expireDate: new Date(),
    maxNoOfUse: "",
    productIdSet: "",
    minimumAmountApplicableOn: "", //d
    minimumAmount: "",
    maxQuantity: "",
    maximumAmount: "",
    productSaleTypeApplicable: "", //d
    freeShipping: "", //d
    emailVerificationCheck: "", //d
    emailPattern: "",
    successMessage: "",
    couponRequestedby:"", 
    requestedDate: new Date(),  //date
    startDate: new Date(), //date
    tags: "",
    isOrderLevelCancel: "", //d
    isItemLevelCancel: "", //d 
    canExchange: "", //d 
    canReturn: "", //d
    online : "",
    cod : "",
    web : "",
    msite : "",
    android : "",
    ios : "",
    globalCount : "",
    createdBy : localStorage[env+"_koovs_userid"] ,
    version : "",
    generateRandom : false,
    txnId :"",
    userEmail  : "",
    userFile : "",
    typeFace : "",
};

  

componentDidMount = () => {
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
  })
};




UNSAFE_componentWillReceiveProps = (newProps) => {
    if(newProps.match.params.type != this.props.match.params.type){
        this.setState({ type :  newProps.match.params.type },()=>{
          if(this.state.type == "add"){
              this.setState({ 
                type :  "add",
                edit_id : "",

              })
          }
        })
    }
    if(newProps.match.params.id != this.props.match.params.id){
      this.setState({ id :  newProps.match.params.id },()=>{
          if(this.state.type  == "edit" && this.state.edit_id){
            this.props.dispatch(fetchUserPromoDetail(this.state.edit_id)).then(() =>
            this.setState({

            })
            )
          }
      })
    }
}



removefile(){
  this.setState({ userFile :  "" , filename : ""},()=>{
    document.getElementById("user_file_upload").value=""
  })
}

uploadfile(event){
  var file = event.target.files[0].name.split(".")
  var name = file[ file.length -1 ].toLowerCase();
  var size =  event.target.files[0].size
  if(name == "csv"){
      if((parseFloat((size / 1048576).toFixed(2)) <= 5)){
              this.setState({ userFile : event.target.files[0], filename : event.target.files[0].name },()=>{
              })
      }
      else{
          alert("File Size should be less than 5MB.")
      }
  }
  else{
      document.getElementById("user_file_upload").value= ""
      alert("Please upload image with .csv extention.")
  }
}



  handleform(event){
    event.preventDefault();
    if(this.state.userFile){
        var self = this;
        var paymentMethodApplicable = []
        if(this.state.online == "ONLINE"){
          paymentMethodApplicable.push("ONLINE")
        }
        if(this.state.cod == "COD"){
          paymentMethodApplicable.push("COD")
        }
    
        var applicablePlatformSet = []
        if(this.state.ios == "IOS"){
          applicablePlatformSet.push("IOS")
        }
        if(this.state.web == "WEB"){
          applicablePlatformSet.push("WEB")
        }
        if(this.state.msite == "MSITE"){
          applicablePlatformSet.push("MSITE")
        }
        if(this.state.android == "ANDROID"){
          applicablePlatformSet.push("ANDROID")
        }
        var promoCodes = {
          "code": this.state.code,
          "generateRandom": this.state.generateRandom,
          "globalCount": this.state.globalCount,
          "userEmail" :  this.state.userEmail,
          "userId" :  this.state.userId,
          "txnId": this.state.txnId,
          "status": this.state.status,
          "startDate": dateFormat(this.state.startDate, "isoDateTime"),
          "expireDate": dateFormat(this.state.expireDate, "isoDateTime"),
          "productSaleTypeApplicable": this.state.productSaleTypeApplicable,
          "createdBy": this.state.createdBy,
          "oneTimeUse": this.state.oneTimeUse,
          "type": this.state.typeid,
          "maxNoOfUse": this.state.maxNoOfUse,
          "freeShipping": this.state.freeShipping,
          "typeFace" : this.state.typeFace,
          "fileKey":  dateFormat(new Date(), "isoDateTime"),
          "promoCodeData": [
            {
              "currency": false,
              "discount": this.state.discount_type == "1" ? this.state.absolute_percent : this.state.absolute_value,
              "isPercent": this.state.discount_type == "1" ? true : false,
              "maxQuantity": this.state.maxQuantity,
              "paymentMethodApplicable":paymentMethodApplicable ,
              "minimumAmountApplicableOn": this.state.minimumAmountApplicableOn,
              "minimumAmount": this.state.minimumAmount,
              "maximumAmount": this.state.maximumAmount,
              "applicablePlatformSet": applicablePlatformSet,
              "maximumDiscountAmount": this.state.maximumDiscountAmount,
              "productIdSet": this.state.productIdSet != "" ? this.state.productIdSet.split(",") : [],
            }
          ],
        }
        if(this.state.edit_id){
            promoCodes["id"] = this.state.edit_id
            promoCodes["version"] = this.state.version
        }
        var formdata = new FormData();
        formdata.append("promoCode", JSON.stringify(promoCodes))
        formdata.append("file", this.state.userFile)
        if(this.state.type == "add"){
          this.props.dispatch(postMultiUserPromo(formdata)).then((res) => {
            if (!self.props.error) {
              this.props.history.push("/promo/list/user")
            }
            else{
                if(typeof(this.props.error.error) != "object"){
                    alert(this.props.error.error)
                }
                if(typeof(this.props.error.error) == "object"){
                  alert(this.props.error.error.response.data.message)
                } 
            }
          })
        }
      
    }
    else{
      alert("Please User Upload Batch File in .csv format.")
    }
  }


  render() {
    const { classes, match, loading } = this.props;
    return (
      <React.Fragment>
        {loading &&
            <LinearProgress />
        }
        {!loading && (
          <React.Fragment>
            <Grid container lg={12} justify="space-between" className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
              {this.state.type == "edit" ? "Edit" : "Create"} Multi User Promo 
            </Typography>
            <Button variant="contained" color="primary" className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={12}>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    value={this.state.code || ""}
                    variant="outlined"
                    name="code"
                    onChange={(e) => { this.setState({ code :  (e.target.value) })}}
                    label="Enter Promo Code"
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Please select discount type*</InputLabel>
                    <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                    value={this.state.discount_type}
                    onChange={(e)=> { this.setState({ discount_type :  e.target.value })}}
                    SelectProps={{
                    native: true,
                    }}
                    margin="normal"
                    fullWidth
                    required
                    label="Please select discount type*"
                    >
                    <MenuItem value="1">Absolute Percent</MenuItem>
                    <MenuItem value="2">Absolute Value</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                {this.state.discount_type == "1" &&
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    value={this.state.absolute_percent || ""}
                    variant="outlined"
                    name="absolute_percent"
                    type="number"
                    onChange={(e) => { this.setState({ absolute_percent :  (e.target.value) })}}
                    label="Enter Absolute Percent"
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250",
                    min:"0",
                    }}
                    fullWidth
                  />
                </Grid>
                }
                {this.state.discount_type == "2" &&
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    value={this.state.absolute_value || ""}
                    variant="outlined"
                    type="number"
                    name="absolute_value"
                    onChange={(e) => { this.setState({ absolute_value :  (e.target.value) })}}
                    label="Enter Absolute Value"
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250",
                    min:"0",
                    }}
                    fullWidth
                  />
                </Grid>
                }

                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    value={this.state.txnId || ""}
                    variant="outlined"
                    name="txnId"
                    onChange={(e) => { this.setState({ txnId :  (e.target.value) })}}
                    label="Enter Txnid"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    value={this.state.globalCount || ""}
                    variant="outlined"
                    type="number"
                    name="globalCount"
                    onChange={(e) => { this.setState({ globalCount :  (e.target.value) })}}
                    label="Enter Global Count"
                    required={false}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Please Select One Time Use * </InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.oneTimeUse}
                    onChange={(e)=> { this.setState({ oneTimeUse :  e.target.value })}}
                    margin="normal"
                    fullWidth
                    label="Please Select One Time Use * "
                    required
                    >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Please Select Status*</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.status}
                      onChange={(e)=> { this.setState({ status :  e.target.value })}}
                      fullWidth
                      label="Please Select Status*"
                      required
                    >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">InActive</MenuItem>
                    <MenuItem value="USED">Used</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                <label className="datepicker_label">Enter Expiry Date</label>
                  <DatePicker
                        selected={this.state.expireDate || ""}
                        onChange={(date) => { this.setState({ expireDate :  (date) }) }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        placeholderText="Enter Expiry Date"
                      />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    value={this.state.maxNoOfUse || ""}
                    variant="outlined"
                    type="number"
                    name="maxNoOfUse"
                    onChange={(e) => { this.setState({ maxNoOfUse :  (e.target.value) })}}
                    label="Enter Max No. of Use"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    value={this.state.productIdSet || ""}
                    variant="outlined"
                    name="productIdSet"
                    onChange={(e) => { this.setState({ productIdSet :  (e.target.value) })}}
                    label="Enter Deal Ids"
                    fullWidth
                  />
                </Grid>
                              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Please Select Type Face*</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.typeFace}
                    onChange={(e)=> { this.setState({ typeFace :  e.target.value })}}
                    margin="normal"
                    fullWidth
                    label="Please Select Type Face*"
                    required
                    >
                    <MenuItem value="NEW">NEW</MenuItem>
                    <MenuItem value="EXISTING">EXISTING</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                

                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    value={this.state.minimumAmount || ""}
                    variant="outlined"
                    name="minimumAmount"
                    onChange={(e) => { this.setState({ minimumAmount :  (e.target.value) })}}
                    label="Enter Minimum Amount"
                    fullWidth
                    type="number"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250",
                    min:"0",
                    }}
                  />
                </Grid>

                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    value={this.state.maximumAmount || ""}
                    variant="outlined"
                    name="maximumAmount"
                    onChange={(e) => { this.setState({ maximumAmount :  (e.target.value) })}}
                    label="Enter Maximum Amount"
                    fullWidth
                    type="number"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250",
                    min:"0",
                    }}
                  />
                </Grid>

                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    value={this.state.maxQuantity || ""}
                    variant="outlined"
                    name="maxQuantity"
                    onChange={(e) => { this.setState({ maxQuantity :  (e.target.value) })}}
                    label="Enter Maximum Quantity"
                    fullWidth
                    type="number"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250",
                    min:"0",
                    }}
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Please Select Type*</InputLabel>
                    <Select
                    value={this.state.typeid}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    onChange={(e)=> { this.setState({ typeid :  e.target.value })}}
                    fullWidth
                    required
                    label="Please Select Type*"
                    >
                    <MenuItem value="MULTIUSERS">Multiusers</MenuItem>
                    <MenuItem value="OTHERS">Others</MenuItem>
                    <MenuItem value="PROMOTIONAL">Promotional</MenuItem>
                    <MenuItem value="PUBLIC_ACCESS_GENERIC">Public Access Generic</MenuItem>
                    <MenuItem value="REFUND">Refund</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Please Select Discount Override*</InputLabel>
                    <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                    value={this.state.productSaleTypeApplicable}
                    onChange={(e)=> { this.setState({ productSaleTypeApplicable :  e.target.value })}}
                    fullWidth
                    label="Please Select Discount Override*"
                    required
                    >
                    <MenuItem value="NON_SALE">Non Sale </MenuItem>
                    <MenuItem value="SALE">Sale</MenuItem>
                    <MenuItem value="ALL">All</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4} sm={4} className={classes.control}>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Applicable Payment Method</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                        control={
                            <Checkbox color="primary" checked={this.state.online == "ONLINE"} onChange={(e) => { this.setState({ online : e.target.checked ? "ONLINE" : "" })}} />
                        }
                        label="Online"
                        />
                        <FormControlLabel
                        control={
                            <Checkbox color="primary" checked={this.state.cod == "COD"} onChange={(e) => { this.setState({ cod : e.target.checked ? "COD" : "" })}}  />
                        }
                        label="COD"
                        />
                    </FormGroup>
                </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Applicable Platforms </FormLabel>
                    <FormGroup>
                        <FormControlLabel
                        control={
                            <Checkbox color="primary" checked={this.state.web == "WEB"} onChange={(e) => { this.setState({ web : e.target.checked ? "WEB" : "" })}} />
                        }
                        label="WEB"
                        />
                        <FormControlLabel
                        control={
                            <Checkbox color="primary" checked={this.state.msite == "MSITE"} onChange={(e) => { this.setState({ msite : e.target.checked ? "MSITE" : "" })}} />
                        }
                        label="MSITE"
                        />
                        <FormControlLabel
                        control={
                            <Checkbox color="primary" checked={this.state.ios == "IOS"} onChange={(e) => { this.setState({ ios : e.target.checked ? "IOS" : "" })}} />
                        }
                        label="IOS"
                        />
                        <FormControlLabel
                        control={
                            <Checkbox color="primary" checked={this.state.android == "ANDROID"} onChange={(e) => { this.setState({ android : e.target.checked ? "ANDROID" : "" })}} />
                        }
                        label="ANDROID"
                        />
                        
                    </FormGroup>
                </FormControl>
                </Grid>

      
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Please Select Free Shipping*</InputLabel>
                    <Select
                    value={this.state.freeShipping}
                    onChange={(e)=> { this.setState({ freeShipping :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    margin="normal"
                    label="Please Select Free Shipping*"
                    required
                    >
                    <MenuItem value="false">No </MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
               
                <Grid item xs={4} sm={4} className={classes.control}>
                <label className="datepicker_label">Enter Start Date</label>
                    <DatePicker
                        selected={this.state.startDate || ""}
                        onChange={(date) => { this.setState({ startDate :  (date) }) }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        placeholderText="Enter Start Date"
                      />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Please Min Amount Applicable At*</InputLabel>
                    <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                    value={this.state.minimumAmountApplicableOn}
                    onChange={(e)=> { this.setState({ minimumAmountApplicableOn :  e.target.value })}}
                    margin="normal"
                    fullWidth
                    label="Please Min Amount Applicable At*"
                    required
                    >
                    <MenuItem value="ITEM">Minimum subtotal of individual item</MenuItem>
                    <MenuItem value="CART">Minimum cart total</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                      <label>Upload User Email (.csv File)</label><br/>
                      {!this.state.userFile &&
                        <input name="user_file_upload" id="user_file_upload" type="file" onChange={this.uploadfile.bind(this)} required/>
                      }
                      <label>Note* No Header is required. Just enter email in a single column.</label>
                      {this.state.userFile &&
                        <React.Fragment>
                          <p>{this.state.filename} &nbsp; <span onClick={this.removefile.bind(this)} style={{ color : "red"}}> Remove </span></p>
                        </React.Fragment>
                      }
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
  promo_data: state.userpromo.data,
  loading: state.userpromo.loading,
  error: state.userpromo.error
});

export default withStyles(styles)(connect(mapStateToProps)(UserPromo));
