import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles,Select,InputLabel,MenuItem } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DatePicker from "react-datepicker";
var dateFormat = require('dateformat');
import axios from "axios";
var now = new Date();
import {
  fetchPromotionalPromoDetail,
  postPromotionalPromo,
  putPromotionalPromo,
} from "../../store/actions/promotionalpromo";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import CKEditor from "react-ckeditor-component";
import Select1, { Async } from 'react-select-v1';

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  control:{
    padding:"15px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  },
  datepicker_label: {
    paddingTop: "20px",
    marginBottom: "-50px",
    display: "block",
    color: "rgba(0, 0, 0, 0.54)",
    marginTop: "0px"
  }
});

class PromotionalPromo extends React.Component {
  state = {
    ruleCount: 1,
    type: "add",
    edit_id: "",
    base_fields: {
      "code": { "type": "string", "required": "true" },
      "productSaleTypeApplicable": { "type": "select", "values": { "NON_SALE": "NON_SALE", "SALE": "SALE", "ALL": "ALL" }, "required": "true" },
      "successMessage": { "type": "string", "required": "true" },
      "startDate": { "type": "date", "required": "true" },
      "expireDate": { "type": "date", "required": "true" },
      "status": { "type": "select", "values": { "ACTIVE": "ACTIVE", "INACTIVE": "INACTIVE" }, "required": "true" },
      "couponRequestedby": { "type": "string", "required": "true" },
      "requestedDate": { "type": "date", "required": "true" },
      "oneTimeUse": { "type": "select", "values": { "YES": "true", "NO": "false" }, "required": "true" },
      "type": { "type": "select", "values": { "BUYXGETY": "BUYXGETY" }, "required": "true" },
      "maxNoOfUse": { "type": "integer", "required": "true" },
      "globalCount": { "type": "integer", "required": "false" },
      "freeShipping": { "type": "select", "values": { "YES": "true", "NO": "false" }, "required": "true" },
      "emailVerificationCheck": { "type": "select", "values": { "YES": "1", "NO": "0" }, "required" : "true" },
      "emailPattern": { "type": "string" },
      "termAndCondition":{"type":"textArea"},
      "isOrderLevelCancel": { "type": "select", "values": { "NO": "false", "YES": "true" }, "required": "true", "select": "false" },
      "isItemLevelCancel": { "type": "select", "values": { "YES": "true", "NO": "false" }, "required": "true", "select": "false" },
      "canExchange": { "type": "select", "values": { "YES": "true", "NO": "false" }, "required": "true", "select": "false" },
      "canReturn": { "type": "select", "values": { "YES": "true", "NO": "false" }, "required": "true", "select": "false" },
    },
    nonMandatory_fields: {
      "minQuantityCheck": { "type": "select", "values": { "NO": "false", "YES": "true" }, "required": "true" },
      "minAmountCheck": { "type": "select", "values": { "NO": "false", "YES": "true" }, "required": "true" },
    },
    promoCodeData: {
      "maxQuantity": { "type": "integer" },
      "paymentMethodApplicable": { "type": "checkbox", "values": { "ONLINE": "ONLINE", "COD" : "COD" }, "required": "true" },
      "minimumAmountApplicableOn": { "type": "select", "values": { "CART": "CART" }, "required": "true" },
      "minimumAmount": { "type": "integer", "required": "true" },
      "maximumAmount": { "type": "integer" },
      "applicablePlatformSet": { "type": "checkbox", "values": { "MSITE": "MSITE", "WEB": "WEB", "ANDROID": "ANDROID", "IOS": "IOS" }, "required": "true" }
    },
    // promoLevelKeys :["generateRandom", "status" ,"startDate", "expireDate", "productSaleTypeApplicable", 
    //               "createdBy", "couponRequestedby", "requestedDate", "oneTimeUse", "type","maxNoOfUse", "freeShipping", 
    //               "emailVerificationCheck", "emailPattern", "successMessage", "isOrderLevelCancel","isItemLevelCancel","canExchange","canReturn"],
    usable_templates: ["CartBuyXGetOffOnYCouponGreaterQuantity",
      "CartBuyXGetFixedYAmountCoupon",
      "CartBuyXGetYFreeCoupon",
      "CartItemLevelDiscount",
      // "CartBuyXGetFixedYAmountCouponFNF",
      "CartBuyXGetSpecificDiscountOffOnYCoupon",
      "CartBuyXGetOffOnYCouponUsageGroupMultipleRules",
      "CartBuyXGetOffOnYCouponGreaterQuantityMultipleRules",
    "CartBuyXGetYTagCoupon"],
    multiple_rule_teplate: [
      "CartBuyXGetFixedYAmountCoupon",
      "CartBuyXGetYFreeCoupon",
      "CartBuyXGetSpecificDiscountOffOnYCoupon",
      "CartBuyXGetOffOnYCouponGreaterQuantityMultipleRules",
      "CartItemLevelDiscount",
      "CartBuyXGetOffOnYCouponUsageGroupMultipleRules",
      "CartBuyXGetYTagCoupon"
    ],
    formData: {
      requestedDate: dateFormat(now, "isoUtcDateTime"),
      startDate: dateFormat(now, "isoUtcDateTime"),
      expireDate: dateFormat(now, "isoUtcDateTime"),
    },
    showFreeText: "",
    promoData: [],
    available_templates: [],
    selected_template_id: "",
    selected_template_fields: [],
    all_fields: {},
    promo_fields: {},
    promo_fields_array: [],
    name: "",
    message: "",
    all_master_cat: {},
    all_sub_cat : {},
  };



  componentDidMount = () => {
    this.getTemplate();
    this.setState({
      type: this.props.match.params.type ? (this.props.match.params.type == "create" ? "add" : this.props.match.params.type)  : "add",
      edit_id: this.props.match.params.id ? this.props.match.params.id : ""
    })
  };
 


  getTemplate() {
    var self = this;
    axios.get("/rules/v1/template").then(function (res) {
      self.setState({ available_templates: res.data.response }, () => {
        if (self.state.type == "edit" && self.state.edit_id) {
          self.props.dispatch(fetchPromotionalPromoDetail(self.state.edit_id)).then(() => {
            var data = self.props.promo_data.data.response;

            if (self.state.available_templates.length > 0) {
              for (let item of self.state.available_templates) {
                if (item.templateId == data.templateId) {
                  let selected_template_fields = [];
                  selected_template_fields.push(item.fields)
                  self.setState({
                    name: item.templateId,
                    message: item.description, selected_template_fields: selected_template_fields[0]
                  }, () => {
                    self.setTemplateId()
                    self.create_fields_json();
                  })
                }
              }
              self.setState({ formData: data, promoData: data['promoCodeData'] },
                () => {
                  if (self.state.promoData.length > 1) {
                    let promo_fields_array = self.state.promo_fields_array;
                    for (let i = 0; i < self.state.promoData.length; i++) {
                      if (i > 0) {
                        promo_fields_array.push(self.state.promo_fields);
                      }
                    }
                    self.setState({ promo_fields_array })
                  }
                })
            }
          }
          )
        }
      })
    })
  }

  setTemplateId() {
    for (let item of this.state.available_templates) {
      if (item.templateId == this.state.name) {
        this.setState({ selected_template_id: item.id})
      }
    }
  }

  UNSAFE_componentWillReceiveProps = (newProps) => {
    if (newProps.match.params.type != this.props.match.params.type) {
      this.setState({ type: newProps.match.params.type }, () => {
        if (this.state.type == "add") {
          this.setState({
            type: "add",
            edit_id: "",
          })
        }
      })
    }
    if (newProps.match.params.id != this.props.match.params.id) {
      this.setState({ id: newProps.match.params.id }, () => {
        if (this.state.type == "edit" && this.state.edit_id) {
          this.props.dispatch(fetchPromotionalPromoDetail(this.state.edit_id)).then(() =>
            this.setState({

            })
          )
        }
      })
    }
  }

  handle_template = (value) => {
    if(value){
      this.setState({ selected_template_id: value }, () => {
        var selected_template_fields = [];
        var name = "";
        var message = ""
        this.state.available_templates.map(function (i, index) {
          if (i.id == this.state.selected_template_id) {
            name = i.templateId
            message = i.description
            selected_template_fields.push(i.fields)
          }
        }, this)
        this.setState({
          selected_template_fields: selected_template_fields[0],
          name: name,
          message: message
        }, () => {
          this.create_fields_json();
        })
      })
    }
  }


  create_fields_json() {
    let copy_base_fields = JSON.parse(JSON.stringify(this.state.base_fields));
    let display_fields = copy_base_fields;;
    let display_promoCodeData = JSON.parse(JSON.stringify(this.state.promoCodeData));
    var fields_array = JSON.parse(JSON.stringify(this.state.selected_template_fields));
    Object.keys(fields_array).map((key, i) => {
      if (fields_array[key].promoLevelKey == true) {
        if (!display_fields[key]) {
          if (this.state.nonMandatory_fields[key]) {
            display_fields[key] = this.state.nonMandatory_fields[key];
          }
          else {
          }
        }
      }
      else {
        if (!display_promoCodeData[key]) {
          if (key == "maximumDiscountAmount" || key == "discount" || key == "minQuantity" || key == "minimumAmount") {
            display_promoCodeData[key] = { "type": "integer", "required": "true" }
          }
          else if (key == "priority") {
            if (this.state.multiple_rule_teplate.indexOf(this.state.name) > -1) {
              display_promoCodeData[key] = { "type": "select", "values": { "10": "10", "9": "9", "8": "8", "7": "7", "6": "6", "5": "5", "4": "4", "3": "3", "2": "2" }, "required": "true" }
            }
          }
          else if (key == "colorSet" || key == "brandIdSet" || key == "masterCategorySet" || key == "subCategorySet") {	
            display_promoCodeData[key] = { "type": "select", "values": {} }	
          }
          else if (key == "genderSet") {
            display_promoCodeData[key] = { "type": "select", "values": { "Men": "Men", "Women": "Women", "Unisex": "Unisex", "Kids": "Kids" } }
          }
          else if (key == "isPercent") {
            display_promoCodeData[key] = { "type": "select", "values": { "NO": "false", "YES": "true" }, "required": "true" }
          }
          else if (key == "yType") {
            display_promoCodeData[key] = { "type": "select", "values": { "productId": "productId", "freeText": "freeText" }, "required": "true" }
          }
          else if (key == "batchCartValue" || key == "batchQuantity" || key == "batchFree") {
            display_promoCodeData[key] = { "type": "string", "required": "true" }
          }
          else {
            display_promoCodeData[key] = { "type": "string" }
          }
        }
      }
    })
    let promo_fields_array = [];
    promo_fields_array.push(display_promoCodeData);
    if(this.state.name === "CartBuyXGetYTagCoupon"){
      delete display_fields.isOrderLevelCancel.values.NO;
      delete display_fields.isItemLevelCancel.values.YES;
      delete display_fields.canExchange.values.YES;
      delete display_fields.canReturn.values.YES;
    }
    this.setState({ all_fields: display_fields, promo_fields: display_promoCodeData, promo_fields_array },
      () => {
        // console.log(this.state.promo_fields_array);
        this.get_meta_data();
      })
  }

  handle_edit = (i, event) => {
    let formData = this.state.formData;
    if (i == 'startDate' || i == "expireDate" || i == "requestedDate") {
      formData[i] = new Date(event);
    }
    else if(i=="termAndCondition"){
      formData[i] = event.editor.getData();
    }
    else {
      formData[i] = event.target.value;
    }
    // var data = this.state.all_fields
    // data[i].data = event.target.value
    this.setState({ formData })
  }


  handle_edit_promo = (i, name, event) => {
    let promoData = this.state.promoData[i];
    if (!promoData) {
      promoData = {}
    }
    if (name == "brandIdSet" || name == "lineIdSet" || name == "genderSet" || name == "productIdSet") {
      promoData[name] = [event.target.value];
    }
    else if (name == "masterCategorySet") {
      promoData[name] = event.target.value;
      // let promo_fields_array = JSON.parse(JSON.stringify(this.state.promo_fields_array)); // for creating a copy
      // var sub_cat = this.state.all_master_cat.filter((i) => i.id == event.target.value)[0]
      // let subCategoryObj = {}
      // sub_cat && sub_cat.subCategories && sub_cat.subCategories.forEach(element => {
      //   subCategoryObj[element.name] = element.id;
      //   // return obj
      // });
      // promo_fields_array[i]["subCategorySet"].values = subCategoryObj
      // this.setState({ promo_fields_array }, () => {
      // })
    }
    else {
      promoData[name] = event.target.value;
    }
    let newPromoData = this.state.promoData;
    newPromoData[i] = promoData;
    this.setState({ promoData: newPromoData }, () => {
      // console.log(this.state.promoData);
    })
    // var data = this.state.promo_fields
    // data[i].data = event.target.value
    // this.setState({ promo_fields :  data })
  }

  handle_checkbox(value, name, index, i, event) {
    let promoData = this.state.promoData[i];
    // console.log(promoData)
    if (!promoData) {
      promoData = {}
    }
    // var data = this.state.promo_fields
    var selected_values = promoData[name] ? promoData[name] : [];
    if (selected_values.includes(value)) {
      var updated_data = selected_values.filter((i) => i != value)
      selected_values = updated_data
    }
    else {
      selected_values.push(value)
    }
    // data[i].data = selected_values
    promoData[name] = selected_values;
    let newPromoData = this.state.promoData;
    newPromoData[i] = promoData;
    this.setState({ promoData: newPromoData }, () => {
      // console.log(this.state.promoData, i)
    })
  }

  handleform(event) {
    event.preventDefault();
    var self = this;
    let formData = this.state.formData
    formData['templateId'] = this.state.name;
    if(formData.emailPattern == ""){
      formData["emailPattern"] = null;
    }
    else if(formData.emailPattern && formData.emailPattern.length > 0){
      formData["emailPattern"] = formData.emailPattern.split(",");
    }
    // if (this.state.edit_id) {
    //   formData["id"] = this.state.edit_id
    //   formData["version"] = this.state.version
    // }

    if(formData.termAndCondition == "<p><br></p>"){
      formData["termAndCondition"] = "";
    }

    formData['promoCodeData'] = []
    var pcdata = this.state.promoData
    pcdata.map(function(i,index){
      if(!i.priority){
        i['priority'] = 10;
      }
      return i
    })
    formData['promoCodeData'] = pcdata

    let applicablePlatformSet_error = 0;
    let paymentMethodApplicable_error = 0;
    if(this.state.promoData.length > 0){
      this.state.promoData.map(function(i,index){
        if(!i.applicablePlatformSet || i.applicablePlatformSet.length == 0 || i.applicablePlatformSet == ""){
          applicablePlatformSet_error = applicablePlatformSet_error + 1;
        }
        if(!i.paymentMethodApplicable || i.paymentMethodApplicable.length == 0 || i.paymentMethodApplicable == ""){
          paymentMethodApplicable_error = paymentMethodApplicable_error + 1;
        }
      })
    }

    if(applicablePlatformSet_error >= 1 ){
      alert("Please Select Applicable Platform Field.")
    }
    else if (paymentMethodApplicable_error >= 1){
      alert("Please Select Payment Method Applicable Field.")
    }
    else{
      if (this.state.type == "add") {
        formData["createdBy"] = this.props.userId;
        this.props.dispatch(postPromotionalPromo(JSON.stringify(formData))).then((res) => {
          if (!self.props.error) {
            this.props.history.push("/promo/list/promotional")
          }
        })
      }
      else if (this.state.type == "edit" && this.state.edit_id) {
        formData["lastUpdatedBy"] = this.props.userId;
        this.props.dispatch(putPromotionalPromo(this.state.edit_id, JSON.stringify(formData))).then((res) => {
          if (!self.props.error) {
            this.props.history.push("/promo/list/promotional")
          }
        })
      }
    }
  }

  get_meta_data() {
    var self = this;
    axios.get("/product/getMetadata").then((res) => {
      var category = res.data.response.categories.filter((i) => i.name == "Fashion")
      var subcategory = res.data.response.categories.filter((i) => i.name == "Fashion")[0].attributeTypes.filter((i) => i.name == "Type")[0].attributeTypeValue
      var global_category = res.data.response.categories.filter((i) => i.name == "Global Category")
      var color = global_category[0].attributeTypes ? global_category[0].attributeTypes.filter((i) => (i.name == "Color" || i.name == "Colour")) : [];
      this.setState({ all_master_cat: category[0].subCategories }, () => {
        // if (this.state.type == "edit") {
        //   let promo_fields_array = self.state.promo_fields_array;
        //   for (let i = 0; i < promo_fields_array.length; i++) {
        //     if (self.state.promoData[i].masterCategorySet) {
        //       let id = self.state.promoData[i].masterCategorySet
        //       var sub_cat = self.state.all_master_cat.filter((i) => i.id == id)[0]
        //       let subCategoryObj = {}
        //       sub_cat && sub_cat.subCategories && sub_cat.subCategories.forEach(element => {
        //         subCategoryObj[element.name] = element.id;
        //         // return obj
        //       });
        //       promo_fields_array[i]["subCategorySet"].values = subCategoryObj
        //     }
        //   }
        //   self.setState({ promo_fields_array })
        // }
      })
      let brand = res.data.response.brand;
      let brandObj = {}
      brand.forEach(element => {
        brandObj[element.brandName] = element.brandId;
        // return obj
      });
      let categoryObj = {}
      category[0].subCategories.forEach(element => {
        categoryObj[element.name] = element.id;
        // return obj
      });
      let subcategoryObj = {}
      subcategory.forEach(element => {
        subcategoryObj[element.name] = element.id;
        // return obj
      });
      let colorObj = {}
      if (color.length > 0) {
        color[0].attributeTypeValue.forEach(element => {
          colorObj[element.name] = element.id;
          // return obj
        });
      }
      let promo_fields = this.state.promo_fields;

      promo_fields['brandIdSet'].values = brandObj;
      promo_fields['masterCategorySet'].values = categoryObj;
      promo_fields['subCategorySet'].values = subcategoryObj;
      promo_fields['colorSet'].values = colorObj;
      self.setState({
        promo_fields
      }, () => {
        var id = self.state.promoData.masterCategorySet
        // if(id){
        //   var sub_cat = self.state.all_master_cat.filter((i) => i.id == id)[0].subCategories
        //   self.setState({ all_sub_cat : sub_cat})
        // }
      })
    })
  }

  addPromoFields = () => {
    // console.log(this.state.promo_fields_array, this.state.promo_fields)
    let promo_fields_array = this.state.promo_fields_array;
    promo_fields_array.push(this.state.promo_fields);
    let promoData = this.state.promoData;
    promoData.push({});
    this.setState({ promo_fields_array, promoData })
  }

  removePromo = (i) => {
    let promo_fields_array = this.state.promo_fields_array;
    promo_fields_array.splice(i, 1);
    let promoData = this.state.promoData;
    promoData.splice(i, 1);
    this.setState({ promo_fields_array, promoData })
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
              {this.state.type == "edit" ? "Edit" : "Create"} Promotional Promo
              {this.props.error &&
                <div className="error_container">
                  {(typeof (this.props.error.error) != "object") &&
                    <p>
                      <Error className="vertical_align_error" /> &nbsp;
                      {this.props.error.error}
                    </p>
                  }
                  {(typeof (this.props.error.error) == "object") &&
                    <p>
                      <Error className="vertical_align_error" /> &nbsp;  : &nbsp;
                      {(this.props.error.error.response.data.message)}
                    </p>
                  }
                </div>
              }
             
            </Typography>
            <Button variant="contained" color="primary" onClick={(e) => { this.props.history.goBack() }}> Go Back </Button>
            </Grid>
            <form onSubmit={this.handleform.bind(this)}>
              <Paper className={classes.paper}>
                <Grid container spacing={12}>
                  {this.state.type == 'add' && <Grid item xs={12} sm={12}>
                  <FormControl variant="outlined" fullWidth className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label-template">Select Promo Template*</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label-template"
                      id="demo-simple-select-outlined-template"
                      label="Select Promo Template*"
                      value={this.state.selected_template_id}
                      onChange={e => this.handle_template(e.target.value)}
                      required
                    >
                      {this.state.available_templates.map((item, index) => {
                        return (
                          this.state.usable_templates.includes(item.templateId) &&
                          <MenuItem value={item.id} key={"MenuItems_"+index} >{item.templateId}</MenuItem>
                        )
                      })
                      }
                    </Select>
                    </FormControl>
                  </Grid>}
                  {this.state.selected_template_id &&
                    <div style={{ textAlign: "center", display: "block", width: "100%" }}>
                      <p>{this.state.selected_template_id}</p>
                      <p>{this.state.name}</p>
                      <p>{this.state.message}</p>
                    </div>
                  }
                  <Grid container spacing={12}>
                    {Object.keys(this.state.all_fields).map(function (i, index) {
                      return (
                        <React.Fragment key={"form_"+index}>
                          {(this.state.all_fields[i].type == "integer") &&
                            <Grid item xs={4} sm={4} className={classes.control}>
                              <TextField
                                label={i}
                                variant="outlined"
                                type="number"
                                min="0"
                                name={i}
                                fullWidth
                                value={this.state.formData[i]}
                                onChange={e => this.handle_edit(i, e)}
                                required={(this.state.all_fields[i].required == "true" || this.state.all_fields[i].required == true) ? true : ((this.state.name == "CartBuyXGetOffOnYCouponUsageGroupMultipleRules" && i == "globalCount") ? true : false)}
                              />
                            </Grid>
                          }
                          {(this.state.all_fields[i].type == "string" || this.state.all_fields[i].type == "Boolean") &&
                            <Grid item xs={4} sm={4} className={classes.control}>
                              <TextField
                                label={i}
                                variant="outlined"
                                fullWidth
                                type="text"
                                name={i}
                                value={this.state.formData[i]}
                                onChange={e => this.handle_edit(i, e)}
                                required={(this.state.all_fields[i].required == "true" || this.state.all_fields[i].required == true) ? true : false}
                              />
                            </Grid>
                          }
                          {(this.state.all_fields[i].type == "date" || this.state.all_fields[i].type == "DateTime") &&
                            <Grid item xs={4} sm={4} className={classes.control}>
                              <div >
                                <label className={classes.datepicker_label}>{i + " *"}</label>
                                <DatePicker
                                  selected={this.state.formData[i] ? new Date(this.state.formData[i]) : new Date()}
                                  onChange={e => this.handle_edit(i, e)}
                                  showTimeSelect
                                  timeFormat="HH:mm"
                                  dateFormat="MMMM d, yyyy h:mm aa"
                                  required={(this.state.all_fields[i].required == "true" || this.state.all_fields[i].required == true) ? true : false}
                                  timeCaption="Time"
                                />
                              </div>
                            </Grid>
                          }
                          {(this.state.all_fields[i].type == "textArea") &&
                              <Grid item xs={4} sm={4} className={classes.control}>
                                 <label style={{ "color" : "#999" , "lineHeight":"2", }}>Terms & Conditions</label>
                                <CKEditor
                                    id="editor"
                                    activeClass="p10"
                                    style={{ "height" : "100px","marginBottom":"10px" }}
                                    content={this.state.formData && this.state.formData['termAndCondition'] || ""}
                                    events={{
                                      "change": this.handle_edit.bind(this,i)
                                    }}
                                    placeholder={"Enter Terms & Conditions"}
                                />
                              </Grid>
                            }
                        </React.Fragment>
                      )
                    }, this)
                    }
                  </Grid>

                  {this.state.promo_fields_array.map((item, i) => {
                    return (
                      <Grid container spacing={24} key={"container_"+i} >
                        {this.state.selected_template_id &&
                          <div style={{ width: "100%", textAlign: "center", fontSize: "21px", fontWeight: "600", minHeight: "2px", backgroundColor: "#000", margin: "60px" }}></div>
                        }
                        {Object.keys(item).map((fields, index) => {
                          if (fields == "isPercent" && this.state.promoData && this.state.promoData[i]) {
                            // console.log(this.state.promoData[i][fields])
                          }
                          return (
                            <React.Fragment key={"select_"+index}>
                              {(item[fields].type == "select") &&
                                <Grid item xs={4} sm={4} className={classes.control}>
                                  <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="">{fields}</InputLabel>
                                  <Select
                                    label={fields}
                                    labelId={"label"+ fields}
                                    value={(this.state.promoData[i] && this.state.promoData[i][fields]) ? this.state.promoData[i][fields] : ""}
                                    onChange={e => this.handle_edit_promo(i, fields, e)}
                                    required={(item[fields].required == "true" || item[fields].required == true) ? true : false}
                                  >
                                    <MenuItem value="">{fields}</MenuItem>
                                    {Object.keys(item[fields].values).map(function (j, jindex) {
                                      return (
                                        <MenuItem value={item[fields].values[j]} key={jindex + j}>{j}</MenuItem>
                                      )
                                    }, this)
                                    }
                                  </Select>
                                  </FormControl>
                                </Grid>
                              }
                              {(item[fields].type == "integer") &&
                                <Grid item xs={4} sm={4} className={classes.control}>
                                  <TextField
                                    label={fields}
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    name={fields}
                                    min="0"
                                    value={(this.state.promoData[i] && this.state.promoData[i][fields]) ? this.state.promoData[i][fields] : ""}
                                    onChange={e => this.handle_edit_promo(i, fields, e)}
                                    required={(item[fields].required == "true" || item[fields].required == true) ? true : false}
                                  />
                                </Grid>
                              }
                              {(item[fields].type == "string" || item[fields].type == "Collection" || item[fields].type == "Boolean") && (fields != "yFreeText" && fields != "yProductId") &&
                                <Grid item xs={4} sm={4} className={classes.control}>
                                  <TextField
                                    label={fields}
                                    variant="outlined"
                                    fullWidth
                                    type="text"
                                    name={fields}
                                    value={(this.state.promoData[i] && this.state.promoData[i][fields]) ? this.state.promoData[i][fields] : ""}
                                    onChange={e => this.handle_edit_promo(i, fields, e)}
                                    required={(item[fields].required == "true" || item[fields].required == true) ? true : false}
                                  />
                                </Grid>
                              }
                              {(fields == "yFreeText" && this.state.promoData[i] && this.state.promoData[i].yType == "freeText") &&
                                <Grid item xs={4} sm={4} className={classes.control}>
                                  <TextField
                                    label="yFreeText"
                                    variant="outlined"
                                    fullWidth
                                    type="text"
                                    name="yFreeText"
                                    value={(this.state.promoData[i] && this.state.promoData[i]["yFreeText"]) ? this.state.promoData[i]["yFreeText"] : ""}
                                    onChange={e => this.handle_edit_promo(i, "yFreeText", e)}
                                    required="true"
                                  />
                                </Grid>
                              }
                              {(fields == "yProductId" && this.state.promoData[i] && this.state.promoData[i].yType == "productId") &&
                                <Grid item xs={4} sm={4} className={classes.control}>
                                  <TextField
                                    label="yProductId"
                                    variant="outlined"
                                    fullWidth
                                    type="text"
                                    name="yProductId"
                                    value={(this.state.promoData[i] && this.state.promoData[i]["yProductId"]) ? this.state.promoData[i]["yproductId"] : ""}
                                    onChange={e => this.handle_edit_promo(i, "yProductId", e)}
                                    required
                                    style={{ width: "75%" }}
                                  />
                                </Grid>
                              }
                              {/* {(item[fields].type == "date" || item[fields].type == "DateTime") &&
                                <TextField
                                  label={fields}
                                  margin="normal"
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                  type="datetime-local"
                                  name={fields}
                                  value={(this.state.promoData[i] && this.state.promoData[i][fields]) ? this.state.promoData[i][fields] : ""}
                                  onChange={e => this.handle_edit_promo(i, fields, e)}
                                  placeholder={"Enter " + fields}
                                  required={(item[fields].required == "true" || item[fields].required == true) ? true : false}
                                  style = {{width:"75%"}}
                                />
                              } */}
                              {item[fields].type == "checkbox" &&
                                <Grid item xs={4} sm={4} className={classes.control}>

                                  <FormControl component="fieldset" required="true">
                                    <FormLabel component="legend">{(fields == "paymentMethodApplicable") ? "Payment Method Applicable" : "Available Platform Set"} </FormLabel>
                                    <FormGroup>
                                      {Object.keys(item[fields].values).map(function (j, jindex) {
                                        return (
                                          <FormControlLabel
                                          key={"fields"+jindex}
                                            control={
                                              <Checkbox color="primary"
                                                checked={this.state.promoData[i] && this.state.promoData[i][fields] ? (this.state.promoData[i][fields].includes(item[fields].values[j]) ? true : false) : false}
                                                onChange={this.handle_checkbox.bind(this, item[fields].values[j], fields, index, i)}
                                                // required={(item[fields].required == "true" || item[fields].required == true) ? true : false}
                                              />
                                            }
                                            label={j}
                                          />
                                        )
                                      }, this)
                                      }
                                    </FormGroup>
                                  </FormControl>
                                </Grid>
                              }
                            </React.Fragment>
                          )
                        })}
                        <Grid item lg={12}>
                         {i > 0 &&
                          <Button onClick={e => this.removePromo(i)} variant="contained" color="secondary" type="button" style={{margin:"14px"}}>
                            Remove
                        </Button>}
                        </Grid>
                      </Grid>
                      
                    )
                  })}
                 
                </Grid>
                <Grid container justify="center">
                  <Grid container lg={12} justify="left"  style={{padding:"15px"}}>
                  {this.state.selected_template_id && this.state.multiple_rule_teplate.indexOf(this.state.name) > -1 &&
                    <Button onClick={this.addPromoFields} variant="contained" color="secondary" type="button">
                      Add more fields
                    </Button>
                  }
                  </Grid>
                  <Grid container lg={12} justify="left" style={{padding:"15px"}}>
                    {this.state.promo_fields_array && this.state.promo_fields_array[0] && (this.state.promo_fields_array[0]['batchFree'] || this.state.promo_fields_array[0]['batchCartValue'] || this.state.promo_fields_array[0]['batchQuantity'] || this.state.promo_fields_array[0]['priority']) &&
                      <div style={{ margin: "10px 0px", fontWeight: "bold" }}>
                        NOTE**
                  </div>
                    }
                    {this.state.promo_fields_array && this.state.promo_fields_array[0] && this.state.promo_fields_array[0]['batchFree'] &&
                      <div style={{ margin: "10px 0px" }}>
                        Batch Free is the minimum item to give once the batch quantity or batch cart value condition is met.
                  </div>
                    }
                    {this.state.promo_fields_array && this.state.promo_fields_array[0] && this.state.promo_fields_array[0]['batchCartValue'] &&
                      <div style={{ margin: "10px 0px" }}>
                        Batch Cart Value is the minimum cart value for the discount rule to apply eg: for every 1000 rs get ...
                  </div>
                    }
                    {this.state.promo_fields_array && this.state.promo_fields_array[0] && this.state.promo_fields_array[0]['batchQuantity'] &&
                      <div style={{ margin: "10px 0px" }}>
                        Batch Quantity is the minimum quantity for the discount rule to apply eg: For every 3 item get ...
                  </div>
                    }
                    {this.state.promo_fields_array && this.state.promo_fields_array[0] && this.state.promo_fields_array[0]['priority'] &&
                      <div style={{ margin: "10px 0px" }}>
                        Assign a score from 2-10 to decide priority of code. 2 is the lowest and 10 is the highest priority
                  </div>
                    }
                   
                  </Grid>
                  <Grid lg={12} container justify="center">
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
  promo_data: state.promotionalpromo.data,
  loading: state.promotionalpromo.loading,
  error: state.promotionalpromo.error,
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(PromotionalPromo));