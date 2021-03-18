import React from "react";
import {Typography,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import {LiveTv as Live, Schedule} from "@material-ui/icons";
import ImgUrl from '../../../config.js'
import {baseUrl} from '../../../config.js'
import ReactQuill from 'react-quill'; 
import LinearProgress from '@material-ui/core/LinearProgress';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import { Async } from 'react-select-v1';
import { fetchAllBrand , patchBrand, fetchBrandDetail } from "../../store/actions/brand";
import axios from "axios";
import {
    fetchProductDetail,
    postProduct,
    putProduct,
    fetchMetadata,
    makeProductLive
} from "../../store/actions/product";
import {postLiveLaterApi} from "../../api/productapi";
import {
  fetchAllEnum
} from "../../store/actions/attributetype";
import { connect } from "react-redux";
import Modal from '@material-ui/core/Modal';
import DatePicker from "react-datepicker";
import CircularProgress from "@material-ui/core/CircularProgress";
import {env} from '../../../config';
import Notify from "../../components/Notify";
const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link'],
    ['clean']
  ],
}
var t1, t0;

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
    padding: theme.spacing.unit * 1,
    marginTop: "10px",
    maxWidth: "100%"
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
});

class Product extends React.Component {
  state = {
    type :  "edit",
    edit_id : "",
    metadata : [],
    brands:[],
    global_category:[],
    all_category : [],
    enum : [],
    enum_data : {},
    parentCategory : "",
    masterCategory : "",
    is_add_color : false,
    product_line_size : [],
    product_line_color : [],
    productLines_data : [],
    product : "",
    is_modal_open : false,
    max_mrp : "",
    merchantName : "",
    liveStatus : false,
    color_codes : [],
    global_category_keys : [{"name":"MRP_mrp"},{"name":"Warehouse_warehouse"},{"name":"Procurer_procurer"},{"name":"Shop Name_shop"},{"name":"EAN/UTC Code_ean"},{"name":"Season_season"},{"name":"Long Description_longDescription"},{"name":"Short Description_shortDescription"},{"name":"Year_year"},{"name":"HSN Code_hsnCode"},{"name":"Collaboration_collaboration"},],
    showDatePicker: false,
    liveLater: new Date(),
    message: "",
    loader: false,
    procurer: "",
    view_count : 0,
    show_lines : false,
    can_line_be_live : false,
    selected_live_line: []
};

  

componentDidMount = () => {
  this.get_all_enum();
  t0 = performance.now();
   this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "edit",
    edit_id : this.props.match.params.id ? this.props.match.params.id : "",
    liveStatus : this.props.match.params.liveStatus ? this.props.match.params.liveStatus : ""
  },()=>{
        this.props.dispatch(fetchProductDetail(this.state.edit_id)).then(() =>{
          if(!this.props.error){
            this.setState({
              product : this.props.data.data.response,
            },()=>{
              this.get_meta_data();    
            })
          } 
          else{
            alert("Not able to find product or the product has corrupted data.")
            this.props.history.goBack();
          }
          }
        )
  })
};



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
     this.can_line_be_live()
     this.set_parent_child_attributes();   // after gathering the category data. Called function to get and set the master and parent category data.
   })
}


can_line_be_live(){
  var mrp = this.state.global_category.filter((i) => i.name == "MRP" )[0].data
  var longdescription = this.state.global_category.filter((i) => i.name == "Long Description" )[0].data.toString();
  console.log(mrp , longdescription, this.state.productName, this.state.masterCategory, this.state.parentCategory)
  console.log(this.state.productName != "" && this.state.masterCategory != "" && this.state.parentCategory && mrp != "" && longdescription != "")
  if(this.state.productName && this.state.masterCategory && this.state.parentCategory && mrp && longdescription){
    this.setState({ can_line_be_live : true })
  }
  else{
    this.setState({ can_line_be_live :  false})
  }
}


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

/**
 * Function to get all the brands
 */

get_brand_data(input){
  if(input != ""){
    return this.props.dispatch(fetchAllBrand(input,"")).then(() =>{
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
      this.setState({ edit_id :  newProps.match.params.id , liveStatus : newProps.match.params.liveStatus },()=>{
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

handle_ok(){
  this.setState({ is_modal_open :  false },()=>{
    this.props.history.push("/catalogue/list/product")
  })
}


  handleform(event){
    event.preventDefault();
    if(this.state.productLines_data.length > 0){
    var self = this;
    var attribute_data = {};
    this.state.all_category.filter((i) => i.id == this.state.parentCategory)[0].attributeTypes.map(function(i,index){
        attribute_data["" + i.id] = ""+ ((i.attrType == "DROPDOWN" || i.attrType == "MULTI_VALUED") ? "v:" : "f:") + i.data
    })

    this.state.all_category.filter((i) => i.id == this.state.parentCategory)[0].subCategories.filter((j) => j.id == this.state.masterCategory)[0].attributeTypes.map(function(i,index){
      attribute_data["" + i.id] = ""+ ((i.attrType == "DROPDOWN" || i.attrType == "MULTI_VALUED") ? "v:" : "f:") + i.data
  })

    if(this.state.type == "create"){
      var formdata = {
        "attributes": attribute_data,
        "merchantCode": this.state.merchantCode,
        "merchantName": this.state.merchantName,
        "productGlobalValues": {
          "brand": this.state.brand_id,
          "masterCategory": this.state.masterCategory,
          "parentCategory": this.state.parentCategory,
          "mrp" : this.state.global_category.filter((i) => i.name == "MRP" )[0] ? this.state.global_category.filter((i) => i.name == "MRP" )[0].data : "",
          "workflow" : this.state.enum_data.workflow,
          "gender" : this.state.enum_data.gender,
          "warehouse" : this.state.global_category.filter((i) => i.name == "Warehouse")[0] ? this.state.global_category.filter((i) => i.name == "Warehouse")[0].data : "",
          "procurer" : this.state.procurer,
          "shop" : this.state.global_category.filter((i) => i.name == "Shop Name")[0] ? this.state.global_category.filter((i) => i.name == "Shop Name")[0].data : "",
          "ean" : this.state.global_category.filter((i) => i.name == "EAN/UTC Code")[0] ? this.state.global_category.filter((i) => i.name == "EAN/UTC Code")[0].data : "",
          "brandType" : this.state.enum_data.brandType,
          "codType" : this.state.enum_data.CODType,
          "productType" : this.state.enum_data.productType,
          "season" : this.state.global_category.filter((i) => i.name == "Season")[0] ? this.state.global_category.filter((i) => i.name == "Season")[0].data : "",
          "longDescription" : this.state.global_category.filter((i) => i.name == "Long Description")[0] ? this.state.global_category.filter((i) => i.name == "Long Description")[0].data : "",
          "shortDescription" : this.state.global_category.filter((i) => i.name == "Short Description")[0] ? this.state.global_category.filter((i) => i.name == "Short Description")[0].data : "",
          "year" : this.state.global_category.filter((i) => i.name == "Year")[0] ? this.state.global_category.filter((i) => i.name == "Year")[0].data : "",
          "hsnCode" : this.state.global_category.filter((i) => i.name == "HSN Code")[0] ? this.state.global_category.filter((i) => i.name == "HSN Code")[0].data : "",
          "collaboration" :  this.state.global_category.filter((i) => i.name == "Collaboration")[0] ? this.state.global_category.filter((i) => i.name == "Collaboration")[0].data : ""
        },
        "productLines": this.state.productLines_data,
        "productName": this.state.productName,
      }
      this.props.dispatch(postProduct(JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          // this.setState({ is_modal_open :  true})
          this.props.history.push("/catalogue/list/product")
        }
      })
    }
    else if(this.state.type == "edit" && this.state.edit_id){
      var formdata = {
        "attributes": attribute_data,
        "merchantCode": this.state.merchantCode,
        "merchantName": this.state.merchantName,
        "productId" : this.state.edit_id,
        "productGlobalValues": {
          "brand": this.state.brand_id,
          "masterCategory": this.state.masterCategory,
          "parentCategory": this.state.parentCategory,
          "mrp" : this.state.global_category.filter((i) => i.name == "MRP" )[0] ? this.state.global_category.filter((i) => i.name == "MRP" )[0].data : "",
          "workflow" : this.state.enum_data.workflow,
          "gender" : this.state.enum_data.gender,
          "warehouse" : this.state.global_category.filter((i) => i.name == "Warehouse")[0] ? this.state.global_category.filter((i) => i.name == "Warehouse")[0].data : "",
          "procurer" : this.state.procurer,
          "shop" : this.state.global_category.filter((i) => i.name == "Shop Name")[0] ? this.state.global_category.filter((i) => i.name == "Shop Name")[0].data : "",
          "ean" : this.state.global_category.filter((i) => i.name == "EAN/UTC Code")[0] ? this.state.global_category.filter((i) => i.name == "EAN/UTC Code")[0].data : "",
          "brandType" : this.state.enum_data.brandType,
          "codType" : this.state.enum_data.CODType,
          "productType" : this.state.enum_data.productType,
          "season" : this.state.global_category.filter((i) => i.name == "Season")[0] ? this.state.global_category.filter((i) => i.name == "Season")[0].data : "",
          "longDescription" : this.state.global_category.filter((i) => i.name == "Long Description")[0] ? this.state.global_category.filter((i) => i.name == "Long Description")[0].data : "",
          "shortDescription" : this.state.global_category.filter((i) => i.name == "Short Description")[0] ? this.state.global_category.filter((i) => i.name == "Short Description")[0].data : "",
          "year" : this.state.global_category.filter((i) => i.name == "Year")[0] ? this.state.global_category.filter((i) => i.name == "Year")[0].data : "",
          "hsnCode" : this.state.global_category.filter((i) => i.name == "HSN Code")[0] ? this.state.global_category.filter((i) => i.name == "HSN Code")[0].data : "",
          "collaboration" :  this.state.global_category.filter((i) => i.name == "Collaboration")[0] ? this.state.global_category.filter((i) => i.name == "Collaboration")[0].data : ""
        },
        "productLines": this.state.productLines_data,
        "productName": this.state.productName,
      }
      this.props.dispatch(putProduct(this.state.edit_id,JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          self.props.history.push("/catalogue/list/product")
        }
      })
    }
  }
  else{
    alert("Please add atleast one product line data.")
  }
  }

  handle_global_category(index,event){
      this.state.global_category[index].data = event.target.value
      if(this.state.global_category[index].name == "MRP"){
        this.setState({ max_mrp : event.target.value })
      }
      this.setState({ global_category : this.state.global_category })
  }


  handle_master_attributes(index,event){
    this.state.all_category.filter((i) => i.id == this.state.parentCategory)[0].
                    subCategories.filter((j) => j.id == this.state.masterCategory)[0].attributeTypes[index].data = event.target.value
    this.setState({ all_category : this.state.all_category})               
  }

  handle_parent_attributes(index,event){
    this.state.all_category.filter((i) => i.id == this.state.parentCategory)[0].attributeTypes[index].data = event.target.value
    this.setState({ all_category : this.state.all_category})
  }

  handle_enum(i,event){
    var value = event.target.value 
    this.state.enum_data[""+(i == "brand" ? "brandType" : i)] = value
    this.setState({ enum_data :  this.state.enum_data})
  }

  handle_category(type, event){
    if(type == "parent"){
      this.setState({ parentCategory : event.target.value , masterCategory : ""})
    }
    else{
      this.setState({ masterCategory : event.target.value })
    }
  }

  handle_add_color(){
    this.setState({is_add_color : true},()=>{
      document.getElementById('color_container').scrollIntoView();
    })
  }


  handle_color(event){
    event.preventDefault();
    var obj ={
      "color": event.target.value.split("_")[0],
      "color_name" : event.target.value.split("_")[1],
      "sizes" : [
        {
          "price" : "",
          "size" : "",
          "discount" : "",
        }
      ],
    }

    var data = this.state.productLines_data
    data.push(obj)
    this.setState({ productLines_data : data })
  }

  handle_add_row(iindex){
    var obj ={
          "price" : "",
          "size" : "",
          "discount" : "",
        }

    this.state.productLines_data[iindex].sizes.push(obj)
    this.setState({ productLines_data : this.state.productLines_data },()=>{
       document.getElementById('add_container').scrollIntoView();
    })
  }



  handle_delete_row(iindex,jind){
    var data = this.state.productLines_data
    data[iindex].sizes.splice(jind,1)
    this.setState({ productLines_data : data},()=>{
      console.log(this.state.productLines_data)
    })
  }


  handle_edit_row(iindex,jindex,type,event){
    // if(type == "size"){
    //   this.state.product_line_size.map((i) => {i.disabled = false})
    //   this.state.product_line_size[jindex].disabled = true
    // }
    this.state.productLines_data[iindex].sizes[jindex][""+type] = (type == "discount" || type == "price") ? (event.target.value != "" ? (Math.abs(event.target.value)).toString() : "") : (event.target.value)
    this.setState({ productLines_data : this.state.productLines_data })
  }

  handle_delete_color(iindex){
    var data = this.state.productLines_data
    data.splice(iindex,1)
    this.setState({ productLines_data : data })
  }

  handle_add_images(iindex){
    this.state.productLines_data[iindex].add_images = true
    this.setState({ productLines_data : this.state.productLines_data})
  }


  make_product_live(){
    var self = this;
    if(confirm("Are you sure you want to make this product live ?")){
      this.props.dispatch(makeProductLive(this.props.match.params.id, this.props.email)).then((res)=>{
        if(!self.props.error){
          self.props.history.push("/catalogue/list/product")
        }
      })
    }
  }

  handleToggle = () => {
    this.setState({showDatePicker: !this.state.showDatePicker});
  }

  handleLiveLaterSubmit = () => {
    const form = {
      createdBy: this.props.email,
      productId: this.props.data.data.response.productId,
      time: this.state.liveLater
    };
    const that = this;
    this.setState({
      message: "",
      loader: false
    }, () => {
      if(new Date(this.state.liveLater) <= new Date()){
        that.setState({message : "Invalid time entered"});
      }else{
        postLiveLaterApi(this.props.userId, form).then(res =>
          res && res.status < 350 ? that.setState({
            message: res.data.message,
            loader: false,
            showDatePicker: false,
            liveStatus: false
          }) : that.setState({
            message: res.data.message,
            loader: false
          }))
      }
    });
  }

  handleLiveLaterChange = (e) => {
    const that = this;
    this.setState({message: ""}, () => {
      if(new Date(e) <= new Date()){
        that.setState({message : "Invalid time entered"});
      }else{
        that.setState({liveLater: e});
      }
    });
  }
  preview_product(){
    this.setState({ view_count : this.state.view_count + 1 },()=>{
      if(this.state.liveStatus != "true"){
        window.open(`${baseUrl}/${this.state.edit_id}-${this.state.edit_id}/${this.state.productLines_data[0].sizes[0].skuId}.html`, "_blank")
      }
      else{
        window.open(`${baseUrl}/ops-pdp-preview/${this.state.edit_id}-${this.state.edit_id}/${this.state.productLines_data[0].sizes[0].skuId}.html`, "_blank")
      }
    })
  }


  handleLineLive(){
    this.setState({ show_lines : !this.state.show_lines})
  }

  handle_line_check(id){
    var data = this.state.selected_live_line;
    if(!data.includes(id)){
      data.push(id)
    }
    else{
      var updated_data = data.filter((i) => i != id)
      data = updated_data
    }
    this.setState({ selected_live_line : data})
  }

  handleLineLiveSubmit(){
    if(this.state.selected_live_line.length > 0){
      var formdata  = {
        "productId" : this.state.edit_id,
        "lineIds" : this.state.selected_live_line.toString(),
        "userId" : this.props.email
      }
      axios.post("/product/liveLines",formdata,{
        headers: {
          'X-API-CLIENT': 'web',
          'x-user-id': localStorage[env+"_koovs_userid"] 
        }}).then(function(res){
          if(res.data.statusCode == 200){
            alert("Selected Line's are live now.")
            window.location.reload();
          }
          else if(res.data.errorExists){
            alert(res.data.message)
          }
     })
    }
    else{
      alert("Please select atleast one Line ID to live.")
    }
  }


  render() {
    const that = this;
    const { classes, match, loading } = this.props;
    const {showDatePicker, liveLater, loader, message, show_lines} = this.state;
    const validatedFields = ["HSN Code", "EAN/UTC Code", "Season", "Procurer", "Fabric Content", "UOM"];
    var attribute_data = this.state.all_category.filter((i) => i.id == this.state.parentCategory)[0] ? ( this.state.all_category.filter((i) => i.id == this.state.parentCategory)[0].subCategories.filter((j) => j.id == this.state.masterCategory)[0] ? this.state.all_category.filter((i) => i.id == this.state.parentCategory)[0].subCategories.filter((j) => j.id == this.state.masterCategory)[0].attributeTypes : []) : [];
    var show_avaliable_lines = this.state.productLines_data.filter(function(i){
      var show =  false 
      i.sizes.map(function(j){
        if(j.images){
          show = true;
        }
      })
      if(show){
        return i 
      }
    })
    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        {!loading ? (
          <React.Fragment>
            <Grid container justify="space-between" lg={12} className={classes.wrapper}>
              <Typography variant="h5" gutterBottom component="h5">
              Review Product  ({match.params.id})
              <div className="table_button" style={{ float : "none", marginLeft : "20px"}}>
              {this.state.product.productGlobalValues &&
                <React.Fragment>
                {show_avaliable_lines.length  > 0 &&
                  <Button className="table_onbutton" onClick={this.preview_product.bind(this)} variant="contained" color="primary"> <Live className="table_icons"/>&nbsp; Preview Product </Button> 
                }
                {this.state.liveStatus != "false" && this.state.product.productGlobalValues.status !=
                          "LIVE" && (
                      <React.Fragment>
                          &nbsp; 
                          <Button
                            className="table_onbutton"
                            style={{ marginLeft: "2em" }}
                            onClick={this.make_product_live.bind(this)}
                            variant="contained"
                            color="primary"
                          >
                            <Live className="table_icons" />
                            &nbsp; Make Product Live
                          </Button>
                          <Button
                            className="table_onbutton"
                            style={{ marginLeft: "2em" }}
                            onClick={this.handleToggle}
                            variant="contained"
                            color="primary"
                          >
                            <Schedule className="table_icons" />
                            &nbsp; Live Product Later
                          </Button>

                          


                      </React.Fragment>
                )}
                {this.state.can_line_be_live &&
                  <Button
                    className="table_onbutton"
                    style={{ marginLeft: "2em" }}
                    onClick={this.handleLineLive.bind(this)}
                    variant="contained"
                    color="primary"
                  >
                    <Live className="table_icons" />
                    &nbsp; Live Line
                  </Button>
                }
                </React.Fragment>
              }
              </div>
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
                      {(this.props.error.error.message)}
                    </p>
                    } 
                  </div>
                }
            </Typography>
            <Button variant="contained" color="primary" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>
           



            {show_lines &&
              <Grid style={{ marginTop : 20, marginBottom : 20}} container spacing={12} alignItems="center">
                <br/>
                <Grid item xs={12} sm={12}>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Select Line to make live : </FormLabel>
                    {show_avaliable_lines.length > 0 && 
                        <FormGroup row>
                        {show_avaliable_lines.map(function(i,index){
                          return(
                            <FormControlLabel key={"checkbox_"+i.lineId} control={<Checkbox color="primary" disabled={i.status == "LIVE"} checked={this.state.selected_live_line.includes(i.lineId)} onChange={this.handle_line_check.bind(this, i.lineId)} />} label={i.colorValue + " (" + i.lineId + ") " + (i.status == "LIVE" ? "Already Live" : "")}/>
                          )
                        },this)
                        }
                        </FormGroup>
                    }
                    {show_avaliable_lines.length == 0 &&
                      <p>Please Upload atleast default image at one Line.</p>
                    }
                  {loader ? <CircularProgress /> : (this.state.selected_live_line.length > 0 ? <Button variant="contained" color="primary" onClick={this.handleLineLiveSubmit.bind(this)}>Submit </Button> : "")}
                </FormControl>
                {show_avaliable_lines.length > 0 && 
                <Grid item xs={12} sm={12}>
                </Grid>
                }
                </Grid>
                <br/>
              </Grid>
            }
            {showDatePicker && <Grid container spacing={40} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <DatePicker
                        selected={liveLater}
                        onChange={(date) => this.handleLiveLaterChange(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        placeholderText="Enter Live Later Date"
                        timeIntervals={1}
                        minDate={new Date()}
                      />
                </Grid>
                <Grid item xs={12} sm={3}>
                {loader ? <CircularProgress /> : <Button variant="contained" color="primary" onClick={this.handleLiveLaterSubmit}>
                    Submit
                  </Button>}
                </Grid>
              </Grid>}
            <div className="view_product">
            <form>
            <Paper className={classes.paper}>
              <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                  <p className="product_grouping_headlines">
                     Procurement Details
                  </p>
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Product Name"
                    variant="outlined"
                    value={this.state.productName || ""}
                    name="productName"
                    onChange={(e) => { this.setState({ productName :  (e.target.value) })}}
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Merchant Code"
                    value={this.state.merchantCode || ""}
                    fullWidth
                    variant="outlined"
                    name="merchantCode"
                    onChange={(e) => { this.setState({ merchantCode : (e.target.value) })}}
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*"
                    }}
                  />
                </Grid>
                 <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Merchant Name"
                    variant="outlined"
                    value={this.state.merchantName || ""}
                    fullWidth
                    name="merchantName"
                    onChange={(e) => { this.setState({ merchantName : (e.target.value) })}}
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                  />
                </Grid> 
                <Grid item xs={4} sm={4} className={classes.control}>
                  <TextField
                    label="Procurer"
                    variant="outlined"
                    value={this.state.procurer || ""}
                    fullWidth
                    name="procurer"
                    onChange={e => this.setState({procurer: e.target.value})}
                    placeholder="Enter Procurer"
                    inputProps={{
                      maxLength : "20",
                    }}
                    onInput={e =>
                      (e.target.value = e.target.value.toString().slice(0, 20))
                    }
                  />
                </Grid>
                {/* <Grid item xs={12} sm={12}>
                  <p className="product_grouping_headlines">
                    Basic Details
                  </p>
                </Grid> */}
                <Grid item xs={4} sm={4} className={classes.control}>
                    {/* <TextField
                    select
                    className="select_margin_top"
                    value={this.state.brand_id ? this.state.brand_id : ""}
                    onChange={(e) => { this.setState({ brand_id : e.target.value})}}
                    SelectProps={{
                    native: true,
                    }}
                    margin="normal"
                    fullWidth
                    required
                    helperText="Brand name*"
                    >
                    <option value="">Select Brand Name</option>
                    {this.state.brands.map(function(i,index){
                        return(<option key={index} value={i.brandId}>{i.brandName}</option>)
                    },this)}
                    </TextField> */}
                    <Async 
                      id="brand_search"
                      ref="brand_search"
                      value={this.state.brand_id ? this.state.brand_id : ""}
                      placeholder="Search and Select Brand"
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
                        <Grid item xs={4} sm={4} key={index} className={classes.control}>
                            {i.attrType == "TEXTBOX" && i.name !== "EAN/UTC Code" &&
                                <React.Fragment>
                                    <TextField
                                        label={i.name}
                                        value={i.data|| ""}
                                        margin="normal"
                                        type ={(i.name == "MRP" || i.name == "Year") ? "number" : "text"}
                                        variant="outlined"
                                        fullWidth
                                        name={i.name}
                                        onChange={this.handle_global_category.bind(this,index)}
                                        placeholder={"Enter " + i.name}
                                        inputProps={{
                                            pattern : "^[a-zA-Z1-9].*",
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
                                    <ReactQuill
                                        id={i.id}
                                        required={i.mandatory ? i.mandatory : false }
                                        modules={modules}
                                        preserveWhitespace={true}
                                        formats={formats}
                                        value={i.data|| ""}
                                        placeholder={"Enter " + i.name}
                                        />
                                </React.Fragment>
                            }
                            {i.attrType == "DROPDOWN" &&
                                <React.Fragment>
                                  <FormControl fullWidth variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">{"Select " + i.name}</InputLabel>
                                      <Select
                                          labelId="demo-simple-select-outlined-label"
                                          id="demo-simple-select-outlined"
                                          label={"Select " + i.name}
                                          value={i.data ? i.data : ""}
                                          onChange={this.handle_global_category.bind(this,index)}
                                          fullWidth
                                          required
                                          helperText={"" + i.name + "*"}
                                          >
                                          {i.attributeTypeValue.map(function(i,index){
                                              return(<MenuItem key={index} value={i.name}>{i.name}</MenuItem>)
                                          },this)}
                                      </Select>
                                  </FormControl>
                                </React.Fragment>
                            }
                            {i.attrType == "MULTI_VALUED" &&
                                <React.Fragment>
                                    <TextField
                                        select
                                        className="select_margin_top"
                                        value={i.data ? i.data : ""}
                                        onChange={this.handle_global_category.bind(this,index)}
                                        margin="normal"
                                        fullWidth
                                        required
                                        multiple
                                        helperText={"" + i.name}
                                        >
                                        <option value="">{"Select " + i.name}</option>
                                        {i.attributeTypeValue.map(function(i,index){
                                            return(<option key={index} value={i.id}>{i.name}</option>)
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
                <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">{"Select Master Category"}</InputLabel>
                  <Select
                      label={"Select Master Category"}
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.parentCategory || ""}
                      onChange={this.handle_category.bind(this,"parent")}
                      fullWidth
                      required
                      >
                      {this.state.all_category.map(function(i,index){
                        return(
                          <MenuItem key={index} value={i.id}>{i.name}</MenuItem>
                        )
                      },this)
                      }
                  </Select>
                  </FormControl>
                  </Grid>
                <Grid item xs={6} sm={6} className={classes.control}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">{"Select Parent Category"}</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label={"Select Parent Category"}
                        value={this.state.masterCategory || ""}
                        onChange={this.handle_category.bind(this, "master")}
                        fullWidth
                        required
                        helperText={" Parent Category*"}
                        >
                        {this.state.parentCategory &&
                          this.state.all_category.filter((i) => i.id == this.state.parentCategory)[0].subCategories.map(function(i,index){
                          return(
                            <MenuItem key={index} value={i.id}>{i.name}</MenuItem>
                          )
                          },this)
                        }
                    </Select>
                    </FormControl>
                  </Grid>
                {/* <Grid item xs={12} sm={12}>
                  <p className="product_grouping_headlines">
                      Other Details
                  </p>
                </Grid> */}
                {Object.keys(this.state.enum).filter((s) => s != "attributeType").map(function(i,index){
                    return !(i == "outfitType" || i == "querySortOrder") && (
                      <Grid item xs={4} sm={4} key={index} className={classes.control}>
                        <FormControl fullWidth variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">{"Select " + (i == "brand" ? "brandType" : i)}</InputLabel>
                      <Select
                           labelId="demo-simple-select-outlined-label"
                           id="demo-simple-select-outlined"
                           label={"Select " + (i == "brand" ? "brandType" : i)}
                          value={this.state.enum_data[""+(i == "brand" ? "brandType" : i)]}
                          onChange={this.handle_enum.bind(this, i)}
                          fullWidth
                          required={i !== "status"}
                          helperText={` ${i == "brand" ? "brandType" : i}${i != "status" ? "*" : ""}`}
                          >
                          {Object.keys(this.state.enum[""+i]).map(function(j,jindex){
                            return(
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
                  {this.state.all_category.filter((i) => i.id == this.state.parentCategory)[0].attributeTypes.map(function(i,index){
                    return(
                      <React.Fragment key={index}>
                      {index == 0 &&
                        <Grid item xs={12} sm={12}>
                        <p className="product_grouping_headlines">
                            Master Attribute Details
                        </p>
                        </Grid>
                      }
                      <Grid item xs={4} sm={4} key={index} className={classes.control}>
                          {i.attrType == "TEXTBOX" &&
                              <React.Fragment>
                                  <TextField
                                      label={i.name}
                                      variant="outlined"
                                      value={i.data|| ""}
                                      margin="normal"
                                      fullWidth
                                      name={i.name}
                                      onChange={this.handle_parent_attributes.bind(this,index)}
                                      placeholder={"Enter " + i.name + (i.mandatory ? "*" : "")}
                                      inputProps={{
                                          pattern : "^[a-zA-Z1-9].*"
                                      }}
                                      required={i.mandatory ? i.mandatory : false }
                                  />
                              </React.Fragment>
                          }
                          {i.attrType == "TEXTAREA" &&
                                <React.Fragment>
                                    <ReactQuill
                                        id={i.id}
                                        required={i.mandatory ? i.mandatory : false }
                                        modules={modules}
                                        preserveWhitespace={true}
                                        formats={formats}
                                        value={i.data|| ""}
                                        placeholder={"Enter " + i.name}
                                         />
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
                                      helperText={" " + i.name + (i.mandatory ? "*" : "")}
                                      >
                                      <option value="">{"Select " + i.name}</option>
                                      {i.attributeTypeValue.map(function(i,index){
                                          return(<option key={index} value={i.id}>{i.name}</option>)
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
                                      onChange={this.handle_parent_attributes.bind(this,index)}
                                      SelectProps={{
                                      native: true,
                                      }}
                                      margin="normal"
                                      fullWidth
                                      required={i.mandatory ? i.mandatory : false }
                                      multiple={true}
                                      helperText={" " + i.name + (i.mandatory ? "*" : "")}
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
                        <Grid item xs={4} sm={4} key={index} className={classes.control}>
                            {i.attrType == "TEXTBOX" &&
                                <React.Fragment>
                                    <TextField
                                        variant="outlined"
                                        label={i.name}
                                        value={i.data|| ""}
                                        fullWidth
                                        name={i.name}
                                        onChange={this.handle_master_attributes.bind(this,index)}
                                        placeholder={"Enter " + i.name  + (i.mandatory ? "*" : "")}
                                        inputProps={{
                                            pattern : "^[a-zA-Z1-9].*"
                                        }}
                                        required={i.mandatory ? i.mandatory : false }
                                    />
                                </React.Fragment>
                            }
                            {i.attrType == "TEXTAREA" &&
                                <React.Fragment>
                                    <ReactQuill
                                        id={i.id}
                                        required={i.mandatory ? i.mandatory : false }
                                        modules={modules}
                                        preserveWhitespace={true}
                                        formats={formats}
                                        value={i.data|| ""}
                                        placeholder={"Enter " + i.name}
                                        />
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
                                        helperText={" " + i.name + (i.mandatory ? "*" : "")}
                                        >
                                        <option value="">{"Select " + i.name}</option>
                                        {i.attributeTypeValue.map(function(i,index){
                                            return(<option key={index} value={i.id}>{i.name}</option>)
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
                                        helperText={" " + i.name  + (i.mandatory ? "*" : "")}
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
                    <Grid item xs={12} sm={12}>
                      <p id="color_container" className="product_grouping_headlines">
                        Product Line Details
                      </p>
                    </Grid>
                {this.state.productLines_data.map(function(i,iindex){
                  var sizes = i.sizes.map(function(j,jindex){
                    return(
                      <React.Fragment key={jindex}>
                      <Grid  item xs={3} sm={3} className={classes.control}>
                          <TextField
                            label="Enter Sku Id"
                            value={j.skuId || ""}
                            variant="outlined"
                            name="label"
                            type="text"
                            onChange={this.handle_edit_row.bind(this,iindex,jindex,"skuId")}
                            placeholder="Enter Sku ID"
                            fullWidth
                            inputProps={{
                            readOnly:(this.state.edit_id  && !j.new ? true :  false),
                            pattern : "^[a-zA-Z1-9].*",
                            step: "1",
                            min:"0",
                            }}
                            />
                        </Grid>
                        <Grid item xs={2} sm={2}>
                          <TextField
                              select
                              value={j.size || ""}
                              onChange={this.handle_edit_row.bind(this,iindex,jindex,"size")}
                              SelectProps={{
                                native: true,
                              }}
                              margin="normal"
                              fullWidth
                              name="size"
                              label="Size*"
                              required
                              >
                              <option value="">{"Select Size"}</option>
                                {that.product_line_size.map(function(i,index){
                                return(
                                  <option key={index} value={i.id} data-sizename={i.name} disabled={i.disabled}>{i.name}</option>
                                )
                                },this)}
                          </TextField>
                        </Grid>
                        <Grid item xs={2} sm={2} className={classes.control}>
                            <TextField
                            label="EAN Code"
                            value={j.ean}
                            variant="outlined"
                            disabled
                            name="ean"
                            onChange={this.handle_edit_row.bind(this,iindex,jindex,"ean")}
                            fullWidth
                            />
                          </Grid>
                          <Grid item xs={2} sm={2} className={classes.control}>
                            <TextField
                            label="Price"
                            variant="outlined"
                            value={j.price}
                            name="label"
                            type="number"
                            onChange={this.handle_edit_row.bind(this,iindex,jindex,"price")}
                            placeholder="Enter Price"
                            required
                            fullWidth
                            inputProps={{
                            pattern : "^[a-zA-Z1-9].*",
                            step: "1",
                            min:"0",
                            max:this.state.max_mrp ? this.state.max_mrp : "99999"
                            }}
                            />
                          </Grid>
                          <Grid item xs={2} sm={2} className={classes.control}>
                            <TextField
                            label="Discount (in %)"
                            variant="outlined"
                            value={j.discount}
                            name="label"
                            type="number"
                            onChange={this.handle_edit_row.bind(this,iindex,jindex,"discount")}
                            placeholder="Enter Discount"
                            required
                            fullWidth
                            inputProps={{
                            pattern : "^[a-zA-Z1-9].*",
                            step: "1",
                            max:"100",
                            min:"0",
                            }}
                            />
                          </Grid>
                          {j.images &&
                          <React.Fragment>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  {!j.images.videoUrl &&<label style={{ padding : 30}} htmlFor="video" title="Upload Video"><span>V</span></label>}
                                  {j.images.videoUrl &&
                                    <React.Fragment>
                                    <div style={{marginTop: "-25px", textAlign : "-webkit-center"}}>
                                    <video controls style={{ display : "block"}} height="77px" width="57.5px" src={ImgUrl.videoUrl + "/" + j.images.videoUrl}/>
                                    </div>
                                    </React.Fragment>
                                  }
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  {!j.images.defaultImage &&<label style={{ padding : 30}} htmlFor="default" title="Upload Default Image"><span>D</span></label>}
                                  {j.images.defaultImage &&
                                    <div style={{marginTop: "-25px"}}>
                                    <img height="77px" width="57.5px" src={ImgUrl.imageUrl + j.images.defaultImage}/>
                                    </div>
                                  }
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  {!j.images.frontImage &&<label style={{ padding : 30}} htmlFor="front" title="Upload Front Image"><span>F</span></label>}
                                  {j.images.frontImage &&
                                    <div style={{marginTop: "-25px"}}>
                                    <img height="77px" width="57.5px" src={ImgUrl.imageUrl + j.images.frontImage}/>
                                    </div>
                                  }
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  {!j.images.backImage &&<label style={{ padding : 30}} htmlFor="back" title="Upload Back Image"><span>B</span></label>}
                                  {j.images.backImage &&
                                    <div style={{marginTop: "-25px"}}>
                                    <img height="77px" width="57.5px" src={ImgUrl.imageUrl + j.images.backImage}/>
                                    </div>
                                  }
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  {!j.images.leftImage &&<label style={{ padding : 30}} htmlFor="left" title="Upload Left Image"><span>L</span></label>}
                                  {j.images.leftImage &&
                                    <div style={{marginTop: "-25px"}}>
                                    <img height="77px" width="57.5px" src={ImgUrl.imageUrl + j.images.leftImage}/>
                                    </div>
                                  }
                              </div>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                              <div className="product_images">
                                  {!j.images.rightImage &&<label style={{ padding : 30}} htmlFor="right" title="Upload Right Image"><span>R</span></label>}
                                  {j.images.rightImage &&
                                    <div style={{marginTop: "-25px"}}>
                                    <img height="77px" width="57.5px" src={ImgUrl.imageUrl + j.images.rightImage}/>
                                    </div>
                                  }
                              </div>
                            </Grid>
                          </React.Fragment>
                          }
                      </React.Fragment>
                    )
                  },this)
                    return(
                      <React.Fragment key={iindex}>
                        <div className="color_container">
                        <p>{iindex+1}. {i.colorValue ? i.colorValue : i.color_name }</p>
                        {i.colorCode &&
                            <div style={{ backgroundColor : this.state.color_codes.filter((j) => i.colorCode == j.id)[0].name }} className="show_color_code"></div>
                        }
                        <Grid className="color_code_margin_top" item xs={3} sm={3}>
                            <TextField
                            label="Enter Line Id"
                            value={i.lineId || ""}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true
                            }}
                            name="label"
                            type="text"
                            placeholder="Enter Line ID"
                            fullWidth
                            inputProps={{
                            readOnly:(this.state.edit_id && !i.new ? true : false),
                            pattern : "^[a-zA-Z1-9].*",
                            step: "1",
                            min:"0",
                            }}
                            />
                        </Grid>
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
                                  <img height="200px" width="200px" src={ ImgUrl.imageUrl + i.productMeasurement.image}/>
                              </div>
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
                      </React.Fragment>
                    )
                },this)
                }
              </Grid>
            </Paper>
            </form>
            </div>
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
        ) : <Typography variant="button">Loading...</Typography>}
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
  brand : state.brand.data.data,
  enum : state.attributetype.enum,
  userId: state.signin.data.body.data.user.id,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(Product));