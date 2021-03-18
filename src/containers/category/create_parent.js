import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import {
    fetchPCategoryDetail,
    postPCategory,
    putPCategory,
} from "../../store/actions/parentcategory";
import { connect } from "react-redux";
import sanitizeHtml from 'sanitize-html'
import LinearProgress from '@material-ui/core/LinearProgress';
const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  control:{
    padding:"15px"
  },
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
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  }
});

class ParentCategory extends React.Component {
  state = {
    type :  "add",
    edit_id : "",
    category_name : "",
    category_description : "",
};

  

componentDidMount = () => {
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
        this.props.dispatch(fetchPCategoryDetail(this.state.edit_id)).then(() =>
           this.setState({
             category_name : this.props.category_data.data.response.name,
             category_description : this.props.category_data.data.response.description
           })
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
                category_name : "",
                category_description : "",
              })
          }
        })
    }
    if(newProps.match.params.id != this.props.match.params.id){
      this.setState({ id :  newProps.match.params.id },()=>{
          if(this.state.type  == "edit" && this.state.edit_id){
            this.props.dispatch(fetchPCategoryDetail(this.state.edit_id)).then(() =>
            this.setState({
              category_name : this.props.category_data.data.response.name,
              category_description : this.props.category_data.data.response.description
            })
            )
          }
      })
    }
}

  handleform(event){
    event.preventDefault();
    var self = this;
    var formdata = {"name" :sanitizeHtml(this.state.category_name).replace("&amp;", "&"), "description" : sanitizeHtml(this.state.category_description).replace("&amp;", "&"), createdBy: self.props.email, returnable: false};
      if(this.state.type == "create"){
        this.props.dispatch(postPCategory(JSON.stringify(formdata))).then((res)=>{
          if(!self.props.error){
            alert("Category created successfully");
            this.props.history.push("/catalogue/list/parent/category")
          }
        })
      }
      else if(this.state.type == "edit" && this.state.edit_id){
        formdata.id = this.state.edit_id;
        this.props.dispatch(putPCategory(this.state.edit_id,JSON.stringify(formdata))).then((res)=>{
          if(!self.props.error){
            alert("Category updated successfully");
            this.props.history.push("/catalogue/list/parent/category")
          }
        })
      }
  }


  render() {
    const { classes, match, loading } = this.props;
    return (
      <React.Fragment>
        {!loading && (
          <React.Fragment>
            <Grid container lg={12} justify="space-between" className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
              {this.state.type == "edit" ? "Edit" : "Create"} Master Category 
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
            <Button
                   variant="contained"
                   color="primary"
               className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
            </Grid>
           
            {loading &&
            <LinearProgress />
            }
            <form onSubmit={this.handleform.bind(this)}>
            <Paper className={classes.paper}>
              <Grid container spacing={12}>
                <Grid item xs={12} sm={12}  className={classes.control}>
                  <TextField
                    label="Enter Category Name"
                    variant="outlined"
                    value={this.state.category_name || ""}
                    name="category_name"
                    onChange={(e) => { this.setState({ category_name :  e.target.value })}}
                    required
                    InputProps={{
                    readOnly: this.state.edit_id ? true : false,
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} className={classes.control}>
                  <TextField
                    label="Enter Category Description"
                    variant="outlined"
                    value={this.state.category_description || ""}
                    multiline
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="category_description"
                    rows={2}
                    helperText="Upto 250 characters"
                    onChange={(e) => { this.setState({ category_description : e.target.value })}}
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250"
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
  category_data: state.pcategory.data,
  loading: state.pcategory.loading,
  error: state.pcategory.error,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(ParentCategory));
