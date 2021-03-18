import React, { useState, useEffect } from "react";
import UseDebounce from '../../components/UseDebounce';
import Pagination from "react-js-pagination";
import "react-datepicker/dist/react-datepicker.css"
import Add from "@material-ui/icons/Add";
import {
  Grid,
  InputLabel,
  Select,  
  Paper,
  Table,
  TableContainer,
  Button,
  MenuItem,
  TableRow,
  TableHead,
  TextField,
  TableBody,
  TableCell,
  withStyles,
  Typography,
  FormControl,
  LinearProgress,
  IconButton
} from "@material-ui/core";
import Notify from "../../components/Notify";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
var dateFormat = require('dateformat');
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ClearIcon from '@material-ui/icons/Clear';
import ViewListIcon from '@material-ui/icons/ViewList';
import ListHeading from "../../components/ListHeading";
import CustomTableCell from "../../components/CustomTableCell";
import {
  templateMeta,
  templateActionMeta,
  platformMeta,
  sortByMeta,
  sortOrderMeta
} from "../../../metadata";
import { connect } from "react-redux";
import { viewDateTime } from "../../helpers";
import {
  sendEmailApi,
  putTemplateApi,
  fetchTemplatesApi,
  deleteTemplateApi
} from "../../api/bannercmsapi";
import {
  IOS_DEEP_LINK,
  APP_MAIL_LINK,
  FROM_EMAIL,
  WEB_MAIL_LINK,
  ALLOWED_EMAIL_DOMAINS
} from "../../../config";
import {
  getLocalStorage,
  removeLocalStorage
} from "../../helpers/localstorage";
import { Link } from "react-router-dom";


const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    ...theme.paper,padding:"10px",marginTop:"10px"
  },

  table: { minWidth: 500, whiteSpace: "nowrap" },
  // tableWrapper: theme.tableWrapper,
  tableWrapper: { height: "auto", overflowX: "auto" },
  space: { padding:"15px" },
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

const Templates = props => {
  const [state, setState] = useState({
    loading: false,
    message: "",
    action: {},
    platform: "WEB",
    rows: [],
    page: 1,
    status: "ACTIVE",
    emailId: "",
    updatedBy: "",
    gender: "",
    pageSize: 20,
    sortBy: "activeFrom",
    sortOrder: "desc",
    // startActiveFrom: "",
    // endActiveFrom: "",
    totalElements: 0
  });
  const [value, setValue] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [startActiveFrom, setStartActiveFrom] = React.useState("");
  const [endActiveFrom, setEndActiveFrom] = React.useState("");
  const [startActiveFromFormat, setStartActiveFromFormat] = React.useState("");
  const [endActiveFromFormat, setEndActiveFromFormat] = React.useState("");
  const debouncedSearchTerm = UseDebounce(keyword, 1000);
  const debouncedStartActiveFrom = UseDebounce(startActiveFrom, 1000);
  const debouncedEndActiveFrom = UseDebounce(endActiveFrom, 1000);
  const { classes, emailId, history } = props;
  const {
    action,
    loading,
    message,
    rows,
    platform,
    page,
    gender,
    pageSize,
    sortBy,
    sortOrder,
    status,
    // startActiveFrom,
    // endActiveFrom,
    totalElements
  } = state;

  useEffect(() => {
    getLocalStorage("oldData") && removeLocalStorage("oldData");
    if (!loading) {
      handleRequest()
    }  
  
  }, [platform, gender, page, pageSize, sortBy, sortOrder, status, debouncedSearchTerm, debouncedStartActiveFrom, debouncedEndActiveFrom]);

  const handleRequest = (text = "") => {
    setState({ ...state, loading: true, message: "" });
    fetchTemplatesApi(gender, page, platform, pageSize, sortBy, sortOrder, status, debouncedSearchTerm, debouncedStartActiveFrom, debouncedEndActiveFrom).then(
      res =>
        res && res.status < 350 && res.data.data
          ? setState({
            ...state,
            loading: false,
            rows: res.data.data,
            message: text ? text : "",
            totalElements: res.data.totalElements
          })
          : setState({
            ...state,
            loading: false,
            rows: [],
            message: res?.data?.message || "Something went wrong",
            totalElements: 0
          })
    );
  };

  const handlePageChange = value => {
    setState({ ...state, page: value });
  };

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value, page: 1 });
  };

  const handleDateChange = e => {
    if (e.target.name == "endActiveFrom" && startActiveFrom && new Date(startActiveFrom).getTime() > new Date(e.target.value).getTime()) {
      setState({ ...state, loading: false, message: "" })
      alert("Active To Should be Greater than Active From")
      return false;
    }

    if (e.target.name == "startActiveFrom" && endActiveFrom && endActiveFrom && new Date(e.target.value).getTime() > new Date(endActiveFrom).getTime()) {
      setState({ ...state, loading: false, message: "" })
      alert("Active From Should be Less than Active To")
      return false;
    }

    if (e.target.name == "startActiveFrom") {
      setStartActiveFrom(e.target.value);
      setStartActiveFromFormat(dateFormat(e.target.value, "dd/mm/yyyy"))
    }

    if (e.target.name == "endActiveFrom") {
      setEndActiveFrom(e.target.value);
      setEndActiveFromFormat(dateFormat(e.target.value, "dd/mm/yyyy"))
    }
    setState({ ...state, page: 1 });
  };

  const handleUserChange = e => {
    setKeyword(e.target.value);
  };

  const fallBackError = (message = true) =>
    setState({
      ...state,
      loading: false,
      message: message ? "Cannot not perform delete in this status." : ""
    });

  const handleSendEmail = (row, name) => {
    const email = prompt("Please enter your email", emailId);
    const message = [
      `Please click on URL to get Preview on respective platforms.<br />`
    ];

    if (ALLOWED_EMAIL_DOMAINS.test(email)) {
      row[name].map(v => {
        switch (v.platform) {
          case "ANDROID":
            message.push(`For Android please click below mentioned URL.
          <a href="${APP_MAIL_LINK}/cms/preview/?id=${v.id}">Android PATH</a><br />`);
            break;
          case "IOS":
            message.push(`<a href="${IOS_DEEP_LINK}://previewWidgets/href=${APP_MAIL_LINK}/jarvis-home-service/internal/v1/home/template/preview/${v.id}">
      		    IOS Link</a>:<a href="${IOS_DEEP_LINK}://previewWidgets/href=${APP_MAIL_LINK}/jarvis-home-service/internal/v1/home/template/preview/${v.id}">
      		${IOS_DEEP_LINK}://previewWidgets/href=${APP_MAIL_LINK}/jarvis-home-service/internal/v1/home/template/preview/${v.id}
      	    </a><br />`);
            break;
          case "WEB":
            message.push(
              `For WEB please click below mentioned URL.<a href="${WEB_MAIL_LINK}/cms/preview/?id=${v.id}">WEB</a><br />`
            );
            break;
          case "MSITE":
            message.push(
              `For MSITE please click below mentioned URL.<a href="${WEB_MAIL_LINK}/cms/preview/?id=${v.id}">MSITE</a><br />`
            );
            break;
          default:
            break;
        }
      });

      let requestData = {
        email: {
          from: FROM_EMAIL,
          to: [email],
          html: true,
          message: message.join(""),
          subject: "Preview Template"
        }
      };
      sendEmailApi(requestData).then(res =>
        res && res.status && res.data
          ? setState({
            ...state,
            loading: false,
            message: res.data.message
          })
          : setState({
            ...state,
            loading: false,
            message: "Error in mail sending"
          })
      );
    } else {
      fallBackError(false);
    }
  };

  const handleActions = (e, row, name) => {
    setState({
      ...state,
      loading: true,
      message: "",
      action: {
        ...state.action,
        [name]: e.target.value
      }
    });
    switch (e.target.value) {
      case 1:
        history.push("/bannercms/templates/edit/" + name);
        break;
      case 2:
        row[name].map(v => {
          ["PENDING_REVIEW", "PENDING"].includes(v.status)
            ? deleteTemplateApi(v.id, { lastUpdatedBy: emailId }).then(res => {
              if (res && res.status < 350) {
                handleRequest(`Successfully deleted ${v.id}`);
              } else {
                setState({
                  ...state,
                  loading: false,
                  message: `Error in deleting ${v.id}`
                });
              }
            })
            : fallBackError();
        });
        break;
      case 3:
        handleSendEmail(row, name);
        break;
      case 4:
        handleApprove(row, name).then(res =>
          handleRequest("Pending for activation")
        );
        break;
      default:
        fallBackError(false);
    }
  };

  const handleApprove = async (row, name) => {
    const result = [];
    await row[name].map(v => {
      ["PENDING_REVIEW", "PENDING"].includes(v.status)
        ? putTemplateApi(v.id, { lastUpdatedBy: emailId }).then(res => {
          if (res && res.status < 350) {
            result.push(v.id);
          } else {
            setState({
              ...state,
              loading: false,
              message: `Error in activation ${v.id}`
            });
          }
        })
        : fallBackError();
    });
    return result;
  };

  const rowsGenerator = rowsData => {
    let result = [];
    for (let templateName in rowsData) {
      let gender = [...new Set(rowsData[templateName].map(item => item.gender))];
      let activeTo = [...new Set(rowsData[templateName].map(item => item.activeTo))];
      result.push(
        <TableRow
          key={templateName}
          className={rowsData.status == 4 ? classes.active : ""}
        >
            <TableCell align="center" padding="dense">
            <Link
              style={{
                color: "inherit"
              }}
              to={"/bannercms/templates/edit/" + templateName + "/" + rowsData[templateName][0].version}
            >{templateName}</Link>
          </TableCell>
          <TableCell align="center" padding="dense">
            {(gender.indexOf("UNISEX") > -1 && activeTo.indexOf(null) > -1) ? "CUSTOM" : [
              ...new Set(rowsData[templateName].map(item => item.gender))
            ]}
          </TableCell>
          <TableCell align="center" padding="dense">
            {[
              ...new Set(rowsData[templateName].map(item => item.platform))
            ].join(", ")}
          </TableCell>
           {/* <TableCell align="center" padding="dense">
            {rowsData[templateName].map(item => {
              if (item.status == status) {
                return item.status
              }
            }).filter((value, index, self) => {
              return self.indexOf(value) == index;
            })}

          </TableCell> */}
          <TableCell align="center" padding="dense">
            {rowsData[templateName][0].version}
          </TableCell>
          <TableCell align="center" padding="dense">
            {viewDateTime(rowsData[templateName][0].createdAt)}
          </TableCell>
          <TableCell align="center" padding="dense">
            {rowsData[templateName][0].createdBy}
          </TableCell>
          <TableCell align="center" padding="dense">
            {viewDateTime(rowsData[templateName][0].updatedAt)}
          </TableCell>
          <TableCell align="center" padding="dense">
            {rowsData[templateName][0].lastUpdatedBy}
          </TableCell>
          <TableCell align="center" padding="dense">
            {viewDateTime(rowsData[templateName][0].activeFrom)}
          </TableCell>
        </TableRow>
      );
    }
    return result;
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const setTab = (value) => {
    setState({ ...state, status: value, page: 1, pageSize: 20 });
  }

  const clearFilterData = () => {
    setState({
      ...state,
      platform: "WEB",
      emailId: "",
      updatedBy: "",
      gender: "",
      sortBy: "activeFrom",
      sortOrder: "desc",
      // startActiveFrom: "",
      // endActiveFrom: ""
    });
    setKeyword("");
    setStartActiveFrom("");
    setEndActiveFrom("");
    setStartActiveFromFormat("");
    setEndActiveFromFormat("");
  }

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
      >
        <Grid container justify="space-between" item xs={12} sm={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Listing Template
          </Typography>
          <Button
          color="primary"
          variant="contained"
          title="Create Template"
          component={Link}
          to={"/bannercms/templates/add"}>
           <Add className="table_icons"/> Template
          </Button>
        </Grid>
      </Grid>
      <Paper className={classes.paper}>
        <Grid item xs={12} sm={12} container>
          <Grid item xs={12} sm={4} className={classes.space}>
              <TextField
                variant="outlined"
                label="Editor"
                name="keyword"
                value={keyword}
                onChange={handleUserChange}
                fullWidth
                required
              />
          </Grid>
          <Grid item xs={12} sm={4} className={classes.space}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="demo-simple-select-outlined-label">Platform</InputLabel>
            <Select
                label="Platform"
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name="platform"
                value={platform}
                label="Platform"
                onChange={handleChange}
              >
                {platformMeta.map(v => (
                  <MenuItem key={v.value} value={v.value}>
                    {v.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.space}>
          <FormControl variant="outlined" fullWidth>
          <InputLabel id="demo-simple-select-outlined-label-pagetype">Page Type</InputLabel>
            <Select
                label="Page Type"
                labelId="demo-simple-select-outlined-label-pagetype"
                id="demo-simple-select-outlined"
                name="gender"
                value={gender}
                label="Page Type"
                onChange={handleChange}
            >
               {["UNISEX", "MEN", "WOMEN"].map(v => (
                  <MenuItem key={v} value={v}>
                    {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.space}>
              <TextField
                helperText="Active From"
                type="date"
                name="startActiveFrom"
                value={startActiveFrom}
                onChange={handleDateChange}
                variant="outlined"
                inputProps={{
                  min: "1947-01-24",
                  max: endActiveFrom ? endActiveFrom : "2050-05-31"
                }}
                fullWidth
              />
          </Grid>
          <Grid item xs={12} sm={4} className={classes.space}>
            <TextField
              helperText="Active To"
              type="date"
              name="endActiveFrom"
              value={endActiveFrom}
              onChange={handleDateChange}
              inputProps={{
                min: startActiveFrom ? startActiveFrom : "1947-01-24",
                max: "2050-05-31"
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4} className={classes.space}>              
              <FormControl variant="outlined" fullWidth className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Sort By</InputLabel>
            <Select
              select
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
              title="Reset Filters"
              variant="contained"
              onClick={clearFilterData}>
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {message && <Notify message={message} />}
      {loading && <LinearProgress />}
      <Paper className={classes.paper}>
      <AppBar position="sticky" color="default" style={{ boxShadow: "none" }}>
          <Tabs value={value} onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            centered
          >
            <Tab label="Published " {...a11yProps(0)} onClick={() => setTab("ACTIVE")} />
            <Tab label="Inactive " {...a11yProps(1)} onClick={() => setTab("INACTIVE")} />
            <Tab label="Pending " {...a11yProps(2)} onClick={() => setTab("PENDING")} />
            <Tab label="Submit for Review" {...a11yProps(3)} onClick={() => setTab("PENDING_REVIEW")} />
            <Tab label="Draft" {...a11yProps(4)} onClick={() => setTab("DRAFT")} />
          </Tabs>
        </AppBar>
        <div className={classes.tableWrapper}>
        <div>
            <TabPanel value={value} index={0}>
              <TableContainer>
                <Table className={classes.table}  stickyHeader  aria-label="simple table" >
              <TableHead>
                <TableRow>
                  {templateMeta.map(v => (
                    <CustomTableCell align="center" key={v}>
                      {v}
                    </CustomTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
              {totalElements ? (
                  rowsGenerator(rows)
                ) : (
                    <TableRow hover>
                      <TableCell
                        colSpan={templateMeta.length}
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
                    {templateMeta.map(v => (
                      <TableCell align="center" key={v}>
                        {v}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalElements ? (
                    rowsGenerator(rows)
                  ) : (
                      <TableRow hover>
                        <TableCell
                          colSpan={templateMeta.length}
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
            <TabPanel value={value} index={2}>
            <TableContainer>
              <Table className={classes.table}  stickyHeader  aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {templateMeta.map(v => (
                      <TableCell align="center" key={v}>
                        {v}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalElements ? (
                    rowsGenerator(rows)
                  ) : (
                      <TableRow hover>
                        <TableCell
                          colSpan={templateMeta.length}
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
            <TabPanel value={value} index={3}>
            <TableContainer>
              <Table className={classes.table}  stickyHeader  aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {templateMeta.map(v => (
                      <TableCell align="center" key={v}>
                        {v}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalElements ? (
                    rowsGenerator(rows)
                  ) : (
                      <TableRow hover>
                        <TableCell
                          colSpan={templateMeta.length}
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
            <TabPanel value={value} index={4}>
            <TableContainer>
              <Table className={classes.table}  stickyHeader  aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {templateMeta.map(v => (
                      <TableCell align="center" key={v}>
                        {v}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalElements ? (
                    rowsGenerator(rows)
                  ) : (
                      <TableRow hover>
                        <TableCell
                          colSpan={templateMeta.length}
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
          </div>
        </div>
      </Paper>
      <Pagination
        activePage={page}
        itemsCountPerPage={pageSize}
        totalItemsCount={totalElements}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
    </React.Fragment >      
  );
};

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(Templates));