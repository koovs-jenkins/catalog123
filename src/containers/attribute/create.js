import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles,FormControl,InputLabel,Select,MenuItem   } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Error from "@material-ui/icons/ErrorOutline";
import {
    fetchAttributeTypeDetail,
    postAttributeType,
    putAttributeType,
    fetchAllEnum
} from "../../store/actions/attributetype";
import {
  fetchMetadata,
} from "../../store/actions/product";
import LinearProgress from '@material-ui/core/LinearProgress';
import sanitizeHtml from 'sanitize-html'
import { connect } from "react-redux";

const styles = theme => ({
  wrapper:{
    marginTop:"20px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  paper: {
    padding: theme.spacing.unit * 4,
    marginTop: "20px",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  },
  control:{
    padding:"10px"
  },
  item: {
    margin: theme.spacing.unit * 2,
    textAlign: "center"
  },
  menuitem: {
    fontSize: "12px"
  },
});

class AttributeType extends React.Component {
  state = {
    type :  "add",
    edit_id : "",
    attrType : "",
    attributeTypeName : "",
    pcategoryId : "",
    mcategoryId : "",
    ismandatory : false,
    label : "",
    enum : [],
    pcategory_data : [],
    mcategory_data : [],
};

  

componentDidMount = () => {
  this.get_all_enum();
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
        this.props.dispatch(fetchAttributeTypeDetail(this.state.edit_id)).then(() =>{ 
           this.setState({
            attrType : this.props.data.data.response.attrType,
            attributeTypeName : this.props.data.data.response.attributeTypeName,
            categoryId : this.props.data.data.response.categoryId,
            ismandatory : this.props.data.data.response.ismandatory,
            label : this.props.data.data.response.label,
           },()=>{ 
             this.get_meta_data();
          })
        }
        )
      }
      else{
        this.get_meta_data();
      }
  })
 
}

componentDidUpdate(prevProps, prevState, snapshot){
  var self = this;
  $('#select_master_category').select2();
  $('#select_parent_category').select2();
      $("#select_master_category").on("select2:select select2:unselecting", function (event) { 
        if(event.target.value != self.state.mcategoryId){
          self.handle_master_category(event);
        }
      }); 
      $("#select_parent_category").on("select2:select select2:unselecting", function (event) { 
        if(event.target.value != self.state.pcategoryId){
          self.handle_parent_category(event);
        }
      });
}

get_meta_data(){
  this.props.dispatch(fetchMetadata()).then(() =>{
      var all_category = this.props.metadata.data.response.categories
      this.setState({
        pcategory_data : all_category,
      },()=>{
        if(this.state.categoryId != "" ||  this.state.categoryId == 0){
        var data =  this.state.pcategory_data.filter((i) => i.id == this.state.categoryId)
            if(data.length > 0){
              this.setState({ pcategoryId : data[0].id },()=>{
                  this.getmaster(data[0].id)
              })
            }
            if(data.length == 0){
              this.state.pcategory_data.map(function(i){
                i.subCategories.map(function(j){
                  if(j.id == this.state.categoryId){
                    this.getmaster(j.parentId)
                    this.setState({
                      pcategoryId : j.parentId,
                      mcategoryId : j.id
                    })
                  }
                },this)
              },this)
            }
          }
      })
  }
  )
}

getmaster(id){
    var data = this.state.pcategory_data.filter((i) => i.id == id)[0].subCategories
    this.setState({
        mcategory_data : data,
    })
}


get_all_enum(){
    this.props.dispatch(fetchAllEnum()).then(() =>{
        this.setState({
            enum : this.props.enum.data.response.attributeType,
        },()=>{
        })
    }
    );
}




handle_parent_category(event){
  this.setState({ pcategoryId : event.target.value },()=>{
    if(this.state.pcategoryId){
     this.getmaster(this.state.pcategoryId)
    }
    else{
      this.setState({ mcategory_data : [] })
    }

  })
}


handle_master_category(e){
  this.setState({ mcategoryId : e.target.value})
}



UNSAFE_componentWillReceiveProps = (newProps) => {
    if(newProps.match.params.type != this.props.match.params.type){
        this.setState({ type :  newProps.match.params.type },()=>{
          if(this.state.type == "add"){
              this.setState({ 
                type :  "add",
                edit_id : "",
                attrType : "",
                attributeTypeName : "",
                pcategoryId : "",
                mcategoryId : "",
                ismandatory : false,
                label : "",
              })
          }
        })
    }
    if(newProps.match.params.id != this.props.match.params.id){
      this.setState({ id :  newProps.match.params.id },()=>{
          if(this.state.type  == "edit" && this.state.edit_id){
            this.props.dispatch(fetchAttributeTypeDetail(this.state.edit_id)).then(() =>
            {
            this.setState({
              attrType : this.props.data.data.data.response.attrType,
              attributeTypeName : this.props.data.data.data.response.attributeTypeName,
              categoryId : this.props.data.data.data.response.categoryId,
              ismandatory : this.props.data.data.data.response.ismandatory,
              label : this.props.data.data.data.response.label,
            })
            }
            )
          }
      })
    }
}

  handleform(event){
    event.preventDefault();
    var self = this;
    if(this.state.type == "create"){
      var formdata = {
        "attrType" : this.state.attrType,
        "attributeTypeName" : sanitizeHtml(this.state.attributeTypeName).replace("&amp;", "&"),
        "categoryId" : this.state.mcategoryId ? this.state.mcategoryId : this.state.pcategoryId,
        "ismandatory" : this.state.ismandatory,
        "label" : sanitizeHtml(this.state.label).replace("&amp;", "&"),
        createdBy: self.props.email
        }
      this.props.dispatch(postAttributeType(JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          this.props.history.push("/catalogue/list/attribute")
        }
      })
    }
    else if(this.state.type == "edit" && this.state.edit_id){
      var formdata = {
          "attributeTypeId" : this.state.edit_id,
          "attrType" : this.state.attrType,
          "attributeTypeName" : sanitizeHtml(this.state.attributeTypeName).replace("&amp;", "&"),
          "categoryId" : this.state.mcategoryId ? this.state.mcategoryId : this.state.pcategoryId,
          "ismandatory" : this.state.ismandatory,
          "label" : sanitizeHtml(this.state.label).replace("&amp;", "&"),
          updatedBy: self.props.email
        }
      this.props.dispatch(putAttributeType(this.state.edit_id,JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          this.props.history.push("/catalogue/list/attribute")
        }
      })
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
                {this.state.type == "edit" ? "Edit" : "Create"} Attribute Type
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
              <Button variant="contained" color="primary" className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={12}>
                <Grid item xs={6} sm={6} className={classes.control}>
                <FormControl fullWidth variant="outlined" >
                  <InputLabel id="demo-simple-select-outlined-label-attribute">Select Field Type</InputLabel>
                  <Select
                    fullWidth
                    value={this.state.attrType}
                    onChange={(e) => { this.setState({ attrType : e.target.value})}}
                    labelId="demo-simple-select-outlined-label-attribute"
                    id="demo-simple-select-outlined-attribute"
                    label="Select Field Type"
                    required
                    disabled={this.state.type == "edit" ? true : false}

                  >
                      {Object.keys(this.state.enum).map(function(i,index){
                          return(i != "MULTI_VALUED" && <MenuItem key={i} value={i}>
                          {this.state.enum[i]}
                          </MenuItem>)
                      },this)}
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={6} sm={6} className={classes.control}>
                  <TextField
                    label="Enter Name"
                    variant="outlined"
                    value={this.state.attributeTypeName || ""}
                    name="attributeTypeName"
                    onChange={(e) => { this.setState({ attributeTypeName :  e.target.value })}}
                    fullWidth
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} className={classes.control}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">Select Master Category</InputLabel>
                  <Select
                    fullWidth
                    value={this.state.pcategoryId}
                    onChange={this.handle_parent_category.bind(this)}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    label="Please select field type"
                    onChange={this.handle_parent_category.bind(this)}
                    required
                    disabled={this.state.type == "edit" ? true : false}

                  >
                     <MenuItem value="">Select Master Category*</MenuItem>
                        {this.state.pcategory_data.map(function(i,index){
                            return(
                                <MenuItem key={index} disabled={i.status == "INACTIVE" ? true : false} value={i.id}>{i.name}</MenuItem>
                            )
                        })
                        }
                    </Select>
                </FormControl>
               
                </Grid>
                {this.state.pcategoryId &&
                  <Grid item xs={6} sm={6} spacing={3} className={classes.control}>
                     <FormControl fullWidth variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">Select Master Category</InputLabel>
                        <Select
                            label="Select Master Category"
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={this.state.mcategoryId}
                            onChange={this.handle_master_category.bind(this)}
                            fullWidth
                            helperText="Please select parent category"
                            >
                            <MenuItem value="">Select Parent Category</MenuItem>
                            {this.state.mcategory_data.map(function(i,index){
                                return(
                                    <MenuItem key={index} value={i.id}>{i.name}</MenuItem>
                                )
                            })
                            }
                        </Select>
                    </FormControl>
                  </Grid>
                }
              </Grid>
              <Grid item xs={6} sm={6} className={classes.control}>
                  <TextField
                    
                    varient="outlined"
                    label="Enter Label"
                    value={this.state.label || ""}
                    variant="outlined"
                    name="label"
                    onChange={(e) => { this.setState({ label :  e.target.value })}}
                    fullWidth
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                  />
                </Grid>
                <Grid>
                <FormGroup row className={classes.control}>
                <FormControlLabel
                control={
                    <Checkbox
                            checked={this.state.ismandatory}
                            onChange={(e) => { this.setState({ ismandatory :  e.target.checked})}}
                            color="primary"
                        />
                }
                label="Is Mandatory"
                />
                </FormGroup>
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
  data: state.attributetype.data,
  loading: state.attributetype.loading,
  error: state.attributetype.error,
  enum : state.attributetype.enum,
  metadata : state.product.metadata,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(AttributeType));
