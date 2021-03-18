import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  Paper,
  Grid,
  TextField,
  Fab,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";
import CustomTableCell from "../../../components/CustomTableCell";
import { SearchPinCodeTableHeader } from "../../../../metadata";
import { fetchPincode } from "../../../store/actions/callCenter";
import { getCompleteDateMonth } from "../../../helpers";
import Notify from "../../../components/Notify";

const style = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: { ...theme.paper,marginTop:"10px",padding:"10px" },
  control:{padding:"10px"},
  fab: { margin: theme.spacing.unit },
  tableWrapper: { ...theme.tableWrapper, marginTop: theme.spacing.unit * 2 }
});

class SearchPincode extends React.Component {
  state = {
    rows: {},
    loading: false,
    pincode: "",
    message: ""
  };

  handleSearch = e => {
    if (e.key === "Enter") {
      this.handleRequest(e);
    }
  };

  handleRequest = e => {
    e.preventDefault();
    const that = this;
    this.setState({ message: "" }, () => {
      if (
        that.state.pincode &&
        that.state.pincode.length != 6 &&
        that.state.pincode.trim() == ""
      ) {
        that.setState({
          message: `Please enter 6 digit pincode`
        });
      } else {
        that.props
          .dispatch(fetchPincode(that.props.userId, that.state.pincode))
          .then(() => {
            if (that.props.pincodeList.data.pinCode) {
              that.setState({
                rows: that.props.pincodeList.data,
                loading: that.props.pincodeList.loading
              });
            } else {
              that.setState({
                message: `No result found for pincode ${that.state.pincode}`
              });
            }
          });
      }
    });
  };

  handleChange = e => {
    if (
      e.target.value &&
      e.target.value.length > 0 &&
      e.target.value.trim() == ""
    ) {
      this.setState({ message: "Nothing found to search" });
    } else {
      this.setState({ pincode: e.target.value });
    }
  };

  render() {
    const { classes } = this.props;
    const { rows, pincode, message } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Pincode List
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={12}>
            <Grid item xs={12} sm={12} md={12} className={classes.control}>
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                variant="outlined"
                id="outlined-basic"                 
                value={pincode}
                onChange={this.handleChange}
                onKeyDown={this.handleSearch}
              />
            </Grid>
            
          </Grid>
          <Grid container spacing={12} justify="flex-end">
          <Grid item xs={12} justify="flex-end" sm={12} md={12} className={classes.control}>
              <Button
                color="primary"
                variant="contained"
                className={classes.Fab}
                onClick={this.handleRequest}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper}> 
          {rows && (
            <div className={classes.tableWrapper} >
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    {SearchPinCodeTableHeader.map((v, k) => (
                      <TableCell key={k + v}>{v}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell>{rows.pinCode}</TableCell>
                    <TableCell>
                      {rows.onlineSupported == 1 && "Yes"}
                      {rows.onlineSupported == 0 && "No"}
                    </TableCell>
                    <TableCell>
                      {rows.codSupported == 1 && "Yes"}
                      {rows.codSupported == 0 && "No"}
                    </TableCell>
                    <TableCell>
                      {rows.returnSupported == 1 && "Yes"}
                      {rows.returnSupported == 0 && "No"}
                    </TableCell>
                    <TableCell>
                      {rows.dateUpdated &&
                        getCompleteDateMonth(rows.dateUpdated)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  pincodeList: state.callCenter.pincode
});

export default withStyles(style)(connect(mapStateToProps)(SearchPincode));
