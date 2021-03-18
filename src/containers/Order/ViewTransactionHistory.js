import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  LinearProgress
} from "@material-ui/core";
import { connect } from "react-redux";
import { transactionHistoryMeta, statusMeta } from "../../../metadata";
import { fetchTransactionHistoryApi } from "../../api/order";
import { objectToString } from "../../helpers";
import CustomTableCell from "../../components/CustomTableCell";
import Notify from "../../components/Notify";

const style = theme => ({
  paper: {
    ...theme.paper
  },
  tableWrapper: {
    ...theme.tableWrapper
  }
});

class ViewTransactionHistory extends React.Component {
  state = {
    rows: [],
    loading: false,
    message: ""
  };

  componentDidMount = () => {
    const { entityid_ref, txnId } = this.props.match.params;
    const that = this;
    that.setState({ loading: true, message: "" }, () =>
      fetchTransactionHistoryApi(entityid_ref, txnId).then(res =>
        res && res.status < 350
          ? that.setState({ rows: res.data.data, loading: false })
          : that.setState({
              message: "Error in fetching history",
              loading: false
            })
      )
    );
  };

  render() {
    const { classes } = this.props;
    const { rows, message, loading } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Typography variant="h5" gutterBottom component="h5" style={{marginTop:"10px"}}>
          Transaction History
        </Typography>
        <Paper className={classes.paper}>
          {loading && <LinearProgress />}
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {transactionHistoryMeta.map((v, k) => (
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
                          {row.date}
                        </TableCell>
                        <TableCell align="center" padding="dense">
                          {row.log}
                        </TableCell>
                        <TableCell align="center" padding="dense">
                          {row.updatedBy}
                        </TableCell>
                        <TableCell align="left" padding="dense">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: objectToString(row.oldValue, statusMeta)
                            }}
                          />
                        </TableCell>
                        <TableCell align="left" padding="dense">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: objectToString(row.newValue, statusMeta)
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow hover>
                    <TableCell
                      colSpan={transactionHistoryMeta.length}
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
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  history: state.order.history,
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(
  connect(mapStateToProps)(ViewTransactionHistory)
);