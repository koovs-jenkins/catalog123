/** Imported Pacakages */
import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import {Grid,Select,MenuItem,FormControl,InputLabel } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import Remove from "@material-ui/icons/RemoveCircle";
import AddList from "@material-ui/icons/AddCircle";
import LinearProgress from '@material-ui/core/LinearProgress';
import { fetchAllBrand , patchBrand, fetchBrandDetail } from "../../store/actions/brand";
import ReactQuill from 'react-quill'; 
import axios from "axios";
import config from '../../../config.js';
import Select1, { Async } from 'react-select-v1';

var debounce = require('debounce');
var t1, t0;
/** Settings for HTML Sanitize for XSS Checks */
import sanitizeHtml from 'sanitize-html'
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
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
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
import { _queryParser } from "../../helpers";
import {
    fetchProductDetail,
    postProduct,
    putProduct,
    fetchMetadata,
} from "../../store/actions/product";
import {
  fetchAllEnum
} from "../../store/actions/attributetype";
import { connect } from "react-redux";
import Modal from '@material-ui/core/Modal';
import { productStatus } from "../../../metadata";
import CKEditor from "react-ckeditor-component";


/** CSS for Styled Components */
const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 4,
    marginTop: "10px",
    maxWidth: "100%"
  },
  wrapper:{
    marginTop:"20px"
  },
  control:{
    padding:"10px"
  },
  async:{
    marginTop:"15px",
  },
  button: {
    margin: theme.spacing.unit * 4
  },
  modalpaper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  helper: {
    color: "rgba(0, 0, 0, 0.54)",
    margin: "0",
    fontSize: "0.75rem",
    textAlign: "left",
    margin: "8px 0",
    minHeight: "1em",
    fontFamily:
      'Roboto,"Lato",-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    lineHeight: "1em"
  },
  red: {
    color: "red"
  }
});

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.product_line_size = [];
    // this.product_line_color = [];
    this.state = {
      procurer : "",
      type :  "create",  // default state as create 
      edit_id : "",
      metadata : [],
      global_category:[],
      all_category : [],
      enum : [],
      enum_data : {},
      parentCategory : "",
      pcindex : "",
      masterCategory : "",
      mcindex : "",
      is_add_color : false,
      productLines_data : [],
      product : "",
      is_modal_open : false, // used to show sucess message when the product is saved successfully.
      max_mrp : "",
      merchantName : "",
      color_codes : [],
      live_status : false,
      isLiveAble: false,
      selected_type : "",
      global_category_keys : [{"name":"MRP_mrp"},{"name":"Warehouse_warehouse"},{"name":"Procurer_procurer"},{"name":"Shop Name_shop"},{"name":"Season_season"},{"name":"Long Description_longDescription"},{"name":"Short Description_shortDescription"},{"name":"Year_year"},{"name":"HSN Code_hsnCode"},{"name":"Collaboration_collaboration"},]
  };
  }

  

componentDidMount = () => {
  this.setState({
    isLiveAble:
      _queryParser(this.props.location.search) &&
      _queryParser(this.props.location.search).status
  });
  this.get_all_enum();   // API call to get all the Enums to render form
  t0 = performance.now();
  var self = this;
   if(this.props.match.params.type == "create"){
   this.get_meta_data();      // API call to get the Metadata to render form
   }   
   this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "create",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
      // Check if its add or edit product if edit product get the data of the edited product to prefill the form details
      if(this.state.type == "edit" && this.state.edit_id){
        this.props.dispatch(fetchProductDetail(this.state.edit_id)).then(() =>{
            if(!this.props.error){
              this.setState({
                product : this.props.data.data.response
              },()=>{
                this.get_meta_data();    // get the metadata to get in the case of edit product after the editing product data.
              })
            } 
            else{
              // Error case handled if the API gives 500 error . In this case user will be redirected to product listing.
              alert("Not able to find product or the product has corrupted data.")
              this.props.history.goBack();
            }
          }
        )
      }
  })

};


handle_brand(e){
  if(e){
    this.setState({ brand_id : e })
  }
  else{
    this.setState({ brand_id : "" })
  }
}


get_single_brand_data(id){
  this.props.dispatch(fetchBrandDetail(id)).then(() =>{
    var brandData = this.props.brand_data.data.brandDetail
    brandData['value'] = (this.props.brand_data.data.brandDetail.brandId).toString();
    brandData['label'] = this.props.brand_data.data.brandDetail.brandName 
    this.setState({
      brand_id : brandData
    })
  })
}

componentDidUpdate(prevProps, prevState, snapshot){
  // Initialized the code for dropdown render.
  var self = this;
    $('#select_brand').select2();
    $('#select_color').select2();
    $('#select_color_code').select2();
    $('#select_size').select2();
    $('#select_master_category').select2();
    $('#select_parent_category').select2();
    $("#select_brand").on("select2:select select2:unselecting", function (event) { 
      if(event.target.value != self.state.brand_id){
        self.handle_brand(event);
      }
    });
    $("#select_color").on("select2:select select2:unselecting", function (event) { 
        self.handle_color(event);
    });
    $("#select_color_code").on("select2:select select2:unselecting", function (event) { 
        var iindex = $("#select_color_code option:selected").attr('data-iindex');
        self.handle_colorcode_row(iindex,event);
    });
    $("#select_size").on("select2:select select2:unselecting", function (event) { 
        var iindex = $("#select_size option:selected").attr('data-iindex');
        var jindex = $("#select_size option:selected").attr('data-jindex');
        self.handle_edit_row(iindex,jindex,"size",event)
    });
    $("#select_master_category").on("select2:select select2:unselecting", function (event) { 
      var value = event.target.value
      var index = $(this).find('option:selected').attr('id').split("_")[2]
      var updated_value = value+"_"+index
      if(value != self.state.masterCategory && value){
        self.handle_category("master",updated_value);
      }
    }); 
    $("#select_parent_category").on("select2:select select2:unselecting", function (event) { 
      var value = event.target.value
      var index = $(this).find('option:selected').attr('id').split("_")[2]
      var updated_value = value+"_"+index
      if(value != self.state.parentCategory && value){
        self.handle_category("parent",updated_value);
      }
    });
}

get_all_enum(){
  this.props.dispatch(fetchAllEnum()).then(() =>{
      var response = this.props.enum.data.response
      delete response.measurementSize
      delete response.ageGroup
      response.CODType = {
        "NO" : "No",
        "YES" : "Yes",
      }
      delete response.status.LIVE;
      delete response.status.DELISTED;
      this.setState({
          enum : response,
      },()=>{
        var enum_data = {};
        Object.keys(this.state.enum).map(function(i,index){
            enum_data[""+(i == "brand" ? "brandType" : i)] = ""
        })
        this.setState({ enum_data : enum_data })
      })
  }
  );
}

get_meta_data(){
    this.props.dispatch(fetchMetadata()).then(() =>{
        var global_category_data = this.props.metadata.data.response.categories.filter((i) => i.name == "Global Category")[0]
        var global_category_data_attributes = global_category_data.attributeTypes

        var all_category = this.props.metadata.data.response.categories.filter((i) => i.name != "Global Category")
        var global_category = global_category_data.attributeTypes.filter((i) => (i.name != "Size" && i.name != "Color" && i.name != "Color Code"))
        var size = global_category_data_attributes.filter((i) => (i.name == "Size"))
        var color = global_category_data_attributes.filter((i) => (i.name == "Color"))
        var color_codes = global_category_data_attributes.filter((i) => (i.name == "Color Code"))
        this.product_line_size = size[0] ? size[0].attributeTypeValue : []
        this.product_line_size.map((i) => i.disabled == false)
        // this.product_line_color = color[0] ? color[0].attributeTypeValue : [],
        if(this.state.type == "edit" && this.state.edit_id){ 
        this.get_single_brand_data(this.state.product.productGlobalValues.brand) // fetch selected brand detail
        }
        this.setState({
            global_category : global_category,
            all_category : all_category,
            color_codes : color_codes[0]  ? color_codes[0].attributeTypeValue : [],
        },()=>{
          t1 = performance.now();
          console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
          if(this.state.type == "edit" && this.state.edit_id){
            this.set_product_form()  // function to populate the edit data in form fields.
          }
        })
    }
    )
}

/**
 * This function will update the different state objects required to render the product form
 */
set_product_form(){
  Object.keys(this.state.product.productGlobalValues).map(function(i,index){
    this.state.enum_data[""+(i == "brand" ? "brandType" : (i == "codType" ? "CODType" : i))] = this.state.product.productGlobalValues[""+(i == "brand" ? "brandType" : i)]
  },this)

  // To set the data for fixed Global Categort Attributes
  this.state.global_category.map(function(i,index){
     var key = this.state.global_category_keys.filter((j) => i.name == j.name.split("_")[0] )[0] ? this.state.global_category_keys.filter((j) => i.name == j.name.split("_")[0] )[0].name.split("_")[1] : ""
     if(key){
         if(key == "mrp"){
           this.setState({ max_mrp : this.state.product.productGlobalValues[""+key]})
         }
         i.data = this.state.product.productGlobalValues[""+key]
     } 
      return i
  },this)


  this.state.product.productOptions.map(function(i,index){
      i["value"] = i.color,
      i["label"] = i.colorValue
      return i 
  })
  // To set the data for dynamic global category attributes
  Object.keys(this.state.product.attributes).map(function(i){
    if(this.state.global_category.filter((j) => parseInt(j.id) == i)[0]){ this.state.global_category.filter((j) => parseInt(j.id) == i)[0].data = this.state.product.attributes[""+i] }  
  },this)
  var pcindex = this.state.all_category.findIndex(item => item.id === parseInt(this.state.product.productGlobalValues.parentCategory))
  var mcindex = this.state.all_category[pcindex].subCategories.findIndex(item => item.id === parseInt(this.state.product.productGlobalValues.masterCategory))
  this.setState({
    live_status : this.state.product.productGlobalValues.status == "LIVE" ? true : false,
    parentCategory : this.state.product.productGlobalValues.parentCategory,
    pcindex : (pcindex  != -1 ) ? pcindex : "",
    masterCategory : this.state.product.productGlobalValues.masterCategory,
    mcindex : (mcindex  != -1 ) ? mcindex : "",
    merchantCode : this.state.product.merchantCode,
    productName : this.state.product.productName,
    merchantName : this.state.product.merchantName,
    brand_id : this.state.product.productGlobalValues.brand,
    enum_data : this.state.enum_data,
    productLines_data : this.state.product.productOptions,
    global_category : this.state.global_category,
    procurer: this.state.product.productGlobalValues.procurer
   },()=>{
     console.log("Enum Data", this.state.enum_data)
     this.set_parent_child_attributes();   // after gathering the category data. Called function to get and set the master and parent category data.
   })
}

/**
 * Function to set the Master & Parent category for which the product is being edited.
 * Check has been implemented to handle the parent and Master Category Swap. 
 */
set_parent_child_attributes(){
  var data_object = this.state.all_category[this.state.pcindex]
  if(data_object){
    console.debug("Found Master Category ::", data_object)

    
    var parent_attributes = data_object.attributeTypes
    var child_attributes = data_object.subCategories[this.state.mcindex] ? data_object.subCategories[this.state.mcindex].attributeTypes : []



    if(!data_object.subCategories[this.state.mcindex]){
      console.debug("Not able to Find Parent Category with ID ::", this.state.masterCategory)
    }
    else{
      console.debug("Found Parent Category ::", data_object.subCategories[this.state.mcindex])
    }
    Object.keys(this.state.product.attributes).map(function(i){
      if(parent_attributes.filter((j) => parseInt(j.id) == i)[0]){ parent_attributes.filter((j) => parseInt(j.id) == i)[0].data = this.state.product.attributes[""+i] }  
      if(child_attributes.filter((j) => parseInt(j.id) == i)[0]){ child_attributes.filter((j) => parseInt(j.id) == i)[0].data = this.state.product.attributes[""+i] } 
    },this)
  
    data_object.attributeTypes = parent_attributes
    if(data_object.subCategories[this.state.mcindex]){
      data_object.subCategories[this.state.mcindex].attributeTypes = child_attributes
    }
    this.setState({ all_category : this.state.all_category})               
  }
  else{
    console.debug("Not able to Find Master Category with ID ::", this.state.parentCategory)
  }
}


/**
 * Function to get all the brands
 */

get_brand_data(input){
  if(input != ""){
    return this.props.dispatch(fetchAllBrand(input,"ACTIVE")).then(() =>{
             var data  = (this.props.brands.response.length > 0 ? this.props.brands.response : []).map(function(i,index){
                    i['value'] = (i.brandId).toString();
                    i['label'] = i.brandName 
                    return(i)
                  })
            return { options : data };
      });
  }
  else{
    return Promise.resolve({ options: [] });
  }
}


get_color_data(input){
  if(input != ""){
      return axios.get("/attributeType/getAllAttributeValues?search="+ input +"&type=Color").then(function(res){
            console.log(res.data)
            var color_data  = (res.data.response.length > 0 ? res.data.response : []).map(function(i,index){
              i['value'] = (i.attributeValueId).toString();
              i['label'] = i.attributeValue 
              return(i)
            })
          console.log(color_data)
          return { options: color_data };
      })
  }
  else{
    return Promise.resolve({ options: [] });
  }
}


/**
 * React Lifecycle method to handle url change if needed. Currently not being used.
 */
UNSAFE_componentWillReceiveProps = (newProps) => {
    if(newProps.match.params.type != this.props.match.params.type){
        this.setState({ type :  newProps.match.params.type },()=>{
          if(this.state.type == "create"){
              this.setState({ 
                type :  "create",
                edit_id : "",
              })
          }
        })
    }
    if(newProps.match.params.id != this.props.match.params.id){
      this.setState({ edit_id :  newProps.match.params.id },()=>{
          if(this.state.type  == "edit" && this.state.edit_id){
            this.props.dispatch(fetchProductDetail(this.state.edit_id)).then(() =>
            this.setState({
              product : this.props.data.data.productMap[""+ this.state.edit_id],
            })
            )
          }
      })
    }
}


// this function is currently not being used.
handle_ok(){
  this.setState({ is_modal_open :  false },()=>{
    this.props.history.push("/catalogue/list/product")
  })
}

/**
 * Function to handle Product Save.
 * All the data form the state is being formatted to send in the create/edit api.
 */

handleRecursion = (data, result) => {
  for(let i in data){
    if(typeof data[i] != "object"){
      if(data[i] && data[i].length > 1000 && i.toLowerCase().replace(/\s/g,'').indexOf("longdescription") == -1){
          result.push(false);
          if(!isNaN(i)){
            let attribute = this.state.all_category[0].attributeTypes.filter(v => v.id == i && v.attrType == "TEXTAREA")[0];
            alert("Found more than 1000 character on "+ attribute.name);
            if(attribute.mandatory && data[i].length < 1){
              alert("Found blank on mandatory field "+ attribute.name);
            }
            document.getElementById(i).scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
          }else{
            alert("Found more than 1000 character on "+ i);
          }
          break;
      }
    }else if(Array.isArray(data[i])){
      data[i].map(v => this.handleRecursion(v, result));
    }else{
      this.handleRecursion(data[i], result);
    }
   }
}

 handleSanetizeObject = (data) => {
   let result = [];
   this.handleRecursion(data,result);
   return result.indexOf(false) > -1;
 }

  handleform(event){
    event.preventDefault();
    // Check for atleast one product line must be added in order to save the product.
    if(this.state.productLines_data.length > 0){
    var self = this;
    var attribute_data = {};   // Get all the filled attribute data
    if(this.state.all_category[this.state.pcindex]){
      this.state.all_category[this.state.pcindex].attributeTypes.map(function(i,index){
        if(i.data){
          attribute_data["" + i.id] = ""+ ((i.attrType == "DROPDOWN" || i.attrType == "MULTI_VALUED") ? "v:" : "f:") + ( i.attrType == "TEXTAREA" ? (i.data || "") : sanitizeHtml(i.data,allowed).replace(/amp;/g, ""))
        }
        if(i.data && i.attrType == "MULTI_VALUED"){
          attribute_data["" + i.id] = ((i.attrType == "MULTI_VALUED") ? "mv:" : "f:") + sanitizeHtml(i.data,allowed).replace(/amp;/g, "")
        }
      })
      if(this.state.all_category[this.state.pcindex].subCategories[this.state.mcindex]){
        this.state.all_category[this.state.pcindex].subCategories[this.state.mcindex].attributeTypes.map(function(i,index){
          if(i.data){
            attribute_data["" + i.id] = ""+ ((i.attrType == "DROPDOWN" || i.attrType == "MULTI_VALUED") ? "v:" : "f:") + ( i.attrType == "TEXTAREA" ? (i.data || "") : sanitizeHtml(i.data,allowed).replace(/amp;/g, ""))
          }
        })
      }
    }


    var gc_array  = this.state.global_category_keys.map((i) => i.name.split("_")[0])
    this.state.global_category.map(function(i,index){
      if(!gc_array.includes(i.name)){
        if(i.data){
          attribute_data["" + i.id] = ""+ ((i.attrType == "DROPDOWN" || i.attrType == "MULTI_VALUED") ? "v:" : "f:") + ( i.attrType == "TEXTAREA" ? (i.data || "") : sanitizeHtml(i.data,allowed).replace("&amp;", "&"))
        }
      } 
    })

    if(this.state.type == "create"){
      var formdata = {
        "attributes": attribute_data,
        "merchantCode": this.state.merchantCode ? sanitizeHtml(this.state.merchantCode).replace(/amp;/g, "") : "",
        "merchantName": this.state.merchantName ? sanitizeHtml(this.state.merchantName).replace(/amp;/g, "") : "",
        "productGlobalValues": {
          "brand": this.state.brand_id.brandId,
          "masterCategory": this.state.masterCategory,
          "parentCategory": this.state.parentCategory,
          "mrp" : this.state.global_category.filter((i) => i.name == "MRP" )[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "MRP" )[0].data || "") : "",
          "workflow" : this.state.enum_data.workflow,
          "gender" : this.state.enum_data.gender,
          "warehouse" : this.state.global_category.filter((i) => i.name == "Warehouse")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Warehouse")[0].data || "").replace(/amp;/g, "") : "",
          "procurer" : this.state.procurer ? this.state.procurer : "",
          "shop" : this.state.global_category.filter((i) => i.name == "Shop Name")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Shop Name")[0].data || "").replace(/amp;/g, "") : "",
          "brandType" : this.state.enum_data.brandType,
          "codType" : this.state.enum_data.CODType,
          "productType" : this.state.enum_data.productType,
          "season" : this.state.global_category.filter((i) => i.name == "Season")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Season")[0].data || "").replace(/amp;/g, "") : "",
          "longDescription" : this.state.global_category.filter((i) => i.name == "Long Description")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Long Description")[0].data || "").replace(/amp;/g, "") : "",
          "shortDescription" : this.state.global_category.filter((i) => i.name == "Short Description")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Short Description")[0].data || "").replace(/amp;/g, "") : "",
          "year" : this.state.global_category.filter((i) => i.name == "Year")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Year")[0].data || "").replace(/amp;/g, "") : "",
          "hsnCode" : this.state.global_category.filter((i) => i.name == "HSN Code")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "HSN Code")[0].data || "").replace(/amp;/g, "") : "",
          "collaboration" :  this.state.global_category.filter((i) => i.name == "Collaboration")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Collaboration")[0].data || "").replace(/amp;/g, "") : ""
        },
        "productLines": this.state.productLines_data,
        "productName": sanitizeHtml(this.state.productName).replace(/amp;/g, ""),
        "anchor": sanitizeHtml(this.state.productName).replace(/amp;/g, ""),
        "createdBy" : this.props.email 
      }
      if(this.state.enum_data.status != "LIVE"){
        formdata.productGlobalValues.status = this.state.enum_data.status;
      }
      !this.handleSanetizeObject(formdata) && this.props.dispatch(postProduct(JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          // this.setState({ is_modal_open :  true})
          this.props.history.push("/catalogue/list/product")
        }
      })
    }
    else if(this.state.type == "edit" && this.state.edit_id){
      var formdata = {
        "attributes": attribute_data,
        "merchantCode": this.state.merchantCode ? sanitizeHtml(this.state.merchantCode).replace(/amp;/g, "") : "",
        "merchantName": this.state.merchantName ? sanitizeHtml(this.state.merchantName).replace(/amp;/g, "") : "",
        "productId" : this.state.edit_id,
        "productGlobalValues": {
          "brand": this.state.brand_id.brandId,
          "masterCategory": this.state.masterCategory,
          "parentCategory": this.state.parentCategory,
          "mrp" : this.state.global_category.filter((i) => i.name == "MRP" )[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "MRP" )[0].data || "") : "",
          "workflow" : this.state.enum_data.workflow,
          "gender" : this.state.enum_data.gender,
          "warehouse" : this.state.global_category.filter((i) => i.name == "Warehouse")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Warehouse")[0].data || "") : "",
          "procurer" : this.state.procurer,
          "shop" : this.state.global_category.filter((i) => i.name == "Shop Name")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Shop Name")[0].data || "") : "",
          "brandType" : this.state.enum_data.brandType,
          "codType" : this.state.enum_data.CODType,
          "productType" : this.state.enum_data.productType,
          "season" : this.state.global_category.filter((i) => i.name == "Season")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Season")[0].data || "") : "",
          "longDescription" : this.state.global_category.filter((i) => i.name == "Long Description")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Long Description")[0].data || "") : "",
          "shortDescription" : this.state.global_category.filter((i) => i.name == "Short Description")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Short Description")[0].data || "") : "",
          "year" : this.state.global_category.filter((i) => i.name == "Year")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Year")[0].data || "") : "",
          "hsnCode" : this.state.global_category.filter((i) => i.name == "HSN Code")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "HSN Code")[0].data || "") : "",
          "collaboration" :  this.state.global_category.filter((i) => i.name == "Collaboration")[0] ? sanitizeHtml(this.state.global_category.filter((i) => i.name == "Collaboration")[0].data || "") : ""
        },
        "productLines": this.state.productLines_data,
        "productName": sanitizeHtml(this.state.productName).replace(/amp;/g, ""),
        "anchor": sanitizeHtml(this.state.productName).replace(/amp;/g, ""),
        "updatedBy" : this.props.email 
      }
      if(this.state.enum_data.status != "LIVE"){
        formdata.productGlobalValues.status = this.state.enum_data.status;
      }
      !this.handleSanetizeObject(formdata) && this.props.dispatch(putProduct(this.state.edit_id,JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          //this.props.history.push("/catalogue/list/product")
          this.props.history.push("/catalogue/view/product/"+ this.state.edit_id + "/" + this.state.isLiveAble)
        }
      })
    }
  }
  else{
    alert("Please add atleast one product line data.")
  }
  }

  /**
   * To handle all the global attributes form fields
   */
  handle_global_category(index,from="",value="",event){
    if(from != "textarea"){
      this.state.global_category[index].data = from.target.value
      if(this.state.global_category[index].name == "MRP"){
        this.setState({ max_mrp : from.target.value })
      }
      this.setState({ global_category : this.state.global_category })
    }
    else if(from == "textarea" && value){
      this.state.global_category[index].data = value.editor.getData().replace(/<[^>]*>?/gm, '') != "" ? value.editor.getData() : ""
    }
      console.log(this.state.global_category)
  }

  /**
   * To handle all the master category form fields
   */
  handle_master_attributes(index,from="",value="",event){
    if(from != "textarea"){
      this.state.all_category[this.state.pcindex].subCategories[this.state.mcindex].attributeTypes[index].data = (from.target.value)
      this.setState({ all_category : this.state.all_category})               
    }
    else if(from == "textarea" && value){
      this.state.all_category[this.state.pcindex].subCategories[this.state.mcindex].attributeTypes[index].data = value.editor.getData().replace(/<[^>]*>?/gm, '') != "" ? value.editor.getData() : ""
    }
  }



  /**
   *  To hanlde all the parent category from fields
   */
  handle_parent_attributes(index,from="",value="",event){
    if(from != "textarea"){
      this.state.all_category[this.state.pcindex].attributeTypes[index].data = (from.target.value)
      this.setState({ all_category : this.state.all_category})
    }
    else if(from == "textarea" && value){
      this.state.all_category[this.state.pcindex].attributeTypes[index].data = value.editor.getData().replace(/<[^>]*>?/gm, '') != "" ? value.editor.getData() : ""
    }
  }

  handle_type(index,value){
    console.log(value)
    if(value){
      // var data = this.state.selected_type.length > 0 ? this.state.selected_type : [] 
      // data.push(value)
      this.state.all_category[this.state.pcindex].attributeTypes[index].data = (value)
      this.setState({ all_category : this.state.all_category})
    }
    else{
      this.setState({ selected_type : this.state.selected_type ? this.state.selected_type : ""  },()=>{
        console.log(this.state.selected_type)
      })
    }
  }


  /**
   * To handle all the enum related form fields
   */
  handle_enum(i,event){
    var value = event.target.value 
    this.state.enum_data[""+(i == "brand" ? "brandType" : i)] = value
    this.setState({ enum_data :  this.state.enum_data})
  }


  /**
   * To handle when the user selects master and parent category and save in state
   */
  handle_category(type, value){
    if(type == "parent"){
      this.setState({ parentCategory : value.split("_")[0], pcindex : value.split("_")[1] , masterCategory : "", mcindex : ""})
    }
    else{
      this.setState({ masterCategory : value.split("_")[0], mcindex : value.split("_")[1] })
    }
  }

  handle_add_color(){
    this.setState({is_add_color : true},()=>{
      document.getElementById('color_container').scrollIntoView();
    })
  }

/**
 * 
 * @param {*} event 
 * function to add color
 * Empty object is being added to sku array to render the form.
 */
  handle_color(event){
    var obj ={
      "id" : "",
      "new" : true,
      "color": event.attributeValueId,
      "color_name" : event.attributeValue,
      "value" : event.attributeValueId,
      "label" : event.attributeValue,
      "colorCode" : "",
      "sizes" : [
        {
          "price" : "",
          "size" : "",
          "discount" : "",
          "new" : true,
        }
      ],
    }
    var pdata = this.state.productLines_data
    var data = Object.assign([], pdata );
    if(obj.color != ""){
      data.push(obj)
    }
    if(data.length != this.state.productLines_data.length){
      this.setState({ productLines_data : data })
    }
  }


  //Edit Color Function
  handle_edit_color(index,event){
    console.log(index, event)
    if(event){
      var pdata = this.state.productLines_data
      var data = Object.assign([], pdata );
      data[index].label =event.attributeValue
      data[index].colorValue =event.attributeValue
      data[index].value =event.attributeValue
      data[index].color =event.attributeValueId
      data[index].color_name =event.attributeValue
      this.setState({productLines_data : data })
    }

  }


  /**
   * function to add line to the product.
   * Empty object is being added in  the Line array to render the form.
   */
  handle_add_row(iindex){
    var obj ={
          "price" : "",
          "size" : "",
          "discount" : "",
          "ean": "",
          "new" : true
        }

    this.state.productLines_data[iindex].sizes.push(obj)
    this.setState({ productLines_data : this.state.productLines_data },()=>{
       document.getElementById('add_container').scrollIntoView();
    })
  }


  /**
   * Function to delete Color row.
   * Takes 2 params as Line inded and Row SKU index which needs to be deleted.
   */
  handle_delete_row(iindex,jind){
    var data = this.state.productLines_data
    data[iindex].sizes.splice(jind,1)
    this.setState({ productLines_data : data},()=>{
    })
  }

  /**
   * Function to handle the Line's Sku form fields
   * Line Index , Sku Index , type of field editing and event is being passed as params.
   */
  handle_edit_row(iindex,jindex,type,event){
    // if(type == "size"){
    //   this.state.product_line_size.map((i) => {i.disabled = false})
    //   this.state.product_line_size[jindex].disabled = true
    // }
    if(this.state.productLines_data[iindex].sizes[jindex][""+type] != event.target.value){
      this.state.productLines_data[iindex].sizes[jindex][""+type] = (type == "discount" || type == "price") ? (event.target.value != "" ? (Math.abs(event.target.value)).toString() : "") : (event.target.value)
      this.setState({ productLines_data : this.state.productLines_data })
    }
  }

  /**
   * Function to update  the data for Sku row. 
   */
  handle_colorcode_row(iindex,event){ 
    if(this.state.productLines_data[iindex].colorCode != event.target.value){
      this.state.productLines_data[iindex].colorCode = event.target.value
      this.setState({ productLines_data : this.state.productLines_data })
    }
  }

  /**
   * Function to updated the data of line row.
   */
  handle_lineId_row(iindex,event){
    this.state.productLines_data[iindex].lineId = event.target.value
    this.setState({ productLines_data : this.state.productLines_data })
  }

  handle_delete_color(iindex){
    var data = this.state.productLines_data
    data.splice(iindex,1)
    this.setState({ productLines_data : data })
  }

  //Function not being used.
  handle_add_images(iindex){
    this.state.productLines_data[iindex].add_images = true
    this.setState({ productLines_data : this.state.productLines_data})
  }


  render() {
    const { classes, match, loading } = this.props;
    const { edit_id } = this.state;
    const validatedFields = ["HSN Code", "Season", "Procurer", "Fabric Content", "UOM"];
    var attribute_data = this.state.all_category[this.state.pcindex] ? ( this.state.all_category[this.state.pcindex].subCategories[this.state.mcindex] ? this.state.all_category[this.state.pcindex].subCategories[this.state.mcindex].attributeTypes : []) : [];   
    var parent_category = (this.state.all_category[this.state.pcindex] && this.state.all_category[this.state.pcindex].attributeTypes) ?  this.state.all_category[this.state.pcindex].attributeTypes : []
    return (
      <React.Fragment>
       {loading &&
            <LinearProgress />
        }
        {!loading && (
          <React.Fragment>

            <Grid container justify="space-between" className={classes.wrapper}>
              <Typography variant="h5" gutterBottom component="h5">
                {this.state.type == "edit" ? "Edit" : "Create"} Product 
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
                        {this.props.error.error.response && this.props.error.error.response.data.text}
                      </p>
                      } 
                    </div>
                  }
              </Typography>
              <Button variant="contained" color="primary" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>
          
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={12}>
                <Grid item xs={12} sm={12}>
                  <p className="product_grouping_headlines">
                     Procurement Details
                  </p>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Product Name"
                    onInput={e =>
                      (e.target.value = e.target.value.toString().slice(0, 200))
                    }
                    value={this.state.productName || ""}
                    name="productName"
                    onChange={(e) => { this.setState({ productName :  (e.target.value) })}}
                    required
                    inputProps={{
                    maxLength : "250",
                    }}
                    helperText={this.state.productName && this.state.productName.length > 255 && <span className={classes.red}>You're exceeding character limit</span>}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Merchant Code"
                    id="outlined-basic"
                    variant="outlined"
                    helperText={this.state.merchantCode && this.state.merchantCode.length > 255 && <span className={classes.red}>You're exceeding character limit</span>}
                    value={this.state.merchantCode || ""}
                    fullWidth
                    name="merchantCode"
                    onChange={(e) => { this.setState({ merchantCode : (e.target.value) })}}
                    required
                    onInput={e =>
                      (e.target.value = e.target.value.toString().slice(0, 50))
                    }
                  />
                </Grid>
                 <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Merchant Name"
                    id="outlined-basic"
                    variant="outlined"
                    helperText={this.state.merchantName && this.state.merchantName.length > 255 && <span className={classes.red}>You're exceeding character limit</span>}
                    value={this.state.merchantName || ""}
                    fullWidth
                    name="merchantName"
                    onChange={(e) => { this.setState({ merchantName : (e.target.value) })}}
                    inputProps={{
                    maxLength : "250",
                    }}
                  />
                </Grid> 
                <Grid item xs={6} sm={6} className={classes.control}>
                  <TextField
                    id="outlined-basic" 
                    variant="outlined"
                    value={this.state.procurer || ""}
                    helperText={this.state.procurer && this.state.procurer.length > 255 && <span className={classes.red}>You're exceeding character limit</span>}
                    fullWidth
                    name="procurer"
                    onChange={e => this.setState({procurer: e.target.value})}
                    label="Enter Procurer"
                    onInput={e =>
                      (e.target.value = e.target.value.toString().slice(0, 20))
                    }
                  />
                </Grid> 
                <Grid item xs={6} sm={6} className={classes.control}>
                  <Async 
                    className={classes.async}
                    id="brand_search"
                    ref="brand_search"
                    value={this.state.brand_id ? this.state.brand_id : ""}
                    onChange={this.handle_brand.bind(this)} 
                    placeholder="Search and Select Brand*"
                    loadOptions={this.get_brand_data.bind(this)} 
                    backspaceRemoves={true}
                    autoload = {false}
                    cache={false}
                    required
                    searchPromptText = "Enter brand name to search"
                    noResultsText = "No brand found."
                    loadingPlaceholder = "Searching brand"
                  />
                </Grid>
                {this.state.global_category.map(function(i,index){
                    return(
                        <Grid container item xs={i.attrType == "TEXTBOX" ? 6 : 6} sm={i.attrType == "TEXTBOX" ? 6 : 6} key={index} className={classes.control}>
                             {i.attrType == "TEXTBOX" && i.name !== "EAN/UTC Code" &&
                                <React.Fragment>
                                    <TextField
                                        onInput={e =>
                                          validatedFields.indexOf(i.name) > -1 && (e.target.value = e.target.value.toString().slice(0, i.name == "Season" ? 50 : i.name=="HSN Code" ? 8 : 20))
                                        }
                                        value={i.data|| ""}
                                        variant="outlined"
                                        type ={(i.name == "MRP" || i.name == "Year") ? "number" : "text"}
                                        helperText={i.data && i.data.length > 255 && <span className={classes.red}>You're exceeding character limit</span>}
                                        fullWidth
                                        name={i.name}
                                        onChange={this.handle_global_category.bind(this,index)}
                                        label={"Enter " + i.name }
                                        inputProps={{
                                            readOnly:((this.state.edit_id && i.name == "MRP")  ? true :  false),
                                            step: i.name == "MRP" ? 1 : "",
                                            max: i.name == "MRP" ? "999999" : "",
                                            min: i.name == "MRP" ? 0 : "",
                                        }}
                                        required={i.mandatory ? i.mandatory : false }
                                    />
                                </React.Fragment>
                            } 
                            {i.attrType == "TEXTAREA" &&
                                <React.Fragment>
                              
                                  <Typography className={classes.helper}>{i.name + (i.mandatory ? "*" : "")}</Typography>
                                    <CKEditor
                                      id={i.id.toString()}
                                      activeClass="p10" 
                                      required={i.mandatory ? i.mandatory : false }
                                      modules={modules}
                                      preserveWhitespace={false}
                                      formats={formats}
                                      content={i.data || ""}
                                      placeholder={"Enter " + i.name + (i.mandatory ? "*" : "")}
                                      events={{
                                        "change": this.handle_global_category.bind(this,index,"textarea")
                                      }}
                                    />
                                    {i.data && i.data.length && i.data.length > 1000 && i.name.toLowerCase().replace(/\s/g,'').indexOf("longdescription") == -1 && <Typography className={classes.helper}><span className={classes.red}>You're exceeding character limit</span></Typography>}
                                </React.Fragment>
                            }
                            {i.attrType == "DROPDOWN" &&
                                <React.Fragment>
                                  <Grid xs={6} lg={6} sm={6}>
                                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                    <InputLabel id={"demo-simple-select-outlined-label-"+i}>{"Select " + i.name}</InputLabel>
                                    <Select
                                          labelId={"demo-simple-select-outlined-label-"+i}
                                          id={"demo-simple-select-outlined-"+i}
                                          value={i.data ? i.data : ""}
                                          label={"Please Select " + i.name }
                                          onChange={this.handle_global_category.bind(this,index)}
                                          fullWidth
                                          required={i.mandatory ? i.mandatory : false }
                                          helperText={"Please Select " + i.name + (i.mandatory ? "*" : "")}
                                          >
                                          <MenuItem value="">{"Select " + i.name}</MenuItem>
                                          {i.attributeTypeValue.map(function(i,index){
                                              return(<MenuItem key={index} value={!(this.state.global_category_keys.map((i) => i.name.split("_")[0])).includes(i.name) ? i.id : i.name} disabled={i.status == "ACTIVE" ? false : true}>{i.name}</MenuItem>)
                                        },this)}
                                    </Select>
                                    </FormControl>
                                  </Grid>
                                </React.Fragment>
                            }
                            {i.attrType == "MULTI_VALUED" &&
                                <React.Fragment>
                                  <TextField
                                        select
                                        className="select_margin_top"
                                        value={i.data ? i.data : ""}
                                        onChange={this.handle_global_category.bind(this,index)}
                                        fullWidth
                                        required={i.mandatory ? i.mandatory : false }
                                        multiple
                                        label={"Select " + i.name}
                                        helperText={"Please Select " + i.name + (i.mandatory ? "*" : "")}
                                        >
                                        {i.attributeTypeValue.map(function(i,index){
                                            return(<option key={index} value={i.id} disabled={i.status == "ACTIVE" ? false : true}>{i.name}</option>)
                                        },this)}
                                    </TextField>
                                </React.Fragment>
                            }
                        </Grid>
                    )
                },this)
                }
                <Grid item xs={12} sm={12}>
                  <p className="product_grouping_headlines">
                      Product Details
                  </p>
                </Grid>
                <Grid item xs={6} sm={6} className={classes.control}>
                    <TextField
                        select
                        id="select_parent_category"
                        className="select_margin_top"
                        value={this.state.parentCategory || ""}
                        onChange={this.handle_category.bind(this,"parent")}
                        SelectProps={{
                        native: true,
                        }}
                        margin="normal"
                        fullWidth
                        required
                        helperText={"Please Select Master Category*"}
                        disabled={this.state.edit_id ? true : false}
                        >
                        <option value="">{"Select Master Category"}</option>
                        {this.state.all_category.map(function(i,index){
                          return(
                            <option key={index} id={"mc_"+i.id+"_"+index} value={i.id} disabled={i.status == "ACTIVE" ? false : true}>{i.name}</option>
                          )
                        },this)
                        }
                    </TextField>
                  </Grid>
                <Grid item xs={6} sm={6} className={classes.control}>
                  <TextField
                      select
                      id="select_master_category"
                      className="select_margin_top"
                      value={this.state.masterCategory || ""}
                      onChange={this.handle_category.bind(this, "master")}
                      SelectProps={{
                        native: true,
                      }}
                      margin="normal"
                      fullWidth
                      required
                      helperText={"Please Select Parent Category*"}
                      disabled={this.state.edit_id ? false : false}
                      >
                      <option value="">{"Select Parent Category"}</option>
                      {this.state.parentCategory &&
                        this.state.all_category[this.state.pcindex] &&
                          this.state.all_category[this.state.pcindex].subCategories.map(function(i,index){
                          return(
                            <option key={index} id={"pc_"+i.id+"_"+index} value={i.id} disabled={i.status == "ACTIVE" ? false : true}>{i.name}</option>
                          )
                        },this)
                      }
                  </TextField>
                </Grid>
                {Object.keys(this.state.enum).filter((s) => s != "attributeType").map(function(i,index){
                    return !(i == "outfitType" || i == "querySortOrder") && (
                      <Grid item xs={4} sm={4} key={index} className={classes.control}>
                         <FormControl fullWidth variant="outlined" className={classes.formControl}>
                          <InputLabel id="demo-simple-select-outlined-label">{"Select " + (i == "brand" ? "brandType" : i)} </InputLabel>
                          <Select
                              label={"Select " + (i == "brand" ? "brandType" : i)}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={this.state.enum_data[""+(i == "brand" ? "brandType" : i)]}
                              onChange={this.handle_enum.bind(this, i)}
                              fullWidth
                              required={i !== "status"}
                              helperText={`Please Select ${i == "brand" ? "brandType" : i}${i != "status" ? "*" : ""}`}
                              >
                              {Object.keys(this.state.enum[""+i]).map(function(j,jindex){
                                return i=="status" ? (
                                  productStatus.indexOf(j) > -1 && <MenuItem key={jindex} value={this.state.enum[""+i][""+j]}>{j}</MenuItem>
                                ) : (
                                  <MenuItem key={jindex} value={this.state.enum[""+i][""+j]}>{j}</MenuItem>
                                )
                              },this)
                              }
                          </Select>
                        </FormControl>
                      </Grid>
                    )
                },this)
                }
                {this.state.parentCategory &&
                  <React.Fragment>
                  {parent_category.map(function(i,index){
                    return(
                      <React.Fragment key={index}>
                      {index == 0 &&
                        <Grid item xs={12} sm={12}>
                        <p className="product_grouping_headlines">
                            Master Attribute Details
                        </p>
                        </Grid>
                      }
                      <Grid item xs={i.attrType == "TEXTBOX" ? 6 : 6} sm={i.attrType == "TEXTBOX" ? 6 : 6} key={index} className={classes.control}>
                          {i.attrType == "TEXTBOX" &&
                              <React.Fragment>
                                  <TextField
                                      onInput={e =>
                                        validatedFields.indexOf(i.name) > -1 && (e.target.value = e.target.value.toString().slice(0, i.name =="Fabric Content" ? 1000 : 20))
                                      }
                                      value={i.data|| ""}
                                      fullWidth
                                      variant="outlined"
                                      name={i.name}
                                      onChange={this.handle_parent_attributes.bind(this,index)}
                                      label={"Enter " + i.name + (i.mandatory ? "*" : "")}
                                      helperText={i.data && i.data.length > 255 && <span className={classes.red}>You're exceeding character limit</span>}
                                      required={i.mandatory ? i.mandatory : false }
                                  />
                              </React.Fragment>
                          }
                          {i.attrType == "TEXTAREA" &&
                                <React.Fragment>
                                  <Typography className={classes.helper}>{i.name + (i.mandatory ? "*" : "")}</Typography>
                                    <CKEditor
                                        id={i.id.toString()}
                                        required={i.mandatory ? i.mandatory : false }
                                        modules={modules}
                                        preserveWhitespace={false}
                                        formats={formats}
                                        content={i.data|| ""}
                                        placeholder={"Enter " + i.name + (i.mandatory ? "*" : "")}
                                        events={{
                                          "change": this.handle_parent_attributes.bind(this,index,"textarea")
                                        }} />
                                        <Typography className={classes.helper}>{i.data && i.data.length > 1000 && <span className={classes.red}>You're exceeding character limit</span>}</Typography>
                                </React.Fragment>
                            }
                          {i.attrType == "DROPDOWN" &&
                              <React.Fragment>
                                  <TextField
                                      select
                                      className="select_margin_top"
                                      value={i.data ? i.data : ""}
                                      onChange={this.handle_parent_attributes.bind(this,index)}
                                      SelectProps={{
                                      native: true,
                                      }}
                                      margin="normal"
                                      fullWidth
                                      required={i.mandatory ? i.mandatory : false }
                                      helperText={"Please Select " + i.name + (i.mandatory ? "*" : "")}
                                      >
                                      <option value="">{"Select " + i.name}</option>
                                      {i.attributeTypeValue.map(function(i,index){
                                          return(<option key={index} value={i.id} disabled={i.status == "ACTIVE" ? false : true}>{i.name}</option>)
                                      },this)}
                                  </TextField>
                              </React.Fragment>
                          }
                          {(i.attrType == "MULTI_VALUED" && i.name == "Type")&&
                              <React.Fragment>
                                  <Select1
                                    name="select_type"
                                    simpleValue
                                    value={i.data ? i.data : ""}
                                    onChange={this.handle_type.bind(this,index)}
                                    placeholder="Search and Select Type"
                                    backspaceRemoves={false}
                                    cache={false}
                                    multi={true}
                                    searchPromptText = "Enter type name to search"
                                    noResultsText = "No type found."
                                    loadingPlaceholder = "Searching type"
                                    options={i.attributeTypeValue.map(function(i,index){
                                      i["value"] = i.id
                                      i["label"] = i.name
                                      i["disabled"] = i.status == "INACTIVE" ? true : false
                                      return i
                                    })}
                                  />
                              </React.Fragment>
                          }
                          {(i.attrType == "MULTI_VALUED" && i.name != "Type") &&
                              <React.Fragment>
                                  <TextField
                                      select
                                      className="select_margin_top"
                                      value={i.data ? i.data : ""}
                                      onChange={this.handle_parent_attributes.bind(this,index)}
                                      SelectProps={{
                                      native: true,
                                      }}
                                      fullWidth
                                      required={i.mandatory ? i.mandatory : false }
                                      multiple={true}
                                      helperText={"Please Select " + i.name + (i.mandatory ? "*" : "")}
                                      >
                                      <option value="">{"Select " + i.name}</option>
                                      {i.attributeTypeValue.map(function(i,index){
                                          return(<option key={index} value={i.id}>{i.name}</option>)
                                      },this)}
                                  </TextField>
                              </React.Fragment>
                          }
                      </Grid>
                      </React.Fragment>
                    )
                  },this)}
                  </React.Fragment>
                }
                {this.state.masterCategory &&
                  <React.Fragment>
                    {attribute_data.map(function(i,index){
                      return(
                        <React.Fragment key={index}>
                        {index == 0 &&
                          <Grid item xs={12} sm={12}>
                          <p className="product_grouping_headlines">
                              Parent Attribute Details
                          </p>
                          </Grid>
                        }
                        <Grid item xs={i.attrType == "TEXTBOX" ? 6 : 6} sm={i.attrType == "TEXTBOX" ? 6 : 6} key={index}>
                             {i.attrType == "TEXTBOX" &&
                                <React.Fragment>
                                    <TextField
                                        label={i.name}
                                        value={i.data ? i.data  : ""}
                                        margin="normal"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        name={i.name}
                                        onChange={this.handle_master_attributes.bind(this,index)}
                                        placeholder={"Enter " + i.name  + (i.mandatory ? "*" : "")}
                                        inputProps={{
                                            max: 1000
                                        }}
                                        onInput={e =>
                                          validatedFields.indexOf(i.name) > -1 && (e.target.value = e.target.value.toString().slice(0, 1000))
                                        }
                                        helperText={i.data && i.data.length > 255 && <span className={classes.red}>You're exceeding character limit</span>}
                                        required={i.mandatory ? i.mandatory : false }
                                    />
                                </React.Fragment>
                            } 
                            {i.attrType == "TEXTAREA" &&
                                <React.Fragment>
                                  <Typography className={classes.helper}>{i.name + (i.mandatory ? "*" : "")}</Typography>
                                    <CKEditor
                                        id={i.id.toString()}
                                        required={i.mandatory ? i.mandatory : false }
                                        modules={modules}
                                        preserveWhitespace={false}
                                        formats={formats}
                                        content={i.data|| ""}
                                        placeholder={"Enter " + i.name + (i.mandatory ? "*" : "")}
                                        events={{
                                          "change": this.handle_master_attributes.bind(this,index,"textarea")
                                        }} />
                                        <Typography className={classes.helper}>{i.data && i.data.length > 1000 && <span className={classes.red}>You're exceeding character limit</span>}</Typography>
                                </React.Fragment>
                            }
                            {i.attrType == "DROPDOWN" &&
                                <React.Fragment>
                                    <TextField
                                        select
                                        className="select_margin_top"
                                        value={i.data ? i.data : ""}
                                        onChange={this.handle_master_attributes.bind(this,index)}
                                        SelectProps={{
                                        native: true,
                                        }}
                                        margin="normal"
                                        fullWidth
                                        required={i.mandatory}
                                        helperText={"Please Select " + i.name + (i.mandatory ? "*" : "")}
                                        >
                                        <option value="">{"Select " + i.name}</option>
                                        {i.attributeTypeValue.map(function(i,index){
                                            return(<option key={index} value={i.id} disabled={i.status == "ACTIVE" ? false : true}>{i.name}</option>)
                                        },this)}
                                    </TextField>
                                </React.Fragment>
                            }
                            {i.attrType == "MULTI_VALUED" &&
                                <React.Fragment>
                                    <TextField
                                        select
                                        className="select_margin_top"
                                        value={i.data ? i.data : ""}
                                        onChange={this.handle_master_attributes.bind(this,index)}
                                        SelectProps={{
                                        native: true,
                                        }}
                                        margin="normal"
                                        fullWidth
                                        required={i.mandatory}
                                        multiple={true}
                                        helperText={"Please Select " + i.name  + (i.mandatory ? "*" : "")}
                                        >
                                        <option value="">{"Select " + i.name}</option>
                                        {i.attributeTypeValue.map(function(i,index){
                                            return(<option key={index} value={i.id}>{i.name}</option>)
                                        },this)}
                                    </TextField>
                                </React.Fragment>
                            }
                        </Grid>
                        </React.Fragment>
                      )
                    },this)
                    }
                  </React.Fragment>
                }
                    <React.Fragment>
                    <Grid item xs={12} sm={12}>
                      <p id="color_container" className="product_grouping_headlines">
                        Product Line Details
                      </p>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      {/* <TextField
                          select
                          id="select_color"
                          className="select_margin_top"
                          value={""}
                          onChange={this.handle_color.bind(this)}
                          SelectProps={{
                            native: true,
                          }}
                          margin="normal"
                          fullWidth
                          name="color"
                          helperText={"Please Select Color"}
                          >
                          <option value="">{"Select Color"}</option>
                            {this.product_line_color.map(function(i,index){
                            return(
                              <option key={index} value={i.id+"_"+i.name} data-colorname={i.name}>{i.name}</option>
                            )
                            },this)}
                      </TextField> */}
                      <Async 
                        id="color_search"
                        ref="color_search"
                        value={""}
                        onChange={this.handle_color.bind(this)} 
                        placeholder="Search and Select Color"
                        loadOptions={this.get_color_data.bind(this)} 
                        backspaceRemoves={true}
                        autoload = {false}
                        cache={false}
                        searchPromptText = "Enter color name to search"
                        noResultsText = "No color found."
                        loadingPlaceholder = "Searching color"
                      />
                    </Grid>
                    </React.Fragment>
                {this.state.productLines_data.map(function(i,iindex){
                  var sizes = i.sizes.map(function(j,jindex){
                    return(
                      <React.Fragment key={jindex}>
                      <Grid  item xs={2} sm={2}>
                          <TextField
                            label="Enter Sku Id"
                            value={j.skuId || ""}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true
                            }}
                            name="label"
                            type="text"
                            onChange={this.handle_edit_row.bind(this,iindex,jindex,"skuId")}
                            placeholder="Enter Sku ID"
                            fullWidth
                            disabled={config.namespace === 'koovs'}
                            inputProps={{
                            readOnly:(this.state.edit_id  && !j.new ? true :  false),
                            step: "1",
                            min:"0",
                            }}
                            />
                        </Grid>
                        <Grid item xs={2} sm={2}>
                          <TextField
                              select
                              id="select_size"
                              value={j.size || ""}
                              onChange={this.handle_edit_row.bind(this,iindex,jindex,"size")}
                              SelectProps={{
                                native: true,
                              }}
                              margin="normal"
                              fullWidth
                              name="size"
                              label="Please Select Size"
                              required
                              //disabled={edit_id && !j.new ? true : false}
                              InputLabelProps={{
                                shrink: true
                            }}
                              >
                              <option value="">{"Select Size"}</option>
                                {this.product_line_size.map(function(i,index){
                                return(
                                  <option key={index} value={i.id} data-iindex={iindex} data-jindex={jindex} data-sizename={i.name} disabled={i.disabled}>{i.name}</option>
                                )
                                },this)}
                          </TextField>
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <TextField
                            label="EAN Code"
                            value={j.ean}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true
                            }}
                            disabled={edit_id && !j.new ? true : false}
                            name="ean"
                            onChange={this.handle_edit_row.bind(this,iindex,jindex,"ean")}
                            fullWidth
                            />
                          </Grid>
                          <Grid item xs={2} sm={2}>
                            <TextField
                            label="Price"
                            required
                            value={j.price}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true
                            }}
                            name="label"
                            type="number"
                            onChange={this.handle_edit_row.bind(this,iindex,jindex,"price")}
                            placeholder="Enter Price"
                            fullWidth
                            inputProps={{
                            readOnly:(this.state.edit_id  && !j.new ? true :  false),
                            step: "1",
                            min:"0",
                            max:this.state.max_mrp ? this.state.max_mrp : "99999"
                            }}
                            />
                          </Grid>
                          <Grid item xs={2} sm={2}>
                            <TextField
                            label="Discount (in %)"
                            required
                            value={j.discount}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true
                            }}
                            name="label"
                            type="number"
                            onChange={this.handle_edit_row.bind(this,iindex,jindex,"discount")}
                            placeholder="Enter Discount"
                            fullWidth
                            inputProps={{
                            step: "1",
                            max:"100",
                            min:"0",
                            }}
                            />
                          </Grid>
                            {(jindex == 0 && i.sizes.length == 1) &&
                            <Grid className="row_grid_attribute_value vertical_align" item xs={1} sm={1}>
                                <AddList onClick={this.handle_add_row.bind(this,iindex)} /> 
                            </Grid>
                            }
                            <Grid className="row_grid_attribute_value vertical_align" item xs={1} sm={1}>
                              {(!this.state.live_status && i.sizes.length > 1 && !j.skuId) &&
                                <Remove onClick={this.handle_delete_row.bind(this,iindex,jindex)}/>
                              }
                              {(this.state.live_status && j.new && i.sizes.length > 1 && !j.skuId) &&
                                <Remove onClick={this.handle_delete_row.bind(this,iindex,jindex)}/>
                              }
                            </Grid>  
                            
                            {((i.sizes.length - 1 == jindex )&& i.sizes.length > 1) &&
                            <Grid className="row_grid_attribute_value vertical_align" item xs={1} sm={1}>
                                <AddList onClick={this.handle_add_row.bind(this,iindex)} /> 
                            </Grid>
                            }
                            
                      </React.Fragment>
                    )
                  },this)
                    return(
                      <React.Fragment key={iindex}>
                        <div className="color_container">
                        <p>{iindex+1}. {i.colorValue ? i.colorValue : i.color_name }</p>
                        <Grid className="color_code_margin_top" item xs={3} sm={3}>
                          <Async 
                          id="color_search"
                          ref="color_search"
                          value={i}
                          onChange={this.handle_edit_color.bind(this, iindex)} 
                          placeholder="Search and Select Color"
                          loadOptions={this.get_color_data.bind(this)} 
                          backspaceRemoves={false}
                          autoload = {false}
                          cache={false}
                          searchPromptText = "Enter color name to search"
                          noResultsText = "No color found."
                          loadingPlaceholder = "Searching color"
                        />
                        </Grid>
                        <Grid className="color_code_margin_top" item xs={3} sm={3} className={classes.control}>
                            <TextField
                            label="Enter Line Id"
                            value={i.lineId || ""}
                            margin="normal"
                            name="label"
                            type="text"
                            onChange={this.handle_lineId_row.bind(this,iindex)}
                            placeholder="Enter Line ID"
                            fullWidth
                            disabled={config.namespace === 'koovs'}
                            inputProps={{
                            readOnly:(this.state.edit_id && !i.new ? true : false),
                            step: "1",
                            min:"0",
                            }}
                            />
                        </Grid>
                        {/* <Grid className="color_code_margin_top" item xs={3} sm={3}>
                          <TextField
                              select
                              id="select_color_code"
                              value={i.colorCode || ""}
                              onChange={this.handle_colorcode_row.bind(this,iindex)}
                              SelectProps={{
                                native: true,
                              }}
                              margin="normal"
                              fullWidth
                              name="color_code"
                              helperText={"Please Select Color Code"}
                              required={config.namespace !== 'koovs'}
                              >
                              <option value="">{"Select Color Code"}</option>
                                {this.state.color_codes.map(function(i,index){
                                return(
                                  <option key={index} value={i.id} data-iindex={iindex} data-sizename={i.name}>{i.name}</option>
                                )
                                },this)}
                          </TextField>
                        </Grid> */}
                        {i.colorCode &&
                            <div style={{ backgroundColor : this.state.color_codes.filter((j) => i.colorCode == j.id)[0].name }} className="show_color_code"></div>
                        }
                        {(!this.state.live_status) &&
                          <Remove className="color_remove" onClick={this.handle_delete_color.bind(this,iindex)}/>
                        }
                        {(this.state.live_status && i.new) &&
                          <Remove className="color_remove" onClick={this.handle_delete_color.bind(this,iindex)}/>
                        }
                        {/* {!i.add_images &&
                          <Button className="add_image_button" onClick={this.handle_add_images.bind(this,iindex)} variant="contained" color="primary"> <Add className="table_icons"/>Images </Button>
                        } */}
                        </div>
                        {sizes}
                        {i.productMeasurement &&
                          <React.Fragment>
                            <Grid item xs={12} sm={12}>
                              <p id="color_container" className="product_grouping_headlines">
                                  Model Details
                              </p>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                              <div className={"product_images"}>
                                  <img height="200px" width="200px" src={config.imageUrl + i.productMeasurement.image}/>
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <label className="measurement_label">Age Group</label>
                                <label className="measurement_value">{i.productMeasurement.ageGroup}</label>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <label className="measurement_label">Bust</label>
                                <label className="measurement_value">{i.productMeasurement.bust}</label>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <label className="measurement_label">Height</label>
                                <label className="measurement_value">{i.productMeasurement.height}</label>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <label className="measurement_label">Hips</label>
                                <label className="measurement_value">{i.productMeasurement.hips}</label>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <label className="measurement_label">Info</label>
                                <label className="measurement_value">{i.productMeasurement.info}</label>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <label className="measurement_label">Name</label>
                                <label className="measurement_value">{i.productMeasurement.name}</label>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <label className="measurement_label">Shoulder</label>
                                <label className="measurement_value">{i.productMeasurement.shoulder}</label>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <label className="measurement_label">Size</label>
                                <label className="measurement_value">{i.productMeasurement.size}</label>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <label className="measurement_label">Waist</label>
                                <label className="measurement_value">{i.productMeasurement.waist}</label>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <label className="measurement_label">Gender</label>
                                <label className="measurement_value">{i.productMeasurement.gender}</label>
                            </Grid>
                          </React.Fragment>
                        }
                        {/* {i.add_images &&
                          <React.Fragment>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  <label htmlFor="video" title="Upload Video"><span>V</span></label>
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  <label htmlFor="default" title="Upload Default Image"><span>D</span></label>
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  <label htmlFor="front" title="Upload Front Image"><span>F</span></label>
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  <label htmlFor="back" title="Upload Back Image"><span>B</span></label>
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  <label htmlFor="left" title="Upload Left Image"><span>L</span></label>
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  <label htmlFor="right" title="Upload Right Image"><span>R</span></label>
                              </div>
                            </Grid>
                          </React.Fragment>
                        } */}
                      </React.Fragment>
                    )
                },this)
                }

              </Grid>
              <Grid container justify="center" id="add_container">
                <Grid item>
                  <Button variant="contained" color="primary" type="submit" className={classes.button}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            </form>
            <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.is_modal_open}
            onClose={this.handle_ok.bind(this)}
            >
              <div className={classes.modalpaper}>
              <Typography variant="h6" id="modal-title">
                Product has been created successfully.
              </Typography>
              <Typography variant="subtitle1" id="simple-modal-description">
                
              </Typography>
              </div>
            </Modal>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}



const mapStateToProps = state => ({
  data: state.product.data,
  brands : state.brand.data.data,
  brand_data: state.brand.data,
  loading: state.product.loading,
  error: state.product.error,
  metadata : state.product.metadata,
  enum : state.attributetype.enum,
  email: state.signin.data.body.data.user.email,
});

export default withStyles(styles)(connect(mapStateToProps)(Product));