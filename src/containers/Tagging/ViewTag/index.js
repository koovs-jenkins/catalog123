import React from "react";
import Pagination from "react-js-pagination";
import { connect } from "react-redux";
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper
} from "@material-ui/core";
import CustomTableCell from "../../../components/CustomTableCell";
import { fetchTagMaps } from "../../../store/actions/tagging";
import BackButton from "../../../components/BackButton";

const styles = theme => ({
  paper: { ...theme.paper },
  table: {
    minWidth: 500,
    marginTop: theme.spacing.unit * 2
  },
  tableWrapper: {
    ...theme.tableWrapper
  }
});

class ViewTag extends React.Component {
  state = {
    rows: [],
    activePage: 1,
    countPerPage: 10,
    count: 0
  };

  handleRequest = activePage => {
    const that = this;
    this.props
      .dispatch(
        fetchTagMaps(
          that.props.match.params.tagname,
          "",
          activePage,
          this.state.countPerPage
        )
      )
      .then(() => {
        that.setState({
          rows:
            that.props.tagging.tagMaps.totalElement > 0
              ? that.props.tagging.tagMaps.response[
                  decodeURIComponent(that.props.match.params.tagname)
                ]
              : [],
          count: that.props.tagging.tagMaps.totalElement
        });
      });
  };

  UNSAFE_componentWillMount = () => {
    this.handleRequest(this.state.activePage);
  };

  handlePageChange = activePage => {
    this.setState({ activePage: activePage }, () =>
      this.handleRequest(activePage)
    );
  };

  render() {
    const { rows, activePage, countPerPage, count } = this.state;
    const { classes, match, history } = this.props;

    return (
      <React.Fragment>
        <BackButton
          text={"Tag mapping for id " + match.params.tagname}
          history={history}
        />
        <Paper className={classes.paper}>
          <div>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">#</TableCell>
                  <TableCell padding="dense">Product Id</TableCell>
                  <TableCell padding="dense">SKU Id</TableCell>
                  <TableCell padding="dense">Line Id</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows && rows.length > 0 &&
                  rows.map((v, k) => (
                    <TableRow key={k} hover>
                      <TableCell padding="checkbox" component="th" scope="row">
                        {activePage > 1 ? (activePage - 1) * 10 + (k + 1) : k + 1}
                      </TableCell>
                      <TableCell padding="dense" component="th" scope="row">
                        {v.productId}
                      </TableCell>
                      <TableCell padding="dense" component="th" scope="row">
                        {v.productSkuId}
                      </TableCell>
                      <TableCell padding="dense" component="th" scope="row">
                        {v.productLineId}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </Paper>
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
  userId: state.signin.data.body.data.user.email,
  tagging: state.tagging
});

export default withStyles(styles)(connect(mapStateToProps)(ViewTag));
