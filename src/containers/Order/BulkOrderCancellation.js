import React from "react";

import {
  Paper,
  Grid,
  TextField,
  Typography,
  Fab,
  withStyles,
  Button,
  LinearProgress
} from "@material-ui/core";
import { postBulkCsvAction } from "../../store/actions/order";
import { connect } from "react-redux";
import Notify from "../../components/Notify";
import Papa from "papaparse";
import { validateCsvData, arraysIdentical } from "../../helpers";
import { bulkCsvHeader } from "../../../metadata";
import { downloadCsv } from "../../../utils/csv";

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 1,
    marginTop: "10px",
    maxWidth: "100%"
  },
  fab: {
    margin: theme.spacing.unit
  }
});

class BulkOrderCancellation extends React.Component {
  state = {
    status: false,
    csvFile: {},
    message: ""
  };

  handle_upload_csv = e => {
    e.preventDefault();
    const that = this;
    this.setState({ status: false, message: "" }, () => {
      const { csvFile } = this.state;
      if (csvFile) {
        Papa.parse(csvFile, {
          header: true,
          complete: function(results) {
            if (arraysIdentical(results.meta.fields, bulkCsvHeader.cancel)) {
              const validate = validateCsvData(
                results.data,
                results.meta.fields
              );
              if (validate.error) {
                that.setState({
                  message: "Found error in line " + validate.line,
                  csvFile: {},
                  status: false
                });
              } else {
                that.handleSubmit();
                that.setState({
                  status: false
                });
              }
            } else {
              that.setState({
                message:
                  "Found error in headers " + results.meta.fields.join(", "),
                csvFile: {},
                status: false
              });
            }
          }
        });
      } else {
        that.setState({
          message: "Please upload valid file",
          status: false
        });
      }
    });
  };

  handleSubmit = () => {
    const that = this;
    const { csvFile } = this.state;
    var file = csvFile.name.split(".");
    var name = file[file.length - 1].toLowerCase();
    if (name === "csv") {
      var formdata = new FormData();
      formdata.append("file", csvFile);
      that.props
        .dispatch(
          postBulkCsvAction(
            formdata,
            that.props.userId,
            that.props.emailId,
            "/jarvis-order-service/internal/v1/order/cancel/bulk"
          )
        )
        .then(() => {
          alert(that.props.csvStatus);
          window.location.reload();
        });
    }
  };

  handleFileUpload = e => {
    this.setState({ csvFile: e.target.files[0], message: "" });
  };

  render() {
    const { classes } = this.props;
    const { message, status, csvFile } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid container justify="center" className={classes.wrapper} alignItems="center" >
          <Grid lg={4} container justify="center" style={{height:"80vh"}} alignItems="center">
            {status ? (
          <LinearProgress />
        ) : (
            <Grid
              spacing={12}
            >
               <Typography variant="h5" component="h5">
               Bulk Cancellation
            </Typography>
              <Paper className={classes.paper}>
              <Grid item xs={12} sm={6} md={12}>
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
                              filename: "bulkorder_cancel.csv",
                              header: bulkCsvHeader.cancel
                            })
                          }
                        >
                          Download Sample File
                        </a>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Button
                      disabled={!csvFile.name}
                      color="primary"
                      onClick={this.handle_upload_csv}
                      className={classes.fab}
                      variant="contained"
                    >
                      Submit
                    </Button>
              </Grid>
              </Grid>
              </Paper>
            </Grid>
        )}
          </Grid>
        </Grid>
        
        
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  csvStatus: state.order.csvStatus,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(
  connect(mapStateToProps)(BulkOrderCancellation)
);
