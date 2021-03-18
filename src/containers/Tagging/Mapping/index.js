import React from "react";

import Add from "@material-ui/icons/Add";
import { connect } from "react-redux";
import { postCsvData, fetchFileStatus, postSkuCsvData } from "../../../store/actions/tagging";
import Notify from "../../../components/Notify";
import {
  Grid,
  Paper,
  LinearProgress,
  IconButton,
  Typography,
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@material-ui/core";
import Refresh from "@material-ui/icons/Refresh";
import CustomTableCell from "../../../components/CustomTableCell";
import { downloadCsv } from "../../../../utils/csv";
import { tagMappingCsvHeader,skuTagMappingCsvHeader, tagRemoveCsvHeader } from "../../../../metadata";

const styles = theme => ({
  table: {
    minWidth: 500,
    marginTop: theme.spacing.unit * 2
  },
  tableWrapper: {
    ...theme.tableWrapper
  },
  control:{
    padding:"10px"
  },
  anchor: {
    // marginTop: theme.spacing.unit * 2,
    fontWeight: "bold"
  }
});

class Mapping extends React.Component {
  state = {
    status: false,
    message: "",
    response: {},
    isRemove: this.props.match.path.indexOf("remove") > -1
  };

  handle_upload_csv = (event,type) => {
    console.log("type", type)
    const { userId } = this.props;
    const eventFile = event.target.files[0];
    const that = this;
    this.setState({ status: true, message: "" }, () => {
      var file = eventFile.name.split(".");
      var name = file[file.length - 1].toLowerCase();
      if (name === "csv") {
        var formdata = new FormData();
        formdata.append("file", eventFile);
          if(type == "skuCsv"){
            that.props.dispatch(
              postSkuCsvData(userId, formdata, this.state.isRemove))
            .then(() => {
              that.setState({
                status: false,
                message: that.props.csv.data.errorExists
                  ? that.props.csv.data.reason
                  : "Csv uploaded successfully. Kindly follow up with below details",
                response: that.props.csv.data.response
              });
            });
          }
          else{
            that.props.dispatch(
              postCsvData(userId, formdata, this.state.isRemove))
            .then(() => {
              that.setState({
                status: false,
                message: that.props.csv.data.errorExists
                  ? that.props.csv.data.reason
                  : "Csv uploaded successfully. Kindly follow up with below details",
                response: that.props.csv.data.response
              });
            });
          }
          


      } else {
        that.setState({
          message: "Please upload the file in .csv file format only.",
          status: false
        });
      }
    });
  };

  handleReload = fileId => {
    this.props
      .dispatch(fetchFileStatus(fileId))
      .then(() => this.setState({ response: this.props.csv.data.response }));
  };

  render() {
    const { status, message, response } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        {status ? (
          <LinearProgress />
        ) : (
          <Grid container lg={12}  justify="center" alignItems="center" align="center" style={{height:"80vh"}}>
            <Grid lg={3} containe justify="center">
              <Paper style={{padding:"15px"}}>
              <Grid  item xs={12} className={classes.control}>
              <input
                allowed=".xlsx, .xls"
                type="file"
                id="upload_csv"
                onChange={(event)=>this.handle_upload_csv(event,"csv")}
                hidden
              />
              <label
                htmlFor="upload_csv"
                className="table_onbutton upload_csv"
                variant="contained"
                color="primary"
              >
                {" "}
               {" "}
                Upload CSV{" "}
              </label>
            </Grid>
            <Grid item xs={12} className={classes.control}>
              <a
                href="#"
                onClick={() =>
                  downloadCsv({
                    filename: "mapping.csv",
                    data: [],
                    header: this.state.isRemove ? tagRemoveCsvHeader.split(",") :  tagMappingCsvHeader.split(",")
                  })
                }
              >
                <Typography className={classes.anchor}>
                  Download Sample File
                </Typography>
              </a>
            </Grid>
            <Grid item xs={12} className={classes.control}>
              <input
                allowed=".xlsx, .xls"
                type="file"
                id="upload_sku_map_csv"
                onChange={(event)=>this.handle_upload_csv(event,"skuCsv")}
                hidden
              />
              <label
                htmlFor="upload_sku_map_csv"
                className="table_onbutton upload_csv"
                variant="contained"
                color="primary"
              >
                {" "}
               {" "}
                SKU Tag Mapping CSV{" "}
              </label>
              
            </Grid>
            <Grid item xs={12} className={classes.control}> 
            <a
                href="#"
                onClick={() =>
                  downloadCsv({
                    filename: "skuTagMapping.csv",
                    data: [],
                    header:skuTagMappingCsvHeader.split(",")
                  })
                }
              >
                <Typography className={classes.anchor}>
                  Download Sample File
                </Typography>
              </a>
            </Grid>
              </Paper>
           
            </Grid>
          
          </Grid>
        )}
        {response && response.fileName && (
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell padding="checkbox">Name</CustomTableCell>
                <CustomTableCell padding="dense">Status</CustomTableCell>
                {response.s3ErrorFileUrl && (
                  <CustomTableCell padding="dense">Error File</CustomTableCell>
                )}
                <CustomTableCell padding="dense">Action</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell padding="checkbox" component="th" scope="row">
                  {response.fileName}
                </TableCell>
                <TableCell padding="dense" component="th" scope="row">
                  {response.fileStatus}
                </TableCell>
                {response.s3ErrorFileUrl && (
                  <TableCell padding="dense" component="th" scope="row">
                    <a href={response.s3ErrorFileUrl}>Download Error File</a>
                  </TableCell>
                )}
                <TableCell padding="dense" component="th" scope="row">
                  <IconButton
                    onClick={() => this.handleReload(response.fileId)}
                  >
                    <Refresh />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.email,
  csv: state.tagging.csv
});

export default withStyles(styles)(connect(mapStateToProps)(Mapping));
