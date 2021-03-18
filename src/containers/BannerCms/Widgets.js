import React, { useState, useEffect } from "react";
import UseDebounce from '../../components/UseDebounce';
import NativeSelect from '@material-ui/core/NativeSelect';
import Add from "@material-ui/icons/Add";
import {
  Grid,
  Paper,
  Table,
  Button,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  withStyles,
  Typography,
  IconButton,
  LinearProgress,
  FormControl,
  TextField,
  TableContainer,
  InputLabel,
  MenuItem,
  Select,
  Input
} from "@material-ui/core";
import Notify from "../../components/Notify";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
var dateFormat = require('dateformat');
import CustomTableCell from "../../components/CustomTableCell";
import { platformMeta } from "../../../metadata";
import { widgetListMeta, widgetTypeMeta } from "../../../metadata";
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
import { viewDateTime } from "../../helpers";
import { fetchWidgetsApi, deleteWidgetApi } from "../../api/bannercmsapi";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import ViewListIcon from '@material-ui/icons/ViewList';
import ListHeading from "../../components/ListHeading";
import { Link } from "react-router-dom";
import axios from "axios";

const styles = theme => ({
  wrapper:{marginTop:"10px"},
  paper: {
    marginTop:"10px",
    padding: theme.spacing.unit * 2,
    maxWidth: "100%"
  },
  table: { minWidth: 500, whiteSpace: "nowrap" },
  tableWrapper: { height: "auto", overflowX: "auto" },
  space: { padding: "15px" },
  flex: { display: "flex" },
  contents: { display: "contents", alignItems: "center" },
  iconHeight: { height: "48px", width: "48px", position: "relative", top: "9px", cursor: "pointer" },
  tableData: { padding: "0 5px 0 5px", fontSize: "12px" }
});

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, } = props;
  return <div>{value === index && (<span>{children}</span>)}</div>
}

const sortByMeta = [
  { label: "ACTIVE DATE", value: "startDatetime" },
  { label: "CREATED DATE", value: "createdDate" },
  { label: "MODIFIED DATE", value: "updatedDate" }
];


const Widgets = props => {
  const [state, setState] = useState({
    loading: false,
    message: "",
    action: 0,
    platform: "WEB",
    rows: [],
    count: 0,
    page: 1,
    countPerPage: 20,
    status: "ACTIVE",
    updatedBy: "",
    widgetName: "",
    widgetType: "",
    searchType: "",
    gender: "",
    sortBy: "startDatetime",
    sortOrder: "desc",
    deletePopupTitle: "Delete Widget",
    deletePopupContent: "Do you really want to delete these records? This process cannot be undone.",
    // startDatetime: "",
    // endDatetime: "",
    active: "ACTIVE"
  });
  
  const [widgetName, setWidgetName] = React.useState("");
  const [value, setValue] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [startDatetime, setStartDatetime] = React.useState("");
  const [endDatetime, setEndDatetime] = React.useState("");
  const [startDatetimeFormat, setStartDatetimeFormat] = React.useState("");
  const [endDatetimeFormat, setEndDatetimeFormat] = React.useState("");
  const debouncedKeyword = UseDebounce(keyword, 1000);
  const debouncedWidgetName = UseDebounce(widgetName, 1000);
  const debouncedStartDatetime = UseDebounce(startDatetime, 1000);
  const debouncedEndDatetime = UseDebounce(endDatetime, 1000);
  const { classes, history, emailId } = props;
  const {
    loading,
    message,
    rows,
    platform,
    status,
    page,
    count,
    countPerPage,
    updatedBy,
    widgetType,
    searchType,
    gender,
    sortBy,
    sortOrder,
    // startDatetime,
    // endDatetime,
    active
  } = state;

  useEffect(() => {  
    if (!loading) {
      if (widgetType === "" && debouncedWidgetName === "" && platform === "WEB" && sortBy === "startDatetime" && debouncedStartDatetime === "" && debouncedEndDatetime === "" && debouncedKeyword === "") {
        handleRequest();
      } else {
        // if (rows && rows.length != 0) {
        fetchWidgetData();
        // }
      }
    }
  }, [platform, status, page, updatedBy, searchType, debouncedWidgetName, widgetType, debouncedStartDatetime, debouncedEndDatetime, sortOrder, sortBy, debouncedKeyword]);


  const handleRequest = () => {
    setState({ ...state, loading: true, message: "" });
    fetchWidgetsApi(page, countPerPage, "", status, "active","").then(res =>
      res && res.status < 350
        ? setState({
          ...state,
          loading: false,
          rows: res?.data?.data,
          count: res?.data?.totalElements
        })
        : setState({
          ...state,
          loading: false,
          message: res.data.error || "Something went wrong",
          rows: []
        })
    );
  };

  const handlePageChange = value => {
    setState({ ...state, page: value });
  };
  
  const handleDateChange = e => {
    if (e.target.name == "endDatetime" && debouncedStartDatetime && new Date(debouncedStartDatetime).getTime() > new Date(e.target.value).getTime()) {
      setState({ ...state, loading: false, message: "" })
      alert("Active To Should be Greater than Active From")
      return false;
    }
    if (e.target.name == "startDatetime" && debouncedEndDatetime && debouncedEndDatetime && new Date(e.target.value).getTime() > new Date(debouncedEndDatetime).getTime()) {
      setState({ ...state, loading: false, message: "" })
      alert("Active From Should be Less than Active To")
      return false;
    }
    if (e.target.name == "startDatetime") {
      setStartDatetime(e.target.value);
      setStartDatetimeFormat(dateFormat(e.target.value, "dd/mm/yyyy"))
    }

    if (e.target.name == "endDatetime") {
      setEndDatetime(e.target.value);
      setEndDatetimeFormat(dateFormat(e.target.value, "dd/mm/yyyy"))
    }
    setState({ ...state, active: active, page: 1 });
  }

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value, active: active, page: 1 });
  };


  const handleWidgetChange = e => {
    setWidgetName(e.target.value);
  };

  const handleWidgetDelete = id => {
    // setState({ ...state, loading: true, message: "" });
    if (confirm("Are you sure want to delete this?")) {
      deleteWidgetApi(id, emailId).then(res => {
        if (res && res.status < 350) {
          setState({ ...state, loading: false, message: "" });
          alert("Widget Deleted Successfully");
          handleRequest();
        } else {
          setState({
            ...state,
            loading: false,
            message: res.data.message || "Something went wrong"
          });
        }
      });
    }
  };

  const searchWidgetData = () => {
    setState({ ...state, page: 1, countPerPage: 20 }, fetchWidgetData());
  }

  const fetchWidgetData = () => {
    setState({ ...state, loading: true, message: "", platform: state.platform });
    axios
      .get(
        `/jarvis-home-service/internal/v1/widget/list?page=${page}&pageSize=${countPerPage}${
          widgetName ? "&name=" + widgetName : ""}${keyword ? "&keyword=" + keyword : ""}${
            (widgetType == "none") ? "" : (widgetType ? "&type=" + widgetType : "")}${
            (platform ? "&platform=" + platform : "")}${startDatetime ? "&startDatetime=" + startDatetime : ""}${
            endDatetime ? "&endDatetime=" + endDatetime : ""}${
            status ? "&status=" + status : ""}${
            sortBy && sortOrder ? "&sortBy=" + sortBy : ""}${sortOrder ? "&sortOrder=" + sortOrder : ""}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-client": "web"
          }
        }
      )
      .then(res => {
        res && res.status < 350
          ? setState({
            ...state, loading: false, rows: res?.data?.data, count: res?.data?.totalElements
          })
          : setState({ ...state, loading: false, message: res.data.error || "Something went wrong" })
      })
      .catch(err => err.response);
  }


  const rowsGenerator = row => (
    <TableRow key={row.id} className={row.status == 4 ? classes.active : ""}>
       <TableCell align="center" padding="dense" >
        <Link
          title="Edit"
          style={{
            color: "inherit"
          }}
          to={"/bannercms/widgets/edit/" + row.id}
        >{row.name}</Link>
      </TableCell>
      <TableCell align="center" padding="dense" >
        {row.type}
      </TableCell>
      <TableCell align="center" padding="dense" >
        {row.version + (row.latestVersion ? " (latest)" : " (old)")}
      </TableCell>
      {/* <TableCell align="center" padding="dense">
        {
          // new Date(row.startDatetime).getTime() < new Date().getTime() &&
          //   new Date(row.endDatetime).getTime() > new Date().getTime() &&
          row.latestVersion
            ? "Active"
            : "Inactive"}
      </TableCell> */}
      <TableCell align="center" padding="dense" >
        {Object.keys(row.data).join(",")}
      </TableCell>
      <TableCell align="center" padding="dense" >
        {viewDateTime(row.createdDate)}
      </TableCell>
      <TableCell align="center" padding="dense" >
        {row.createdBy}
      </TableCell>
      <TableCell align="center" padding="dense" >
        {viewDateTime(row.updatedDate)}
      </TableCell>
      <TableCell align="center" padding="dense" >
        {row.updatedBy}
      </TableCell>
      <TableCell align="center" padding="dense" >
        {viewDateTime(row.startDatetime)}
      </TableCell>
     
    </TableRow>
  );

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const setTab = (value) => {
    setState({ ...state, status: value, page: 1 });
  }

  const clearFilterData = () => {
    setState({
      ...state,
      platform: "WEB",
      status: "ACTIVE",
      updatedBy: "",
      widgetType: "",
      searchType: "",
      sortBy: "startDatetime",
      sortOrder: "desc",
      // startDatetime: "",
      // endDatetime: ""
    });
    setWidgetName("");
    setKeyword("");
    setStartDatetime("")
    setEndDatetime("")
    setStartDatetimeFormat("");
    setEndDatetimeFormat("");
  }

  const handleUserChange = e => {
    setKeyword(e.target.value);
  };

  const dateStyle = {
    position: "absolute",
    top: 20,
    left: 0,
    bottom: 2,
    background: "white",
    fontFamily: "sans-serif",
    pointerEvents: "none",
    right: 50,
    display: "flex",
    alignItems: "center",
    height: "auto",
    zIndex: 2
  }

  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
         {message && <Notify message={message} />}
      {loading && <LinearProgress />}
        <Grid item xs={12} container justify="space-between" xs={12} sm={12} className={classes.wrapper} >
          <Typography variant="h5" gutterBottom component="h5">
            Listing Widget
          </Typography>
          <Button
            color="primary"
            title="Add Widget"
            component={Link}
            variant="contained"
            to={"/bannercms/widgets/add"}
          >
            <Add className="table_icons"/> Widget
          </Button>

        </Grid>
      </Grid>
      <Paper className={classes.paper}>
      <Grid
        container
        xs={12}
      >
          <Grid item xs={4} sm={4} className={classes.space}>
              <TextField
                variant="outlined"
                label="Editor"
                name="keyword"
                autoComplete="off"
                value={keyword}
                onChange={handleUserChange}
                fullWidth
                required
              />
          </Grid>
          <Grid item xs={4} sm={4} className={classes.space}>
              <TextField
                label="Widget Name"
                name="widgetName"
                autoComplete="off"
                value={widgetName}
                variant="outlined"
                onChange={handleWidgetChange}
                fullWidth
                required
              />
          </Grid>
          <Grid item xs={4} sm={4} className={classes.space}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">Widget Type</InputLabel>
              <Select
                label="Widget Type"
                value={widgetType}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                onChange={handleChange}
                name="widgetType"
              >
                {widgetTypeMeta.map((v, index) => (
                  <MenuItem value={v} key={index}> {v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.space}>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                helperText="Active From"
                type="date"
                name="startDatetime"
                value={startDatetime}
                onChange={handleDateChange}
                inputProps={{
                  min: "1947-01-24",
                  max: endDatetime ? endDatetime : "2050-12-29"
                }}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.space}>
            <FormControl fullWidth>
              <TextField
              variant="outlined"
                helperText="Active To"
                type="date"
                name="endDatetime"
                value={endDatetime}
                onChange={handleDateChange}
                inputProps={{
                  min: startDatetime ? startDatetime : "1947-01-24",
                  max: "2050-05-31"
                }}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.space}>
            <FormControl fullWidth variant="outlined" >
              <InputLabel id="demo-simple-select-outlined-label">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name="sortBy"
                value={sortBy}
                label="Sort By"
                onChange={handleChange}
              >
                {sortByMeta.map(v => (
                  <MenuItem key={v.value} value={v.value}>
                    {v.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} className={classes.space}>
            <Button
              color="primary"
              variant="contained"
              title="Reset Filters"
              onClick={clearFilterData}
            >
             Reset Filters
            </Button>
          </Grid>
      </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <AppBar position="sticky" color="default" style={{ boxShadow: "none" }}>	
          <Tabs value={value} onChange={handleTabChange}	
            indicatorColor="primary"	
            textColor="primary"	
            variant="fullWidth"	
            centered	
          >	
            <Tab label="Active" {...a11yProps(0)} onClick={() => setTab("ACTIVE")} />	
            <Tab label="Inactive" {...a11yProps(1)} onClick={() => setTab("INACTIVE")} />	
            <Tab label="Draft" {...a11yProps(2)} onClick={() => setTab("DRAFT")} />	
          </Tabs>	
        </AppBar>
        <div>
          <TabPanel value={value} index={0}>
            <TableContainer>
            <Table className={classes.table}  stickyHeader  aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {widgetListMeta.map(v => (
                      <TableCell align="center" key={v}>
                        {v}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows && rows.length > 0 ? (
                    rows.map(v => rowsGenerator(v))
                  ) : (
                      <TableRow hover>
                        <TableCell
                          colSpan={widgetListMeta.length}
                          align="center"
                        >
                          No Record Found
                    </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={value} index={1}>
          <TableContainer>
          <Table className={classes.table}  stickyHeader  aria-label="simple table">
              <TableHead>
                <TableRow>
                  {widgetListMeta.map(v => (
                    <CustomTableCell align="center" key={v}>
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
                      <CustomTableCell
                        colSpan={widgetListMeta.length}
                        align="center"
                      >
                        No Record Found
                  </CustomTableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>
          </TabPanel>
          <TabPanel value={value} index={2}>
          <TableContainer>
            <Table className={classes.table}  stickyHeader  aria-label="simple table">
            <TableHead>
              <TableRow>
                {widgetListMeta.map(v => (
                  <CustomTableCell align="center"  key={v}>
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
                    <CustomTableCell
                      colSpan={widgetListMeta.length}
                      align="center"
                    >
                      No Record Found
                  </CustomTableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
          </TableContainer>
          </TabPanel>
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
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(Widgets));