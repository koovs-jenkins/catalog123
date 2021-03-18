import React from "react";

import {
  Paper,
  Grid,
  TextField,
  Typography,
  Fab,
  withStyles,
  Button,
} from "@material-ui/core";
import { connect } from "react-redux";
import Papa from "papaparse";
import { postSkuDetail } from "../../../api/pricing";
import Notify from "../../../components/Notify";
import { flattenArray } from "../../../helpers";
import { downloadCsv } from "../../../../utils/csv";

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
  select: {
    width: "100%",
    height: "56px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "white"
  },
  link: {
    textDecoration: "none",
    margin: "auto"
  },
  red: {
    color: "red"
  }
});

class UploadDiscount extends React.Component {
  initialState = {
    status: false,
    csvFile: {},
    inventoryMap: [],
    message: "",
    skuIds: ""
  };
  state = {
    ...this.initialState,
    showCsv: false
  };

  handleFileUpload = e => {
    this.setState({ ...this.initialState, csvFile: e.target.files[0] });
  };

  handleChange = e => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
      status: true
    });
  };

  handleRequest = (userId, data) => {
    const that = this;
    postSkuDetail(userId, data).then(res => {
      if (res.data.statusCode != 200) {
        that.setState({
          message: "Error Occured " + res.data.data.message,
          status: false
        });
      } else {
        that.setState({
          inventoryMap: flattenArray(res.data.inventoryMap, "skuId"),
          message: "Successfully Uploaded",
          csvFile: {},
          status: false
        });
      }
    });
  };

  handleSubmitByCsv = () => {
    const that = this;
    this.setState({ status: true, message: "" }, () => {
      if (that.state.csvFile.name) {
        Papa.parse(that.state.csvFile, {
          header: true,
          complete: function(results) {
            if (results.meta.fields[0] === "skus") {
              const data = {
                skus: results.data
                  .map(v => v.skus.trim() != "" && v.skus)
                  .filter(v => v != false)
              };
              that.handleRequest(that.props.userId, data);
            } else {
              that.setState({
                message: `Error in header found ${results.meta.fields.toString()} expecting skus`,
                csvFile: {},
                skuIds: ""
              });
            }
          }
        });
      } else {
        that.setState({
          message: `Please upload a file first.`,
          csvFile: {},
          skuIds: ""
        });
      }
    });
  };

  handleSubmitByText = () => {
    const that = this;
    this.setState({ status: true, message: "" }, () => {
      if (that.state.skuIds) {
        const data = {
          skus: that.state.skuIds.split(",")
        };
        this.handleRequest(that.props.userId, data);
      } else {
        this.setState({ message: "Enter comma seprated sku ids first" });
      }
    });
  };

  handleToggleCsv = () => {
    this.setState({ showCsv: !this.state.showCsv });
  };

  handleSkuIdChange = (e) => {
    if (
      e.target.value &&
      e.target.value.length > 0 &&
      e.target.value.trim() == ""
    ) {
      this.setState({ message: "Nothing found to search" });
    } else {
      this.setState({ skuIds: e.target.value });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      inventoryMap,
      message,
      status,
      csvFile,
      skuIds,
      showCsv
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid container className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Get Sku Detail
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid
            container
            spacing={12}
            alignItems="left"
            justify="flex-start"
          >
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                fullWidth
                label="Sku Ids"
                name="skuIds"
                variant="outlined"
                onChange={this.handleSkuIdChange}
                value={skuIds}
                helperText={
                  <a href="#" onClick={this.handleToggleCsv}>
                    Click here to upload file
                  </a>
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Button
                color="primary"
                onClick={this.handleSubmitByText}
                className={classes.fab}
                variant="contained"
                disabled={showCsv}
              >
                Submit Text
              </Button>
            </Grid>
            {showCsv && (
              <React.Fragment>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    type="file"
                    label="CSV file"
                    name="csv_file"
                    variant="outlined"
                    onChange={this.handleFileUpload}
                    margin="none"
                    InputLabelProps={{
                      shrink: true
                    }}
                    helperText={
                      <a
                        href="#"
                        onClick={() =>
                          downloadCsv({
                            filename: "skus.csv",
                            header: ["skus"]
                          })
                        }
                      >
                        Download Sample File
                      </a>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <Button
                    color="primary"
                    onClick={this.handleSubmitByCsv}
                    className={classes.fab}
                    variant="contained"
                  >
                    Submit File
                  </Button>
                </Grid>
              </React.Fragment>
            )}
            {inventoryMap.length > 0 && (
              <Grid item xs={12}>
                <Button
                  color="primary"
                  className={classes.fab}
                  variant="contained"
                  onClick={() =>
                    downloadCsv({
                      filename: "inventory.csv",
                      data: inventoryMap,
                      header: [
                        "skuId",
                        "bookableInventory",
                        "lot",
                        "warehouse",
                        "vendor"
                      ]
                    })
                  }
                >
                  Export File
                </Button>
              </Grid>
            )}
          </Grid>
          <Typography className={classes.red}>
            <b>Note:</b>
            <span>
              {" "}
              In case of No inventory Blank data is displayed in CSV file.
            </span>
          </Typography>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id
});

export default withStyles(styles)(connect(mapStateToProps)(UploadDiscount));
