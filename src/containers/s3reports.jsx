import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import { getCookie } from "../helpers/localstorage";
import Icon from '@material-ui/core/Icon';
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
var dateFormat = require('dateformat');
const styles = theme => ({
  wrapper: {
    marginTop: "10px"
  },
  paper: {
    marginTop: "10px",
    padding: theme.spacing.unit * 2,
    // margin: "auto",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  },
  control: { padding: "10px" }
});
class s3Reports extends React.Component {
  state = {
    loading: false,
    status: null,
    selected_folder: "/",
    row_data: [],
    folders: [],
    CommonPrefixes: [],
  };

  componentDidMount = () => {
    this.getobjects();
  };

  UNSAFE_componentWillReceiveProps(prevProps) {
    if (this.props.location != prevProps.location) {
      this.setState({ selected_folder: prevProps.location.hash ? prevProps.location.hash.replace("#", "") : "/" }, () => {
        this.getobjects();
      })
    }
  }

  htmlEscape(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;')
      .replace(/`/g, '&#x60;')
      .replace(/=/g, '&#x3D;');
  }

  isthisdocument(bucket, key) {
    return key === "index.html";
  }

  isfolder(path) {
    return (path.endsWith('/') && path.split("/").length == 2);
  }


  isSubFolder(path) {
    return (path.endsWith('/') && path.split("/").length > 2);
  }

  isfile(path) {
    return !path.includes('/') || !path.endsWith("/");
  }

  // Convert cars/vw/golf.png to golf.png
  fullpath2filename(path) {
    return this.htmlEscape(path.replace(/^.*[\\\/]/, ''));
  }

  bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    var ii = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, ii), 2) + ' ' + sizes[ii];
  }

  handleFolder(key) {
    // this.setState({ selected_folder : key },()=>{
    //   // this.getobjects();
    // })
  }

  getobjects() {
    const self = this;
    const { startdate, enddate, report_type } = this.state;
    var headers = {
      headers: {
        "x-api-client": "OPS",
        "X-AUTH-TOKEN": getCookie("_koovs_token"),
        "x-s3-prefix": this.state.selected_folder,
      }
    }

    this.setState({ loading: true })
    axios.get("/get-reports-data", headers).then((res) => {
      var folders = [];
      if (res.data.Contents) {
        res.data.Contents.map(function (i) {
          if (i.Key.endsWith("/")) {
            folders.push(i.Key);
          }
        })
      }
      self.setState({ loading: false, row_data: (res.data.Contents ? res.data.Contents : []), folders: folders, CommonPrefixes: (res.data.CommonPrefixes ? res.data.CommonPrefixes : []) })

    }).catch((error) => {
      console.log(error)
      self.setState({ loading: false })
    })
  }


  getObject(key){
    const self = this;
    const { startdate, enddate , report_type} = this.state;
    var headers = {
      headers: {
        "x-api-client": "OPS",
        "X-AUTH-TOKEN": getCookie("_koovs_token"),
        "x-s3-path": key,
      }
    }
    this.setState({ loading  : true})
    axios.get("/get-reports-object", headers).then((res)=>{
      self.setState({ loading : false })
      if(res.data){
        var blob = new Blob([res.data], {
          type: "text/csv;charset=utf-8;"
        });
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob,key.split("/")[key.split("/").length - 1]);
        }
        else {
          var link = document.createElement("a");
          if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", key.split("/")[key.split("/").length - 1]);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      }
      else{
        alert("Error while downloading the file.")
      }
   }).catch((error)=>{
     console.log(error)
     self.setState({ loading : false })
   })
  }


  render() {
    const { classes, match } = this.props;
    return (
      <React.Fragment>
        {this.state.loading &&
          <LinearProgress />
        }
        {(this.state.loading && this.state.status) &&
          <Paper className={classes.paper} style={{ marginTop: 20 }}>
            <Typography variant="h6" gutterBottom component="h6" style={{ textAlign: "center" }}>
              {this.state.status}
            </Typography>
          </Paper>
        }
        {!this.state.loading && (
          <React.Fragment>
            <Grid container lg={12} justify="space-between" className={classes.wrapper}>
              <Typography variant="h5" gutterBottom component="h5">
                Download Daily Scheduled Reports
              </Typography>
              <div className="table_button"><Button className="table_onbutton"  onClick={(e) =>{ this.props.history.goBack()}} variant="contained" color="primary"> Go Back </Button></div>
            </Grid>
            <Paper className={classes.paper}>
              <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Last Modified</TableCell>
                        <TableCell>Size</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <React.Fragment>
                      {this.state.CommonPrefixes.map(function (i, index) {
                        return (
                          <TableRow key={index}>
                            {(this.isfolder(i.Prefix) && i.Prefix != this.state.selected_folder) &&
                              <React.Fragment>
                                <TableCell style={{ textAlign: "left" }}><a style={{ textDecoration: "none" }} href={"#" + (i.Prefix)} onClick={this.handleFolder.bind(this, i.Prefix)}><Icon color="primary" style={{ verticalAlign: "middle" }}>folder</Icon> {(i.Prefix).replace("/", "")}</a></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                              </React.Fragment>
                            }
                            {this.isSubFolder(i.Prefix) &&
                              <React.Fragment>
                                <TableCell style={{ textAlign: "left" }}><a style={{ textDecoration: "none" }} href={"#" + (i.Prefix)} onClick={this.handleFolder.bind(this, i.Prefix)}><Icon color="primary" style={{ verticalAlign: "middle" }}>folder</Icon> {(i.Prefix).replace(this.state.selected_folder, "").replace("/" , "")}</a></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                              </React.Fragment>
                            }
                          </TableRow>
                        )
                      }, this)
                      }
                      {this.state.row_data.map(function (i, index) {
                        return (
                          <TableRow key={index}>
                            {this.isfile(i.Key) &&
                              <React.Fragment>
                                <TableCell style={{ textAlign: "left" }}><a style={{ textDecoration: "none", cursor: "pointer" }} onClick={this.getObject.bind(this, i.Key)}><Icon color="primary" style={{ verticalAlign: "middle" }}>text_snippet</Icon> {(i.Key).replace(this.state.selected_folder, "")}</a></TableCell>
                                <TableCell>{dateFormat(i.LastModified, "dd/mm/yyyy hh:mm")}</TableCell>
                                <TableCell>{this.bytesToSize(i.Size)}</TableCell>
                              </React.Fragment>
                            }
                            {(this.isfolder(i.Key) && i.Key != this.state.selected_folder) &&
                              <React.Fragment>
                                <TableCell style={{ textAlign: "left" }}><a style={{ textDecoration: "none" }} href={"#" + (i.Key)} onClick={this.handleFolder.bind(this, i.Key)}><Icon color="primary" style={{ verticalAlign: "middle" }}>folder</Icon> {(i.Key).replace("/", "")}</a></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                              </React.Fragment>
                            }
                          </TableRow>
                        )
                      }, this)
                      }
                    </React.Fragment>
                    {(this.state.row_data.length == 0 && this.state.CommonPrefixes.length == 0) &&
                      <tr className="no_data_found">
                        <td colSpan="3" style={{ padding: "10px" }}>No data avaliable.</td>
                      </tr>
                    }
                  </TableBody>
                </Table>
            </Paper>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(s3Reports));