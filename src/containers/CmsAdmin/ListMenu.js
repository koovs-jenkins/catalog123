import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TextField,
  withStyles,
  Typography,
  LinearProgress,
  Grid,
  TableContainer
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Notify from "../../components/Notify";
import CustomTableCell from "../../components/CustomTableCell";
import {
  fetchAllHeaderTemplateApi,
  updateTemplateStatusApi
} from "../../api/headermenu";
import {
  headerListMeta,
  listHeaderActionMeta,
  platformMeta,
  headerStatusMeta
} from "../../../metadata";
import { viewDateTime, getSelectedItem } from "../../helpers";
import { connect } from "react-redux";
import Pagination from "react-js-pagination";

const styles = theme => ({
  control:{
    padding:"10px"
  },
  paper: {
    ...theme.paper,padding:"10px",marginTop:"10px"
  },
  table: { minWidth: 500 },
  tableWrapper: {...theme.tableWrapper,marginTop:"30px"},
  active: { backgroundColor: "#999" },
  space: { margin: theme.spacing.unit },
  flex: { display: "flex" }
});

const ListMenu = props => {
  const [state, setState] = useState({
    loading: false,
    message: "",
    action: 0,
    platform: "WEB",
    rows: [],
    count: 0,
    page: 1,
    countPerPage: 10,
    status: "",
    emailId: "",
    updatedBy: ""
  });
  const { classes, userId, email } = props;
  const {
    loading,
    message,
    rows,
    action,
    platform,
    status,
    page,
    count,
    countPerPage,
    updatedBy,
    emailId
  } = state;

  useEffect(() => {
    handleRequest();
  }, [platform, status, page, updatedBy]);

  const handleRequest = () => {
    setState({ ...state, loading: true, message: "" });
    fetchAllHeaderTemplateApi(
      platform,
      status,
      updatedBy,
      countPerPage,
      page
    ).then(res => {
      res &&
      res.status < 350 &&
      res.data &&
      res.data.data &&
      !res.data.errorExists
        ? setState({
            ...state,
            rows: res.data.data.content,
            count: res.data.data.totalElements,
            loading: false
          })
        : setState({
            ...state,
            loading: false,
            message:
              (res && res.data && res.data.displayMessage) ||
              "Something went wrong"
          });
    });
  };

  const handleChange = (e, id) => {
    setState({ ...state, [e.target.name]: e.target.value });
    if (e.target.name === "action") {
      handleSwitchAction(e.target.value, id);
    }
  };

  const handleStatusChange = (id, status) => {
    setState({ ...state, loading: true, message: "" });
    updateTemplateStatusApi(id, { status }, userId, email).then(res => {
      if (res && res.status < 350 && res.data && !res.data.errorExists) {
        setState({
          ...state,
          loading: false
        });
        alert(res.data.displayMessage);
        handleRequest();
      } else {
        setState({
          ...state,
          loading: false,
          message:
            (res && res.data && res.data.displayMessage) ||
            "Something went wrong"
        });
      }
    });
  };

  const handleSwitchAction = (value, id) => {
    switch (value) {
      case 1:
        props.history.push("/headermenu/copy-menu/" + id);
        break;
      case 2:
        props.history.push("/headermenu/edit-menu/" + id);
        break;
      case 3:
        handleStatusChange(id, 0);
        break;
      case 4:
        handleStatusChange(id, 1);
        break;
    }
  };

  const handleFilter = e => {
    setState({ ...state, [e.target.name]: e.target.value, page: 1 });
    if (e.key == "Enter") {
      setState({
        ...state,
        updatedBy: e.target.value,
        page: 1,
        message: "",
        loading: false
      });
    }
  };

  const handlePageChange = value => {
    setState({ ...state, page: value });
  };

  const rowsGenerator = row => (
    <TableRow key={row.id} className={row.status == 4 ? classes.active : ""}>
      <TableCell align="center" padding="dense">
        {row.id}
      </TableCell>
      <TableCell align="center" padding="dense">
        {row.platform}
      </TableCell>
      <TableCell align="center" padding="dense">
        {getSelectedItem(headerStatusMeta, row.status)}
      </TableCell>
      <TableCell align="center" padding="dense">
        {row.activeFrom && viewDateTime(row.activeFrom)}
      </TableCell>
      <TableCell align="center" padding="dense">
        {row.createdAt && viewDateTime(row.createdAt)}
      </TableCell>
      <TableCell align="center" padding="dense">
        {row.updatedAt && viewDateTime(row.updatedAt)}
      </TableCell>
      <TableCell align="center" padding="dense">
        {row.createdBy}
      </TableCell>
      <TableCell align="center" padding="dense">
        {row.updatedBy}
      </TableCell>
      <TableCell align="center" padding="dense">
        <TextField
          select
          name="action"
          value={action}
          onChange={e => handleChange(e, row.id)}
          fullWidth
        >
          {listHeaderActionMeta.map((v, k) => (
            <MenuItem key={v} value={k}>
              {v}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>
    </TableRow>
  );

  return (
    <React.Fragment>
       {message && <Notify message={message} />}
        {loading && <LinearProgress />}
      <Grid container className={classes.wrapper}>
        <Grid item xs={6}>
          <Typography variant="h5" gutterBottom component="h5">
            List Header Menu
          </Typography>
        </Grid>
      </Grid>
      <Paper className={classes.paper}>
      <Grid container justify="flex-start" alignItems="center">
        <Grid item xs={4} className={classes.control}>
          <TextField
            label="Updated By"
            name="emailId"
            onChange={handleFilter}
            value={emailId}
            onKeyDown={handleFilter}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}  className={classes.control}>
          <FormControl fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
              <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="status"
                  value={status}
                  label="Status"
                  onChange={handleFilter}
                  variant="outlined"
                  label="Status"
                  fullWidth
                >
                  <MenuItem value="">All</MenuItem>
                  {headerStatusMeta.map(v => (
                  <MenuItem key={v.value} value={v.value}>
                    {v.label}
                  </MenuItem>
                ))}
              </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}  className={classes.control}>
          <FormControl fullWidth variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Platform</InputLabel>
            <Select
              name="platform"
              value={platform}
              label="Platform"
              onChange={handleFilter}
              fullWidth
              variant="outlined"
            >
              {platformMeta.map(v => (
                <MenuItem key={v.value} value={v.value}>
                  {v.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      </Paper>
     <Paper className={classes.paper}>
     <div className={classes.tableWrapper}>
       <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {headerListMeta.map(v => (
                  <CustomTableCell align="center" padding="dense" key={v}>
                    {v}
                  </CustomTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.length > 0 ? (
                rows.map(v => rowsGenerator(v))
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={headerListMeta.length}
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
     </Paper>
     <Pagination
          activePage={page}
          itemsCountPerPage={countPerPage}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(ListMenu));