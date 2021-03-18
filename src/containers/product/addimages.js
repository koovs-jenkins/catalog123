import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import {imageUrl,videoUrl} from '../../../config.js'
import {
    fetchAllProduct,
} from "../../store/actions/product";
import {
    fetchProductImage,
    fetchLineImage,
    postProductImage,
    removeError,
    uploadProductImage,
    uploadBulkProductImages
} from "../../store/actions/productimage"
import queryString from 'query-string';
import FileDrop from 'react-file-drop';

import { connect } from "react-redux";
import { uploadFile } from 'react-s3';
import config from '../../../config.js'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 4,
    margin: "auto",
    maxWidth: "100%"
  },
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

class AddProductImages extends React.Component {
  state = {
    all_products : [],
    all_line : [],
    all_skew : [],
    selected_skew : "",
    selected_line : "",
    image_obj : {
        front : "",
        back : "",
        left : "",
        right : "",
        video : "",
    },
    loading : {
        front : false,
        back : false,
        left : false,
        right : false,
        video : false,
    },
    bulkUpload:"",
    selected_product : "",
};

componentDidMount = () => {
   var self = this;
//    this.get_all_products()
   this.get_query_params(this.props.location.search)
   this.props.dispatch(removeError())
//    $(document).ready(function(){
//         $("#select_product").on("select2:select select2:unselecting", function (event) { 
//             console.log(event.target.value)
//             if(event.target.value != self.state.selected_product){
//                 self.handle_select_product(event);
//             }
//         });
//     });
};

componentDidUpdate(){
    // $('#select_product').select2();
}


get_query_params(location){
    var all_query_params = queryString.parse(location);
    this.setState({ 
        selected_product :  all_query_params.pid ? all_query_params.pid : "",
    },()=>{
        if(this.state.selected_product){
            this.get_all_products()
        }
    })
}

get_product_data(id,lineid){
    this.props.dispatch(fetchProductImage(id,lineid)).then(() =>{    
            console.log(this.props.product_images.response)
            var img = this.props.product_images.product_images.data.data.response
            var image_obj = {
                front : img.frontImage ? {"location":imageUrl + img.frontImage} : "",
                back : img.backImage ? {"location":imageUrl + img.backImage} : "",
                left : img.leftImage ? {"location":imageUrl + img.leftImage} : "",
                right : img.rightImage ? {"location":imageUrl + img.rightImage} : "",
                video : img.videoUrl ? {"location":videoUrl + img.videoUrl} : "",
                default : img.defaultImage ? {"location":imageUrl + img.defaultImage} : "",
            }
            this.setState({
                image_obj : image_obj    
            })
        }
    );
}
get_line_data(id){
    this.props.dispatch(fetchLineImage(id)).then(() =>{    
            console.log(this.props.product_images.response)
            var img = this.props.product_images.product_images.data.data.response
            var image_obj = {
                front : img.frontImage ? {"location":ImgUrl.imageUrl + img.frontImage} : "",
                back : img.backImage ? {"location":ImgUrl.imageUrl + img.backImage} : "",
                left : img.leftImage ? {"location":ImgUrl.imageUrl + img.leftImage} : "",
                right : img.rightImage ? {"location":ImgUrl.imageUrl + img.rightImage} : "",
                video : img.videoUrl ? {"location": videoUrl + img.videoUrl} : "",
                default : img.defaultImage ? {"location":ImgUrl.imageUrl + img.defaultImage} : "",
            }
            this.setState({
                image_obj : image_obj    
            })
        }
    );
}

get_all_products(event){
    if(event){
        event.preventDefault();
    }
    var pid = this.state.selected_product 
    if(pid){
        this.props.dispatch(fetchAllProduct(pid,"","")).then(() =>{
            this.setState({
                all_products : this.props.all_products.response ? this.props.all_products.response : [],
                selected_product : pid
            },()=>{
                if(this.state.all_products.length > 0){
                    this.handle_select_product()
                }
                else{
                    this.setState({ all_products : [] , selected_product : pid,all_line : [], all_skew : [] ,selected_line : "" , selected_skew : "" , })
                    alert("No Product Found")
                }
            })
        }
        );
    }
    else{
        this.setState({ all_products : [] , selected_product : "",selected_line : "" , selected_skew : "" , })
    }
}

handle_select_product(event){
    this.setState({ selected_line : "", selected_skew : "" },()=>{
        console.log(this.state.selected_product, this.state.all_products)
        var image_obj ={
            front : "",
            back : "",
            left : "",
            right : "",
            video : "",
            default : "",
        }
        this.setState({image_obj : image_obj })
        var selected_product_id =  this.state.selected_product
        if(selected_product_id){
            this.setState({ all_line : this.state.all_products.filter((i) => (i.productId == (selected_product_id.toString())) )[0].productOptions})
        }
        else{
            this.setState({ all_line : [] , all_skew : [], selected_line : "", selected_skew : ""})
        }
    })
}

handle_select_line(event){
    this.setState({ selected_line : event.target.value},()=>{
        var image_obj ={
            front : "",
            back : "",
            left : "",
            right : "",
            video : "",
            default : "",
        }
        this.setState({image_obj : image_obj },()=>{
            if(this.state.selected_line){
                this.get_product_data(this.state.selected_skew, this.state.selected_line);
            }
        })
        var selected_line_id =  this.state.selected_line
        var selected_product_id =  this.state.selected_product
        if(selected_line_id){
        this.setState({ all_skew : this.state.all_products.filter((i) => (i.productId == (selected_product_id.toString())) )[0].productOptions.filter((i) => (i.lineId == (selected_line_id.toString())))[0].sizes})
        }
        else{
            this.setState({ all_skew : [] , selected_skew : ""})
        }
    })
}

handle_select_skew(event){
    this.setState({ selected_skew : event.target.value},()=>{
        if(this.state.selected_skew){
            this.get_product_data(this.state.selected_skew, this.state.selected_line);
        }
        var image_obj ={
            front : "",
            back : "",
            left : "",
            right : "",
            default : "",
            video : "",
        }
        this.setState({image_obj : image_obj })
    })
}


handleform(event){
    event.preventDefault();
    var self = this;
    if(this.state.all_skew.length > 0){
        if(!this.state.loading.default && 
            !this.state.loading.front && 
            !this.state.loading.back && 
            !this.state.loading.right && 
            !this.state.loading.left && 
            !this.state.loading.video){
                //if(this.state.image_obj.default.location && this.state.image_obj.back.location && this.state.image_obj.front.location && this.state.image_obj.right.location && this.state.image_obj.left.location){
                if(this.state.image_obj.default.location || this.state.image_obj.back.location || this.state.image_obj.front.location || this.state.image_obj.right.location || this.state.image_obj.left.location || this.state.image_obj.video.location){
                    var formdata = {
                        defaultImage : this.state.image_obj.default.location ? this.state.image_obj.default.location : "",
                        skuId : this.state.selected_skew,
                        lineId : this.state.selected_line,
                        backImage : this.state.image_obj.back.location ? this.state.image_obj.back.location : "",
                        frontImage : this.state.image_obj.front.location ? this.state.image_obj.front.location : "",
                        rightImage : this.state.image_obj.right.location ? this.state.image_obj.right.location : "",
                        leftImage : this.state.image_obj.left.location ? this.state.image_obj.left.location : "",
                        videoUrl : this.state.image_obj.video.location ? this.state.image_obj.video.location : "",
                        userId: this.props.email
                      }
                      this.props.dispatch(postProductImage(JSON.stringify(formdata),this.state.selected_product)).then((res)=>{
                        if(!self.props.error){
                          /* this.props.history.push("/catalogue/list/product") */
                          alert("Images uploaded successfully.")
                        }
                      })
                }
                else{
                    alert("Upload Altleast One Image or Video.")
                }
            }
            else{
                alert("Please wait while we finish uploading all the files.")
            }
    }
    else{
        alert("Can't upload image. No Sku's found for the selected line id.")
    }
      
}

handle_image_upload(type,files,event){
    var self = this;
    var file = files[0].name.split(".")
    var name = file[ file.length -1 ].toLowerCase();
    var size =  files[0].size
    if(type == "video" && name == "mp4"){
        if(parseFloat((size / 1048576).toFixed(2)) <= 5){
            var formdata = new FormData();
            formdata.append(type+"_upload", files[0]);
            this.props.dispatch(uploadProductImage(formdata)).then((res)=>{
                var data = self.props.image_object.data.data
                data["location"] = self.props.image_object.data.data.Location
                var image_obj = this.state.image_obj
                image_obj[""+type] = data
                self.setState({image_obj : image_obj},()=>{})
             })
        }
        else{
           alert("Please upload video of size less than 5MB") 
        }
    }
    else if(type != "video" && (name == "jpg" || name == "jpeg")){
        if(parseFloat((size / 1048576).toFixed(2)) <= 2){
            var formdata = new FormData();
            formdata.append(type+"_upload", files[0]);
            this.props.dispatch(uploadProductImage(formdata)).then((res)=>{
                var data = self.props.image_object.data.data
                data["location"] = self.props.image_object.data.data.Location
                var image_obj = this.state.image_obj
                image_obj[""+type] = data
                self.setState({image_obj : image_obj},()=>{})
             })
        }
        else{
            alert("Please upload image of size less than 2MB") 
        }
    }
    else if (type == "video" && name != "mp4"){
        alert("Please upload the video in .mp4 format only.")
    }
    else if(type != "video" && (name != "jpg" || name != "jpeg")){
        alert("Please upload the image in .jpg/.jpeg format only.")
    }   
}


handle_image_uploads(type,event){
    var self = this;
    var file = event.target.files[0].name.split(".")
    var name = file[ file.length -1 ].toLowerCase();
    var size =  event.target.files[0].size
    if(type == "video" && name == "mp4"){
        if(parseFloat((size / 1048576).toFixed(2)) <= 5){
            var formdata = new FormData();
            formdata.append(type+"_upload", event.target.files[0]);
            this.props.dispatch(uploadProductImage(formdata)).then((res)=>{
                var data = self.props.image_object.data.data
                data["location"] = self.props.image_object.data.data.Location
                var image_obj = this.state.image_obj
                image_obj[""+type] = data
                self.setState({image_obj : image_obj},()=>{})
             })
        }
        else{
           alert("Please upload video of size less than 5MB") 
        }
    }
    else if(type != "video" && (name == "jpg" || name == "jpeg")){
        if(parseFloat((size / 1048576).toFixed(2)) <= 2){
            var formdata = new FormData();
            formdata.append(type+"_upload", event.target.files[0]);
            this.props.dispatch(uploadProductImage(formdata)).then((res)=>{
                var data = self.props.image_object.data.data
                data["location"] = self.props.image_object.data.data.Location
                var image_obj = this.state.image_obj
                image_obj[""+type] = data
                self.setState({image_obj : image_obj},()=>{})
             })
        }
        else{
            alert("Please upload image of size less than 2MB") 
        }
    }
    else if (type == "video" && name != "mp4"){
        alert("Please upload the video in .mp4 format only.")
    }
    else if(type != "video" && (name != "jpg" || name != "jpeg")){
        alert("Please upload the image in .jpg/.jpeg format only.")
    }   
}

handle_bulk_image_upload(e){
   document.getElementById("bulk_upload").click();
}

bulkUploadFile(type,event){
    var file = event.target.files[0].name.split(".")
    var name = file[ file.length -1 ].toLowerCase();
    var size =  event.target.files[0].size
    if(type=="bulk" && name=="zip"){
            if(file){
                var formdata = new FormData();
                formdata.append("compressedFile", event.target.files[0]);
                document.getElementById("bulk_upload").value="";
                const data = {
                    lineId:  this.state.selected_line,
                    productId:this.state.selected_product,
                    skuId :  this.state.selected_skew,
                    userId: this.props.email
                }
                this.props.dispatch(uploadBulkProductImages(formdata,data)).then((res)=>{
                    if(!this.props.error){
                        alert("Image batch folder uploaded successfully!");
                        this.props.history.push("/catalogue/list/product")
                    }
                })
            }
    }
    else if(type == "bulk" && name != "zip"){
        alert("Please upload the images in .zip format only.")
    }
}


handle_remove_image = (type) => {
    if(confirm("Are you sure you want to remove this "+ type +" image?")){
        var image_obj = this.state.image_obj
        image_obj[""+type] = ""
        document.getElementById(type+"_upload").value = "";
        this.setState({ image_obj : image_obj })
    }
}


download_images(link){
    let a = document.createElement('a')
    a.href = link
    a.download = link.split('/').pop()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

render() {
    const { classes, match, loading } = this.props;
    const note = [
        "Only .zip file will be upload.",
        "Images name must be (lineid_1,lineid_2,lineid_3,lineid_4,lineid_5).",
        "Video name must be (lineid_video).",
        "Only .mp4, videos will be uploaded."
    ];
    return (
      <React.Fragment>
        {loading &&
            <LinearProgress />
        }
          <React.Fragment>
          <Grid container className={classes.header} spacing={12} justify="space-between" style={{marginTop:"20px",marginBottom:"20px"}}>  
          <Typography variant="h5" gutterBottom component="h5">
              Add Line Images 
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
                
                    <div className="table_button">
                    <Button  
                    variant="contained"
                    style={{float:"right"}}
                    color="primary" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
                        { this.state.selected_line &&
                            <div>
                                    <input onChange={this.bulkUploadFile.bind(this,"bulk")} id="bulk_upload" type="file" name="bulk_upload" accept=".zip"  hidden/>
                                    {!this.state.loading.default 
                                        ? ""
                                        : <CircularProgress className="round_loader" />
                                    } 
                                <Button onClick={this.handle_bulk_image_upload.bind(this)} variant="contained" color="primary" type="submit" >
                                Upload Image Folder (.zip) 
                                </Button>
                            </div>
                        }
                    </div>
          </Grid>
           
            <Paper className={classes.paper}>
            <Grid container spacing={12}>
            <form onSubmit={this.get_all_products.bind(this)} style={{ width : "100%"}}>
              <Grid item xs={12} sm={6}>
                  <TextField
                     id="outlined-basic" 
                     variant="outlined" 
                    label="Product Id"
                    value={this.state.selected_product || ""}
                    onChange={(e) => { this.setState({ selected_product  : e.target.value },()=>{ 
                        if(this.state.selected_product == ""){ 
                            this.setState({ all_products : [] , 
                                            selected_product : "",
                                            selected_line : "" , 
                                            selected_skew : "" ,
                                            all_line : [],
                                            all_skew : [],
                                        }) 
                            }
                            })
                            }
                    }
                    name="productName"
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250",
                    }}
                    fullWidth
                  />
            </Grid>
            </form>
           
            <form onSubmit={this.handleform.bind(this)} style={{ width : "100%"}}>
            <Grid container spacing={12}>
                {this.state.selected_product &&
                <Grid item xs={6} sm={6} className="no_measure_line">
                {this.state.all_line.length > 0 &&
                    <TextField
                      select
                      value={this.state.selected_line || ""}
                      onChange={this.handle_select_line.bind(this)}
                      SelectProps={{
                      native: true,
                      }}
                      margin="normal"
                      fullWidth
                      required
                      helperText={"Please Select Product Line"}
                      >
                      <option value="">Select Product Line*</option>
                      {this.state.all_line.map(function(i,index){
                        return(
                          <option key={index} value={i.lineId}>{i.lineId} - {i.colorValue}</option>
                        )
                      },this)
                      }
                  </TextField>
                }
                {(this.state.all_line.length == 0 && this.state.all_products.length > 0) &&
                    <span>No line created for selected product.</span>
                }
                </Grid>
                }
                {this.state.selected_line &&
                <Grid item xs={6} sm={6}>
                    <p>
                        {this.state.all_skew.map(function(i,index){
                                return(
                                <span key={i.skuId}>{i.skuId} &nbsp; &nbsp; </span>
                                )
                        },this)}
                    </p>
                </Grid>   
                }
                {this.state.selected_line &&
                    <React.Fragment>
                        <Grid item xs={4} sm={4}>
                            <div className={!this.state.image_obj.video ? "product_images" : "zero_padding_top"}>
                               <input id="video_upload" onChange={this.handle_image_uploads.bind(this,"video")} type="file" name="video_upload" accept=".mp4"  hidden/>
                                {this.state.image_obj.video &&
                                    <React.Fragment>
                                    <div style={{ paddingLeft : "132px"}}>
                                    <video controls style={{ display : "block"}} height="77px" width="57.5px" src={this.state.image_obj.video.location} 
                                    title="Click to Download this Video"
                                    onClick={this.download_images.bind(this,this.state.image_obj.video.location)}/>
                                    <span style={{ marginLeft : "0px"}} className="image_remove_button" onClick={() => this.handle_remove_image("video")}>X</span>
                                    </div>
                                    </React.Fragment>
                                }
                                {!this.state.image_obj.video &&
                                    <React.Fragment>
                                    {!this.state.loading.video 
                                        ? <label htmlFor="video_upload" title="Upload Video">
                                            <FileDrop onDrop={this.handle_image_upload.bind(this,"video")}>
                                                    <span>V</span>
                                            </FileDrop>
                                        </label> 
                                        : <CircularProgress className="round_loader" />
                                    } 
                                    </React.Fragment>
                                }
                            </div>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <div className={!this.state.image_obj.default ? "product_images" : "zero_padding_top"}>
                                <input id="default_upload" onChange={this.handle_image_uploads.bind(this,"default")} type="file" name="default_upload" accept=".png, .jpg, .jpeg"  hidden/>
                                {this.state.image_obj.default &&
                                    <React.Fragment>
                                    <div style={{ paddingLeft : "132px"}}>
                                    <a target="_blank" href={this.state.image_obj.default.location} download><img height="77px" width="57.5px" title="Click to Download this Image" src={this.state.image_obj.default.location}/></a>
                                    <span className="image_remove_button" onClick={() => this.handle_remove_image("default")}>X</span>
                                    </div>
                                    </React.Fragment>
                                }
                                {!this.state.image_obj.default &&
                                    <React.Fragment>
                                    {!this.state.loading.default 
                                        ? <label htmlFor="default_upload" title="Upload Default Image">
                                            <FileDrop onDrop={this.handle_image_upload.bind(this,"default")}>
                                                    <span>D</span>
                                            </FileDrop>
                                            </label> 
                                        : <CircularProgress className="round_loader" />
                                    } 
                                    </React.Fragment>
                                }
                            </div>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <div className={!this.state.image_obj.front ? "product_images" : "zero_padding_top"}>
                                <input id="front_upload" onChange={this.handle_image_uploads.bind(this,"front")} type="file" name="front_upload" accept=".png, .jpg, .jpeg"  hidden/>
                                {this.state.image_obj.front &&
                                    <React.Fragment>
                                    <div style={{ paddingLeft : "132px"}}>
                                    <a target="_blank" href={this.state.image_obj.front.location} download><img height="77px" width="57.5px" title="Click to Download this Image"  src={this.state.image_obj.front.location}/></a>
                                    <span className="image_remove_button" onClick={() => this.handle_remove_image("front")}>X</span>
                                    </div>
                                    </React.Fragment>
                                }
                                {!this.state.image_obj.front &&
                                    <React.Fragment>
                                    {!this.state.loading.front 
                                        ? <label htmlFor="front_upload" title="Upload Front Image">
                                        <FileDrop onDrop={this.handle_image_upload.bind(this,"front")}>
                                                    <span>F</span>
                                            </FileDrop>
                                        </label> 
                                        : <CircularProgress className="round_loader" />
                                    } 
                                    </React.Fragment>                              
                                }
                            </div>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                        <div className={!this.state.image_obj.back ? "product_images" : "zero_padding_top"}>
                            <input id="back_upload" onChange={this.handle_image_uploads.bind(this,"back")} type="file" name="back_upload" accept=".png, .jpg, .jpeg"  hidden/> 
                            {this.state.image_obj.back &&
                                <React.Fragment>
                                <div style={{ paddingLeft : "132px"}}>
                                <a target="_blank" href={this.state.image_obj.back.location} download><img height="77px" width="57.5px" title="Click to Download this Image"  src={this.state.image_obj.back.location}/></a>
                                <span className="image_remove_button" onClick={() => this.handle_remove_image("back")}>X</span>
                                </div>
                                </React.Fragment>
                            }
                            {!this.state.image_obj.back &&
                                <React.Fragment>
                                {!this.state.loading.back 
                                    ? <label htmlFor="back_upload" title="Upload Back Image">
                                         <FileDrop onDrop={this.handle_image_upload.bind(this,"back")}>
                                            <span>B</span>
                                         </FileDrop>
                                    </label> 
                                    : <CircularProgress className="round_loader" />
                                } 
                                </React.Fragment>                              
                            }
                        </div>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                        <div className={!this.state.image_obj.left ? "product_images" : "zero_padding_top"}>
                            <input id="left_upload" onChange={this.handle_image_uploads.bind(this,"left")} type="file" name="left_upload" accept=".png, .jpg, .jpeg"  hidden/> 
                            {this.state.image_obj.left &&
                                <React.Fragment>
                                <div style={{ paddingLeft : "132px"}}>
                                <a target="_blank" href={this.state.image_obj.left.location} download><img height="77px" width="57.5px" title="Click to Download this Image"  src={this.state.image_obj.left.location}/></a>
                                <span className="image_remove_button" onClick={() => this.handle_remove_image("left")}>X</span>
                                </div>
                                </React.Fragment>
                            }
                            {!this.state.image_obj.left &&
                                <React.Fragment>
                                {!this.state.loading.left 
                                    ? <label htmlFor="left_upload" title="Upload Left Image">
                                        <FileDrop onDrop={this.handle_image_upload.bind(this,"left")}>
                                            <span>L</span>
                                        </FileDrop>
                                    </label> 
                                    : <CircularProgress className="round_loader" />
                                } 
                                </React.Fragment>                              
                            }
                        </div>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                        <div className={!this.state.image_obj.right ? "product_images" : "zero_padding_top"}>
                            <input id="right_upload" onChange={this.handle_image_uploads.bind(this,"right")} type="file" name="right_upload" accept=".png, .jpg, .jpeg"  hidden/>
                            {this.state.image_obj.right &&
                                <React.Fragment>
                                <div style={{ paddingLeft : "132px"}}>
                                <a target="_blank" href={this.state.image_obj.right.location} download><img height="77px" width="57.5px" title="Click to Download this Image"  src={this.state.image_obj.right.location}/></a>
                                <span className="image_remove_button" onClick={() => this.handle_remove_image("right")}>X</span>
                                </div>
                                </React.Fragment>
                            }
                            {!this.state.image_obj.right &&
                                <React.Fragment>
                                {!this.state.loading.right 
                                    ? <label htmlFor="right_upload" title="Upload Right Image">
                                            <FileDrop onDrop={this.handle_image_upload.bind(this,"right")}>
                                                <span>R</span>
                                            </FileDrop>
                                    </label> 
                                    : <CircularProgress className="round_loader" />
                                } 
                                </React.Fragment>                              
                            }
                        </div>
                        </Grid>
                    </React.Fragment>
                }
              <Grid container justify="left">
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" className={classes.button} color="primary" type="submit">
                    Save
                  </Button>
                </Grid>
              </Grid>
              </Grid>
            </form>
              </Grid>
            <div>
                <Typography className={classes.button} variant="h6">Note:</Typography>
                <ol style={{"padding-left":"15px"}}>
                    {note.map((v, i) => <li key={i}><Typography>{v}</Typography></li>)}
                </ol>
            </div>
            </Paper>
          </React.Fragment>
      </React.Fragment>
    );
  }
}



const mapStateToProps = state => ({
  data: state.productimage.data,
  loading: state.productimage.loading,
  error: state.productimage.error,
  all_products : state.product.data.data,
  product_images : state.productimage,
  image_object : state.productimage.image_object,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(AddProductImages));