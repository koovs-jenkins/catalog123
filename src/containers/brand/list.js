import React from "react";
import { Link } from "react-router-dom";
import { namespace } from "../../../config";
import Add from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import { connect } from "react-redux";
import { fetchAllBrand, patchBrand } from "../../store/actions/brand";
import { withStyles } from "@material-ui/core/styles";withStyles
import LinearProgress from "@material-ui/core/LinearProgress";
import Pagination from "react-js-pagination";
import queryString from "query-string";

import {
  Avatar,
  Box,
  MenuItem ,
  InputLabel ,
  Select,
  FormControl,
  FormHelperText,
  Card,
  Checkbox,
  CardContent,
  TextField,
  Paper,
  Grid,
  InputAdornment,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';


const style = theme => ({
  paper: {
    marginTop:"10px",
    padding: theme.spacing.unit * 2,
    maxWidth: "100%"
  },
  wrapper: {
    marginTop:"20px"
  },
  textField:{
    marginRight:"10px"
  },
  header:{
    display:"flex",
    padding: "10px",
    marginBottom: "10px",
    justifyContent: "space-between"
  },
  select: {
    marginLeft:"10px",
  },
  heading:{
    fontSize:"0.75rem",
    color:"#000",
    fontWeight:"bold",
    fontFamily:"Roboto"
  }
});


class AllBrands extends React.Component {
  state = {
    searched_text: "",
    selected_filter: "",
    row_data: "",
    status: "",
    current_page: 1
  };

  componentDidMount() {
    this.get_query_params(this.props.location.search);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.location.search != this.props.location.search) {
      this.get_query_params(newProps.location.search);
    }
  }

  get_query_params(location) {
    var all_query_params = queryString.parse(location);
    this.setState(
      {
        searched_text: all_query_params.q ? all_query_params.q : "",
        selected_filter: all_query_params.filter ? all_query_params.filter : "",
        current_page: all_query_params.page ? all_query_params.page : 1
      },
      () => {
        this.get_brand_data();
      }
    );
  }

  update_url() {
    this.props.history.push(
      "/catalogue/list/brand?q=" +
        this.state.searched_text +
        "&filter=" +
        this.state.selected_filter +
        "&page=" +
        this.state.current_page
    );
  }

  get_brand_data() {
    if (
      this.state.searched_text &&
      this.state.searched_text.length > 0 &&
      !this.state.searched_text.trim()
    ) {
      alert("Nothing found to search");
    } else {
      this.props
        .dispatch(
          fetchAllBrand(
            this.state.searched_text,
            this.state.selected_filter,
            this.state.current_page
          )
        )
        .then(() =>
          this.setState({
            row_data: this.props.list ? this.props.list : ""
          })
        );
    }
  }

  handlesearch(event) {
    this.setState({ searched_text: event.target.value }, () => {
      if (this.state.searched_text.length > 2) {
        this.handlesearchapi();
      } else if (this.state.searched_text.length == 0) {
        this.handlesearchapi();
      }
    });
  }

  handlestatus(id, index, value) {
    if (
      confirm(
        "Are you sure you want to change status to " +
          (value == "INACTIVE" ? "ACTIVE" : "INACTIVE")
      )
    ) {
      var formdata = {
        status: value == "INACTIVE" ? "ACTIVE" : "INACTIVE"
      };
      var updated_data = this.state.row_data;
      updated_data.response[index].status =
        value == "INACTIVE" ? "ACTIVE" : "INACTIVE";
      this.props
        .dispatch(patchBrand(id, JSON.stringify(formdata)))
        .then(res => {
          console.log(updated_data, res, this.props.list);
          this.setState(
            {
              row_data: updated_data
            },
            () => {
              this.get_brand_data();
            }
          );
        });
    }
  }

  handlesearchapi() {
    this.setState({ current_page: 1 }, () => {
      this.update_url();
    });
  }

  handlefilter(event) {
    this.setState({ selected_filter: event.target.value }, () => {
      this.setState({ current_page: 1 }, () => {
        this.update_url();
      });
    });
  }

  go_to_add() {
    this.props.history.push("/catalogue/brand/create");
  }

  handlePageChange(pageNumber) {
    document.querySelector(".table_button").scrollIntoView(false);
    this.setState({ current_page: pageNumber }, () => {
      this.update_url();
    });
  }

  render() {
    const { classes } = this.props;
    const { row_data, searched_text, selected_filter } = this.state;
    return (
      <React.Fragment>
         {this.props.loading && (
          <LinearProgress />
          )}
        <Grid container className={classes.header} spacing={12}>  
          <Typography variant="h5" gutterBottom component="h5">
            All Brands{" "}
          </Typography>
            <div className="table_button">
              <Button
                className="table_onbutton"
                onClick={this.go_to_add.bind(this)}
                variant="contained"
                color="primary"
              >
              <Add className="table_icons"/>
               Add Brand
              </Button>
            </div>
          </Grid>
         
       <Paper className={classes.paper} elevation={3}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                    <TextField
                      label="Search By Brand Name"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={searched_text}
                      onChange={this.handlesearch.bind(this)}
                      margin="none"
                      onKeyDown={this.handleSearchChange}
                    />
                </Grid>
                <Grid item xs={4} >
                <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">All Brands</InputLabel>
                    <Select
                        variant="outlined"
                        label="All Brands"
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        onChange={this.handlefilter.bind(this)}
                        value={selected_filter}
                  > 
                           <MenuItem  value="">All Brands</MenuItem>
                          <MenuItem  value="ACTIVE">Active Brands</MenuItem>
                          <MenuItem value="INACTIVE">Inactive Brands</MenuItem>
                      </Select>
                  </FormControl>
                </Grid>
              </Grid>
        </Paper >
            <Paper className={classes.paper} elevation={3}>
            <Table>
            <TableHead >
              <TableRow >
                <TableCell className={classes.heading}>
                S.No.
                </TableCell>
                <TableCell className={classes.heading}>
                Brand Name
                </TableCell>
                <TableCell className={classes.heading}>
                  Brand Description
                </TableCell>
                <TableCell className={classes.heading}>
                  Status
                </TableCell>
                <TableCell className={classes.heading}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {row_data ? (
                <React.Fragment>
                  {!row_data.errorExists &&
                    row_data.response &&
                    row_data.response.map(function(i, index) {
                      return (
                        <TableRow
                          hover
                          key={index}
                        >
                          <TableCell>
                            {this.state.current_page > 1
                              ? (this.state.current_page - 1) * 10 + (index + 1)
                              : index + 1}
                          </TableCell>
                          <TableCell>
                            {i.brandName.length > 30
                              ? i.brandName.slice(0, 30) + "..."
                              : i.brandName}
                          </TableCell>
                          <TableCell>
                            {
                              <div
                                style={{ textAlign: "left" }}
                                dangerouslySetInnerHTML={{
                                  __html:
                                    i.description &&
                                    i.description.indexOf("{") > -1 &&
                                    "Men : " +
                                      (JSON.parse(i.description).men.length > 20
                                        ? JSON.parse(i.description).men.slice(
                                            0,
                                            30
                                          ) + "..."
                                        : JSON.parse(i.description).men) +
                                      "<br />Women : " +
                                      (JSON.parse(i.description).women.length >
                                      20
                                        ? JSON.parse(i.description).women.slice(
                                            0,
                                            30
                                          ) + "..."
                                        : JSON.parse(i.description).women)
                                }}
                              />
                            }
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            <Switch
                              onChange={this.handlestatus.bind(
                                this,
                                i.brandId,
                                index,
                                i.status
                              )}
                              color="primary"
                              checked={i.status == "ACTIVE" ? true : false}
                            />
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            <Link
                              className="edit_button"
                              to={"/catalogue/brand/edit/" + i.brandId}
                            >
                              Edit
                            </Link>{" "}
                          </TableCell>
                        </TableRow>
                      );
                    }, this)}
                  {(row_data.errorExists || row_data.response.length == 0) && (
                    <TableRow className="no_data_found" justify="center">
                      <TableCell colSpan="5" style={{ padding: "10px",textAlign:"center" }}>
                        No data avaliable.
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ) : (
                <TableRow></TableRow>
              )}
              {!row_data && (
                <TableRow className="no_data_found">
                  <TableCell colSpan="5" style={{ padding: "10px",textAlign:"center" }}>
                    No data avaliable.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </Paper>
          {this.state.row_data.totalElement > 0 && (
              <div className="pagination_container">
                <Pagination
                  activePage={this.state.current_page}
                  itemsCountPerPage={10}
                  totalItemsCount={this.state.row_data.totalElement}
                  pageRangeDisplayed={5}
                  onChange={this.handlePageChange.bind(this)}
                />
              </div>
            )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  list: state.brand.data.data,
  loading: state.brand.loading,
  error: state.brand.error
});

export default withStyles(style)(connect(mapStateToProps)(AllBrands));
