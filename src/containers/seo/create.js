import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import {
    fetchSeoDetail,
    postSeo,
    putSeo,
} from "../../store/actions/seo";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import sanitizeHtml from 'sanitize-html'
import ReactQuill from 'react-quill'; 
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
    [{'indent': '-1'}, {'indent': '+1'}],
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

const styles = theme => ({
   paper: {
        marginTop:"10px",
        padding: theme.spacing.unit * 2,
        maxWidth: "100%"
      },
    wrapper: {
      marginTop:"20px"
    },
  button: {
    margin: theme.spacing.unit * 4
  }
});

class Seo extends React.Component {
  state = {
    type :  "add",
    edit_id : "",
    metaDescription: "",
    metaTitle: "",
    metaKeyword: "",
    bannerUrl: "",
    footerContent: "",
    canonicalUrl: ""
};

  

componentDidMount = () => {
  this.setState({
    type : this.props.match.params.type ? this.props.match.params.type : "add",
    edit_id : this.props.match.params.id ? this.props.match.params.id : ""
  },()=>{
      if(this.state.type == "edit" && this.state.edit_id){
        this.props.dispatch(fetchSeoDetail(this.state.edit_id)).then(() =>
           this.setState({
             metaDescription : this.props.seo_data.data.metaDescription,
             metaTitle : this.props.seo_data.data.metaTitle,
             metaKeyword : this.props.seo_data.data.metaKeyword,
             bannerUrl : this.props.seo_data.data.bannerUrl,
             footerContent : JSON.parse(this.props.seo_data.data.footerContent).footer_aboutus,
             canonicalUrl : this.props.seo_data.data.canonicalUrl
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
                metaDescription : "",
                metaTitle : "",
                metaKeyword : "",
                bannerUrl : "",
                footerContent : "",
                canonicalUrl : "",
                
              })
          }
        })
    }
    if(newProps.match.params.id != this.props.match.params.id){
      this.setState({ id :  newProps.match.params.id },()=>{
          if(this.state.type  == "edit" && this.state.edit_id){
            this.props.dispatch(fetchSeoDetail(this.state.edit_id)).then(() =>
            this.setState({
             metaDescription : this.props.seo_data.data.metaDescription,
             metaTitle : this.props.seo_data.data.metaTitle,
             metaKeyword : this.props.seo_data.data.metaKeyword,
             bannerUrl : this.props.seo_data.data.bannerUrl,
             footerContent : this.props.seo_data.data.footerContent,
             canonicalUrl : this.props.seo_data.data.canonicalUrl
            })
            )
          }
      })
    }
}

handlefooterdata(value){
  this.setState({ footerContent : value })
}

  handleform(event){
    console.log(event)
    event.preventDefault();
    var self = this;
    if(this.state.type == "create"){
      var formdata = {
        "metaDescription" : sanitizeHtml(this.state.metaDescription).replace(/amp;/g, ""),
        "metaTitle" : sanitizeHtml(this.state.metaTitle).replace(/amp;/g, ""),
        "metaKeyword" : sanitizeHtml(this.state.metaKeyword).replace(/amp;/g, ""),
        "bannerUrl" : sanitizeHtml(this.state.bannerUrl).replace(/amp;/g, ""),
        "footerContent" : JSON.stringify({"brand_data":[],"category_data":[],"footer_aboutus": this.state.footerContent == '<p><br></p>' ? "" : this.state.footerContent }),
        "canonicalUrl" : this.state.canonicalUrl
      }
      this.props.dispatch(postSeo(JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          this.props.history.push("/catalogue/list/banner")
        }
      })
    }
    else if(this.state.type == "edit" && this.state.edit_id){
      var formdata = {
      "id" : this.state.edit_id,
      "metaDescription" : sanitizeHtml(this.state.metaDescription).replace(/amp;/g, ""),
      "metaTitle" : sanitizeHtml(this.state.metaTitle).replace(/amp;/g, ""),
      "metaKeyword" : sanitizeHtml(this.state.metaKeyword).replace(/amp;/g, ""),
      "bannerUrl" : sanitizeHtml(this.state.bannerUrl).replace(/amp;/g, ""),
      "footerContent" : JSON.stringify({"brand_data":[],"category_data":[],"footer_aboutus": this.state.footerContent == '<p><br></p>' ? "" : this.state.footerContent }),
      "canonicalUrl" : this.state.canonicalUrl
      }
      this.props.dispatch(putSeo(this.state.edit_id,JSON.stringify(formdata))).then((res)=>{
        if(!self.props.error){
          this.props.history.push("/catalogue/list/banner")
        }
      })
    }
   
  }


  render() {
    const { classes, match, loading } = this.props;
    return (
      <React.Fragment>
        {loading &&
            <LinearProgress className="linear_loader" color="secondary"/>
        }
        {!loading && (
          <React.Fragment>
            <Grid container className={classes.wrapper} justify="space-between">
              <Typography variant="h5" gutterBottom component="h5">
                {this.state.type == "edit" ? "Edit" : "Create"} SEO Data {this.state.edit_id}
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
                      <Error className="vertical_align_error"/> &nbsp; Server Error : &nbsp;
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
              <Grid container spacing={12} className={classes.wrapper}>
              <Grid item xs={12} sm={12}>
                  <TextField
                    label="Banner URL"
                    value={this.state.bannerUrl || ""}
                    fullWidth
                    variant="outlined"
                    name="bannerUrl"
                    rows={2}
                    onChange={(e) => { this.setState({ bannerUrl : (e.target.value) })}}
                    placeholder="Enter Banner URL"
                    required={true}
                    inputProps={{
                    maxLength : "250"
                    }}
                    helperText="Enter the url without the first and last (/) slash."
                  />
                </Grid>
                {this.setState.bannerUrl != "" &&
                    <React.Fragment>
                      <Grid item xs={12} sm={12} className={classes.wrapper}>
                        <TextField
                          label="Meta Description"
                          multiline
                          value={this.state.metaDescription || ""}
                          variant="outlined"
                          name="metaDescription"
                          onChange={(e) => { this.setState({ metaDescription :  (e.target.value) })}}
                          placeholder="Enter Meta Description"
                          inputProps={{
                          maxLength : "500",
                          minLength : "50"
                          }}
                          fullWidth
                          required={true}
                          helperText="Description should be between 50-500 characters."
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} className={classes.wrapper}>
                        <TextField
                          label="Meta Title"
                          value={this.state.metaTitle || ""}
                          fullWidth
                          variant="outlined"
                          name="metaTitle"
                          rows={2}
                          onChange={(e) => { this.setState({ metaTitle : (e.target.value) })}}
                          placeholder="Enter Meta Title"
                          required={true}
                          inputProps={{
                          maxLength : "250"
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} className={classes.wrapper}>
                        <TextField
                          label="Meta Keyword"
                          value={this.state.metaKeyword || ""}
                          fullWidth
                          variant="outlined"
                          name="metaKeyword"
                          rows={2}
                          onChange={(e) => { this.setState({ metaKeyword : (e.target.value) })}}
                          placeholder="Enter Meta Keyword"
                          required={true}
                          inputProps={{
                          maxLength : "250"
                          }}
                          helperText="Enter Meta Keywords comma (,) seprated."
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} className={classes.wrapper}>
                      <ReactQuill
                          required={false}
                          modules={modules}
                          defaultValue={this.state.footerContent}
                          preserveWhitespace={true}
                          formats={formats}
                          value={this.state.footerContent || ""} 
                          placeholder={"Enter Footer Content Data"}
                          onChange={ this.handlefooterdata.bind(this)} />
                      </Grid>
                    </React.Fragment>
                }
                
                {/* <Grid item xs={12} sm={12}>
                  <TextField
                    label="Canonical URL"
                    value={this.state.canonicalUrl || ""}
                    margin="normal"
                    multiline
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="canonicalUrl"
                    rows={2}
                    onChange={(e) => { this.setState({ canonicalUrl : (e.target.value) })}}
                    placeholder="Enter Canonical URL"
                    inputProps={{
                    pattern : "^[a-zA-Z1-9].*",
                    maxLength : "250",
                    type : "url"
                    }}
                    helperText="Enter the Full URL."
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
  seo_data: state.seo.data,
  loading: state.seo.loading,
  error: state.seo.error
});

export default withStyles(styles)(connect(mapStateToProps)(Seo));