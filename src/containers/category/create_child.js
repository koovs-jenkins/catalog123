import React from "react";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import {Grid,MenuItem,Select,InputLabel,FormControl  } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import {
    fetchCCategoryDetail,
    postCCategory,
    putCCategory,
} from "../../store/actions/childcategory";
import LinearProgress from '@material-ui/core/LinearProgress';
import sanitizeHtml from 'sanitize-html'
import { fetchAllPCategory } from "../../store/actions/parentcategory";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "20px",
    maxWidth: "100%"
  },
  wrapper:{marginTop:"20px"},
  select: {
    marginTop:"15px",
    borderRadius:"5px",
    width: "100%",
    color: "rgba(0, 0, 0, 0.54)",
    fontSize:"16px",
    paddingLeft:"10px",
    height: "56px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "white"
  },
  control:{
    padding:"10px"
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

class ChildCategory extends React.Component {
  state = {
    type :  "add",
    edit_id : "",
    category_name : "",
    category_description : "",
    parent_category_id : "",
    pcategory_data : [],
    returnable: false
};

  

componentDidMount = () => {
  this.get_parent_category_data();
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
        this.props.dispatch(fetchCCategoryDetail(this.state.edit_id)).then(() =>
           this.setState({
             category_name : this.props.category_data.data.response.name,
             category_description : this.props.category_data.data.response.description,
             parent_category_id : this.props.category_data.data.response.parentId,
             returnable: this.props.category_data.data.response.returnable
           })
        )
      }
  })
};



componentDidUpdate(prevProps, prevState, snapshot){
  var self = this;
  $('#select_master_category').select2();
  $("#select_master_category").on("select2:select select2:unselecting", function (event) { 
    if(event.target.value != self.state.parent_category_id){
      self.handle_parent_category(event);
    }
  }); 
}



get_parent_category_data(){
    this.props.dispatch(fetchAllPCategory("","")).then(() =>{
        this.setState({
            pcategory_data : this.props.pcategory_data.data.response ? this.props.pcategory_data.data.response : [],
        })
    }
    );
}

handle_parent_category(e){
  this.setState({ parent_category_id : e.target.value})
}


UNSAFE_componentWillReceiveProps = (newProps) => {
    if(newProps.match.params.type != this.props.match.params.type){
        this.setState({ type :  newProps.match.params.type },()=>{
          if(this.state.type == "add"){
              this.setState({ 
                type :  "add",
                edit_id : "",
                category_name : "",
                category_description : "",
                pcategory_data : [],
                returnable: false
              })
          }
        })
    }
    if(newProps.match.params.id != this.props.match.params.id){
      this.setState({ id :  newProps.match.params.id },()=>{
          if(this.state.type  == "edit" && this.state.edit_id){
            this.props.dispatch(fetchCCategoryDetail(this.state.edit_id)).then(() =>
            this.setState({
              category_name : this.props.category_data.data.response.name,
              category_description : this.props.category_data.data.response.description,
              returnable: this.props.category_data.data.response.returnable
            })
            )
          }
      })
    }
}

  handleform(event){
    event.preventDefault();
    var self = this;
      if(this.state.type == "create"){
        var formdata = {"name" :sanitizeHtml(this.state.category_name).replace("&amp;", "&"),"parentId" : this.state.parent_category_id ,"description" : sanitizeHtml(this.state.category_description).replace("&amp;", "&"), createdBy: self.props.email, returnable: this.state.returnable}
        this.props.dispatch(postCCategory(JSON.stringify(formdata))).then((res)=>{
          if(!self.props.error){
            alert("Category created successfully");
            this.props.history.goBack();
          }
        })
      }
      else if(this.state.type == "edit" && this.state.edit_id){
        var formdata = {"id" : this.state.edit_id,"name" :sanitizeHtml(this.state.category_name).replace("&amp;", "&"),"parentId" : this.state.parent_category_id, "description" : sanitizeHtml(this.state.category_description).replace("&amp;", "&"), updatedBy: self.props.email, returnable: this.state.returnable}
        this.props.dispatch(putCCategory(this.state.edit_id,JSON.stringify(formdata))).then((res)=>{
          if(!self.props.error){
            alert("Category updated successfully");
            this.props.history.goBack();
          }
        })
      }
  }


  render() {
    const { classes, match, loading } = this.props;
    const { pcategory_data, returnable } = this.state;
    return (
      <React.Fragment>
        {loading &&
            <LinearProgress />
        }
        {!loading && (
          <React.Fragment>
            <Grid container lg={12} justify="space-between" className={classes.wrapper}>
              <Typography variant="h5" gutterBottom component="h5">
                {this.state.type == "edit" ? "Edit" : "Create"} Parent Category 
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
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">Select Master Category*</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={this.state.parent_category_id}
                        onChange={this.handle_parent_category.bind(this)}
                        fullWidth
                        required
                        label="Please select master category"
                    >
                        <MenuItem value="">Select Master Category*</MenuItem>
                        {pcategory_data.map((option, k) => (
                        <MenuItem key={k} value={option.id}>
                        {option.name}
                        </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6} className={classes.control}>
                  <TextField
                    variant="outlined"
                    value={this.state.category_name || ""}
                    name="category_name"
                    onChange={(e) => { this.setState({ category_name :  e.target.value })}}
                    label="Enter Category Name"
                    fullWidth
                    required
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} className={classes.control}>
                  <TextField
                    variant="outlined"
                    value={this.state.category_description || ""}
                    multiline
                    fullWidth
                    name="category_description"
                    helperText="Upto 250 characters"
                    rows={2}
                    onChange={(e) => { this.setState({ category_description : e.target.value })}}
                    label="Enter Category Description"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} className={classes.control}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={returnable ? returnable : false}
                          name="returnable"
                          color="primary"
                          onChange={e =>
                            this.setState({ returnable: e.target.checked })
                          }
                        />
                      }
                      label="Is Returnable"
                    />
                  </Grid>
              </Grid>
              <Grid container justify="center" className={classes.control}>
                <Grid item>
                  <Button variant="contained" color="primary" type="submit">
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
  category_data: state.ccategory.data,
  loading: state.ccategory.loading,
  error: state.ccategory.error,
  pcategory_data : state.pcategory.data,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(ChildCategory));
