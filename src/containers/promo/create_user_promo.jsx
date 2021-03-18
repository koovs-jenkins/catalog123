import React from "react";
import {Typography,TextField,Select,InputLabel,FormControl,MenuItem} from "@material-ui/core";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
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
    fetchUserPromoDetail,
    postUserPromo,
    putUserPromo,
} from "../../store/actions/userpromo";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import CKEditor from "react-ckeditor-component";



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
    margin: theme.spacing.unit * 4
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
    termsAndCond:"", 
    successMessage: "",
    couponRequestedby:"", 
    requestedDate: new Date(),  //date
    startDate: new Date(), //date
    tags: "",
    isOrderLevelCancel: "", //d
    isItemLevelCancel: "", //d 
    canExchange: "", //d 
    canReturn: "", //d
    online : "ONLINE",
    cod : "COD",
    web : "WEB",
    msite : "MSITE",
    android : "ANDROID",
    ios : "IOS",
    globalCount : "",
    createdBy : this.props.user_id,
    version : "",
    generateRandom : false,
    txnId :"",
    userEmail  : "",
    promocode_readonly : ""
};

  

componentDidMount = () => {
  this.setState({
    type : this.props.match.params.type ? (this.props.match.params.type == "create" ? "add" : this.props.match.params.type)  : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
        this.props.dispatch(fetchUserPromoDetail(this.state.edit_id)).then(() =>
           { 
            var data = this.props.promo_data.data.response
            this.setState({
                code : data.code,
                typeid : data.type,
                globalCount : data.globalCount,
                discount_type: data.promoCodeData[0].isPercent == true ? "1" : "2",
                absolute_percent: data.promoCodeData[0].isPercent == true ? data.promoCodeData[0].discount : "",
                absolute_value : data.promoCodeData[0].isPercent == false ? data.promoCodeData[0].discount : "",
                maxQuantity: data.promoCodeData[0].maxQuantity,
                minimumAmountApplicableOn: data.promoCodeData[0].minimumAmountApplicableOn, 
                minimumAmount: data.promoCodeData[0].minimumAmount,
                maximumAmount: data.promoCodeData[0].maximumAmount,
                maximumDiscountAmount : data.promoCodeData[0].maximumDiscountAmount,
                productIdSet: data.promoCodeData[0].productIdSet ? data.promoCodeData[0].productIdSet.join(",") : "",
                oneTimeUse: data.oneTimeUse ,
                status: data.status,
                expireDate: new Date(data.expireDate),
                maxNoOfUse: data.maxNoOfUse,
                termsAndCond:data.termAndCondition,
                productSaleTypeApplicable: data.productSaleTypeApplicable, //d
                freeShipping: data.freeShipping , //d
                startDate: new Date(data.startDate), //date
                online : data.promoCodeData[0].paymentMethodApplicable.includes("ONLINE") ? "ONLINE" : "" ,
                cod : data.promoCodeData[0].paymentMethodApplicable.includes("COD") ? "COD" : "" ,
                web : data.promoCodeData[0].applicablePlatformSet.includes("WEB") ? "WEB" : "" ,
                msite : data.promoCodeData[0].applicablePlatformSet.includes("MSITE") ? "MSITE" : "" ,
                ios : data.promoCodeData[0].applicablePlatformSet.includes("IOS") ? "IOS" : "" ,
                android : data.promoCodeData[0].applicablePlatformSet.includes("ANDROID") ? "ANDROID" : "" ,
                createdBy : data.createdBy,
                requestedDate: new Date(data.requestedDate),
                version : data.version,
                generateRandom : data.generateRandom,
                txnId :data.txnId,
                "userEmail" :  data.userEmail,
                "userId" :  data.userId,
            })
        }
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

getUserData(event){
    var self = this;
    event.preventDefault();
     axios.get("/jarvis-order-service/internal/v1/customer-care/user-profile?email=" + this.state.userEmail,{
        headers: {
          'X-API-CLIENT': 'web',
          'x-user-id': localStorage[env+"_koovs_userid"] 
        }}).then(function(res){
          if(res.data[0]){
            self.setState({ userId : res.data[0].id },()=>{
                self.handleform();
            })
         } 
         else{
           alert("There is no user associated with email : " + self.state.userEmail)
         }
     })
}



  handleform(){
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

    if(applicablePlatformSet.length == 0 ){
      alert("Please Select Applicable Platform Field.")
    }
    else if (paymentMethodApplicable.length == 0){
      alert("Please Select Payment Method Applicable Field.")
    }
    else{
    var formdata = {
      "code": this.state.code,
      "generateRandom": this.state.generateRandom,
      "globalCount": this.state.globalCount,
      "userEmail" :  this.state.userEmail,
      "userId" :  this.state.userId,
      "txnId": this.state.txnId,
      "status": this.state.status,
      "startDate": dateFormat(this.state.startDate, "isoDateTime"),
      "expireDate": dateFormat(this.state.expireDate, "isoDateTime"),
     // "requestedDate": dateFormat(this.state.requestedDate, "isoDateTime"), 
      "productSaleTypeApplicable": this.state.productSaleTypeApplicable,
      "createdBy": this.state.createdBy,
      "oneTimeUse": this.state.oneTimeUse,
      "type": this.state.typeid,
      "maxNoOfUse": this.state.maxNoOfUse,
      "freeShipping": this.state.freeShipping,
      "termAndCondition":(this.state.termsAndCond == "<p><br></p>" ? "" : this.state.termsAndCond),
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
        formdata["id"] = this.state.edit_id
        formdata["version"] = this.state.version
        formdata["lastUpdatedBy"] = this.props.user_id;
    } else {
      formdata["createdBy"] = this.state.createdBy;
    }
    if(this.state.type == "add"){
      this.props.dispatch(postUserPromo(JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          this.props.history.push("/promo/list/user")
        }
      })
    }
    else if(this.state.type == "edit" && this.state.edit_id){
      this.props.dispatch(putUserPromo(this.state.edit_id,JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          this.props.history.push("/promo/list/user")
        }
      })
    }
    }
  }


  handle_termsAndCond(value){
    var newContent = value.editor.getData();
    this.setState({
      termsAndCond: newContent
    })
  }

  handle_absolute_percent(e){
    this.setState({ absolute_percent : e.target.value },()=>{
      if(this.state.absolute_percent > 70 ){
          var generate_code = "";
          var generated_date = new Date(this.state.expireDate).getTime()
          generate_code = "GKOOVS" + generated_date + "U" + this.state.absolute_percent
          this.setState({ promocode_readonly : true , code : generate_code })
      }
      else{
        this.setState({promocode_readonly : false  })
      }
    })
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
            <Grid container justify="space-between" className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
              {this.state.type == "edit" ? "Edit" : "Create"} User Promo 
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
                      {(this.props.error.error.response.data.message)}
                    </p>
                    } 
                  </div>
                }
            </Typography>
            <Button variant="contained" color="primary" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>
            <form onSubmit={this.getUserData.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                   variant="outlined"
                    label="Promo Code"
                    value={this.state.code || ""}
                    name="code"
                    onChange={(e) => { this.setState({ code :  (e.target.value) })}}
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250",
                    readOnly: this.state.promocode_readonly,
                    }}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Select Discount Type*</InputLabel>

                  <Select
                    value={this.state.discount_type}
                    onChange={(e)=> { this.setState({ discount_type :  e.target.value },()=>{
                      if(this.state.discount_type == 1){
                        this.setState({ absolute_value : ""})
                      }
                      else{
                        this.setState({ absolute_percent : "" , promocode_readonly : false })
                      }
                    })}}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    fullWidth
                    required
                    label="Select Discount Type*"
                    >
                    <MenuItem value="1">Absolute Percent</MenuItem>
                    <MenuItem value="2">Absolute Value</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                
                {this.state.discount_type == "1" &&
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Absolute Percent"
                    value={this.state.absolute_percent || ""}
                    variant="outlined"
                    name="absolute_percent"
                    type="number"
                    onChange={this.handle_absolute_percent.bind(this)}
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
                <Grid item xs={4} sm={4}  className={classes.control}>
                  <TextField
                    label="Absolute Value"
                    value={this.state.absolute_value || ""}
                    variant="outlined"
                    type="number"
                    name="absolute_value"
                    onChange={(e) => { this.setState({ absolute_value :  (e.target.value) })}}
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
                    label="Txnid"
                    value={this.state.txnId || ""}
                    variant="outlined"
                    name="txnId"
                    onChange={(e) => { this.setState({ txnId :  (e.target.value) })}}
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="User Email"
                    value={this.state.userEmail || ""}
                    type="email"
                    variant="outlined"
                    name="txnId"
                    onChange={(e) => { this.setState({ userEmail :  (e.target.value) })}}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Global Count"
                    value={this.state.globalCount || ""}
                    variant="outlined"
                    type="number"
                    name="globalCount"
                    onChange={(e) => { this.setState({ globalCount :  (e.target.value) })}}
                    required={false}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Select One Time Use*</InputLabel>
                  <Select
                    value={this.state.oneTimeUse}
                    onChange={(e)=> { this.setState({ oneTimeUse :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    label="Select One Time Use*"
                    required
                    >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Select Status*</InputLabel>

                  <Select
                    value={this.state.status}
                    onChange={(e)=> { this.setState({ status :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    label="Select Status*"
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
                      />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Max No of Use"
                    value={this.state.maxNoOfUse || ""}
                    variant="outlined"
                    type="number"
                    name="maxNoOfUse"
                    onChange={(e) => { this.setState({ maxNoOfUse :  (e.target.value) })}}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    variant="outlined"
                    label="Deal Ids"
                    value={this.state.productIdSet || ""}
                    name="productIdSet"
                    onChange={(e) => { this.setState({ productIdSet :  (e.target.value) })}}
                    fullWidth
                  />
                </Grid>
                              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Select Min Amount applicable at*</InputLabel>

                  <Select
                    value={this.state.minimumAmountApplicableOn}
                    onChange={(e)=> { this.setState({ minimumAmountApplicableOn :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    label="Select Min Amount applicable at*"
                    required
                    >
                    <MenuItem value="ITEM">Minimum subtotal of individual item</MenuItem>
                    <MenuItem value="CART">Minimum cart total</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                

                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Min Amount"
                    value={this.state.minimumAmount || ""}
                    variant="outlined"
                    name="minimumAmount"
                    onChange={(e) => { this.setState({ minimumAmount :  (e.target.value) })}}
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
                    label="Max Amount"
                    value={this.state.maximumAmount || ""}
                    variant="outlined"
                    name="maximumAmount"
                    onChange={(e) => { this.setState({ maximumAmount :  (e.target.value) })}}
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
                    label="Max Quantity"
                    value={this.state.maxQuantity || ""}
                    variant="outlined"
                    name="maxQuantity"
                    onChange={(e) => { this.setState({ maxQuantity :  (e.target.value) })}}
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
                  <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Select Type*</InputLabel>

                  <Select
                    value={this.state.typeid}
                    onChange={(e)=> { this.setState({ typeid :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    required
                    label="Select Type*"
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
                  <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Select Discount Override*</InputLabel>

                  <Select
                    value={this.state.productSaleTypeApplicable}
                    onChange={(e)=> { this.setState({ productSaleTypeApplicable :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    label="Select Discount Override*"
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
                  <FormControl variant="outlined" fullWidth>
                  <InputLabel id="demo-simple-select-outlined-label">Select Free Shipping*</InputLabel>

                  <Select
                    value={this.state.freeShipping}
                    onChange={(e)=> { this.setState({ freeShipping :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    label="Select Free Shipping*"
                    required
                    >
                    <MenuItem value="false">No </MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                {/* <Grid item xs={4} sm={4}>
                  <FormControl variant="outlined" fullWidth>
                          <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>

                  <Select
                    value={this.state.emailVerificationCheck}
                    onChange={(e)=> { this.setState({ emailVerificationCheck :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    helperText="Please Select Email Verification"
                    >
                    <MenuItem value="">Select Email Verification</MenuItem>
                    <MenuItem value="0">No </MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                    </TextField>
                    </FormControl>
                </Grid> */}

               {/* <Grid item xs={4} sm={4}>
                  <TextField
                    label="Email Pattern"
                    value={this.state.emailPattern || ""}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="emailPattern"
                    onChange={(e) => { this.setState({ emailPattern :  (e.target.value) })}}
                    placeholder="Enter Email Pattern"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>  */}

                 {/* <Grid item xs={4} sm={4}>
                  <TextField
                    label="Cart Message"
                    value={this.state.successMessage || ""}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="successMessage"
                    onChange={(e) => { this.setState({ successMessage :  (e.target.value) })}}
                    placeholder="Enter Cart Message"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>  */}

                 {/* <Grid item xs={4} sm={4}>
                  <TextField
                    label="Pay U Offer Key"
                    value={this.state.offer_key || ""}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="offer_key"
                    onChange={(e) => { this.setState({ offer_key :  (e.target.value) })}}
                    placeholder="Enter Pay U Offer Key"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid> */}

                {/* <Grid item xs={4} sm={4}>
                  <TextField
                    label="Coupon Requested By"
                    value={this.state.coupon_requestedby || ""}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="coupon_requestedby"
                    onChange={(e) => { this.setState({ coupon_requestedby :  (e.target.value) })}}
                    placeholder="Enter Coupon Requested By"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid> */}

                {/* <Grid item xs={4} sm={4}>
                  <label className="datepicker_label">Requested Date</label>
                    <DatePicker
                        selected={this.state.requestedDate || ""}
                        onChange={(date) => { this.setState({ requestedDate :  (date) }) }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        placeholderText="Enter Requested Date"
                      />
                </Grid> */}

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

                {/* <Grid item xs={4} sm={4}>
                  <TextField
                    label="Tags"
                    value={this.state.tags || ""}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="tags"
                    onChange={(e) => { this.setState({ tags :  (e.target.value) })}}
                    placeholder="Enter Tags"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid> */}
                

                {/* <Grid item xs={4} sm={4}>
                  <FormControl variant="outlined" fullWidth>
                          <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>

                  <Select
                    value={this.state.isOrderLevelCancel}
                    onChange={(e)=> { this.setState({ isOrderLevelCancel :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    helperText="Please Select Is Order Level Cancel"
                    >
                    <MenuItem value="">Select Is Order Level Cancel</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    </TextField>
                    </FormControl>
                </Grid> */}
                {/* <Grid item xs={4} sm={4}>
                  <FormControl variant="outlined" fullWidth>
                          <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>

                  <Select
                    value={this.state.isItemLevelCancel}
                    onChange={(e)=> { this.setState({ isItemLevelCancel :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    helperText="Please select Is Item Level Cancel"
                    >
                    <MenuItem value="">Select Is Item Level Cancel</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    </TextField>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4}>
                <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>
  
                <Select
                    value={this.state.canExchange}
                    onChange={(e)=> { this.setState({ canExchange :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    helperText="Please select Can Exchange"
                    >
                    <MenuItem value="">Select Can Exchange</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    </TextField>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4}>
                <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>
  
                <Select
                    value={this.state.canReturn}
                    onChange={(e)=> { this.setState({ canReturn :  e.target.value })}}
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    fullWidth
                    helperText="Please Select can return"
                    >
                    <MenuItem value="">Select Can Return</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    </TextField>
                    </FormControl>
                </Grid> */}
                {/* <Grid item xs={4} sm={4 } style={{"margin-bottom":"30px"}}>
                  <label style={{ "color" : "#999" , "line-height":"2", }}>Terms & Conditions</label>
                    <CKEditor
                      id="editor"
                      activeClass="p10"
                      content={this.state.termsAndCond || ""}
                      placeholder={"Enter Terms & Conditions"}
                      events={{
                        "change": this.handle_termsAndCond.bind(this)
                      }}
                    />
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
  promo_data: state.userpromo.data,
  loading: state.userpromo.loading,
  error: state.userpromo.error,
  user_id: state.signin.data.body.data.user.id
});

export default withStyles(styles)(connect(mapStateToProps)(UserPromo));
