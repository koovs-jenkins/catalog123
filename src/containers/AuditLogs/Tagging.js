import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Typography,
  Fab,
  Table,
  Button,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TextField,
  LinearProgress
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Pagination from "react-js-pagination";
import { taggingLogsHeader } from "../../../metadata";
import CustomTableCell from "../../components/CustomTableCell";
import Notify from "../../components/Notify";
import { fetchTaggingLogsApi } from "../../api/audit";

const style = theme => ({
  paper: {
    ...theme.paper,padding:"10px",marginTop:"10px"
  },
  datepick:{
    display:"flex",
    justifyContent:"flex-start",
    marginTop:"16px",
  },
  wrapper:{
    marginTop:"10px"
  },
  buttnWrap:{
    display:"flex",
    justifyContent:"flex-end",
    "& button" :{
      marginLeft:"10px",
    },
  },
  control:{
    padding:"10px"
  },
  fab: {
    margin: theme.spacing.unit
  },
  heading: {
    margin: theme.spacing.unit * 4
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    ...theme.tableWrapper,
    marginTop:"30px"
  }
});

class Tagging extends React.Component {
  initialState = {
    lineId: "",
    count: 0,
    tagName: "",
    loading: false,
    message: ""
  };

  state = {
    activePage: 1,
    rows: [],
    countPerPage: 10,
    ...this.initialState
  };

  handleTaggingFetch = activePage => {
    const that = this;
    const pageNumber = activePage ? activePage : this.state.activePage;
    const { lineId, countPerPage, tagName } = this.state;
    that.setState({ message: "", loading: true }, () => {
      fetchTaggingLogsApi(
        lineId,
        countPerPage,
        pageNumber,
        tagName,
        that.props.userId
      ).then(res =>
        res && res.status < 350
          ? that.setState({
              rows: res.data.response || [],
              count: res.data.totalElement || 0,
              loading: false,
              message: res.data.errorExists ? res.data.reason : ""
            })
          : that.setState({
              message: (res && res.data && res.data.message) || "No data found",
              loading: false
            })
      );
    });
  };

  handleSearchChange = e => {
    if (
      e.target.value &&
      e.target.value.length > 0 &&
      e.target.value.trim() == ""
    ) {
      this.setState({ message: "Nothing found to search" });
    } else {
      this.setState({ [e.target.name]: e.target.value });
      if (e.key == "Enter") {
        this.handleSubmit();
      }
    }
  };

  handleClear = () => {
    this.setState({ ...this.initialState });
  };

  handleSubmit = () => {
    if(this.state.tagName || this.state.lineId){
      this.setState({ activePage: 1 }, () => this.handleTaggingFetch(null));
    }
    else{
      this.setState({ message: "Atleast one parameter should be entered to search." });
    }
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber },()=> { this.handleTaggingFetch(null)});
  };

  render() {
    const { classes } = this.props;
    const {
      lineId,
      tagName,
      rows,
      activePage,
      countPerPage,
      count,
      loading,
      message
    } = this.state;

    return (
      <React.Fragment>
         {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid lg={12} className={classes.wrapper}>
          <Typography variant="h6" gutterBottom component="h6">
            Tagging Audit Logs
          </Typography>
        </Grid>
       <Paper className={classes.paper}>
       <Grid container className={classes.wrapper} spacing={12} alignItems="center">
            <Grid item xs={12} sm={6} md={6} className={classes.control}>
              <TextField
                label="Line Id"
                type="number"
                fullWidth
                name="lineId"
                className={classes.textField}
                variant="outlined"
                onChange={this.handleSearchChange}
                margin="none"
                value={lineId}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} className={classes.control}>
                <TextField
                  label="Tag Name"
                  type="text"
                  name="tagName"
                  className={classes.textField}
                  variant="outlined"
                  fullWidth
                  onChange={this.handleSearchChange}
                  margin="none"
                  value={tagName}
                />
            </Grid>
           
          </Grid>
          <Grid container>
            <Grid className={classes.buttnWrap} item xs={12} sm={12} md={12} alignItems="right"  alignContent="flex-end">
              <Button variant="contained" color="primary"  
                onClick={this.handleSubmit}
              >Search</Button>
            </Grid>
          </Grid>
       </Paper>
       <Paper className={classes.paper}>
       <div >
          <Table >
            <TableHead>
              <TableRow>
                {taggingLogsHeader.map((v, k) => (
                  <TableCell key={k} align="center" padding="dense">
                    {v}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.length > 0 ? (
                rows.map((row, k) => {
                  return (
                    <TableRow key={k + 1} hover>
                      <TableCell align="center" padding="dense">
                        {row.tagName}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.lineId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.updateBy}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {new Date(row.logDate).toLocaleString()}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {Object.keys(row.activityLogs).map(function(i,index){
                          return(
                            <span key={"logs_"+index}>{i} : {row.activityLogs[i]}</span>
                          )
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={taggingLogsHeader.length}
                    align="center"
                    padding="dense"
                  >
                    No Record Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          activePage={activePage}
          itemsCountPerPage={countPerPage}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
       </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(Tagging);
