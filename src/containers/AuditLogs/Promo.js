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
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Divider from "@material-ui/core/Divider";
import Pagination from "react-js-pagination";
import { promoLogsHeader } from "../../../metadata";
import CustomTableCell from "../../components/CustomTableCell";
import Notify from "../../components/Notify";
import { fetchPromoLogsApi } from "../../api/audit";
import { compareToObject } from "../../helpers/compare";
import { parseList } from "../../helpers";

const style = theme => ({
  paper: {
    ...theme.paper,padding:"10px",marginTop:"10px"
  },
  fab: { margin: theme.spacing.unit },
  heading: { margin: theme.spacing.unit * 4 },
  table: { minWidth: 500 },
  tableWrapper: { ...theme.tableWrapper,marginTop:"30px" },
  control:{padding:"10px"},
  select: {
    borderRadius:"5px",
    width: "100%",
    color: "rgba(0, 0, 0, 0.54)",
    fontSize:"16px",
    paddingLeft:"10px",
    height: "56px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "white"
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
  overFlow: { maxWidth: "100px", overflowWrap: "break-word", padding: "0px 16px" }
});

class Promo extends React.Component {
  initialState = {
    promoCode: "",
    userId: "",
    userEmail: "",
    type: "",
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

  handlePromoFetch = activePage => {
    const that = this;
    const pageNumber = activePage ? activePage : this.state.activePage;
    const {
      promoCode,
      userId,
      userEmail,
      type,
      countPerPage,
      startDate,
      endDate
    } = this.state;
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
      } else if (
        (startDate && endDate) ||
        promoCode ||
        userId ||
        userEmail ||
        type
      ) {
        if (!promoCode) {
          that.setState({ message: "Promocode is mandatory", loading: false });
        } else {
          fetchPromoLogsApi(
            promoCode,
            userId,
            userEmail,
            type,
            countPerPage,
            pageNumber,
            startDate ? startDate + " 00:00" : "",
            endDate ? endDate + " 23:59" : "",
            that.props.userId
          ).then(res =>
            res.status < 350
              ? that.setState({
                  rows: res.data.response || [],
                  count: res.data.totalElement || 0,
                  loading: false,
                  message: !res.data.response ? "No logs found" : ""
                })
              : that.setState({
                  message: (res.data && res.data.message) || res.statusText,
                  loading: false
                })
          );
        }
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
      this.setState({
        [e.target.name]:
          [e.target.name] == "promoCode"
            ? e.target.value.toUpperCase()
            : e.target.value
      });
      if (e.key == "Enter") {
        this.handleSubmit();
      }
    }
  };

  handleClear = () => {
    this.setState({ ...this.initialState });
  };

  handleSubmit = () => {
    this.setState({ activePage: 1 }, () => this.handlePromoFetch(null));
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber }, () =>
      this.handlePromoFetch(pageNumber)
    );
  };

  render() {
    const { classes } = this.props;
    const {
      promoCode,
      userId,
      userEmail,
      type,
      startDate,
      endDate,
      rows,
      activePage,
      countPerPage,
      count,
      loading,
      message
    } = this.state;

    const items = [];
    if (rows && rows.length && rows.length > 0) {
      for (let i = 0; i <= rows.length - 1; i++) {
        rows[i] && rows[i + 1]
          ? items.push(
              <TableRow key={i} hover>
                <TableCell align="left" className={classes.overFlow}>
                  <ul>{parseList(compareToObject(rows[i + 1], rows[i]))}</ul>
                </TableCell>
                <TableCell align="left" className={classes.overFlow}>
                  <ul>
                    {parseList(compareToObject(rows[i + 1], rows[i], "new"))}
                  </ul>
                </TableCell>
              </TableRow>
            )
          : items.push(
              <TableRow key={i} hover>
                <TableCell align="left" className={classes.overFlow}>
                  <ul>{parseList(compareToObject({}, rows[i]))}</ul>
                </TableCell>
                <TableCell align="left" className={classes.overFlow}>
                  <ul>
                    {parseList(compareToObject({}, rows[i], "new"))}
                  </ul>
                </TableCell>
              </TableRow>
            );
      }
    }

    return (
      <React.Fragment>
          {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid lg={12} className={classes.wrapper}>
          <Typography variant="h6" gutterBottom component="h6">
            Promo Audit Logs
          </Typography>
        </Grid>
        <Paper classes={classes.paper} elevation="3">
        <Grid container spacing={24} alignItems="center" className={classes.wrapper}>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                label="Promo Code"
                name="promoCode"
                className={classes.textField}
                variant="outlined"
                onChange={this.handleSearchChange}
                margin="none"
                fullWidth
                value={promoCode}
                onKeyDown={this.handleSearchChange}
                style={{ textTransform: "uppercase" }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}  className={classes.control}>
              <TextField
                label="User Id"
                type="number"
                name="userId"
                fullWidth
                className={classes.textField}
                variant="outlined"
                onChange={this.handleSearchChange}
                value={userId}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}  className={classes.control}>
              <TextField
                label="User Email"
                name="userEmail"
                type="email"
                fullWidth
                className={classes.textField}
                variant="outlined"
                onChange={this.handleSearchChange}
                value={userEmail}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <FormControl fullWidth variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="type"
                  value={type}
                  onChange={this.handleSearchChange}
                  label="Type"
                >
                  <MenuItem value="">Type</MenuItem>
                  <MenuItem value="PROMOTIONAL">PROMOTIONAL</MenuItem>
                  <MenuItem value="PUBLIC_ACCESS_GENERIC">GENERIC</MenuItem>
                  <MenuItem value="MULTIUSERS">MULTIUSERS</MenuItem>
                  <MenuItem value="REFUND">REFUND</MenuItem>
                  <MenuItem value="OTHERS">OTHERS</MenuItem>
                  <MenuItem value="BUYXGETY">BUYXGETY</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                helperText="Start Date"
                type="date"
                variant="outlined"
                fullwidth
                margin="normal"
                fullWidth
                name="startDate"
                value={startDate}
                onChange={this.handleSearchChange}
                inputProps={{
                  max: new Date().toISOString().split("T")[0]
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                helperText="End Date"
                type="date"
                variant="outlined"  
                margin="normal"
                fullWidth
                name="endDate"
                value={endDate}
                onChange={this.handleSearchChange}
                inputProps={{
                  max: new Date().toISOString().split("T")[0]
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Grid className={classes.buttnWrap} item xs={12} sm={6} md={9}alignItems="right"  alignContent="flex-end">
                <Button variant="contained" color="primary"  onClick={this.handleClear}>Clear</Button>
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>Search</Button>
              </Grid>
            </Grid>
          </Grid>
       
        </Paper>
        <Paper className={classes.paper} elevation="3">
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="center" padding="dense">
                  Old
                </TableCell>
                <TableCell align="center" padding="dense">
                  New
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.length > 0 ? (
                items
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={promoLogsHeader.length}
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

export default withStyles(style)(Promo);
