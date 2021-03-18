import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Remove from "@material-ui/icons/RemoveCircle";
import Error from "@material-ui/icons/ErrorOutline";
import Add from "@material-ui/icons/AddCircle";
import {
    fetchAttributeValueDetail,
    postAttributeValue,
    putAttributeValue,
} from "../../store/actions/attributevalue";
import {
  fetchMetadata,
} from "../../store/actions/product";
import { fetchAllAttributeType } from "../../store/actions/attributetype";
import LinearProgress from '@material-ui/core/LinearProgress';
import { ChromePicker  } from 'react-color';
import { connect } from "react-redux";
import sanitizeHtml from 'sanitize-html'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  },
  item: {
    margin: theme.spacing.unit * 2,
    textAlign: "center"
  },
  menuitem: {
    fontSize: "12px"
  },
});

class AttributeValue extends React.Component {
  state = {
    type :  "add",
    edit_id : "",
    attributeTypeId : "",
    attributeValues : [{id : 0 , attributeValue : "" }],
    attribute_types : [],
    attributeText : "",
    mastercategory : []
};



get_meta_data(){
  this.props.dispatch(fetchMetadata()).then(() =>{
    console.log(this.props.metadata.data.response.categories.filter((i) => i.name == "Fashion"))
      var all_category = this.props.metadata.data.response.categories.filter((i) => i.name == "Fashion")[0] ? this.props.metadata.data.response.categories.filter((i) => i.name == "Fashion")[0].subCategories : []
      this.setState({
        mastercategory : all_category,
      })
  }
  )
}


  

componentDidMount = () => {
  this.get_all_attribute_types();
  this.get_meta_data();
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
        this.props.dispatch(fetchAttributeValueDetail(this.state.edit_id)).then(() =>
        { 
           this.setState({
            attributeValues :  this.props.data.data.attrbuteValueDetail.attributeValues,
            attributeTypeId :  this.props.data.data.attrbuteValueDetail.attributeTypeId
           })
        }
        )
      }
  })
};


componentDidUpdate(prevProps, prevState, snapshot){
  var self = this;
  $('#attrtype').select2();
      $("#attrtype").on("select2:select select2:unselecting", function (event) { 
        if(event.target.value != self.state.attributeTypeId){
          self.handle_attribute_type(event);
        }
      }); 
}


get_all_attribute_types(){
    this.props.dispatch(fetchAllAttributeType()).then(() =>{
        var data = this.props.attribute_types.data.response.filter((i) => (i.attrType != "TEXTBOX" && i.attrType != "TEXTAREA"))
        this.setState({
            attribute_types : data,
        },()=>{
        })
    }
    );
}


handle_attribute_type(e){
  this.setState({ attributeTypeId : e.target.value, attributeText : document.getElementById("attrtype").options[document.getElementById("attrtype").selectedIndex].text})
}


UNSAFE_componentWillReceiveProps = (newProps) => {
    if(newProps.match.params.type != this.props.match.params.type){
        this.setState({ type :  newProps.match.params.type },()=>{
          if(this.state.type == "add"){
              this.setState({ 
                type :  "add",
                edit_id : "",
                attributeValues : [],
                attributeTypeId : "",
              })
          }
        })
    }
    if(newProps.match.params.id != this.props.match.params.id){
      this.setState({ id :  newProps.match.params.id },()=>{
          if(this.state.type  == "edit" && this.state.edit_id){
            this.props.dispatch(fetchAttributeValueDetail(this.state.edit_id)).then(() =>
            {
            this.setState({
                attributeValues :  this.props.data.data.attrbuteValueDetail.attributeValues,
                attributeTypeId :  this.props.data.data.attrbuteValueDetail.attributeTypeId
            })
            }
            )
          }
      })
    }
}

  handleform(event){
    console.log(event)
    event.preventDefault();
    var self = this;
    this.state.attributeValues.map(function(i,index){
      i.attributeValue = sanitizeHtml(i.attributeValue).replace("&amp;", "&")
      return i
    })
    if(this.state.type == "create"){
      var formdata = {
        attributeValues : this.state.attributeValues,
        attributeTypeId : this.state.attributeTypeId,
        }
      this.props.dispatch(postAttributeValue(JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          this.props.history.goBack();
        }
      })
    }
    else if(this.state.type == "edit" && this.state.edit_id){
      var formdata = {
          "id" : this.state.edit_id,
          "attributeValues" : this.state.attributeValues,
          "attributeTypeId" : this.state.attributeTypeId,
        }
      this.props.dispatch(putAttributeValue(this.state.edit_id,JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          this.props.history.goBack();
        }
      })
    }
   
  }

  handle_edit_row(index,type,event){
      var updated_row = this.state.attributeValues
      updated_row[index][type] = event.target.value
      if(type == "masterCategoryId"){
        updated_row[index]["masterCategoryName"] = document.getElementById("masterCategory" + index).options[document.getElementById("masterCategory" + index).selectedIndex].text
      }
      this.setState({ attributeValues : updated_row})
  }
  // handle_edit_row(index,type,name,event){
  //     var updated_row = this.state.attributeValues
  //     updated_row[index][type] = event.target.value
  //     this.setState({ attributeValues : updated_row})
  // }

  handle_edit_color_row(index,color){
      console.log(color,index)
      var updated_row = this.state.attributeValues
      updated_row[index].attributeValue = (color.hex).toLowerCase();
      this.setState({ attributeValues : updated_row})
  }

  handle_add_row(){
      var obj ={
          "id" : this.state.attributeValues.length,
          "attributeValue" : "",
          "masterCategoryId" : "",
          "gender" : "",
      }
      var updated_row = this.state.attributeValues
      updated_row.push(obj)
      this.setState({ attributeValues : updated_row },()=>{
        document.getElementById('add_container').scrollIntoView();
      })
  }

  handle_delete_row(index){
      console.log(this.state.attributeValues)
      var updated_row = this.state.attributeValues
      updated_row.splice(index,1)
      console.log(updated_row)
      this.setState({ attributeValues : updated_row })
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
            <Grid lg={12} container justify="space-between" style={{marginTop:"10px"}}>
            <Typography variant="h5" gutterBottom component="h5" >
              {this.state.type == "edit" ? "Edit" : "Create"} Attribute Value 
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
           
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                    <TextField
                    select
                    id="attrtype"
                    value={this.state.attributeTypeId ? this.state.attributeTypeId : ""}
                    onChange={this.handle_attribute_type.bind(this)}
                    SelectProps={{
                    native: true,
                    }}
                    margin="normal"
                    fullWidth
                    required
                    helperText="Please select attribute type"
                    >
                    <option value="">Select Attribute Type*</option>
                    {this.state.attribute_types.map(function(i,index){
                        return(<option key={index} value={i.attributeTypeId}>{i.attributeTypeName} - ({i.categoryName})</option>)
                    },this)}
                    </TextField>
                </Grid>
                {this.state.attributeValues.map(function(i,index){
                    return(
                        <React.Fragment key={index}>
                            <Grid item xs={this.state.attributeText == "Type - (Fashion)"  ? 3 : 8} sm={this.state.attributeText == "Type - (Fashion)"  ? 3 : 8} style={{ paddingTop : 0}}>
                            {(this.state.attributeText == "Color Code - (Global Category)" || this.state.attributeText == "Colour Code")&&
                                  <ChromePicker 
                                  required
                                  color={ i.attributeValue || "" }
                                  onChangeComplete={ this.handle_edit_color_row.bind(this,index) }
                                  />
                            }
                            {(this.state.attributeText != "Color Code - (Global Category)" && this.state.attributeText != "Colour Code" ) &&
                                <TextField
                                label="Enter Attribute Label"
                                value={i.attributeValue || ""}
                                name="label"
                                variant="outlined"
                                onChange={this.handle_edit_row.bind(this,index , "attributeValue")}
                                required
                                fullWidth
                                inputProps={{
                                maxLength : "250"
                                }}
                                />
                            }
                            </Grid>
                            {(this.state.attributeText == "Type - (Fashion)") &&
                              <React.Fragment>
                                <Grid xs={index == 0 ? 4 : 3} sm={index == 0 ? 4 : 3} style={{ paddingRight :  20}}>
                                    <TextField
                                        select
                                        id={"masterCategory" + index}
                                        value={i.masterCategoryId || ""}
                                        onChange={this.handle_edit_row.bind(this,index , "masterCategoryId")}
                                        SelectProps={{
                                        native: true,
                                        }}
                                        margin="normal"
                                        fullWidth
                                        required
                                        helperText="Please select parent category"
                                        >
                                        <option value="">Select Parent Category*</option>
                                        {this.state.mastercategory.map(function(i,index){
                                            return(<option key={index} disabled={i.status == "INACTIVE" ? true : false} value={i.id}>{i.name}</option>)
                                        },this)}
                                    </TextField>
                                </Grid>
                                {(index == 0 && this.state.attributeValues.length > 1) &&
                                  <Grid xs={1} sm={1}>

                                  </Grid>
                                }
                                <Grid xs={index == 0 ? 3 : 2} sm={index == 0 ? 3 : 2}>
                                  <TextField
                                      select
                                      id="gender"
                                      value={i.gender || ""}
                                      onChange={this.handle_edit_row.bind(this,index , "gender")}
                                      SelectProps={{
                                      native: true,
                                      }}
                                      margin="normal"
                                      fullWidth
                                      required
                                      helperText="Please select gender category"
                                      >
                                      <option value="">Select Gender*</option>
                                      <option value="1">Male</option>
                                      <option value="2">Female</option>
                                      {/* <option value="2">Others</option> */}
                                  </TextField>
                              </Grid>
                              </React.Fragment>
                            }
                            {(index == 0 && this.state.attributeValues.length == 1) && 
                            <Grid className="row_grid_attribute_value vertical_align" item xs={2} sm={2}>
                                <Add onClick={this.handle_add_row.bind(this)} /> 
                            </Grid>
                            }
                            {((this.state.attributeValues.length - 1 == index )&& this.state.attributeValues.length > 1) && 
                            <Grid className="row_grid_attribute_value vertical_align" item xs={2} sm={2}>
                                <Add onClick={this.handle_add_row.bind(this)} /> 
                            </Grid>
                            }
                            { index != 0 &&
                            <Grid className="row_grid_attribute_value vertical_align" item xs={2} sm={2}>
                                <Remove onClick={this.handle_delete_row.bind(this,index)}/>
                            </Grid>  
                            }
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
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: state.attributevalue.data,
  loading: state.attributevalue.loading,
  error: state.attributevalue.error,
  attribute_types : state.attributetype.data,
  metadata : state.product.metadata,
});

export default withStyles(styles)(connect(mapStateToProps)(AttributeValue));