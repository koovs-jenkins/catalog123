import React from "react";

import Add from "@material-ui/icons/Add";
import { connect } from "react-redux";
import Notify from "../../../components/Notify";
import {
  Grid,
  LinearProgress,
  Typography,
  withStyles,
  Paper,
} from "@material-ui/core";
import { downloadCsv } from "../../../../utils/csv";
import { overrideInventoryCsvHeader } from "../../../../metadata";
import { postOverrideInventoryApi } from "../../../api/pricing";
import { hasProp } from "../../../helpers";
import Papa from "papaparse";

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  table: {
    minWidth: 500,
    marginTop: theme.spacing.unit * 2
  },
  tableWrapper: {
    ...theme.tableWrapper
  },
  anchor: {
    marginTop: theme.spacing.unit * 2,
    fontWeight: "bold"
  },
  button: {
    border: 0,
    background: "none",
    cursor: "pointer",
    display: "block"
  },
  green: {
    color: "green"
  }
});

class OverrideInventory extends React.Component {
  state = {
    status: false,
    message: "",
    response: [],
    success: [],
    error: []
  };

  handle_upload_csv = event => {
    const eventFile = event.target.files[0];
    const that = this;
    this.setState(
      { status: false, message: "", response: [], success: [], error: [] },
      () => {
        var file = eventFile.name.split(".");
        var name = file[file.length - 1].toLowerCase();
        if (name === "csv") {
          Papa.parse(eventFile, {
            header: true,
            complete: function(results) {
              if (results.data.length <= 500) {
                if (
                  results.meta.fields.join(",") !=
                  overrideInventoryCsvHeader.join(",")
                ) {
                  that.setState({
                    message: `Found error in header expecting ${overrideInventoryCsvHeader.join(
                      ","
                    )}`
                  });
                } else {
                  const uuidv1 = require("uuid/v1");
                  results.data.map((v, k) => {
                    const payload = {
                      ...v,
                      idempotenceKey: uuidv1(),
                      initiatedBy: that.props.userId
                    };
                    if (
                      hasProp(v, "inventoryValue") &&
                      hasProp(v, "lotId") &&
                      hasProp(v, "referenceId") &&
                      hasProp(v, "skuId") &&
                      hasProp(v, "vendorId") &&
                      hasProp(v, "warehouseId")
                    ) {
                      postOverrideInventoryApi(that.props.userId, payload).then(
                        res => {
                          if (res.data.errorExists || res.data.error) {
                            const response = [...that.state.response];
                            response.push(
                              res.data.error
                                ? `Row: ${k +
                                    2} => Updation failed due to incorrect data`
                                : `Row: ${k + 2} => ${res.data.reason}`
                            );
                            that.setState({
                              response: response
                            });
                          } else {
                            const success = [...that.state.success];
                            success.push(
                              `Row: ${k + 2} SkuId: ${v.skuId} => Success`
                            );
                            that.setState({
                              success: success
                            });
                          }
                        }
                      );
                    } else {
                      const error = [...that.state.error];
                      if (
                        Object.values(v).length ==
                        Object.values(results.meta.fields).length
                      ) {
                        if (
                          !v.inventoryValue ||
                          !v.skuId ||
                          !v.lotId ||
                          !v.referenceId ||
                          !v.vendorId ||
                          !v.warehouseId
                        ) {
                          error.push(`Row: ${k + 2} => Found empty column`);
                          that.setState({
                            error: error
                          });
                        }
                      } else if (
                        Object.values(v).length <
                          Object.values(results.meta.fields).length &&
                        k == 0 &&
                        results.data.length == 1
                      ) {
                        error.push(`Row: ${k + 2} => No record found.`);
                        that.setState({
                          error: error
                        });
                      } else {
                        if (
                          !v.inventoryValue ||
                          !v.skuId ||
                          !v.lotId ||
                          !v.referenceId ||
                          !v.vendorId ||
                          !v.warehouseId
                        ) {
                          if (k != results.data.length - 1) {
                            error.push(`Row: ${k + 2} => Found empty column`);
                          } else {
                            error.push(`Row: ${k + 2} => Found empty row`);
                          }
                          that.setState({
                            error: error
                          });
                        }
                      }
                    }
                  });
                }
              } else {
                that.setState({
                  message: "Csv can not have more than 500 rows."
                });
              }
            }
          });
        } else {
          that.setState({
            message: "Please upload the file in .csv file format only.",
            status: false
          });
        }
      }
    );
    event.target.value = null;
  };

  render() {
    const { status, message, response, success, error } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        {status ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={4} style={{height:"80vh"}} alignItems="center" justify="center">
            <Grid item lg={3}>
              <Paper className={classes.paper}>
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom component="h5">
                      Override Inventory
                    </Typography>
                </Grid>
                <Grid item xs={12}>
             
             <input
               allowed=".xlsx, .xls"
               type="file"
               id="upload_csv"
               onChange={this.handle_upload_csv}
               hidden
             />
             <label
               htmlFor="upload_csv"
               className="table_onbutton upload_csv"
               variant="contained"
               color="primary"
             >
               {" "}
               <Add
                 style={{ verticalAlign: "middle" }}
                 className="table_icons"
               />{" "}
               Upload CSV{" "}
             </label>
             <button
               className={classes.button}
               onClick={() =>
                 downloadCsv({
                   filename: "OverrideInventory.csv",
                   data: [],
                   header: overrideInventoryCsvHeader
                 })
               }
             >
               <Typography className={classes.anchor}>
                 Download Sample File
               </Typography>
             </button>
           </Grid>
           {response.length > 0 && (
             <Grid item md={12}>
               <Typography variant="h6" gutterBottom color="error">
                 Failed
               </Typography>
               {response.map((v, k) => (
                 <Typography key={k} color="error">
                   {v}
                 </Typography>
               ))}
             </Grid>
           )}
           {error.length > 0 && (
             <Grid item md={12}>
               <Typography variant="h6" gutterBottom color="error">
                 Validation Errors
               </Typography>
               {error.map((v, k) => (
                 <Typography key={k} color="error">
                   {v}
                 </Typography>
               ))}
             </Grid>
           )}
           {success.length > 0 && (
             <Grid item md={12}>
               <Typography variant="h6" gutterBottom className={classes.green}>
                 Success
               </Typography>
               {success.map((v, k) => (
                 <Typography key={k} className={classes.green}>
                   {v}
                 </Typography>
               ))}
             </Grid>
           )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  csv: state.tagging.csv
});

export default withStyles(styles)(connect(mapStateToProps)(OverrideInventory));
