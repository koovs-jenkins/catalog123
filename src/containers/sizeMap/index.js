import React from "react";
import Notify from "../../components/Notify";
import {
  Grid,
  withStyles,
  Paper,
  LinearProgress,
  Button,
  TextField,
  Typography,
  Input,
  Select,
  InputLabel,
  MenuItem,
  FormControl
} from "@material-ui/core";
import {
  fetchAllMasterCategory,
  uploadTemplateImage,
  fetchSubCategory,
  fetchBrandTemplate,
  postSizeMap
} from "../../store/actions/sizeMap";
import { connect } from "react-redux";
import {
  postSizeMapData,
  fetchArticleIdBySubcategory
} from "../../api/sizeMap";

const styles = theme => ({
  select: {
    width: "60%",
    height: "40px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "white"
  },
  paper: {
    padding: theme.spacing.unit * 1,
    marginTop: "10px",
    maxWidth: "100%"
  },
  wrapper:{
    marginTop:"10px"
  },
  button: {
    margin: theme.spacing.unit * 2
  },
  gridItem: {
    padding:"10px",
    marginTop: "10px",
  }
});

class SizeMap extends React.Component {
  initialState = {
    showWithTemplate: false,
    showWithoutTemplate: false,
    formData: {
      gender: "men",
      masterCategory: "",
      subCategory: "",
      brand: "",
      multiBrand: [],
      template: "",
      imageUrl: "",
      articleTypeId: ""
    },
    postData: {},
    message: "",
    loader: false
  };
  state = {
    ...this.initialState
  };

  componentDidMount() {
    this.getMasterCategory();
  }

  toggleShowWithTemplate = () => {
    let formData = this.state.formData;
    formData.masterCategory = "";
    formData.subCategory = "";
    this.setState({
      formData,
      showWithTemplate: true,
      showWithoutTemplate: false
    });
  };

  toggleShowWithoutTemplate = () => {
    let formData = this.state.formData;
    formData.masterCategory = "";
    formData.subCategory = "";
    this.setState({
      formData,
      showWithoutTemplate: true,
      showWithTemplate: false
    });
  };

  handleOnSubmit = e => {
    e.preventDefault();
    let postData = [];
    if (this.state.showWithTemplate) {
      if (this.state.formData.gender == "") {
        alert("select gender");
      } else if (this.state.formData.masterCategory == "") {
        alert("select master category");
      } else if (this.state.formData.subCategory == "") {
        alert("select sub category");
      } else if (this.state.formData.multiBrand.length < 1) {
        alert("select brands");
      } else if (this.state.formData.template == "") {
        alert("select template");
      } else {
        let brands = this.state.formData.multiBrand;
        postData = brands.map((item, index) => {
          let object = {};
          object.articleTypeId = this.state.formData.articleTypeId;
          object.brandId = item;
          object.imageUrl = this.state.formData.imageUrl;
          object.gender = this.state.formData.gender;
          object.templateId = this.state.formData.template;
          return object;
        });
      }
    }
    if (this.state.showWithoutTemplate) {
      if (this.state.formData.gender == "") {
        alert("select gender");
      } else if (this.state.formData.masterCategory == "") {
        alert("select master category");
      } else if (this.state.formData.subCategory == "") {
        alert("select sub category");
      } else if (this.state.formData.brand == "") {
        alert("select brand");
      } else if (this.state.formData.imageUrl == "") {
        alert("plz Upload image or wait for sometime");
      } else {
        let object = {};
        object.articleTypeId = this.state.formData.articleTypeId;
        object.brandId = this.state.formData.brand;
        object.gender = this.state.formData.gender;
        object.imageUrl = this.state.formData.imageUrl;
        postData.push(object);
      }
    }
    if (postData.length > 0) {
      const that = this;
      this.setState({ message: "", loader: true }, () =>
        postSizeMapData(postData).then(res => {
          if (res.status < 350) {
            that.setState({
              ...this.initialState,
              message: "Update successfull",
              loader: false
            });
          } else {
            that.setState({
              message: "Error occured in mapping subcategory",
              loader: false
            });
          }
        })
      );
    }
  };

  getMasterCategory = () => {
    this.props.dispatch(fetchAllMasterCategory()).then(() => {});
  };

  getSubCategory = id => {
    if (id != "") {
      this.props
        .dispatch(fetchSubCategory(this.state.formData.gender, id))
        .then(() => {});
    }
  };

  getBrands = id => {
    if (id != "") {
      this.props
        .dispatch(fetchBrandTemplate(this.state.formData.gender, id))
        .then(() => {});
    }
  };

  handleTemplateImageUpload = formData => {
    this.props.dispatch(uploadTemplateImage(formData)).then(() => {
      let formData = this.state.formData;
      formData.imageUrl = this.props.templateImage.data.key;
    });
  };

  handleMultiSelectChange = e => {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    // console.log(value);
    let formData = this.state.formData;
    formData.multiBrand = value;
    this.setState({ formData });
  };

  render() {
    const { classes, match, loading } = this.props;
    const { message, loader } = this.state;
    const that = this;
    return (
      <React.Fragment>
        {(loading || loader) && <LinearProgress className="linear_loader" />}
        {message && <Notify message={message} />}
        <Grid className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Size Mapping
          </Typography>
        </Grid>
        <Grid  justify="left" lg={12}>
          <Paper className={classes.paper}>
          <Grid container justify="left">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={e => {
                  this.toggleShowWithTemplate();
                }}
                type="button"
                className={classes.button}
              >
                Size Mapping with template
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={e => {
                  this.toggleShowWithoutTemplate();
                }}
                type="button"
                className={classes.button}
              >
                New Size Mapping
              </Button>
            </Grid>
        </Grid>
          {(this.state.showWithTemplate || this.state.showWithoutTemplate) && (
            <form onSubmit={e => this.handleOnSubmit(e)}>
              <Grid container>
                <Grid className={classes.gridItem} item xs={12} sm={6} md={4}>
                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Select Gender</InputLabel>
                      <Select
                        name="gender"
                        label="Select Gender"
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        onChange={e => {
                          let formData = this.state.formData;
                          formData.gender = e.target.value;
                          formData.masterCategory = "";
                          formData.subCategory = "";
                          formData.template = "";
                          formData.brand = "";
                          formData.multiBrand = [];
                          this.setState({ formData });
                        }}
                      >
                        <MenuItem value="men">Men</MenuItem>
                        <MenuItem value="women">Women</MenuItem>
                        <MenuItem value="unisex">Unisex</MenuItem>
                        <MenuItem value="kids">Kids</MenuItem>
                      </Select>
                  </FormControl>
                </Grid>
                <Grid className={classes.gridItem} item xs={12} sm={6} md={4}>
                  {this.props.masterCategory &&
                    this.props.masterCategory.data &&
                    this.props.masterCategory.data.data &&
                    this.props.masterCategory.data.data.length > 0 && (
                      <FormControl fullWidth variant="outlined">
                      <InputLabel id="demo-simple-select-outlined-label">Select Master Category</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        label="Select Master Category"
                        name="masterCategory"
                        value={this.state.formData.masterCategory}
                        onChange={e => {
                          let formData = this.state.formData;
                          formData.masterCategory = e.target.value;
                          formData.subCategory = "";
                          formData.multiBrand = [];
                          formData.brand = "";
                          formData.imageUrl = "";
                          formData.template = "";
                          this.setState({ formData });
                          this.getSubCategory(e.target.value);
                        }}
                      >
                        {this.props.masterCategory.data.data.map(
                          (item, index) => {
                            return (
                              <MenuItem key={item.id} value={item.id}>
                                {item.value}
                              </MenuItem>
                            );
                          }
                        )}
                      </Select>
                      </FormControl>
                    )}
                </Grid>
                <Grid className={classes.gridItem} item xs={12} sm={6} md={4}>
                  {console.log("this.props.subCategory.data.data",this.props.subCategory.data.data)}
                  {this.state.formData.masterCategory != "" &&
                    this.props.subCategory &&
                    this.props.subCategory.data &&
                    this.props.subCategory.data.data &&
                    this.props.subCategory.data.data.length > 0 && (
                      <FormControl fullWidth variant="outlined">
                      <InputLabel id="demo-simple-select-outlined-label-subcat">Select Sub Category</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label-subcat"
                        name="subCategory"
                        label="Select Sub Category"
                        value={this.state.formData.subCategory}
                        onChange={e => {
                          let formData = this.state.formData;
                          if (formData.masterCategory != "") {
                            formData.subCategory = e.target.value;
                            formData.multiBrand = [];
                            formData.brand = "";
                            formData.imageUrl = "";
                            formData.template = "";
                            this.setState({ formData });
                            this.getBrands(e.target.value);
                            fetchArticleIdBySubcategory(
                              e.target.value,
                              this.props.userId,
                              this.state.formData.gender,
                            ).then(res => {
                              if (
                                res &&
                                res.status < 350 &&
                                res.data &&
                                res.data.response &&
                                res.data.response.articleTypeId
                              ) {
                                formData.articleTypeId =
                                  res.data.response.articleTypeId;
                                that.setState({ formData });
                              }
                            });
                          } else {
                            alert("Plz Select Master Category");
                          }
                        }}
                      >
                        <MenuItem value="">Select subCategory</MenuItem>
                        {this.props.subCategory.data.data.map((item, index) => {
                          return (
                            <MenuItem key={item.id} value={item.id}>
                              {item.value}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      </FormControl>
                    )}
                </Grid>
                {this.state.showWithTemplate && (
                <Grid className={classes.gridItem} item xs={12} sm={6} md={4}>
                  <Typography>Brand</Typography>
                  {this.state.formData.subCategory != "" &&
                    this.props.brands &&
                    this.props.brands.data &&
                    this.props.brands.data.data &&
                    this.props.brands.data.data.length > 0 && (
                      <select
                        name="selectMultiBrand"
                        className={classes.select}
                        style={{ height: "100px" }}
                        multiple
                        onChange={e => {
                          let formData = this.state.formData;
                          if (formData.subCategory != "") {
                            this.handleMultiSelectChange(e);
                          } else {
                            alert("Plz Select Sub Category");
                          }
                        }}
                      >
                        {this.props.brands.data.data.map((item, index) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.value}
                            </option>
                          );
                        })}
                      </select>
                    )}
                </Grid>
              )}
                {this.state.showWithTemplate && (
                  <Grid className={classes.gridItem} item xs={12} sm={6} md={4}>
                    {this.state.formData.subCategory != "" &&
                      this.props.brands &&
                      this.props.brands.data &&
                      this.props.brands.data.templates &&
                      this.props.brands.data.templates.length > 0 && (
                        <FormControl fullWidth variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">Select Template</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          label="Select Template"
                          name="selectTemplate"
                          value={this.state.formData.template}
                          onChange={e => {
                            let formData = this.state.formData;
                            if (formData.subCategory != "") {
                              formData.template = e.target.value;
                              let index = e.target.selectedIndex - 1;
                              if (index > -1) {
                                formData.imageUrl = this.props.brands.data.templates[
                                  index
                                ].imageUrl;
                              }
                              this.setState({ formData });
                            } else {
                              alert("Plz Select Sub Category");
                            }
                          }}
                        >
                          <MenuItem value="">Select Template</MenuItem>
                          {this.props.brands.data.templates.map((item, index) => {
                            return (
                              <MenuItem
                                key={item.id}
                                url={item.imageUrl}
                                value={item.id}
                              >
                                {item.value}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        </FormControl>
                      )}
                  </Grid>
                )}
                {this.state.showWithoutTemplate && (
                  <Grid className={classes.gridItem} item xs={12} sm={6} md={4}>
                    {this.state.formData.subCategory != "" &&
                      this.props.brands &&
                      this.props.brands.data &&
                      this.props.brands.data.data &&
                      this.props.brands.data.data.length > 0 && (
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="demo-simple-select-outlined-label">Select Brand</InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            name="selectBrand"
                            label="Select Brand"
                            value={this.state.formData.brand}
                            onChange={e => {
                              let formData = this.state.formData;
                              if (formData.subCategory != "") {
                                formData.brand = e.target.value;
                                this.setState({ formData });
                              } else {
                                alert("Plz Select Sub Category");
                              }
                            }}
                          >
                            {this.props.brands.data.data.map((item, index) => {
                              return (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.value}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      )}
                  </Grid>
                )}
                {this.state.showWithoutTemplate && (
                  <Grid className={classes.gridItem} item xs={12} sm={6} md={4}>
                    <Typography>Upload</Typography>
                    <input
                      id="uploadFile"
                      type="file"
                      name="template_file"
                      accept=".png, .jpg, .jpeg"
                      onChange={e => {
                        var formdata = new FormData();
                        let file =
                          e.target.files &&
                          e.target.files[0] &&
                          e.target.files[0].name;
                        let allowedExtension = ["png", "jpg", "jpeg"];
                        let fileExtension = file.split(".");
                        fileExtension = fileExtension[fileExtension.length - 1];
                        if (allowedExtension.indexOf(fileExtension) > -1) {
                          formdata.append("template_upload", e.target.files[0]);
                          this.handleTemplateImageUpload(formdata);
                        } else {
                          let fileName = document.getElementById("uploadFile");
                          fileName.value = "";
                          alert(
                            "plz choose the valid file. Choose either png or jpg or jpeg"
                          );
                        }
                      }}
                    />
                  </Grid>
                )}
              </Grid>
              <Grid className={classes.gridItem} item xs={12} sm={6} md={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.button}
                  >
                    Save
                  </Button>
                </Grid>
            </form>
          )}
        </Paper>
        </Grid>
       
       
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  masterCategory: state.sizeMap.masterCategory,
  subCategory: state.sizeMap.subCategory,
  brands: state.sizeMap.brand,
  templateImage: state.sizeMap.uploadImage,
  postData: state.sizeMap.postData,
  userId: state.signin.data.body.data.user.id
});

export default withStyles(styles)(connect(mapStateToProps)(SizeMap));
