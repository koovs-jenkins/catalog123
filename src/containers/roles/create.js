import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel, 
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import Switch from '@material-ui/core/Switch';

import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import sanitizeHtml from 'sanitize-html'
import axios from 'axios';
const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  control:{
    padding:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit 
  }
});

class CreateRoles extends React.Component {
  state = {
    type: "add",
    edit_id: "",
    formData: {
      name: "",
      descrition: "",
      is_active: 0
    }
  };



  componentDidMount = () => {
    this.setState({
      type: this.props.match.params.type ? this.props.match.params.type : "add",
      edit_id: this.props.match.params.id ? this.props.match.params.id : ""
    }, () => {
      if (this.state.type == "edit" && this.state.edit_id) {
        axios.get(`/getRole?id=${this.state.edit_id}`).then(res => {
          this.setState({ formData: res.data.response[0] })
        })
      }
    })
  };


  UNSAFE_componentWillReceiveProps = (newProps) => {
    if (newProps.match.params.type != this.props.match.params.type) {
      this.setState({ type: newProps.match.params.type }, () => {
        if (this.state.type == "add") {
          let formData = this.state.formData;
          formData.name = "";
          formData.descrition = "";
          this.setState({
            type: "add",
            edit_id: "",
            formData
          })
        }
      })
    }
    if (newProps.match.params.id != this.props.match.params.id) {
      this.setState({ id: newProps.match.params.id }, () => {
        if (this.state.type == "edit" && this.state.edit_id) {

        }
      })
    }
  }

  handleform(event) {
    console.log(event, sanitizeHtml(this.state.formData.name), sanitizeHtml(this.state.descrition))
    event.preventDefault();
    var self = this;
    if (self.state.type == "create") {
      let formData = self.state.formData;
      // console.log(formData);
      formData["datecreated"] = new Date();
      formData["dateupdated"] = new Date();
      formData["is_active"] = 1;
      formData["notification_email_list"] = this.props.signin.body.data.user.email;
      // console.log(formData);
      self.setState({ formData });
      axios.post('/createRole', formData).then(res => {
        if (res.data && !res.data.errorExists) {
          this.props.history.push("/role/list/roles")
        }
        else{
          alert(res.data.message)
        }
      })
      // this.props.dispatch(postBrand(JSON.stringify(formdata))).then((res)=>{

      // })
    }
    else if (this.state.type == "edit" && this.state.edit_id) {
      let formData = self.state.formData;
      // console.log(formData);
      formData["dateupdated"] = new Date();
      self.setState({ formData });
      axios.put('/updateRole', formData).then(res => {
        if (res.data && !res.data.errorExists) {
          this.props.history.push("/role/list/roles")
        }
        else{
          alert(res.data.message)
        }
      })
    }

  }


  render() {
    const { classes, match, loading } = this.props;
    // console.log(this.props)
    return (
      <React.Fragment>
        {loading &&
          <LinearProgress />
        }
        {!loading && (
          <React.Fragment>
            <Grid container lg={12} justify="space-between" className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
              {this.state.type == "edit" ? "Edit" : "Create"} Role
              {this.props.error &&
                <div className="error_container">
                  {(typeof (this.props.error.error) != "object") &&
                    <p>
                      <Error className="vertical_align_error" /> &nbsp;
                      {this.props.error.error}
                    </p>
                  }
                  {(typeof (this.props.error.error) == "object") &&
                    <p>
                      <Error className="vertical_align_error" /> &nbsp;  : &nbsp;
                      {(this.props.error.error.message)}
                    </p>
                  }
                </div>
              }
              
            </Typography>
            <Button variant="contained" color="primary" onClick={(e) => { this.props.history.goBack() }}> Go Back </Button>
            </Grid>
          
            <form onSubmit={this.handleform.bind(this)}>
              <Paper className={classes.paper}>
                <Grid container spacing={12}>
                  <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                      variant="outlined"
                      value={this.state.formData.name || ""}
                      name="name"
                      onChange={(e) => {
                        let formData = this.state.formData;
                        formData.name = e.target.value;
                        this.setState({ formData })
                      }}
                      label="Enter Role Name"
                      required
                      inputProps={{
                        readOnly: this.state.edit_id ? true : false,
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250"
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4} sm={4} className={classes.control}>
                    <TextField
                      variant="outlined"
                      value={this.state.formData.descrition || ""}
                      multiline
                      fullWidth
                      name="descrition"
                      rows={1}
                      onChange={(e) => {
                        let formData = this.state.formData;
                        formData.descrition = e.target.value;
                        this.setState({ formData })
                      }}
                      label="Enter Role Description"
                      helperText="Upto 250 characters"
                      required
                      inputProps={{
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250"
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4} className={classes.control}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                    <Select
                       labelId="demo-simple-select-outlined-label"
                       id="demo-simple-select-outlined"
                      label="Status"
                      margin= "normal"
                      value={this.state.formData.is_active}
                      onChange={(e) => {
                        let formData = this.state.formData;
                        formData.is_active = e.target.value;
                        this.setState({ formData })
                      }}
                      fullWidth
                      required
                    >
                      <MenuItem value="1">Active</MenuItem>
                      <MenuItem value="0">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                  </Grid>
                </Grid>
                <Grid container justify="left">
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
  brand_data: state.brand.data,
  loading: state.brand.loading,
  error: state.brand.error,
  signin: state.signin.data
});

export default withStyles(styles)(connect(mapStateToProps)(CreateRoles));
