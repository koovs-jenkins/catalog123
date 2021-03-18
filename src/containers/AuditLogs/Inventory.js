import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Fab,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Paper,
  TextField,
  LinearProgress
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Pagination from "react-js-pagination";
import { inventoryLogsHeader } from "../../../metadata";
import CustomTableCell from "../../components/CustomTableCell";
import Notify from "../../components/Notify";
import { fetchInventoryLogsApi } from "../../api/audit";

const style = theme => ({
  paper: {
    ...theme.paper,padding:"10px",marginTop:"10px"
  },
  buttnWrap:{
    display:"flex",
    justifyContent:"flex-end",
    "& button" :{
      marginLeft:"10px",
    },
  },
  wrapper:{
    marginTop:"10px"
  },
  datepick:{
    display:"flex",
    justifyContent:"flex-end",
    marginTop:"5px",
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
  },
  control:{
    padding:"10px"
  }
});

class Inventory extends React.Component {
  initialState = {
    skuId: "",
    count: 0,
    startDate: "",
    loading: false,
    message: ""
  };

  state = {
    activePage: 1,
    rows: [],
    countPerPage: 10,
    ...this.initialState
  };

  handleInventoryFetch = activePage => {
    const that = this;
    const pageNumber = activePage ? activePage : this.state.activePage;
    const { skuId, countPerPage, startDate } = this.state;
    that.setState({ message: "", loading: true }, () => {
      if (skuId && startDate) {
        fetchInventoryLogsApi(
          skuId,
          countPerPage,
          pageNumber,
          startDate ? startDate : "",
          that.props.userId
        ).then(res =>
          res && res.status < 350 && res.data && res.data.data
            ? that.setState({
                rows: res.data.data.ledgerResponseList || [],
                count: res.data.data.totalElements || 0,
                loading: false,
                message: res.data.errorExists ? res.data.reason : ""
              })
            : that.setState({
                message:
                  (res && res.data && res.data.message) || "No data found",
                loading: false
              })
        );
      } else {
        that.setState({
          loading: false,
          message: "Required parameters are missing"
        });
      }
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
    }
  };

  handleClear = () => {
    this.setState({ ...this.initialState });
  };

  handleSubmit = () => {
    this.setState({ activePage: 1 }, () => this.handleInventoryFetch(null));
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber }, () => this.handleInventoryFetch(null));
  };

  render() {
    const { classes } = this.props;
    const {
      skuId,
      startDate,
      rows,
      activePage,
      countPerPage,
      count,
      loading,
      message
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        {loading && <LinearProgress />}
        <Grid xs={12} className={classes.wrapper}>
          <Typography variant="h6" gutterBottom component="h6">
            Inventory Audit Logs
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
        <Grid container className={classes.wrapper} spacing={12} alignItems="center">
              <Grid item xs={4} sm={4} md={8} className={classes.control}>
                <TextField
                  style={{top:"-10px"}}
                  variant="outlined"
                  label="Sku Id"
                  type="number"
                  name="skuId"
                  fullWidth
                  className={classes.textField}
                  variant="outlined"
                  onChange={this.handleSearchChange}
                  value={skuId}
                  required
                />
              </Grid>
              <Grid item xs={8} sm={8} md={4} className={classes.control}>
                <TextField
                  helperText="From Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  name="startDate"
                  value={startDate}
                  onChange={this.handleSearchChange}
                  inputProps={{
                    max: new Date().toISOString().split("T")[0]
                  }}
                  required
                />
              </Grid>
             
          </Grid>
          <Grid container className={classes.wrapper} spacing={24} >
            <Grid className={classes.buttnWrap} item xs={12} sm={12} md={12} alignItems="right"  alignContent="flex-end">
              <Button variant="contained" color="primary"  onClick={this.handleClear}>Clear</Button>
              <Button variant="contained" color="primary" onClick={this.handleSubmit}>Search</Button>
            </Grid>
          </Grid>
              
        </Paper>
                  <Paper className={classes.paper}>
                  <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {inventoryLogsHeader.map((v, k) => (
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
                        {row.skuId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.vendorId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.warehouseId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.lotId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.inventoryCount}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.deltaValue}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.deltaType}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.createdBy}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.createdOn}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.platform}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.key}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={inventoryLogsHeader.length}
                    align="center"
                    padding="dense"
                  >
                    No Record Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
                  </Paper>
        <div className={classes.tableWrapper}>
         
        </div>
        <Pagination
          activePage={activePage}
          itemsCountPerPage={countPerPage}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(Inventory);