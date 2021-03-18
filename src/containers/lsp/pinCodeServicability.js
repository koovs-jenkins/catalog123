
import React from "react";
import axios from "axios";
import {
  Paper,
  Grid,
  TextField,
  Typography,
  Fab,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  withStyles,
  LinearProgress
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  batchValidateServicablePinCode,
} from "../../store/actions/product";

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    ...theme.paper,
    marginTop:"10px",
    padding:"10px"
  },
  fab: {
    margin: theme.spacing.unit
  }
});

class PincodeUpload extends React.Component {
  state = {
    status: false,
    csvFile: {},
    message: "",
    type : "",
  };


  downloadCsv(){
    var that = this;
    axios({
      method: "get",
      url: that.state.type  == "forward" ? "/pincode-service/internal/download-forward-serviceability-sample" : "/pincode-service/internal/download-reverse-serviceability-sample",
      headers: {
        "Content-Type": "multipart/form-data",
        "x-api-client": "OPS",
        "x-user-id": that.props.userId,
        "X-USER-EMAIL": that.props.emailId,
        "x-api-url": that.state.type  == "forward" ? "/pincode-service/internal/download-forward-serviceability-sample" : "/pincode-service/internal/download-reverse-serviceability-sample",
        "x-api-method": "post"
      }
    }).then(res => {
      var blob = new Blob([res.data], {
        type: "text/csv;charset=utf-8;"
      });
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, that.state.type == "forward" ? "forward_pincode.csv" : "reverse_pincode.csv");
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", that.state.type == "forward" ? "forward_pincode.csv" : "reverse_pincode.csv");
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }).catch((res) => {
    });
  }


  handle_upload_csv_new(event) {
    console.log(this.props);
    var self = this;
    var file = event.target.files[0].name.split(".");
    var name = file[file.length - 1].toLowerCase();
    if (name == "csv") {
      var formdata = new FormData();
      formdata.append("file", event.target.files[0]);
      formdata.append("userId", this.props.email);
      this.props.dispatch(batchValidateServicablePinCode(formdata,self.state.type == "forward" ? "/pincode-service/internal/upload-forward-serviceability?userEmailId=" + self.props.emailId : "/pincode-service/internal/upload-reverse-serviceability?userEmailId=" + self.props.emailId)).then(res => {
        if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
        if (!self.props.batch_error) {
          if(self.props.batch_success.data.errorMessage){
            alert(self.props.batch_success.data.data.errorMessage);
          }
          else{
            console.log("props0",self.props.batch_success.data.data)
            alert(self.props.batch_success.data.data.data.Success);
          }
        } else {
          if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
          else{
            alert(self.props.batch_error.error.response.data.errorMessage);
          }
        }
        window.location.reload();
      });
    } else {
      if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
      alert("Please upload the file in .csv file format only.");
    }
  }


  handleSubmit = () => {
    const that = this;
    const { csvFile } = this.state;
    if(csvFile.name){
      var file = csvFile.name.split(".");
      var name = file[file.length - 1].toLowerCase();
      if (name === "csv") {
        var formdata = new FormData();
        formdata.append("file", csvFile);
        return axios.post("/upload-pincode",
          formdata,{
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-client": "OPS",
            "x-user-id": that.props.userId,
            "X-USER-EMAIL": that.props.emailId,
            "x-api-url": that.state.type  == "forward" ? "/pincode-service/internal/upload-forward-service-pincode"  : "/pincode-service/internal/upload-reverse-service-pincode",
            "x-api-method": "post"
          }
        }).then(res => {
            if(res && res.status < 350 && res.data && res.data.status && res.data.data && res.data.data.Success ){
              alert((res.data.data.faild && res.data.data.faild.length > 0 && res.data.data.faild.join(",")) || res.data.data.Success);
            }else{
             alert(res.data.data.faild.join(",") || res.data.errorMessage)
            }
          window.location.reload();
        }).catch((res) => {
          alert("Something went wrong. Please try again later.")
          window.location.reload();
        });
      }
    }
  };

  handleFileUpload = e => {
    this.setState({ csvFile: e.target.files[0], message: "" });
  };

  render() {
    console.log("props", this.props)
    const { classes } = this.props;
    const { message, status, csvFile } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid container className={classes.wrapper} lg={12}>
        <Typography variant="h5" gutterBottom component="h5">
         Upload Serviceable Pincode
        </Typography>
        </Grid>
        
        {status ? (
          <LinearProgress />
        ) : (
          <Paper className={classes.paper}>
            <Grid
              container
              spacing={12}
              alignItems="center"
              justify="space-between"
            >
            <Grid item xs={12} sm={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">Select Type*</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={this.state.type}
                onChange={(e) => { this.setState({ type : e.target.value})}}
                label="Select Type"
                fullWidth
                required={true}
              >
                <MenuItem value="forward">Forward Pickup LSP </MenuItem>
                <MenuItem value="reverse">Reverse Pickup LSP </MenuItem>
              </Select>
            </FormControl>
            </Grid>
           

              {/* <Grid item xs={12} sm={6} md={3}>
                <Fab
                  disabled={!csvFile.name}
                  color="primary"
                  onClick={this.handle_upload_csv}
                  className={classes.fab}
                  variant="extended"
                >
                  Submit
                </Fab>
              </Grid> */}
            </Grid>
            <Grid container className={classes.wrapper}>
            {this.state.type != "" &&
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  type="file"
                  label="CSV file"
                  name="csv_file"
                  variant="outlined"
                  onChange={this.handle_upload_csv_new.bind(this)}
                  margin="none"
                  InputLabelProps={{
                    shrink: true
                  }}
                  helperText={
                    <a
                      href="#"
                      onClick={() =>{ this.downloadCsv()}}
                    >
                      Download Sample File
                    </a>
                  }
                />
              </Grid>
            }
            </Grid>
          </Paper>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
   userId: state.signin.data.body.data.user.id,
   batch_success : state.product.batch_success,
   batch_error : state.product.batch_error,
   emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(
  connect(mapStateToProps)(PincodeUpload)
);