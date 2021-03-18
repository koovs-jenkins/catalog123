import React from "react";

import {
  Paper,
  Grid,
  TextField,
  Typography,
  Fab,
  withStyles,
  LinearProgress,
  Button
} from "@material-ui/core";
import { postBulkCsvAction } from "../../store/actions/order";
import { connect } from "react-redux";
import Notify from "../../components/Notify";
import Papa from "papaparse";
import { validateCsvData, arraysIdentical } from "../../helpers";
import { bulkCsvHeader } from "../../../metadata";
import { downloadCsv } from "../../../utils/csv";

const date_note = "date format should be (DD-MMM-YYYY)"
const styles = theme => ({
  paper: {
    ...theme.paper,padding:"10px"
  },
  control:{
    padding:"10px",
  },
  fab: {
    margin: theme.spacing.unit
  }
});

class DeliveryUpdate extends React.Component {
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
      const ext = csvFile ? csvFile.name.split(".").pop() : "";
      if (csvFile && csvFile.name && ext === "csv") {
        Papa.parse(csvFile, {
          header: true,
          complete: function(results) {
            if (arraysIdentical(results.meta.fields, bulkCsvHeader.delivery)) {
              const validate = validateCsvData(
                results.data,
                results.meta.fields
              );
              if (validate.error) {
                that.setState({
                  message: "Found error in line " + validate.line,
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
            "/jarvis-order-service/internal/v1/order/delivery/bulk",
            "patch"
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
        <Grid lg={12} container>
        {status ? (
          <LinearProgress />
        ) : (
            <Grid
              container
              spacing={12}
              style={{height:"80vh"}}
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={4} align="left">
                <Typography variant="h5" gutterBottom component="h5">
                 Bulk Delivery Update
                </Typography>
                <Paper className={classes.paper}>
                  <Grid item xs={12} sm={12}>
                <TextField
                  type="file"
                  label="CSV file"
                  name="csv_file"
                  variant="outlined"
                  onChange={this.handleFileUpload}
                  InputLabelProps={{
                    shrink: true
                  }}
                  helperText={
                    <a
                      href="#"
                      onClick={() =>
                        downloadCsv({
                          filename: "delivery_update.csv",
                          header: bulkCsvHeader.delivery
                        })
                      }
                    >
                      Download Sample File
                    </a>
                  }
                />
                <Typography color="error">
                  Note : {date_note}
                </Typography>
                
                </Grid>
                <Grid item xs={12} sm={12}>
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
                </Paper>
              </Grid>
            </Grid>
        )}
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

export default withStyles(styles)(connect(mapStateToProps)(DeliveryUpdate));
