import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  Paper,
  Grid,
  TextField,
  Fab,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  Button,
  CircularProgress
} from "@material-ui/core";
import CustomTableCell from "../../../components/CustomTableCell";
import { TempCartHeader } from "../../../../metadata";
import { fetchTempCartApi } from "../../../api/callCenter";
import { baseUrl } from "../../../../config";
import { serializeArray } from "../../../helpers";
import Pagination from "react-js-pagination";
import { downloadCsv } from "../../../../utils/csv";
import Notify from "../../../components/Notify";

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: { ...theme.paper,marginTop:"10px",padding:"10px" },
  fab: { margin: theme.spacing.unit },
  control:{padding:"10px"},
  tableWrapper: { ...theme.tableWrapper, height: 400 },
  bold: { fontWeight: "bold", textAlign: "left" },
  image: { width: 80, height: 120 },
  head: { backgroundColor: "#4354B1", color: "white" },
  right: { textAlign: "right" },
  card: { display: "flex" },
  details: { display: "flex", flexDirection: "column" },
  content: { flex: "1 0 auto", marginLeft: theme.spacing.unit }
});

class TempCart extends React.Component {
  state = {
    rows: [],
    page: 0,
    limit: 10,
    startdate: "",
    enddate: "",
    count: -1,
    disabled: false,
    message: "",
    loading: false,
    downloadData: [],
    dLoading: false
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value, disabled: false });
  };

  handleRequest = state => {
    const that = this;
    const { page, limit, startdate, enddate } = state;
    that.setState({ message: "", loading: true }, () => {
      fetchTempCartApi(that.props.userId, startdate, enddate, page, limit).then(
        res =>
          res && res.status < 350 && res.data && res.data.data
            ? that.setState({
                rows: res.data.data || [],
                count: res.data.count,
                disabled: false,
                loading: false,
                message: !res.data.data ? "No data found" : ""
              })
            : that.setState({ message: "Something went wrong", loading: false })
      );
    });
  };

  handleSubmit = () => {
    const { limit, startdate, enddate } = this.state;
    const d1 = new Date(startdate);
    const d2 = new Date(enddate);
    const diff = d2.getTime() - d1.getTime();
    const daysDiff = parseInt(diff / (24 * 3600 * 1000));
    const that = this;
    this.setState({ disabled: true, message: "" }, () => {
      if (daysDiff == 0 && diff == 0) {
        that.setState({
          message: "Start and End DateTime can't be same."
        });
      } else if (daysDiff > 5) {
        that.setState({
          message: "Days difference can not be greater than 5 days."
        });
      } else {
        that.handleRequest({
          page: 0,
          limit,
          startdate: startdate + " 00:00:00",
          enddate: enddate + " 23:59:59"
        });
        that.handleDownloadFetch();
      }
    });
  };

  handleDownloadFetch = () => {
    const that = this;
    const { startdate, enddate } = this.state;
    that.setState({ dLoading: true, downloadData: [] }, () =>
      fetchTempCartApi(
        that.props.userId,
        startdate + " 00:00:00",
        enddate + " 23:59:59"
      ).then(res =>
        res && res.status < 350 && res.data && res.data.data
          ? that.setState({ downloadData: res.data.data, dLoading: false })
          : that.setState({ dLoading: false })
      )
    );
  };

  handlePageChange = pageNumber => {
    const that = this;
    const { startdate, enddate } = this.state;
    this.setState({ page: pageNumber - 1 }, () =>
      that.handleRequest({
        ...that.state,
        startdate: startdate + " 00:00:00",
        enddate: enddate + " 23:59:59"
      })
    );
  };

  handleDownload = () => {
    downloadCsv({
      filename: "temp_cart.csv",
      data: serializeArray(this.state.downloadData)
    });
  };

  render() {
    const { classes } = this.props;
    const {
      page,
      limit,
      count,
      rows,
      startdate,
      enddate,
      disabled,
      message,
      loading,
      dLoading
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid lg={12} className={classes.wrapper} container>
        <Typography variant="h5" gutterBottom component="h5">
          Temp Cart Data
        </Typography>
        </Grid>
      
        {loading && <LinearProgress />}
        <Paper className={classes.paper}>
          <Grid container spacing={12}>
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <TextField
                fullWidth
                helperText="Enter Start Date"
                name="startdate"
                variant="outlined"
                value={startdate}
                onChange={this.handleChange}
                type="date"
                inputProps={{
                  max: new Date().toISOString().split("T")[0]
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} className={classes.control}>
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined" 
                helperText="Enter End Date"
                name="enddate"
                value={enddate}
                onChange={this.handleChange}
                type="date"
                inputProps={{
                  max: new Date().toISOString().split("T")[0]
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.control}>
              <Button
                className={classes.fab}
                color="primary"
                onClick={this.handleSubmit}
                variant="contained"
                disabled={disabled || !startdate || !enddate}
              >
                Search
              </Button>
              {dLoading && rows && rows.length > 0 ? (
                <CircularProgress />
              ) : (
                <Button
                  className={classes.fab}
                  color="primary"
                  variant="contained"
                  onClick={this.handleDownload}
                  disabled={rows.length == 0}
                >
                  Download
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
        {rows && rows.length > 0 && (
          <Paper className={classes.paper}>
            <div className={classes.tableWrapper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {TempCartHeader.map((v, k) => (
                      <TableCell key={k + v}>{v}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, key) => (
                    <TableRow hover key={key}>
                      <TableCell padding="dense">
                        {row.name || row.email}
                      </TableCell>
                      <TableCell padding="dense">{row.phone}</TableCell>
                      <TableCell padding="checkbox">
                        <Grid container>
                          <Grid item xs={12}>
                            <Grid container spacing={40}>
                              <Grid item>
                                <Typography>
                                  <span className={classes.bold}>
                                    Last Modified :{" "}
                                  </span>
                                  {row.cartUpdatedAt}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography>
                                  <span className={classes.bold}>
                                    Cart Id :{" "}
                                  </span>{" "}
                                  usercart_{row.userId}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell className={classes.head}>
                                    Item Description
                                  </TableCell>
                                  <TableCell className={classes.head}>
                                    Option
                                  </TableCell>
                                  <TableCell className={classes.head}>
                                    Price
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.cartData.cart.items.map(cVal => (
                                  <TableRow hover key={cVal.id}>
                                    <TableCell>
                                      <div className={classes.card}>
                                        <img
                                          src={cVal.product.cartImageUrl}
                                          className={classes.image}
                                        />
                                        <div className={classes.details}>
                                          <a
                                            href={baseUrl + cVal.links[0].href}
                                            target="_blank"
                                            className={classes.content}
                                          >
                                            <Typography
                                              variant="subtitle1"
                                              color="textSecondary"
                                            >
                                              {cVal.product.productName}
                                            </Typography>
                                          </a>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Grid
                                        container
                                        justify="space-between"
                                        alignItems="flex-start"
                                      >
                                        <Grid item xs={12}>
                                          <Grid
                                            container
                                            justify="space-between"
                                            alignItems="flex-start"
                                          >
                                            <Grid item>
                                              <Typography>Size</Typography>
                                            </Grid>
                                            <Grid item>
                                              <Typography>
                                                {cVal.product.sizeCode}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <Grid
                                            container
                                            justify="space-between"
                                            alignItems="flex-start"
                                          >
                                            <Grid item>
                                              <Typography>Quantity</Typography>
                                            </Grid>
                                            <Grid item>
                                              <Typography>
                                                {cVal.qty}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Grid
                                        container
                                        justify="space-between"
                                        alignItems="flex-start"
                                      >
                                        <Grid item xs={12}>
                                          <Grid
                                            container
                                            justify="space-between"
                                            alignItems="flex-start"
                                          >
                                            <Grid item>
                                              <Typography>Price</Typography>
                                            </Grid>
                                            <Grid item>
                                              <Typography>
                                                Rs. {cVal.total}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <Grid
                                            container
                                            justify="space-between"
                                            alignItems="flex-start"
                                          >
                                            <Grid item>
                                              <Typography>Discount</Typography>
                                            </Grid>
                                            <Grid item>
                                              <Typography>
                                                Rs. {cVal.discount}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <Grid
                                            container
                                            justify="space-between"
                                            alignItems="flex-start"
                                          >
                                            <Grid item>
                                              <Typography
                                                className={classes.bold}
                                              >
                                                Sub Total
                                              </Typography>
                                            </Grid>
                                            <Grid item>
                                              <Typography>
                                                Rs. {cVal.subTotal}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                  {count == 0 && (
                    <TableRow hover>
                      <TableCell colSpan={3}>
                        No Data found for above search
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Paper>
        )}
        <Pagination
          activePage={page + 1}
          itemsCountPerPage={limit}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  list: state.callCenter.tempCartList
});

export default withStyles(style)(connect(mapStateToProps)(TempCart));
