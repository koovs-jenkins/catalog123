import React from "react";
import {Typography,
  Select,
  InputLabel,
  MenuItem,
  FormControl
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Error from "@material-ui/icons/ErrorOutline";
import ImgUrl from "../../../config.js";
import {
  fetchMeasurementDetail,
  postMeasurement,
  putMeasurement
} from "../../store/actions/addmeasurement";
import { fetchAllEnum } from "../../store/actions/attributetype";
import { connect } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import sanitizeHtml from "sanitize-html";
import { awsrequest } from "../../helpers/aws-s3";
const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  control:{
    padding:"10px"
  },
  button: {
    margin: theme.spacing.unit * 2
  }
});

class Measurement extends React.Component {
  state = {
    type: "add",
    edit_id: "",
    enum: ""
  };

  componentDidMount = () => {
    var self = this;
    this.get_all_enum();
    var self = this;
    this.setState(
      {
        type: this.props.match.params.type
          ? this.props.match.params.type
          : "add",
        edit_id: this.props.match.params.id ? this.props.match.params.id : ""
      },
      () => {
        if (this.state.type == "edit" && this.state.edit_id) {
          this.props
            .dispatch(fetchMeasurementDetail(this.state.edit_id))
            .then(() =>
              self.setState({
                ageGroup: this.props.measurement_data.ageGroup,
                bust: this.props.measurement_data.bust,
                gender: this.props.measurement_data.gender,
                height: this.props.measurement_data.height,
                hips: this.props.measurement_data.hips,
                image: ImgUrl.imageUrl + this.props.measurement_data.image,
                info: this.props.measurement_data.info,
                name: this.props.measurement_data.name,
                shoulder: this.props.measurement_data.shoulder,
                size: this.props.measurement_data.meaurementSize,
                waist: this.props.measurement_data.waist
              })
            );
        }
      }
    );
  };

  UNSAFE_componentWillReceiveProps = newProps => {
    var self = this;
    if (newProps.match.params.type != this.props.match.params.type) {
      this.setState({ type: newProps.match.params.type }, () => {
        if (this.state.type == "add") {
          this.setState({
            type: "add",
            edit_id: "",
            enum: ""
          });
        }
      });
    }
    if (newProps.match.params.id != this.props.match.params.id) {
      this.setState({ id: newProps.match.params.id }, () => {
        if (this.state.type == "edit" && this.state.edit_id) {
          this.props
            .dispatch(fetchMeasurementDetail(this.state.edit_id))
            .then(() =>
              self.setState({
                ageGroup: this.props.measurement_data.ageGroup,
                bust: this.props.measurement_data.bust,
                gender: this.props.measurement_data.gender,
                height: this.props.measurement_data.height,
                hips: this.props.measurement_data.hips,
                image: ImgUrl.imageUrl + this.props.measurement_data.image,
                info: this.props.measurement_data.info,
                name: this.props.measurement_data.name,
                shoulder: this.props.measurement_data.shoulder,
                size: this.props.measurement_data.meaurementSize,
                waist: this.props.measurement_data.waist
              })
            );
        }
      });
    }
  };

  handleform(event) {
    event.preventDefault();
    var self = this;
    if (this.state.image) {
      if (this.state.type == "create") {
        var formdata = {
          ageGroup: sanitizeHtml(this.state.ageGroup),
          bust: sanitizeHtml(this.state.bust),
          gender: sanitizeHtml(this.state.gender),
          height: sanitizeHtml(this.state.height),
          hips: sanitizeHtml(this.state.hips),
          image: sanitizeHtml(this.state.image),
          info: sanitizeHtml((this.state.info ? this.state.info : "")),
          name: sanitizeHtml(this.state.name),
          shoulder: sanitizeHtml((this.state.shoulder ? this.state.shoulder : "")),
          measurementSize: sanitizeHtml(this.state.size),
          waist: sanitizeHtml(this.state.waist),
          userId: this.props.email
        };
        this.props
          .dispatch(postMeasurement(JSON.stringify(formdata)))
          .then(res => {
            if (!self.props.error) {
              this.props.history.push("/catalogue/list/measurement");
            }
          });
      } else if (this.state.type == "edit" && this.state.edit_id) {
        var formdata = {
          ageGroup: sanitizeHtml(this.state.ageGroup),
          bust: sanitizeHtml(this.state.bust),
          gender: sanitizeHtml(this.state.gender),
          height: sanitizeHtml(this.state.height),
          hips: sanitizeHtml(this.state.hips),
          image: sanitizeHtml(this.state.image),
          info: sanitizeHtml((this.state.info ? this.state.info : "")),
          name: sanitizeHtml(this.state.name),
          shoulder: sanitizeHtml((this.state.shoulder ? this.state.shoulder : "")),
          measurementSize: sanitizeHtml(this.state.size),
          waist: sanitizeHtml(this.state.waist),
          id: sanitizeHtml(this.state.edit_id),
          userId: this.props.email
        };
        this.props
          .dispatch(
            putMeasurement(this.state.edit_id, JSON.stringify(formdata))
          )
          .then(res => {
            if (!self.props.error) {
              this.props.history.push("/catalogue/list/measurement");
            }
          });
      }
    } else {
      alert("Please upload the model image");
    }
  }

  get_all_enum() {
    this.props.dispatch(fetchAllEnum()).then(() => {
      this.setState(
        {
          enum: this.props.enum.data.response
        },
        () => {}
      );
    });
  }

  handle_image_upload(event) {
    var self = this;
    var file = event.target.files[0].name.split(".");
    var name = file[file.length - 1].toLowerCase();
    var size = event.target.files[0].size;
    if (name == "jpg" || name == "jpeg") {
      if (parseFloat((size / 1048576).toFixed(2)) <= 2) {
        awsrequest(event.target.files[0])
          .then(res =>
            self.setState({ image: res.Location }, () => {
              document.getElementById("image_upload").value = "";
            })
          )
          .catch(err => console.log("rejected", err));
      } else {
        alert("Please upload image of size less than 2MB");
      }
    } else if (name != "jpg" || name != "jpeg") {
      alert("Please upload the image in .jpg/.jpeg format only.");
    }
  }

  handle_remove_image() {
    this.setState({ image: "" });
  }

  render() {
    const { classes, match, loading } = this.props;
    return (
      <React.Fragment>
        {loading && (
          <LinearProgress />
        )}
        {!loading && (
          <React.Fragment>
            <Grid container justify="space-between" className={classes.wrapper} lg={12} >
              <Typography variant="h6" gutterBottom component="h6">
                {this.state.type == "edit" ? "Edit" : "Create"} Model
                {this.props.error && (
                  <div className="error_container">
                    {typeof this.props.error.error != "object" && (
                      <p>
                        <Error className="vertical_align_error" /> &nbsp;
                        {this.props.error.error}
                      </p>
                    )}
                    {typeof this.props.error.error == "object" && (
                      <p>
                        <Error className="vertical_align_error" /> &nbsp; Server
                        Error : &nbsp;
                        {this.props.error.error.message}
                      </p>
                    )}
                  </div>
                )}
                
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={e => {
                  this.props.history.goBack();
                }}
              >
                Go Back
              </Button>
            </Grid>
           
            <form onSubmit={this.handleform.bind(this)}>
              <Paper className={classes.paper}>
                <Grid container spacing={24}>
                  {/* <p className="important_note"><span>Note</span>: All the entries are in <span>inches</span>.</p> */}
                  <Grid item xs={12} sm={12} className={classes.control}>
                    <div className={"product_images"}>
                      <TextField
                        id="image_upload"
                        onChange={this.handle_image_upload.bind(this)}
                        type="file"
                        fullWidth
                        variant="outlined"
                        name="image_upload"
                        accept=".jpg, .jpeg"
                        hidden
                      />
                     
                    </div>
                  </Grid>
                  <Grid item xs={12} container justify="left" className={classes.control}>
                     {this.state.image && (
                        <React.Fragment>
                          <div>
                            <img height="200px" src={this.state.image} />
                            <div
                              style={{ margin: "auto", width: "200px" }}
                              className="image_remove_button"
                              onClick={this.handle_remove_image.bind(this)}
                            >
                              X
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                      {!this.state.image && (
                        <React.Fragment>
                          <label htmlFor="image_upload" title="Upload Image">
                            <span>Image Upload</span>
                          </label>
                        </React.Fragment>
                      )}
                  </Grid>
                  <Grid item xs={12} sm={12} className={classes.control}>
                    <TextField
                      id="outlined-basic" 
                      variant="outlined" 
                      value={this.state.name || ""}
                      name="name"
                      onChange={e => {
                        this.setState({ name: e.target.value });
                      }}
                      label="Enter Name"
                      required
                      inputProps={{
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250"
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}  className={classes.control}>
                    <TextField
                      value={this.state.info || ""}
                      multiline
                      fullWidth
                      name="info"
                      variant="outlined"
                      rows={2}
                      onChange={e => {
                        this.setState({ info: e.target.value });
                      }}
                      label="Enter Info"
                      helperText="Upto 250 characters"
                      inputProps={{
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250"
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}  className={classes.control}>
                    <TextField
                      value={this.state.height || ""}
                       variant="outlined"
                      name="height"
                      onChange={e => {
                        this.setState({ height: e.target.value });
                      }}
                      label="Enter Height"
                      required
                      helperText="Enter Height in feet (ft)*"
                      inputProps={{
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250",
                        min: "0",
                        step: "0.01",
                        max: "8.10"
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}  className={classes.control}>
                    <TextField
                      value={this.state.bust || ""}
                      variant="outlined"
                      name="bust"
                      onChange={e => {
                        this.setState({ bust: e.target.value });
                      }}
                      label="Enter Chest/Bust"
                      required={true}
                      helperText="Enter Chest/Bust in inches (inch)*"
                      inputProps={{
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250",
                        min: "0",
                        max: "100",
                        step: "1"
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}  className={classes.control}>
                    <TextField
                      label="Waist"
                      value={this.state.waist || ""}
                      name="waist"
                      variant="outlined"
                      onChange={e => {
                        this.setState({ waist: e.target.value });
                      }}
                      required
                      helperText="Enter Waist in inches (inch)*"
                      inputProps={{
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250",
                        min: "0",
                        step: "1",
                        max: "100"
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}  className={classes.control}>
                    <TextField
                      value={this.state.hips || ""}
                      name="hips"
                      variant="outlined"
                      onChange={e => {
                        this.setState({ hips: e.target.value });
                      }}
                      label="Enter Hips"
                      required
                      helperText="Enter Hips in inches (inch)*"
                      inputProps={{
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250",
                        min: "0",
                        step: "1",
                        max: "100"
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}  className={classes.control}>
                    <TextField
                      value={this.state.shoulder || ""}
                      name="shoulder"
                      variant="outlined"
                      onChange={e => {
                        this.setState({ shoulder: e.target.value });
                      }}
                      label="Enter Shoulder"
                      helperText="Enter Shoulder in inches (inch)*"
                      inputProps={{
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250",
                        min: "0",
                        step: "1",
                        max: "100"
                      }}
                      fullWidth
                    />
                  </Grid>
                  {this.state.enum.ageGroup && (
                    <React.Fragment>
                      <Grid item xs={4} sm={4}  className={classes.control}>
                      <FormControl fullWidth variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Please select Age Group*</InputLabel>
                        <Select
                          label="Please select Age Group*"
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={this.state.ageGroup ? this.state.ageGroup : ""}
                          onChange={e => {
                            this.setState({ ageGroup: e.target.value });
                          }}
                          fullWidth
                          required
                        >
                          <MenuItem value="">Select Age Group</MenuItem>
                          {Object.keys(this.state.enum.ageGroup).map(function(
                            i,
                            index
                          ) {
                            return (
                              <MenuItem
                                key={index}
                                value={this.state.enum.ageGroup["" + i]}
                              >
                                {i}
                              </MenuItem>
                            );
                          },
                          this)}
                        </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} sm={4}  className={classes.control}>
                      <FormControl fullWidth variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Please select Gender*</InputLabel>
                        <Select
                          label="Please select Gender*"
                          value={this.state.gender ? this.state.gender : ""}
                          onChange={e => {
                            this.setState({ gender: e.target.value });
                          }}
                          labelId="demo-simple-select-outlined-label"
                          fullWidth
                          required
                        >
                          <MenuItem value="">Select Gender</MenuItem>
                          {Object.keys(this.state.enum.gender).map(function(
                            i,
                            index
                          ) {
                            return (
                              <MenuItem
                                key={index}
                                value={this.state.enum.gender["" + i]}
                              >
                                {i}
                              </MenuItem>
                            );
                          },
                          this)}
                        </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} sm={4}  className={classes.control}>
                      <FormControl fullWidth variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Please select Size*</InputLabel>
                        <Select
                          label="Please select Size*"
                          labelId="demo-simple-select-outlined-label"
                          value={this.state.size ? this.state.size : ""}
                          onChange={e => {
                            this.setState({ size: e.target.value });
                          }}
                          fullWidth
                          required
                        >
                          <MenuItem value="">Select Size</MenuItem>
                          {Object.keys(this.state.enum.measurementSize).map(
                            function(i, index) {
                              return (
                                <MenuItem
                                  key={index}
                                  value={
                                    this.state.enum.measurementSize["" + i]
                                  }
                                >
                                  {i}
                                </MenuItem>
                              );
                            },
                            this
                          )}
                        </Select>
                        </FormControl>
                      </Grid>
                    </React.Fragment>
                  )}
                </Grid>
                <Grid container justify="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className={classes.button}
                    >
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
  measurement_data: state.addmeasurement.data.data.response,
  loading: state.addmeasurement.loading,
  error: state.addmeasurement.error,
  enum: state.attributetype.enum,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(Measurement));
