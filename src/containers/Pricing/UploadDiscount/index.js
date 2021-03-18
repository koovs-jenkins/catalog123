import React from "react";
import {
  Paper,
  Grid,
  TextField,
  Typography,
  Fab,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  withStyles,
  CircularProgress
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  UploadTypeOptions,
  csvLabelMeta,
  priceUploadUrl
} from "../../../../metadata";
import Papa from "papaparse";
import { arraysIdentical, validateCsvData } from "../../../helpers";
import { postBulkPriceApi, postRevertBatchApi } from "../../../api/pricing";
import Notify from "../../../components/Notify";
import { downloadCsv } from "../../../../utils/csv";
const uuidv1 = require("uuid/v1");
import { postBulkPricingCsvApi } from "../../../api/pricing";

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  fab: {
    margin: theme.spacing.unit
  },
  control:{
    padding:"10px"
  },
  select: {
    width: "100%",
    height: "56px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "white"
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  response: {
    wordWrap: "break-word"
  },
  red: {
    color: "red"
  }
});

class UploadDiscount extends React.Component {
  state = {
    type: "",
    csvFile: {},
    loading: false,
    batchId: "",
    message: "",
    failedData: [],
    savedData: [],
    updatedData: []
  };

  handleFileUpload = e => {
    if (e.target.files[0].name.indexOf(".csv") > -1) {
      this.setState({ csvFile: e.target.files[0] });
    } else {
      alert("Please upload csv file");
      e.target.value = null;
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      loading: false
    });
  };

  handle_upload_csv = e => {
    e.preventDefault();
    const that = this;
    let error = true;
    if (that.state.type == "schedulerRevert" && that.state.batchId != "") {
      error = false;
    } else if (that.state.type != "" && that.state.type != "schedulerRevert") {
      error = false;
    } else {
      error = true;
      alert("All the fields are required. Please fill all the details.");
    }

    if (error == false) {
      this.setState({ loading: true, message: "" }, () => {
        const { csvFile, batchId } = this.state;
        if ((csvFile && csvFile.name) || batchId) {
          that.handleSubmit();
        } else {
          that.setState({
            message: "Please upload valid file",
            loading: false
          });
        }
      });
    }
  };

  handleSubmit = () => {
    const that = this;
    const { csvFile, type, batchId } = this.state;
    let url = `${priceUploadUrl[that.state.type].url}?createdBy=${that.props.userId}&email=${that.props.emailId}`
    if (type == "schedulerRevert" && batchId && !csvFile.name) {
      const data = {
        idempotenceKey: uuidv1(),
        createdBy: that.props.userId,
        batchId: batchId
      };
      this.setState({ loading: true, message: "" }, () =>
        postRevertBatchApi(that.props.userId, data).then(res =>
          res && res.status < 350 && res.data && !res.data.errorExists
            ? that.setState({
                loading: false,
                message: res.data.response
              })
            : that.setState({
                loading: false,
                message: res.data.message || "Something went wrong"
              })
        )
      );
    } else if (csvFile && csvFile.name) {
      if(type == "schedulerRevert"){
        url = `/pricing/upload-revert-sku/${that.state.batchId}?createdBy=${that.props.userId}&email=${that.props.emailId}`;
      }
      const file = csvFile.name.split(".");
      const name = file[file.length - 1].toLowerCase();
      let formdata = new FormData();
      name === "csv" && formdata.append("file", csvFile);
      this.setState({ loading: true, message: "" }, () =>
        postBulkPricingCsvApi(
          formdata,
          that.props.userId,
          that.props.emailId,
          url
        ).then(res => {
          if (res && res.status < 350) {
            that.setState({
              loading: false,
              message: "Successfully Uploaded. Kindly check email"
            });
          } else {
            that.setState({
              loading: false,
              message: res.data.message || "Error in Uploading file"
            });
          }
          document.getElementById("csv_file").value = "";
        })
      );
    } else {
      this.setState({ message: "Please select a file to upload" });
    }
  };

  handleRevert = () => {
    if (!this.state.batchId) {
      alert("Please enter batch id.");
    } else {
      const that = this;
      this.setState({ loading: true, message: "" }, () => {
        const data = {
          idempotenceKey: uuidv1(),
          createdBy: that.props.userId,
          batchId: that.state.batchId,
          skuId: that.state.skuId ? that.state.skuId.split(",") : null
        };
        postBulkPriceApi(
          that.props.userId,
          priceUploadUrl[that.state.type].url,
          data
        ).then(res => {
          that.setState({
            message:
              res.statusCode != 200
                ? "Error Occured " + res.data.message
                : res.response,
            loading: false
          });
        });
      });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      type,
      savedData,
      updatedData,
      failedData,
      loading,
      message
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid lg={12} container className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Upload CSV File
          </Typography>
        </Grid>
       
        <Paper className={classes.paper}>
          <Grid container spacing={24} justify="space-between">
            <Grid item xs={12} sm={6} md={6} className={classes.control}>
              <FormControl fullWidth variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Upload Type</InputLabel>
                  <Select
                    name="type"
                    label="Upload Type"
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    onChange={this.handleChange}
                    value={type}
                  >
                    {UploadTypeOptions.map((v, k) => (
                      <MenuItem key={k} value={v.value}>
                        {v.label}
                      </MenuItem>
                    ))}
                  </Select>
              </FormControl>
            </Grid>
            {type == "schedulerRevert" && (
              <React.Fragment>
                <Grid item xs={12} sm={6} md={6} className={classes.control}>
                  <TextField
                    fullWidth
                    label="Batch Id"
                    name="batchId"
                    id="batchId"
                    variant="outlined"
                    onChange={e => this.setState({ batchId: e.target.value })}
                  />
                </Grid>
              </React.Fragment>
            )}
            <React.Fragment>
              <Grid item xs={12} sm={6} md={6} className={classes.control}>
                <TextField
                  type="file"
                  name="csv_file"
                  id="csv_file"
                  variant="outlined"
                  fullWidth
                  onChange={this.handleFileUpload}
                  helperText={
                    csvLabelMeta[type] !== undefined && (
                      <a
                        href="#"
                        onClick={() =>
                          downloadCsv({
                            filename: type + ".csv",
                            header: csvLabelMeta[type].split(",")
                          })
                        }
                      >
                        Download Sample File
                      </a>
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    disabled={!type}
                    color="primary"
                    onClick={this.handle_upload_csv}
                    className={classes.fab}
                    variant="contained"
                  >
                    Submit
                  </Button>
                )}
              </Grid>
            </React.Fragment>
          </Grid>
          {type == "scheduler" && (
            <Typography className={classes.red}>
              <b>Note:</b>
              <span> Please upload (dd-mm-yyyy hh:mm) date format.</span>
            </Typography>
          )}
          {(savedData.length > 0 ||
            failedData.length > 0 ||
            updatedData.length > 0) && (
            <Grid container>
              {savedData && (
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">Saved Data :</Typography>
                  {savedData.map((v, k) => (
                    <Typography key={k} className={classes.response}>
                      {v}
                    </Typography>
                  ))}
                </Grid>
              )}
              {failedData && (
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">Failed Data :</Typography>
                  {failedData.map((v, k) => (
                    <Typography key={k} className={classes.response}>
                      {v}
                    </Typography>
                  ))}
                </Grid>
              )}
              {updatedData && (
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">Updated Data :</Typography>
                  {updatedData.map((v, k) => (
                    <Typography key={k} className={classes.response}>
                      {v}
                    </Typography>
                  ))}
                </Grid>
              )}
            </Grid>
          )}
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(UploadDiscount));
