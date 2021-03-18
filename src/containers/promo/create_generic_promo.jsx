import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import {Grid,FormControl,InputLabel,Select,MenuItem} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DatePicker from "react-datepicker";
import {env} from '../../../config';
var dateFormat = require('dateformat');
var now = new Date();
import {
    fetchGenericPromoDetail,
    postGenericPromo,
    putGenericPromo,
  } from "../../store/actions/genericpromo";
  import { connect } from "react-redux";
  import LinearProgress from '@material-ui/core/LinearProgress';
  import axios from 'axios';
  import CKEditor from "react-ckeditor-component";

  // import Select, { Async } from 'react-select-v1';
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
    margin: theme.spacing.unit * 2
  }
});

class GenericPromo extends React.Component {
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
    productSaleTypeApplicable: "ALL", //d
    freeShipping: "", //d
    emailVerificationCheck: "", //d
    emailPattern: "",
    successMessage: "",
    termsAndCond:"",
    couponRequestedby:"", 
    requestedDate: new Date(),  //date
    startDate: new Date(), //date
    tags: "",
    globalCount : "",
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
    createdBy : localStorage[env+"_koovs_userid"],
    // userId : localStorage[env + "_koovs_userid"],
    version : "",
    brandIdSet : "",
    genderSet : "",
    subCategorySet : "",
    masterCategorySet : "",
    colorSet : "",
    productCreatedAfter : new Date(),
    productCreatedBefore : new Date(),
    all_brands : [],
    all_master_cat : [],
    all_sub_cat : [],
    all_color : [],
    all_gender : [
                  {"name" : "Kids", "id" : "Kids"},
                  {"name" : "Men", "id" : "Men"},
                  {"name" : "Unisex", "id" : "Unisex"},
                  {"name" : "Women", "id" : "Women"},
                 ],
    allowSlpitPayment : false,
};

  

componentDidMount = () => {
  this.get_meta_data();
  this.setState({
    type : this.props.match.params.type ? (this.props.match.params.type == "create" ? "add" : this.props.match.params.type)  : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
        this.props.dispatch(fetchGenericPromoDetail(this.state.edit_id)).then(() =>
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
                tags: data.promoCodeData[0].tag,
                oneTimeUse: data.oneTimeUse ,
                status: data.status,
                expireDate: data.expireDate != "" ?  new Date(data.expireDate) : new Date(),
                maxNoOfUse: data.maxNoOfUse,
                productSaleTypeApplicable: data.productSaleTypeApplicable, //d
                freeShipping: data.freeShipping , //d
                emailVerificationCheck: data.emailVerificationCheck, //d
                emailPattern:data.emailPattern ? ((data.emailPattern[0] != "" || data.emailPattern[0] != null) ? data.emailPattern.join(",") : "") : "",
                successMessage: data.successMessage,
                couponRequestedby:data.couponRequestedby, 
                requestedDate: data.requestedDate != "" ? new Date(data.requestedDate) : new Date(),  //date
                startDate: data.startDate != "" ? new Date(data.startDate) : new Date(), //date
                isOrderLevelCancel:data.isOrderLevelCancel, //d
                isItemLevelCancel: data.isItemLevelCancel, //d 
                canExchange: data.canExchange, //d 
                allowSlpitPayment: data.allowSlpitPayment, //d 
                termsAndCond:data.termAndCondition,
                canReturn: data.canReturn, //d
                online : data.promoCodeData[0].paymentMethodApplicable.includes("ONLINE") ? "ONLINE" : "" ,
                cod : data.promoCodeData[0].paymentMethodApplicable.includes("COD") ? "COD" : "" ,
                web : data.promoCodeData[0].applicablePlatformSet.includes("WEB") ? "WEB" : "" ,
                msite : data.promoCodeData[0].applicablePlatformSet.includes("MSITE") ? "MSITE" : "" ,
                ios : data.promoCodeData[0].applicablePlatformSet.includes("IOS") ? "IOS" : "" ,
                android : data.promoCodeData[0].applicablePlatformSet.includes("ANDROID") ? "ANDROID" : "" ,
                createdBy : data.createdBy,
                // userId : data.userId,
                version : data.version,
                generateRandom : data.generateRandom,
                txnId : data.txnId,
                brandIdSet :data.promoCodeData[0].brandIdSet != null ? (data.promoCodeData[0].brandIdSet[0] != "" ? data.promoCodeData[0].brandIdSet.join("") : "") : "",
                genderSet :data.promoCodeData[0].genderSet != null ? (data.promoCodeData[0].genderSet[0] != "" ? data.promoCodeData[0].genderSet.join("") : "")  : "",
                subCategorySet : data.promoCodeData[0].subCategorySet != "" ? data.promoCodeData[0].subCategorySet : "",
                masterCategorySet : data.promoCodeData[0].masterCategorySet != "" ? data.promoCodeData[0].masterCategorySet : "",
                colorSet : data.promoCodeData[0].colorSet != "" ? data.promoCodeData[0].colorSet : "",
                productCreatedAfter : (data.promoCodeData[0].productCreatedAfter != "" && data.promoCodeData[0].productCreatedAfter != null) ? new Date(data.promoCodeData[0].productCreatedAfter) : new Date(),
                productCreatedBefore : (data.promoCodeData[0].productCreatedBefore != "" && data.promoCodeData[0].productCreatedBefore != null) ? new Date(data.promoCodeData[0].productBeforeBefore) : new Date(),
            },()=>{
              
            })
        }
        )
      }
  })
};



componentDidUpdate(prevProps, prevState, snapshot){
  var self = this;
    $('#select_brand').select2();
    $('#select_color').select2();
    $('#select_gender').select2();
    $('#select_master_category').select2();
    $('#select_sub_category').select2();

    $("#select_brand").on("select2:select select2:unselecting", function (event) { 
      if(event.target.value != self.state.brandIdSet){
        self.handle_brand(event);
      }
    });
    $("#select_color").on("select2:select select2:unselecting", function (event) { 
      if(event.target.value != self.state.colorSet){
        self.handle_color(event);
      }
    });
    $("#select_gender").on("select2:select select2:unselecting", function (event) { 
      if(event.target.value != self.state.genderSet)
        self.handle_gender(event);
    });
    $("#select_master_category").on("select2:select select2:unselecting", function (event) { 
      if(event.target.value != self.state.masterCategorySet){
        self.handle_master_category(event);
      }
    }); 
    $("#select_sub_category").on("select2:select select2:unselecting", function (event) { 
      if(event.target.value != self.state.subCategorySet){
        self.handle_sub_category(event);
      }
    });
}



handle_brand(e){
  this.setState({ brandIdSet : e.target.value })
}
handle_color(e){
  this.setState({ colorSet : e.target.value })
}
handle_gender(e){
  this.setState({ genderSet : e.target.value })
}

handle_master_category(event){
  this.setState({  masterCategorySet : event.target.value, subCategorySet : ""},()=>{
    if(this.state.masterCategorySet){
      var id = this.state.masterCategorySet
      var sub_cat = this.state.all_master_cat.filter((i) => i.id == id)[0].subCategories
      this.setState({ all_sub_cat : sub_cat})
    }
    else{
      this.setState({ all_sub_cat : [] })
    }
  })
}


handle_sub_category(event){
  this.setState({ subCategorySet : event.target.value })
}




get_meta_data(){
  var self = this;
  axios.get( "/product/getMetadata").then((res) =>{
    var category  = res.data.response.categories.filter((i) => i.name != "Global Category")
    var global_category  = res.data.response.categories.filter((i) => i.name == "Global Category")
    var color = global_category[0].attributeTypes ? global_category[0].attributeTypes.filter((i) => (i.name == "Color"|| i.name == "Colour")) : [];
    self.setState({ 
      all_brands : res.data.response.brand , 
      all_master_cat : category ,
      all_color : color.length > 0 ? color[0].attributeTypeValue : "",
    },()=>{
              var id = self.state.masterCategorySet
              if(id){
                var sub_cat = self.state.all_master_cat.filter((i) => i.id == id)[0].subCategories
                self.setState({ all_sub_cat : sub_cat})
              }
    })
  })
}






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
            this.props.dispatch(fetchGenericPromoDetail(this.state.edit_id)).then(() =>
            this.setState({

            })
            )
          }
      })
    }
}

  handleform(event){
    event.preventDefault();
    var self = this;
    if(this.state.isOrderLevelCancel == this.state.isItemLevelCancel){
        alert("Is Order Level Cancel cannot be same as Is Item Level Cancel")
    }
    else{
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
        "status": this.state.status,
        "startDate": this.state.startDate ? dateFormat(this.state.startDate, "isoDateTime") : "",
        "expireDate": this.state.expireDate ? dateFormat(this.state.expireDate, "isoDateTime") : "",
        "productSaleTypeApplicable": this.state.productSaleTypeApplicable,
        "createdBy": this.state.createdBy,
        // "userId": this.state.userId,
        "couponRequestedby": this.state.couponRequestedby,
        "requestedDate": this.state.requestedDate ? dateFormat(this.state.requestedDate,"isoDateTime") : "",
        "oneTimeUse": this.state.oneTimeUse,
        "type": this.state.typeid,
        "maxNoOfUse": this.state.maxNoOfUse,
        "allowSlpitPayment" : this.state.allowSlpitPayment,
        "freeShipping": this.state.freeShipping,
        "emailVerificationCheck": this.state.emailVerificationCheck,
        "emailPattern": this.state.emailPattern.split(","),
        "successMessage": this.state.successMessage,
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
            "productIdSet": this.state.productIdSet.split(","),
            "tag": this.state.tags,
            "brandIdSet" : this.state.brandIdSet ? [this.state.brandIdSet] : [],
            "genderSet" : this.state.genderSet ? [this.state.genderSet] : [],
            "subCategorySet" : this.state.subCategorySet,
            "masterCategorySet" : this.state.masterCategorySet,
            "colorSet" : this.state.colorSet,
            "productCreatedAfter" : this.state.productCreatedAfter ? dateFormat(this.state.productCreatedAfter,"isoDateTime") : "",
            "productCreatedBefore" : this.state.productCreatedBefore ? dateFormat(this.state.productCreatedBefore,"isoDateTime") : "",
          }
        ],
        "isOrderLevelCancel": this.state.isOrderLevelCancel,
        "isItemLevelCancel": this.state.isItemLevelCancel,
        "canExchange": this.state.canExchange,
        "canReturn": this.state.canReturn,
      }
      if(this.state.edit_id){
          formdata["id"] = this.state.edit_id
          formdata["version"] = this.state.version
      }
      if(this.state.type == "add"){
        formdata["createdBy"] = this.props.userId;
        this.props.dispatch(postGenericPromo(JSON.stringify(formdata))).then((res)=>{
          if(!self.props.error){
            this.props.history.push("/promo/list/generic")
          }
        })
      }
      else if(this.state.type == "edit" && this.state.edit_id){
        formdata["lastUpdatedBy"] = this.props.userId;
        this.props.dispatch(putGenericPromo(this.state.edit_id,JSON.stringify(formdata))).then((res)=>{
          if(!self.props.error){
            this.props.history.push("/promo/list/generic")
          }
        })
      }
    }
  }
  }


  handle_termsAndCond(value){
    var newContent = value.editor.getData();
    this.setState({
      termsAndCond: newContent
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
                {this.state.type == "edit" ? "Edit" : "Create"} Generic Promo 
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
                        {(this.props.error.error.response && 
                          this.props.error.error.response.data && 
                          this.props.error.error.response.data.message)}
                      </p>
                      } 
                    </div>
                  }
              </Typography>
              <Button variant="contained" color="primary" className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={12}>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Promo Code"
                    variant="outlined"
                    value={this.state.code || ""}
                    name="code"
                    onChange={(e) => { this.setState({ code :  (e.target.value) })}}
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">Please select discount type*</InputLabel>
                    <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                    label="Please select discount type*"
                    value={this.state.discount_type}
                    onChange={(e)=> { this.setState({ discount_type :  e.target.value })}}
                    fullWidth
                    helperText="Please select discount type*"
                    required
                    >
                    <MenuItem value="1">Absolute Percent</MenuItem>
                    <MenuItem value="2">Absolute Value</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                
                {this.state.discount_type == "1" &&
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Absolute Percent"
                    variant="outlined"
                    value={this.state.absolute_percent || ""}
                    name="absolute_percent"
                    type="number"
                    onChange={(e) => { this.setState({ absolute_percent :  (e.target.value) })}}
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
                   variant="outlined"
                    label="Absolute Value"
                    value={this.state.absolute_value || ""}
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
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="demo-simple-select-outlined-label">Select One Time Use*</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="Select One Time Use*"
                        value={this.state.oneTimeUse}
                        onChange={(e)=> { this.setState({ oneTimeUse :  e.target.value })}}
                        fullWidth
                        required
                      >
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                      </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                 <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">Select Status*</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.status}
                    onChange={(e)=> { this.setState({ status :  e.target.value })}}
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
                        variant="outlined"
                        selected={new Date(this.state.expireDate)}
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
                    label="Enter Max No of Use"
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
                    label="Enter Global Count"
                    value={this.state.globalCount || ""}
                    type="number"
                    name="globalCount"
                    onChange={(e) => { this.setState({ globalCount :  (e.target.value) })}}
                    required={false}
                    fullWidth
                  />
                </Grid>
                 <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Deal Ids"
                    variant="outlined"
                    value={this.state.productIdSet || ""}
                    name="productIdSet"
                    onChange={(e) => { this.setState({ productIdSet :  (e.target.value) })}}
                    fullWidth
                  />
                </Grid>
                              
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Please Min Amount Applicable At *</InputLabel>
                    <Select
                     label="Select Min Amount applicable at*"
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                      value={this.state.minimumAmountApplicableOn}
                      onChange={(e)=> { this.setState({ minimumAmountApplicableOn :  e.target.value })}}
                      fullWidth
                     required
                    >
                    <MenuItem value="ITEM">Minimum subtotal of individual item</MenuItem>
                    <MenuItem value="CART">Minimum cart total</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Min Amount"
                    value={this.state.minimumAmount || ""}
                    name="minimumAmount"
                    onChange={(e) => { this.setState({ minimumAmount :  (e.target.value) })}}
                    fullWidth
                    variant="outlined"
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
                    label="Enter Max Amount"
                    value={this.state.maximumAmount || ""}
                    name="maximumAmount"
                    onChange={(e) => { this.setState({ maximumAmount :  (e.target.value) })}}
                    fullWidth
                    variant="outlined"
                    type="number"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250",
                    min : this.state.minimumAmount
                    }}
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Enter Max Quantity"
                    variant="outlined"
                    value={this.state.maxQuantity || ""}
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
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Select Type*</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.typeid}
                    onChange={(e)=> { this.setState({ typeid :  e.target.value })}}
                    margin="normal"
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
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Please Select Discount Override * </InputLabel>
                    <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                    value={this.state.productSaleTypeApplicable}
                    onChange={(e)=> { this.setState({ productSaleTypeApplicable :  e.target.value })}}
                    fullWidth
                    label="Please Select Discount Override *"
                    required
                    >
                    <MenuItem value="NON_SALE">Non Sale </MenuItem>
                    <MenuItem value="SALE">Sale</MenuItem>
                    <MenuItem value="ALL">All</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Please Select Allow Split Payments</InputLabel>
                    <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                    value={this.state.allowSlpitPayment}
                    onChange={(e)=> { this.setState({ allowSlpitPayment :  e.target.value })}}
                    fullWidth
                    label="Please Select Allow Split Payments"
                    >
                    <MenuItem value="">Select Allow Split Payments </MenuItem>
                    <MenuItem value="true">True </MenuItem>
                    <MenuItem value="false">False</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4} sm={4}>
                <FormControl component="fieldset" >
                    <FormLabel  component="legend">Applicable Payment Method</FormLabel>
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
                <Grid item xs={4} sm={4}>
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
                  <InputLabel id="demo-simple-select-outlined-label">Select Free Shipping*</InputLabel>
                    <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                    value={this.state.freeShipping}
                    onChange={(e)=> { this.setState({ freeShipping :  e.target.value })}}
                    fullWidth
                    label="Select Free Shipping*"
                    required
                    >
                    <MenuItem value="false">No </MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Select Email Verification*</InputLabel>
                    <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                    value={this.state.emailVerificationCheck}
                    onChange={(e)=> { this.setState({ emailVerificationCheck :  e.target.value })}}
                    fullWidth
                    label="Select Email Verification*"
                    required
                    >
                    <MenuItem value="0">No </MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    variant="outlined"
                    label="Enter Email Pattern"
                    value={this.state.emailPattern || ""}
                    name="emailPattern"
                    onChange={(e) => { this.setState({ emailPattern :  (e.target.value) })}}
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                  variant="outlined"
                    label="Cart Message"
                    value={this.state.successMessage || ""}
                    name="successMessage"
                    onChange={(e) => { this.setState({ successMessage :  (e.target.value) })}}
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>

                 <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    variant="outlined"
                    label="Pay U Offer Key"
                    value={this.state.offer_key || ""}
                    name="offer_key"
                    onChange={(e) => { this.setState({ offer_key :  (e.target.value) })}}
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    variant="outlined"
                    label="Coupon Requested By"
                    value={this.state.couponRequestedby || ""}
                    name="couponRequestedby"
                    onChange={(e) => { this.setState({ couponRequestedby :  (e.target.value) })}}
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>


                <Grid item xs={4} sm={4} className={classes.control}>
                <label className="datepicker_label">Enter Requested Date</label>
                  <DatePicker
                        selected={new Date(this.state.requestedDate)}
                        onChange={(date) => { this.setState({ requestedDate :  (date) }) }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        placeholderText="Enter Requested Date"
                      />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                    <label className="datepicker_label">Enter Start Date</label>
                    <DatePicker
                        selected={new Date(this.state.startDate)}
                        onChange={(date) => { this.setState({ startDate :  (date) }) }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        placeholderText="Enter Start Date"
                      />
                  
                </Grid>

                 <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Tag"
                    variant="outlined"
                    value={this.state.tags || ""}
                    name="tags"
                    onChange={(e) => { this.setState({ tags :  (e.target.value) })}}
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid> 
                

                <Grid item xs={4} sm={4} className={classes.control}>
                    <FormControl fullWidth variant="outlined" >
                       <InputLabel id="demo-simple-select-outlined-label">Please Select Is Order Level Cancel</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.isOrderLevelCancel}
                    onChange={(e)=> { this.setState({ isOrderLevelCancel :  e.target.value })}}
                    fullWidth
                    label="Please Select Is Order Level Cancel"
                    required
                    >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="demo-simple-select-outlined-label">Select Is Item Level Cancel*</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.isItemLevelCancel}
                    onChange={(e)=> { this.setState({ isItemLevelCancel :  e.target.value })}}
                    fullWidth
                    required
                    label="Select Is Item Level Cancel*"
                    >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                    <FormControl variant="outlined" fullWidth>
                       <InputLabel id="demo-simple-select-outlined-label">Please select Can Exchange</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.canExchange}
                    onChange={(e)=> { this.setState({ canExchange :  e.target.value })}}
                    fullWidth
                    label="Please select Can Exchange"
                    required
                    >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                    <FormControl variant="outlined" fullWidth>
                       <InputLabel id="demo-simple-select-outlined-label">Please Select can return</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
                    value={this.state.canReturn}
                    onChange={(e)=> { this.setState({ canReturn :  e.target.value })}}
                    fullWidth
                    required
                    label="Please Select can return"
                    >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                      select
                      id="select_brand"
                      className="select_margin_top"
                      value={this.state.brandIdSet ? this.state.brandIdSet : ""}
                      onChange={this.handle_brand.bind(this)}
                      SelectProps={{
                      native: true,
                      }}
                      margin="normal"
                      fullWidth
                      helperText="Please select brand name*"
                      >
                      <option value="">Select Brand Name</option>
                      {this.state.all_brands.map(function(i,index){
                          return(<option key={index} value={i.brandId} disabled={i.status == "ACTIVE" ? false : true}>{i.brandName}</option>)
                      },this)}
                      </TextField>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Please Select Master Category*</InputLabel>
                  <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.masterCategorySet || ""}
                      onChange={this.handle_master_category.bind(this)}
                      label="Please Select Master Category*"
                      >
                      {this.state.all_master_cat.map(function(i,index){
                        return(
                          <MenuItem key={index} value={i.id}>{i.name}</MenuItem>
                        )
                        },this)
                      }
                  </Select>
                </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4} className={classes.control}>
                      <FormControl fullWidth variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">"Please Select Parent Category*</InputLabel>
                      <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={this.state.subCategorySet || ""}
                            onChange={this.handle_sub_category.bind(this)}
                            label={"Please Select Parent Category*"}
                          >
                          {this.state.all_sub_cat.map(function(i,index){
                            return(
                              <MenuItem key={index} value={i.id}>{i.name}</MenuItem>
                            )
                          },this)
                          }
                      </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={4} className={classes.control}>
                       <FormControl fullWidth variant="outlined">
                      <InputLabel id="demo-simple-select-outlined-label">Please Select Color*</InputLabel>
                      <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={this.state.colorSet || ""}
                          onChange={this.handle_color.bind(this)}
                          name="color"
                          label="Please Select Color*"
                          >
                            {this.state.all_color.map(function(i,index){
                            return(
                              <MenuItem key={index} value={i.id} data-colorname={i.name}>{i.name}</MenuItem>
                            )
                            },this)}
                      </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={4} className={classes.control}>
                      <FormControl fullWidth variant="outlined">
                      <InputLabel id="demo-simple-select-outlined-label">Please Select Gender*</InputLabel>
                      <Select
                         labelId="demo-simple-select-outlined-label"
                         id="demo-simple-select-outlined"
                          value={this.state.genderSet || ""}
                          onChange={this.handle_gender.bind(this)}
                          fullWidth
                          name="gender"
                          label="Please Select Gender*"
                          >
                            {this.state.all_gender.map(function(i,index){
                            return(
                              <MenuItem key={index} value={i.id} data-colorname={i.name}>{i.name}</MenuItem>
                            )
                            },this)}
                      </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={4} className={classes.control}>
                    <label className="datepicker_label">Enter Product Created After Date</label>
                      <DatePicker
                        selected={new Date(this.state.productCreatedAfter)}
                        onChange={(date) => { this.setState({ productCreatedAfter :  (date) }) }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        placeholderText="Enter Product Created After Date"
                      />
                    </Grid>
                    <Grid item xs={4} sm={4} className={classes.control}>
                    <label className="datepicker_label">Enter Product Created Before Date</label>
                      <DatePicker
                        selected={new Date(this.state.productCreatedBefore)}
                        onChange={(date) => { this.setState({ productCreatedBefore :  (date) }) }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        placeholderText="Enter Product Created Before Date"
                      />
                    </Grid>
                    <Grid item xs={8} sm={8 } className={classes.control} style={{"marginBottom":"30px"}}>
                      <label style={{ "color" : "#999" , "lineHeight":"2", }}>Terms & Conditions</label>
                        <CKEditor
                          id="editor"
                          activeClass="p10"
                          content={this.state.termsAndCond || ""}
                          events={{
                            "change": this.handle_termsAndCond.bind(this)
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
  promo_data: state.genericpromo.data,
  loading: state.genericpromo.loading,
  error: state.genericpromo.error,
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(GenericPromo));