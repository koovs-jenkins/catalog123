import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Typography,
  Fab,
  Table,
  TableBody,
  TableHead,
  Button,
  TableCell,
  TableRow,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  LinearProgress,
  TableContainer
} from "@material-ui/core";
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
import {
  PriceSchedulerTableMeta,
  PriceSchedulerFilterMeta,
  priceScheduleTableHeader
} from "../../../../metadata";
import CustomTableCell from "../../../components/CustomTableCell";
import { fetchScheduledPriceApi } from "../../../api/pricing";
import { getCompleteDate } from "../../../helpers";
import { downloadCsv } from "../../../../utils/csv";
import Notify from "../../../components/Notify";

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  control:{
    padding:"10px"
  },
  select: {
    width: "100%",
    height: "56px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "white"
  },
  fab: {
    margin: theme.spacing.unit
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    ...theme.tableWrapper
  },
  subText: {
    fontSize: "15px"
  },
  red: {
    color: "red"
  },
  right: {
    textAlign: "right"
  },
  select: {
    width: "100%",
    height: "56px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "white"
  },
  link: {
    textDecoration: "none"
  },
  helperText: {
    margin: "8px 12px 0",
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "0.75rem",
    lineHeight: "1em"
  }
});

class PriceScheduler extends React.Component {
  initialState = {
    filter: {
      startDate: "",
      endDate: "",
      skuId: "",
      flag: "",
      pageNumber: 1,
      pageSize: 10
    },
    totalCount: 0,
    message: ""
  };

  state = {
    ...this.initialState,
    rows: [],
    exportData: []
  };

  handleFirstLoad = filter => {
    const that = this;
    const params = JSON.parse(JSON.stringify(filter));
    params.startDate = params.startDate
      ? getCompleteDate(params.startDate)
      : "";
    params.endDate = params.endDate
      ? getCompleteDate(params.endDate, "23:59:59")
      : "";
    this.setState({ loading: true, message: "" }, () =>
      fetchScheduledPriceApi(that.props.userId, params).then(res => {
        if (
          res &&
          res.status < 350 &&
          res.data &&
          res.data.response &&
          res.data.response.length > 0
        ) {
          // that.handleExport(params);
          that.setState({
            rows: typeof res.data.response == "object" ? res.data.response : [],
            totalCount: res.data.totalElement,
            loading: false
          });
        } else {
          that.setState({
            loading: false,
            message: res.data.message || "No record found"
          });
        }
      })
    );
  };

  handleSubmit = () => {
    if (this.state.filter.startDate || this.state.filter.endDate) {
      if (this.state.filter.startDate && this.state.filter.endDate) {
        this.handleRequest();
      } else {
        alert("Start date and end date are mandatory");
      }
    } else {
      this.handleRequest();
    }
  };

  handleRequest = () => {
    this.setState({ message: "" });
    const filter = { ...this.state.filter };
    this.setState({ filter }, () => this.handleFirstLoad(this.state.filter));
  };

  componentDidMount = () => {
    this.handleFirstLoad(this.state.filter);
  };

  handlePageChange = pageNumber => {
    const filter = { ...this.state.filter };
    filter.pageNumber = pageNumber;
    this.setState({ filter }, () => this.handleFirstLoad(this.state.filter));
  };

  handleChange = e => {
    if (
      e.target.value &&
      e.target.value.length > 0 &&
      e.target.value.trim() == ""
    ) {
      this.setState({ message: "Nothing found to search" });
    } else {
      const filter = this.state.filter;
      filter[e.target.name] = e.target.value;
      this.setState({ filter });
    }
  };

  handleExport = filter => {
    delete filter.pageNumber;
    delete filter.pageSize;
    fetchScheduledPriceApi(this.props.userId, filter).then(
      res =>
        res &&
        res.status < 350 &&
        this.setState({
          exportData: res.data.response.keys() && res.data.response
        })
    );
  };

  render() {
    const { classes } = this.props;
    const {
      rows,
      filter,
      totalCount,
      exportData,
      message,
      loading
    } = this.state;

    return (
      <React.Fragment>
          {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid lg={12} className={classes.wrapper} justify="space-between">
          <Typography variant="h5" gutterBottom component="h5">
            Price Scheduler Dashboard
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={12} alignItems="center">
            <Grid item xs={12} sm={6} md={8} className={classes.control}>
              <TextField
                fullWidth
                label="Enter Sku Id"
                name="skuId"
                className={classes.textField}
                variant="outlined"
                onChange={this.handleChange}
                margin="none"
                value={filter.skuId}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <FormControl fullWidth variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Filter Type</InputLabel>
                  <Select
                    label="Filter Type"
                    name="flag"
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={filter.flag}
                    onChange={this.handleChange}
                  >
                    {PriceSchedulerFilterMeta.map((v, k) => (
                      <MenuItem key={k} value={v.value}>
                        {v.label}
                      </MenuItem>
                    ))}
                  </Select>
              </FormControl>
            </Grid>
            {filter.flag == "SCHEDULED" && (
              <React.Fragment>
                <Grid item xs={12} sm={6} md={6} className={classes.control}>
                  <TextField
                   fullWidth
                    label="Scheduled Start Date"
                    className={classes.textField}
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="startDate"
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} className={classes.control}>
                  <TextField
                    fullWidth
                    label="Scheduled End Date"
                    className={classes.textField}
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true
                    }}
                    name="endDate"
                    onChange={this.handleChange}
                  />
                </Grid>
              </React.Fragment>
            )}
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <Button
                color="primary"
                onClick={this.handleSubmit}
                variant="contained"
              >
                Search
              </Button>
              {exportData.length > 0 && (
                <Button
                  color="primary"
                  className={classes.fab}
                  variant="extended"
                  onClick={() =>
                    downloadCsv({
                      filename: "price_scheduled.csv",
                      data: exportData,
                      header: priceScheduleTableHeader.split(",")
                    })
                  }
                >
                  Export File
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      <Paper className={classes.paper}>
        <Grid lg={12} style={{overflow:"scroll"}}>
        <div>
          <TableContainer>
            <Table className={classes.table}  stickyHeader  aria-label="simple table">
            <TableHead>
              <TableRow>
                {PriceSchedulerTableMeta.map((v, k) => (
                  <CustomTableCell key={k} align="center" colSpan="1"  padding="dense">
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
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.scheduledBatchId}
                      </TableCell>
                      {/* <TableCell align="center" padding="dense">
                        {row.id}
                      </TableCell> */}
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.productId}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.lineId}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.skuId}
                      </TableCell>
                      <TableCell colSpan="1" colSpan="1" align="center" padding="dense">
                        {row.vendorId}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.warehouseId}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.lotId}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.mrp}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.sellingPrice}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.scheduledPrice}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.startTime}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.endTime}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.updatedBy}
                      </TableCell>
                      <TableCell colSpan="1"  align="center" padding="dense">
                        {row.createdDate}
                      </TableCell>
                      <TableCell colSpan="1" align="center" padding="dense">
                        {row.updatedDate}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell
                    style={{textAlign:"center"}}
                    colSpan={PriceSchedulerTableMeta.length}
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
        </Grid>
      
      
      </Paper>
      <Pagination
          pageNumber={filter.pageNumber}
          itemspageSize={filter.pageSize}
          totalItemsCount={totalCount}
          pageRangeDisplayed={5}
          activePage={filter.pageNumber}
          onChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  pricing: state.pricing,
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(connect(mapStateToProps)(PriceScheduler));