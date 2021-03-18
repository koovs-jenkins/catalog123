import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  LinearProgress,
  Button,
  Fab
} from "@material-ui/core";
import { connect } from "react-redux";
import { CallCenterUserTableHeader } from "../../../../metadata";
import { Link } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import CustomTableCell from "../../../components/CustomTableCell";
import { fetchUserApi } from "../../../api/callCenter";
import Notify from "../../../components/Notify";

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: { ...theme.paper,marginTop:"10px",padding:"10px" },
  control:{padding:"10px"},
  fab: { margin: theme.spacing.unit },
  table: { minWidth: 500 },
  tableWrapper: { ...theme.tableWrapper }
});

class CallCenterSearch extends React.Component {
  state = {
    rows: [],
    form: {
      id: "",
      email: "",
      phone: "",
      txnid: "",
      orderid: "",
      promo: "",
      parentOrderId: ""
    },
    loading: false,
    message: ""
  };

  handleApiCall = arr => {
    const that = this;
    this.setState({ loading: true, message: "", rows: [] }, () =>
      fetchUserApi(this.props.userId, arr).then(res =>
        res && res.status < 350
          ? that.setState({
              rows: res.data,
              loading: false
            })
          : that.setState({
              loading: false,
              message: res.data.message || "No user found"
            })
      )
    );
  };

  handleChange = e => {
    if (
      e.target.value &&
      e.target.value.length > 0 &&
      e.target.value.trim() == ""
    ) {
      this.setState({ message: "Nothing found to search" });
    } else {
      const form = this.state.form;
      form[e.target.name] = e.target.value;
      this.setState({ form: form });
    }
  };

  handleSubmit = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleApiCall([[e.target.name] + "=" + e.target.value]);
    }
  };

  handleRequest = () => {
    const form = { ...this.state.form };
    let newArr = [];
    for (let i in form) {
      if (form[i].trim() != "") {
        newArr.push(i + "=" + form[i]);
      }
    }
    this.handleApiCall(newArr);
  };

  render() {
    const { classes } = this.props;
    const { rows, form, loading, message } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Search User
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={12}>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                fullWidth
                label="Id"
                name="id"
                id="outlined-basic" 
                variant="outlined"
                value={form.id}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                id="outlined-basic" 
                variant="outlined"
                value={form.email}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                fullWidth
                label="Mobile"
                name="phone"
                id="outlined-basic" 
                variant="outlined"
                value={form.phone}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                fullWidth
                label="TxnId"
                name="txnid"
                id="outlined-basic" 
                variant="outlined"
                value={form.txnid}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                fullWidth
                label="OrderId"
                name="orderid"
                id="outlined-basic" 
                variant="outlined"
                value={form.orderid}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}  className={classes.control}>
              <TextField
                fullWidth
                label="Parent Order Id"
                name="parentOrderId"
                id="outlined-basic" 
                variant="outlined"
                value={form.parentOrderId}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <TextField
                fullWidth
                label="Promo"
                name="promo"
                variant="outlined"
                margin="none"
                value={form.promo}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <Button
                color="primary"
                variant="contained"
                onClick={this.handleRequest}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h6" gutterBottom component="h6">
              Total Results: {rows && rows.length}
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          {loading && <LinearProgress />}
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {CallCenterUserTableHeader.map((v, k) => (
                    <TableCell key={k}>{v}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows && rows.length > 0 ? (
                  rows.map(row => (
                    <TableRow key={row.id} hover>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.dateCreated}</TableCell>
                      <TableCell>
                        <Link to={"/call_center/userDetailSearch/" + row.id}>
                          <Visibility fontSize="small" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={CallCenterUserTableHeader.length}>
                      No Users Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Paper>




         
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  userList: state.callCenter.userList
});

export default withStyles(style)(connect(mapStateToProps)(CallCenterSearch));
