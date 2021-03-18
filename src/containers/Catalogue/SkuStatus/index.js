import React from "react";
import Papa from "papaparse";
import { connect } from "react-redux";
import {
  Fab,
  Grid,
  Paper,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Card,
  CardContent,
  TextField,
  withStyles,
  Typography,
  CircularProgress
} from "@material-ui/core/";
import Notify from "../../../components/Notify";
import { downloadCsv } from "../../../../utils/csv";
import { skuStatusMeta } from "../../../../metadata";
import { postSkuChangeApi, postSkuChangeCsvApi } from "../../../api/catalogue";

const styles = theme => ({
  wrapper:{
    marginTop:"20px"
  },
  paper: { ...theme.paper, textAlign: 'left',marginTop:"20px",padding:"10px"},
  fab: { margin: theme.spacing.unit },
  btn:{padding:"10px"},
  select: {
    width: "100%",
    height: "56px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "white"
  },
});

class SkuStatus extends React.Component {
  initialState = {
    csvFile: {},
    skuId: "",
    status: 2,
    loading: false
  };
  state = {
    ...this.initialState,
    type: "",
    message: ""
  };

  handle_upload_csv = e => {
    this.setState({ csvFile: e.target.files[0] });
  };

  handleSubmit = () => {
    const that = this;
    const { csvFile } = this.state;
    const { userId, emailId } = this.props;
    if (csvFile.name) {
      var file = csvFile.name.split(".");
      var name = file[file.length - 1].toLowerCase();
      this.setState({ loading: true, message: "" }, () => {
        if (name === "csv" && csvFile.size) {
          Papa.parse(csvFile, {
            header: true,
            complete: function(results) {
              const status = results.data.filter(
                v => v.Status != 2 || v.Status != 3
              );
              if (results.meta.fields.toString() === "SkuId,Status") {
                if (status.length < 1 ) {
                  that.setState({
                    loading: false,
                    message:
                      "Found incorrect status value in file kindly correct and try again"
                  });
                } else {
                  var formdata = new FormData();
                  formdata.append("file", csvFile);
                  postSkuChangeCsvApi(userId, formdata, emailId).then(res =>
                    res && res.status < 350
                      ? that.setState({
                          ...this.initialState,
                          loading: false,
                          message: res.data.message,
                          csvFile: {}
                        })
                      : that.setState({
                          ...this.initialState,
                          loading: false,
                          message: res.data.message || "Error occured",
                          csvFile: {}
                        })
                  );
                }
              } else {
                that.setState({
                  loading: false,
                  message: "Found error in headers expecting SkuId,Status"
                });
              }
            }
          });
        } else {
          that.setState({
            message: "Please upload valid csv file",
            loading: false,
            csvFile: {}
          });
        }
        document.getElementById("csv_file").value = "";
      });
    }
  };

  handleFileUpload = e => {
    this.setState({ csvFile: e.target.files[0], message: "" });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSingleSku = () => {
    const that = this;
    const { skuId, status } = this.state;
    const { userId, emailId } = this.props;
    const form = { skuId, status, userId: emailId };
    this.setState({ loading: true, message: "" }, () =>
      skuId && skuId.trim() != ""
        ? postSkuChangeApi(form, userId).then(res =>
            res && res.status < 350
              ? that.setState({
                  ...this.initialState,
                  loading: false,
                  message: res.data.errorExists
                    ? res.data.text
                    : res.data.message
                })
              : that.setState({
                  ...this.initialState,
                  loading: false,
                  message: res.data.message || "Error occured"
                })
          )
        : that.setState({
            loading: false,
            message: "All field are mandatory"
          })
    );
  };

  render() {
    const { classes } = this.props;
    const { message, status, csvFile, type, loading, skuId } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
          <Grid xs={12} sm={6} spacing={12} className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
              Sku Status Change
            </Typography>
          </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                  {!type && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.setState({ type: "single" })}
                      fullWidth
                    >
                      Single
                    </Button>
                  )}
              </Grid>
              <Grid item xs={6} sm={3}>
                  {!type && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.setState({ type: "batch" })}
                      fullWidth
                    >
                      Batch
                    </Button>
                  )}
                </Grid>
            </Grid>
            <Grid
            container
            spacing={12}
            xs={12}
            className={classes.paper}
          >
            {type == "single" && (
              <React.Fragment>
                <Grid container spacing={3}>
                  <Grid item xs={8} >
                    <TextField
                        type="text"
                        label="Sku Id"
                        name="skuId"
                        id="outlined-basic"
                        value={skuId}
                        fullWidth
                        variant="outlined"
                        onChange={this.handleChange}
                      />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="demo-simple-select-outlined-label">Select Status</InputLabel>
                      <Select
                        label="Select Status"
                        name="status"
                        value={status}
                        onChange={this.handleChange}
                      >
                        {skuStatusMeta.map((v, k) => (
                          <MenuItem key={k} value={v.value}>
                            {v.label}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                </Grid>
                </Grid>
                <Grid container spacing={3} style={{"margin-top":"10px"}}>
                  <Grid item xs={6}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Button
                      style={{"margin-right":"10px"}}
                        color="primary"
                        variant="contained"
                        disabled={skuId == ""}
                        onClick={this.handleSingleSku}
                      >
                        Submit
                      </Button>
                    )}
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => this.setState({ type: "" })}
                    >
                      Back
                    </Button>
                  </Grid>
                </Grid>
               
              </React.Fragment>
            )}

            {type == "batch" && (
              <React.Fragment>
              <Grid container spacing={3} style={{padding:"10px"}}>
                  <Grid item xs={6}>
                    <Typography>
                      <b>
                        Note: Enter Status <i>2 for Active</i> and{" "}
                        <i>3 for Inactive</i> in csv.
                      </b>
                    </Typography>
                  </Grid>
              </Grid>
              <Grid container spacing={3} style={{padding:"10px"}}>
                <Grid item xs={6}>
                  <TextField
                    type="file"
                    id="csv_file"
                    label="CSV file"
                    name="csv_file"
                    variant="outlined"
                    color="primary"
                    onChange={this.handleFileUpload}
                    InputLabelProps={{
                      shrink: true
                    }}
                    helperText={
                      <a
                        href="#"
                        onClick={() =>
                          downloadCsv({
                            filename: "sku_status.csv",
                            header: ["SkuId", "Status"]
                          })
                        }
                      >
                        Download Sample File
                      </a>
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{padding:"10px"}}>
                <Grid item xs={6}>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      style={{"margin-right":"10px"}}
                      disabled={!csvFile.name}
                      color="primary"
                      onClick={this.handleSubmit}
                      variant="contained"
                    >
                      Submit
                    </Button>
                  )}
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => this.setState({ type: "" })}
                  >
                    Back
                  </Button>
                </Grid>
              </Grid>
              </React.Fragment>
            )}
          </Grid>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(SkuStatus));
