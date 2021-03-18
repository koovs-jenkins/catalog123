import React from "react";
import PropTypes from "prop-types";
import Pagination from "react-js-pagination";
import {
  withStyles,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TextField,
  Paper,
  Button,
  Grid,
  Typography,
  IconButton,
  Switch,
  InputBase,
  LinearProgress
} from "@material-ui/core";
import { Add, Edit, SaveAlt, Search as SearchIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  fetchAllTags,
  patchTag,
  fetchTagMaps
} from "../../../store/actions/tagging";
import { getCompleteDateMonth } from "../../../helpers/index";
import CustomTableCell from "../../../components/CustomTableCell";
import { downloadCsv } from "../../../../utils/csv";
import Notify from "../../../components/Notify";

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "10px",
    maxWidth: "100%"
  },
  root: {
    ...theme.paper
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    ...theme.tableWrapper
  },
  textField: {
    maxWidth: "60px"
  },
  left: {
    float: "left",
    textDecoration: "underline",
    cursor: "pointer"
  },
  right: {
    float: "right",
    textDecoration: "underline",
    cursor: "pointer"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  searchBox: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    border: "1px solid grey"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  paper:{
    marginTop:"10px"
  },
  iconButton: {
    padding: 10
  }
});

const rowGenerator = (
  data,
  k,
  handleStatusChange,
  handleMappingDownload,
  activePage
) => (
  <TableRow key={k.toString() + data.id} hover>
    <TableCell padding="checkbox" component="th" scope="row">
      {activePage > 1 ? (activePage - 1) * 10 + (k + 1) : k + 1}
    </TableCell>
    <TableCell align="left" padding="dense">
      <Link to={"/tagging/view/" + encodeURIComponent(data.tagName)}>
        {data.tagName}
      </Link>
    </TableCell>
    <TableCell align="left" padding="dense">
      {data.tagLable}
    </TableCell>
    <TableCell align="center" padding="dense">
      {data.tagStartDate && getCompleteDateMonth(data.tagStartDate)}
    </TableCell>
    <TableCell align="center" padding="dense">
      {data.tagEndDate && getCompleteDateMonth(data.tagEndDate)}
    </TableCell>
    <TableCell align="center" padding="dense">
      <Switch
        color="primary"
        checked={data.status === "ACTIVE" ? true : false}
        onChange={e => handleStatusChange(e, data.tagName)}
        value="checkedA"
      />
    </TableCell>
    <TableCell align="center" padding="dense">
      <div style={{ display: "flex",justifyContent:"center" }}>
        <IconButton
          color="primary"
          aria-label="Mapping"
          component={Link}
          to={"/tagging/edit/" + encodeURIComponent(data.tagName)}
        >
          <Edit />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="Download"
          component={Link}
          to="#"
          onClick={() => handleMappingDownload(data.tagName)}
        >
          <SaveAlt />
        </IconButton>
      </div>
    </TableCell>
  </TableRow>
);

class ListTagging extends React.Component {
  state = {
    rows: [],
    countPerPage: 10,
    activePage: 1,
    count: 0,
    searchInput: "",
    loading: false,
    message: ""
  };

  handleRequest = (activePage = "", search = "", status = "") => {
    const that = this;
    this.setState({ message: "", loading: true }, () =>
      search && !search.trim()
        ? this.setState({ message: "Nothing found to search", loading: false })
        : that.props
            .dispatch(
              fetchAllTags(activePage, search, status, that.state.countPerPage)
            )
            .then(() =>
              that.setState({
                rows: that.props.list.response,
                count: that.props.list.totalElement,
                message: !that.props.list.response > 0 ? "No result found" : "",
                loading: false
              })
            )
    );
  };

  componentDidMount = () => {
    this.handleRequest(1);
  };

  handlePageChange = activePage => {
    this.setState({ activePage: activePage }, () =>
      this.handleRequest(activePage, this.state.searchInput)
    );
  };

  handleStatusChange = (e, tagName) => {
    const status = e.target.checked ? "ACTIVE" : "INACTIVE";
    this.props
      .dispatch(patchTag(tagName, status, this.props.userId))
      .then(() => {
        if (this.props.response) {
          alert(this.props.response);
          window.location.reload();
        } else {
          alert("Error occured while updating.");
        }
      });
  };

  handleMappingDownload = tagName => {
    const that = this;
    this.setState();
    this.props.dispatch(fetchTagMaps(tagName)).then(() => {
      downloadCsv({
        filename: tagName + ".csv",
        data: that.props.tagging.tagMaps.response[tagName] || [],
        header: ["productId", "productLineId", "tagName" , "productName" ,"productSkuId","productStatus"]
      });
    });
  };

  handleSearch = () => {
    this.setState({ activePage: 1 }, () =>
      this.handleRequest(1, this.state.searchInput)
    );
  };

  handleChange = e => {
    const oldState = this.state.searchInput;
    if (e.key == "Enter") {
      this.handleSearch();
    } else {
      this.setState({ searchInput: e.target.value });
      e.target.value === "" &&
        oldState.length != 0 &&
        e.target.value.length === 0 &&
        this.handleRequest();
    }
  };

  render() {
    const { classes } = this.props;
    const {
      rows,
      activePage,
      countPerPage,
      count,
      searchInput,
      loading,
      message
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Grid container justify="space-between" alignItems="center" className={classes.wrapper}>
          <Grid item>
            <Typography variant="h5" gutterBottom component="h5">
              Tag List
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/tagging/create/"
            >
              Create Tag
            </Button>
          </Grid>
        </Grid>
          {loading && <LinearProgress />}
          <div className={classes.tableWrapper}>
            <Paper className={classes.paper} elevation={1}>
              <Grid container lg={12}>
                <Grid item lg={12} style={{padding:"15px"}}>
                  <TextField
                    variant="outlined"
                    label="Search Tags"
                    onChange={this.handleChange}
                    value={searchInput}
                    onKeyDown={this.handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>
            <Paper className={classes.paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" padding="dense">#</TableCell>
                  <TableCell align="left" padding="dense">
                    Tag Name
                  </TableCell>
                  <TableCell align="left" padding="dense">
                    Tag Code
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    Start Date
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    End Date
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    Status
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(rows) &&
                  rows.map((row, k) =>
                    rowGenerator(
                      row,
                      k,
                      this.handleStatusChange,
                      this.handleMappingDownload,
                      activePage
                    )
                  )}
              </TableBody>
            </Table>
            </Paper>
           
          </div>
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

ListTagging.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  list: state.tagging.data,
  response: state.tagging.response,
  tagging: state.tagging,
  userId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(ListTagging));
