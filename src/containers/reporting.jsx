import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import sanitizeHtml from 'sanitize-html'
import axios from 'axios';
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  TableHead,
  TableRow
} from "@material-ui/core";
import { getCookie } from "../helpers/localstorage";
const VALUE = {
    "notshipped" : {id : 103 , name : "Not Shipped Txn Report"},
    "return" : {id : 104 , name : "Return Report"},
    "refundpending" : {id : 105 , name : "Refund Pending Report"},
    "sale" : {id : 106 , name : "Sale Report"},
    "lineid" : {id : 107 , name : "Line Id Report"},
    "stock" : {id : 108 , name : "Stock Report"},
    "grn" : {id : 109 , name : "GRN Report"}
}

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    marginTop:"10px",
    padding: theme.spacing.unit * 2,
    // margin: "auto",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  },
  control:{padding:"10px"}
});
var counter = 0;
class Reporting extends React.Component {
  state = {
      report_type : null,
      loading : false,
      disabled : false,
      startdate : "",
      enddate : "",
      status : null
  };

  componentDidMount = () => {
      this.setState({ report_type : VALUE[this.props.match.params.type] },()=>{
        this.getReportingType();
      })
  };

  componentWillReceiveProps(newProps){
    if(this.props.match.params.type != newProps.match.params.type){
      this.setState({ report_type : VALUE[newProps.match.params.type] , startdate : "", enddate : "" , loading : false , disabled : false },()=>{
        this.getReportingType();
      })
    }
  }

  getReportingType(){
    const self = this;
    const { startdate, enddate , report_type} = this.state;
    var headers = {
      headers: {
        "Content-Type": "Application/json",
        "x-api-client": "OPS",
        "X-AUTH-TOKEN": getCookie("_koovs_token"),
      }
    }
    this.setState({ loading  : true})
    axios.get("/report/reportTypes", headers).then((res)=>{
      self.setState({ loading : false })
      if(res.data && res.data.response){
        var updated_data =  res.data.response.filter((i) => i.reportId == report_type.id)[0]
        updated_data["id"] = report_type.id;
        this.setState({ report_type : updated_data })
      }
   }).catch((error)=>{
     self.setState({ loading : false })
   })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value, disabled: false });
  };

  handleSubmit(e){
    e.preventDefault();
    const { limit, startdate, enddate } = this.state;
    const d1 = new Date(startdate);
    const d2 = new Date(enddate);
    const diff = d2.getTime() - d1.getTime();
    const daysDiff = parseInt(diff / (24 * 3600 * 1000));
    const self = this;
    this.setState({ disabled: true, message: "" }, () => {
      if (daysDiff == 0 && diff == 0) {
        alert("Start and End DateTime can't be same.")
      } else if (daysDiff > 32) {
        alert("Days difference can not be greater than 31 days.")
      }
      else {
        self.handleRequest({
          startdate: startdate + " 00:00:00",
          enddate: enddate + " 23:59:59"
        });
      }
    });
  };

  handleRequest(state){
    const self = this;
    const { startdate, enddate } = this.state;
    var headers = {
      headers: {
        "Content-Type": "Application/json",
        "x-api-client": "OPS",
        "X-AUTH-TOKEN": getCookie("_koovs_token"),
      }
    }
    this.setState({ loading  : true  , status : "(2/4) Started Processing ..."})
    var formdata = {};
    formdata["endDate"] = enddate,
    formdata["startDate"] = startdate,
    formdata["reportId"] = this.state.report_type.id
    axios.post("/report/api/query_result",JSON.stringify(formdata), headers).then((res)=>{
      self.setState({ loading : false })
      if(res.data.statusCode == 200 && res.data.response.id){
        this.goToSecondStep(res.data.response.id , self.state.report_type.id)
      }
      else{
        alert(res.data.response.error || res.data.text)
      }
   }).catch((error)=>{
     self.setState({ loading : false })
   })
  }

  goToSecondStep(id,reportid){
    const self = this;
    const { startdate, enddate } = this.state;
    var headers = {
      headers: {
        "Content-Type": "Application/json",
        "x-api-client": "OPS",
        "X-AUTH-TOKEN": getCookie("_koovs_token"),
      }
    }
    this.setState({ loading  : true  , status : "(3/4) Executing Query..."})
    axios.get("/report/api/jobs/" + id, headers).then((res)=>{
      if(res.data.response.status  == 3 && res.data.response.query_result_id){
        self.setState({ loading : false })
        this.goThirdStep(res.data.response.query_result_id , reportid)
      }
      else if(res.data.query_result_id == null){
        counter += 1;
        if(counter <= 10){
          setTimeout(() => {
            self.goToSecondStep(id,reportid)
          },10000);
        }
        else{
          counter = 0;
          self.setState({ status : "(1/4) Starting Process ..." , loading : false})
          alert(res.data.error || "Error Processing Query. Taking too much time.")
        }
      }
      else{
        self.setState({ status : "(1/4) Starting Process ..." , loading : false})
        alert(res.data.error || "Error Processing Query. Taking too much time.")
      }
   }).catch((error)=>{
     self.setState({ loading : false })
   })
  }

  goThirdStep(queryid,reportid){
    const self = this;
    this.setState({ loading  : true  , status : "(4/4) Downloading Query Result ..."})
    var headers = {
      headers: {
        "Content-Type": "Application/json",
        "x-api-client": "OPS",
        "X-AUTH-TOKEN": getCookie("_koovs_token"),
      }
    }
    axios.get("/report/api/query_result/"+reportid+"/" + queryid, headers).then((res)=>{
      self.setState({ loading : false })
      if(res.data){
        var blob = new Blob([res.data], {
          type: "text/csv;charset=utf-8;"
        });
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, self.state.report_type.name + "_" + self.state.startdate + "_"+ self.state.enddate + ".csv");
        }
        else {
          var link = document.createElement("a");
          if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download",  self.state.report_type.name + "_" + self.state.startdate + "_"+ self.state.enddate + ".csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      }
      else{
        self.setState({ status : "(1/4) Starting Process ..."})
        alert(res.data.error || "Error Processing Query. Taking too much time.")
      }
   }).catch((error)=>{
     self.setState({ loading : false })
   })
  }

  handleCachedReport(){
    const self = this;
    this.setState({ loading  : true  })
    var headers = {
      headers: {
        "Content-Type": "Application/json",
        "x-api-client": "OPS",
        "X-AUTH-TOKEN": getCookie("_koovs_token"),
      }
    }
    let reportid = this.state.report_type.id;
    axios.get("/report/"+reportid,headers).then((res)=>{
      self.setState({ loading : false })
      if(res.data){
        var blob = new Blob([res.data], {
          type: "text/csv;charset=utf-8;"
        });
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, "Cached_"+ self.state.report_type.name + ".csv");
        }
        else {
          var link = document.createElement("a");
          if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download",  "Cached_"+ self.state.report_type.name + ".csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      }
      else{
        alert(res.data.error || "Error Downloading File.")
      }
   }).catch((error)=>{
     self.setState({ loading : false })
   })
  }

  render() {
    const { classes, match} = this.props;
    return (
      <React.Fragment>
        {this.state.loading &&
            <LinearProgress />
        }
        {(this.state.loading && this.state.status) && 
          <Paper className={classes.paper} style={{ marginTop : 20}}>
            <Typography variant="h6" gutterBottom component="h6" style={{ textAlign : "center"}}>
                {this.state.status}
            </Typography>
          </Paper>
        }
        {!this.state.loading && (
          <React.Fragment>
            <Grid container lg={12} justify="space-between" className={classes.wrapper}>
              <Typography variant="h5" gutterBottom component="h5">
                {this.state.report_type &&  this.state.report_type.name}
              </Typography>
              <div className="table_button"><Button className="table_onbutton"  onClick={(e) =>{ this.props.history.goBack()}} variant="contained" color="primary"> Go Back </Button></div>
            </Grid>
            <form onSubmit={this.handleSubmit.bind(this)}>
              {this.state.report_type !== null &&
              <Paper className={classes.paper}>
              <Grid container spacing={24}>
                  <Grid item xs={6} className={classes.datepick} className={classes.control}>
                      <FormControl fullWidth variant="outlined" className={classes.formControl}>
                        <TextField
                          fullWidth
                          helperText="Enter Start Date"
                          name="startdate"
                          variant="outlined"
                          value={this.state.startdate}
                          onChange={this.handleChange}
                          type="date"
                          required
                          inputProps={{
                            max: new Date().toISOString().split("T")[0]
                          }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} className={classes.datepick} className={classes.control}>
                  <FormControl fullWidth variant="outlined" className={classes.formControl}>
                      <TextField
                          fullWidth
                          id="outlined-basic"
                          variant="outlined"
                          helperText="Enter End Date"
                          name="enddate"
                          value={this.state.enddate}
                          onChange={this.handleChange}
                          type="date"
                          required
                          inputProps={{
                            max: new Date().toISOString().split("T")[0]
                          }}
                        />
                      </FormControl>
                  </Grid>
                </Grid>
                <Grid container justify="center">
                  <Grid item>
                    <Button variant="contained" color="primary" type="submit" className={classes.button}>
                      Download Report
                    </Button>
                  </Grid>
                </Grid>
                {this.state.report_type.cachedReport &&
                  <>
                  <Typography variant="h5" gutterBottom component="h5" style={{ textAlign : "center" }}>
                      Or
                  </Typography>
                  <Grid container justify="center">
                    <Grid item>
                      <Button onClick={this.handleCachedReport.bind(this)} variant="contained" color="primary" type="button" className={classes.button}>
                        Download Cached Report
                      </Button>
                    </Grid>
                  </Grid>
                  </>
                }
              </Paper>
              }
            </form>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(Reporting));