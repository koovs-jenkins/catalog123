import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Typography,
  Fab,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TextField,
  LinearProgress,
  TableContainer
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Pagination from "react-js-pagination";
import { pricingScheduledLogsHeader } from "../../../metadata";
import CustomTableCell from "../../components/CustomTableCell";
import Notify from "../../components/Notify";
import { fetchPricingScheduledLogsApi } from "../../api/audit";
import { connect } from "react-redux";

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
  control:{padding:"10px"},
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

class PricingScheduled extends React.Component {
  initialState = {
    skuId: "",
    count: 0,
    startDate: "",
    endDate: "",
    loading: false,
    message: ""
  };

  state = {
    activePage: 1,
    rows: [],
    countPerPage: 10,
    ...this.initialState
  };

  handlePricingScheduledFetch = activePage => {
    const that = this;
    const pageNumber = activePage ? activePage : this.state.activePage;
    const { skuId, countPerPage, startDate, endDate } = this.state;
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diff = d2.getTime() - d1.getTime();
    const daysDiff = parseInt(diff / (24 * 3600 * 1000));
    that.setState({ message: "", loading: true }, () => {
      if (daysDiff < 0 && diff < 0) {
        that.setState({
          message: "End date can not be more than start date",
          loading: false
        });
      } else if (!skuId) {
        that.setState({
          message: "Sku is mandatory",
          loading: false
        });
      } else if ((startDate && endDate) || skuId) {
        fetchPricingScheduledLogsApi(
          skuId,
          countPerPage,
          pageNumber,
          startDate ? startDate + " 00:00" : "",
          endDate ? endDate + " 23:59" : "",
          that.props.userId
        ).then(res =>
          res && res.status < 350
            ? that.setState({
                rows: res.data.response || [],
                count: res.data.totalElement || 0,
                loading: false,
                message: res.data.totalElement == 0 ? "No logs found" : ""
              })
            : that.setState({
                message:
                  res && ((res.data && res.data.message) || res.statusText),
                loading: false
              })
        );
      } else {
        that.setState({
          message: "Start date and end date are mandatory",
          loading: false
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
      if (e.key == "Enter") {
        this.handleSubmit();
      }
    }
  };

  handleClear = () => {
    this.setState({ ...this.initialState });
  };

  handleSubmit = () => {
    this.setState({ activePage: 1 }, () =>
      this.handlePricingScheduledFetch(null)
    );
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber }, () =>
      this.handlePricingScheduledFetch(pageNumber)
    );
  };

  render() {
    const { classes } = this.props;
    const {
      skuId,
      startDate,
      endDate,
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
            Pricing Scheduled Audit Logs
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
        <Grid className={classes.wrapper} container spacing={24} alignItems="left">
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <TextField
                label="Sku Id"
                type="number"
                fullWidth
                name="skuId"
                className={classes.textField}
                variant="outlined"
                onChange={this.handleSearchChange}
                value={skuId}
                required
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <TextField
                helperText="Start Date"
                type="date"
                variant="outlined"
                fullWidth
                name="startDate"
                value={startDate}
                onChange={this.handleSearchChange}
                inputProps={{
                  max: new Date().toISOString().split("T")[0]
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <TextField
                helperText="End Date"
                type="date"
                variant="outlined"
                fullWidth
                name="endDate"
                value={endDate}
                onChange={this.handleSearchChange}
                inputProps={{
                  max: new Date().toISOString().split("T")[0]
                }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.wrapper} spacing={24}>
            <Grid className={classes.buttnWrap} item xs={12} sm={6} md={12}alignItems="right"  alignContent="flex-end">
              <Button variant="contained" color="primary"  onClick={this.handleClear}>Clear</Button>
              <Button variant="contained" color="primary" onClick={this.handleSubmit}>Search</Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.paper}>
         <div className={classes.tableWrapper}>
          <TableContainer>
          <Table className={classes.table}  stickyHeader  aria-label="simple table">
            <TableHead>
              <TableRow>
                {pricingScheduledLogsHeader.map((v, k) => (
                  <CustomTableCell key={k} align="center" padding="dense">
                    {v}
                  </CustomTableCell>
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
                        {row.sellingPrice}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.scheduledPrice}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.startTime}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.endTime}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.status}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.vendorId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.lotId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.warehouseId}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.createdBy}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.createdDate}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.updatedBy}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.updatedDate}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={pricingScheduledLogsHeader.length}
                    align="center"
                    padding="dense"
                  >
                    No Record Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </TableContainer>
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

export default withStyles(style)(connect(mapStateToProps)(PricingScheduled));
