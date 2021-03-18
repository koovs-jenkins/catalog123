import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Typography,
  Fab,
  Table,
  TableBody,
  Button,
  TableHead,
  TableCell,
  TableRow,
  TextField,
  LinearProgress
} from "@material-ui/core";
import Pagination from "react-js-pagination";
import { productLogsHeader } from "../../../metadata";
import CustomTableCell from "../../components/CustomTableCell";

import Notify from "../../components/Notify";
import { fetchProductLogsApi } from "../../api/audit";
import { compareToObject } from "../../helpers/compare";
import { isEmpty, viewDateTime } from "../../helpers";
import Divider from "@material-ui/core/Divider";

const uuidv1 = require("uuid/v1");

const style = theme => ({
  paper: {
    ...theme.paper,padding:"10px",marginTop:"10px"
  },
  fab: { margin: theme.spacing.unit },
  heading: { margin: theme.spacing.unit * 4 },
  table: { minWidth: 500 },
  tableWrapper: {
    ...theme.tableWrapper,
    marginTop:"30px"
  },
  wrapper:{
    marginTop:"10px"
  },
  fullWidth: {
    minWidth: "300px",
    overflowWrap: "break-word",
    padding: "0px 16px"
  },
  datepick:{
    display:"flex",
    justifyContent:"flex-end",
    marginTop:"5px",
  },
  buttnWrap:{
    display:"flex",
    justifyContent:"flex-end",
    "& button" :{
      marginLeft:"10px",
    },
  },
  
});

class Product extends React.Component {
  initialState = {
    productId: "",
    count: 0,
    loading: false,
    message: "",
    rows: []
  };

  state = {
    activePage: 1,
    countPerPage: 10,
    ...this.initialState
  };

  handleProductFetch = activePage => {
    const that = this;
    const pageNumber = activePage ? activePage : this.state.activePage;
    const { productId, countPerPage } = this.state;
    that.setState({ message: "", loading: true }, () => {
      if (productId && productId.trim()) {
        fetchProductLogsApi(
          productId,
          countPerPage,
          pageNumber,
          that.props.userId
        ).then(res =>
          res && res.status < 350 && res.data && res.data.auditLogList
            ? that.setState({
                rows: res.data.auditLogList || [],
                count: res.data.totalElements || 0,
                loading: false,
                message: res.data.message || ""
              })
            : that.setState({
                message:
                  (res && res.data && res.data.message) || "No data found",
                loading: false
              })
        );
      } else {
        that.setState({ message: "Provide valid product id", loading: false });
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
    this.setState({ activePage: 1 }, () => this.handleProductFetch(null));
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber }, () =>
      this.handleProductFetch(pageNumber)
    );
  };

  render() {
    const { classes } = this.props;
    const {
      productId,
      rows,
      activePage,
      countPerPage,
      count,
      loading,
      message
    } = this.state;

    const objectIterator = (obj, result, depth, keyLabel, heading) => {
      const data = [];
      if (keyLabel && heading) {
        result.push(
          <ul key={uuidv1()}>
            <span style={{ marginLeft: 5 * depth + "px", fontWeight: "bold" }}>
              {keyLabel}
            </span>
            {parseNode(obj, data, depth, result, heading)}
          </ul>
        );
      } else {
        result.push(
          <ul key={uuidv1()}>{parseNode(obj, data, depth, result, heading)}</ul>
        );
      }
    };

    const parseNode = (obj, data, depth, result, heading) => {
      if (!Array.isArray(obj)) {
        for (let i in obj) {
          typeof obj[i] == "object" && !isEmpty(obj[i])
            ? objectIterator(obj[i], result, depth + 1, i, heading)
            : data.push(
                <li style={{ marginLeft: 10 * depth + "px" }} key={uuidv1()}>
                  {i} :{" "}
                  {Date.parse(obj[i]) && obj[i].length > 25
                    ? viewDateTime(obj[i])
                    : obj[i]}
                </li>
              );
        }
      }
      return data;
    };

    const parseList = (obj, heading) => {
      const result = [];
      let depth = 0;
      objectIterator(obj, result, depth, null, heading);
      return result.reverse();
    };

    return (
      <React.Fragment>
          {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid xs={12} lg={12} className={classes.wrapper}>
          <Typography variant="h6" gutterBottom component="h6">
            Product Audit Logs
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
        <Grid className={classes.wrapper} container spacing={24} alignItems="center">
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                label="Product Id"
                type="number"
                name="productId"
                className={classes.textField}
                variant="outlined"
                fullWidth
                onChange={this.handleSearchChange}
                margin="none"
                value={productId}
                onKeyDown={this.handleSearchChange}
              />
            </Grid>
        </Grid>
        <Grid container className={classes.wrapper} spacing={24}>
          <Grid className={classes.buttnWrap} item xs={12} sm={12} md={12} alignItems="right"  alignContent="flex-end">
              <Button variant="contained" color="primary"  onClick={this.handleClear}>Clear</Button>
              <Button variant="contained" color="primary" onClick={this.handleSubmit}>Search</Button>
          </Grid>
        </Grid>
        </Paper>
        <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {productLogsHeader.map((v, k) => (
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
                      <TableCell
                        align="center"
                        padding="checkbox"
                      >
                        {row.typeId}
                      </TableCell>
                      <TableCell
                        align="center"
                        padding="checkbox"
                      >
                        {row.auditLogMessage}
                      </TableCell>
                      <TableCell
                        align="center"
                        padding="checkbox"
                      >
                        {viewDateTime(row.updatedAt)}
                      </TableCell>
                      <TableCell
                        align="center"
                        padding="checkbox"
                      >
                        {row.updatedBy}
                      </TableCell>
                      {row.changeList.newValue && row.changeList.oldValue ? (
                        <React.Fragment>
                          <TableCell className={classes.fullWidth}>
                            {parseList(
                              compareToObject(
                                row.changeList.oldValue,
                                row.changeList.newValue
                              ) || {}
                            )}
                          </TableCell>
                          <TableCell className={classes.fullWidth}>
                            {parseList(
                              compareToObject(
                                row.changeList.oldValue,
                                row.changeList.newValue,
                                "new"
                              ) || {}
                            )}
                          </TableCell>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <TableCell
                            padding="checkbox"
                            className={classes.fullWidth}
                          />
                          <TableCell className={classes.fullWidth}>
                            {parseList(
                              compareToObject(
                                {},
                                row.changeList.newValue,
                                "new"
                              )
                            )}
                          </TableCell>
                        </React.Fragment>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={productLogsHeader.length}
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

export default withStyles(style)(Product);
