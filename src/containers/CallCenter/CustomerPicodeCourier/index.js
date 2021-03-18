import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  Paper,
  Grid,
  TextField,
  Button,
  Fab,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress
} from "@material-ui/core";
import CustomTableCell from "../../../components/CustomTableCell";
import { SerachCourierPinCodeTableHeader } from "../../../../metadata";
import { fetchCourierReturnPincodeServicablityApi } from "../../../api/callCenter";
import Notify from "../../../components/Notify";

const style = theme => ({
  wrapper:{
    marginTop:"20px"
  },
  paper: { ...theme.paper,marginTop:"10px",padding:"10px" },
  control:{padding:"10px"},
  tableWrapper: { ...theme.tableWrapper, marginTop: theme.spacing.unit * 2 }
});

class SearchPincode extends React.Component {
  state = {
    rows: [],
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
    this.setState({ message: "", loading: true }, () => {
      if (that.state.pincode.length != 6) {
        that.setState({
          message: `Please enter 6 digit pincode`,
          loading: false
        });
      } else {
        fetchCourierReturnPincodeServicablityApi(
          that.props.userId,
          that.state.pincode
        ).then(res => {
          if (res && res.data && res.data.data && res.data.data.length > 0) {
            that.setState({
              rows: res.data.data,
              loading: false
            });
          } else {
            that.setState({
              message: `No result found for pincode ${that.state.pincode}`,
              loading: false
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
    const { rows, pincode, message, loading } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Courier Return Pincode Servicablity
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container spacing={12}>
            <Grid item xs={12} sm={6} md={12} className={classes.control}>
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                variant="outlined"
                value={pincode}
                onChange={this.handleChange}
                onKeyDown={this.handleSearch}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12} className={classes.control}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.handleRequest}
                >
                  Search
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper> <Paper className={classes.paper}>
          {rows && (
            <div className={classes.tableWrapper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    {SerachCourierPinCodeTableHeader.map((v, k) => (
                      <TableCell key={k + v}>{v}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows && rows.length > 0 ? (
                    rows.map(v => (
                      <TableRow key={v.courier} hover>
                        <TableCell>{v.zipCode}</TableCell>
                        <TableCell>{v.courier}</TableCell>
                        <TableCell>{v.enabled ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          {v.returnSupported ? "Yes" : "No" }
                        </TableCell>
                        <TableCell>{v.returnPriority}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell />
                    </TableRow>
                  )}
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
