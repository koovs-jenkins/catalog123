import $ from "jquery";
import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import Add from "@material-ui/icons/Add";
import { connect } from "react-redux";
import {
  fetchAllProduct,
  patchProduct,
  batchValidate
} from "../../store/actions/product";
import LinearProgress from "@material-ui/core/LinearProgress";
import Pagination from "react-js-pagination";
import ImgUrl from "../../../config.js";
import axios from "axios";
import Modal from "../../components/Modal";
import DatePicker from "react-datepicker";
var dateFormat = require("dateformat");
import { fetchMetadata } from "../../store/actions/product";
import { postBatchUpdateApi, fetchFilteredProductsApi } from "../../api/productapi";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Filters from './filters';
import Notify from "../../components/Notify";
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
  Grid,
  InputAdornment,
  SvgIcon,
  Table,
  Paper,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';


const styles = (theme) => ({
  paper: {
    marginTop:"10px",
    padding: theme.spacing.unit * 2,
    maxWidth: "100%"
  },
  header:{
    display:"flex",
    padding: "10px",
    marginBottom: "10px",
    justifyContent: "space-between"
  },
  control:{
    padding:"10px"
  },
  formControl: {
    marginLeft: theme.spacing.unit ,
    minWidth: 120,
  },
  heading:{
    fontSize:"0.75rem",
    color:"#000",
    fontWeight:"bold",
    fontFamily:"Roboto"
  },
  wrapper: {
    marginTop:"20px"
  },
  batchUpdate: { display: "inline-block" },
  link: { cursor: "pointer", color: "blue", textDecoration: "underline" },
  disable: { opacity: "0.5" },
  live: { color: "green" },
  space: { marginRight: theme.spacing.unit },
});

class AllProducts extends React.Component {
  intialFilters = {
    gender: "",
    category: "",
    brand: "",
    status: ""
  };
  state = {
    searched_text: "",
    selected_filter: "Sku",
    row_data: [],
    status: "",
    current_page: 1,
    totalElement: 0,
    showModal: false,
    all_brands: [],
    all_category: [],
    all_master_category: [],
    selected_brand: "",
    selected_master_category: "",
    selected_parent_category: "",
    created_date: "",
    product_status: "",
    all_product_status: [
      // { name: "Active" },
      { name: "Inactive" },
      { name: "Live" }
    ],
    advanceFilter: false,
    modalData: { ...this.intialFilters },
    loading: false,
    message: ""
  };

  componentDidMount() {
    this.get_product_data();
    this.get_query_params(this.props.location.search);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.location.search != this.props.location.search) {
      this.get_query_params(newProps.location.search);
    }
  }

  get_query_params(location) {
    console.log(location)
    var all_query_params = queryString.parse(location,{"decode" : false});
    console.log(all_query_params)
    this.setState(
      {
        searched_text: all_query_params.q ? decodeURI(location.split("?q=").join("").split("&filter")[0]) : "",
        selected_filter: all_query_params.filter ? all_query_params.filter : "Sku",
        current_page: all_query_params.page ? all_query_params.page : 1
      },
      () => {
        this.get_product_data();
      }
    );
  }

  update_url() {
    this.props.history.push(
      this.props.location.pathname +
        "?q=" +
        this.state.searched_text +
        "&filter=" +
        this.state.selected_filter +
        "&page=" +
        this.state.current_page
    );
  }

  get_product_data() {
    if (
      this.state.searched_text &&
      this.state.searched_text.length > 0 &&
      !this.state.searched_text
    ) {
      alert("Nothing found to search");
    } else {
      this.props
        .dispatch(
          fetchAllProduct(
            this.state.searched_text,
            this.state.selected_filter,
            this.state.current_page
          )
        )
        .then(() => {
          if (this.props.list.response) {
            this.setState({
              row_data: this.props.list.response,
              totalElement: this.props.list.totalElement
            });
          } else {
            var data = [];
            Object.keys(this.props.list.productMap).map(i =>
              data.push(this.props.list.productMap[i])
            );
            this.setState({
              row_data: data,
              totalElement: 1
            });
          }
        });
    }
  }

  handlePageChange(pageNumber) {
    document.querySelector(".table_button").scrollIntoView(false);
    this.setState({ current_page: pageNumber }, () => {
      if(Object.values(this.state.modalData).filter(v => v).length > 0){
        this.handleSubmit();
      }else{
         this.get_product_data();
      }
    });
  }

  handle_change(event) {
    event.preventDefault();
    if (this.state.searched_text.length > 2) {
      this.handlesearchapi();
    } else if (this.state.searched_text.length == 0) {
      this.handlesearchapi();
    }
  }

  handlesearch(event) {
    this.setState({ searched_text: event.target.value }, () => {
      if (this.state.searched_text.length == 0) {
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
      updated_data.productDetails[index].status =
        value == "INACTIVE" ? "ACTIVE" : "INACTIVE";
      if (
        this.state.selected_filter == "ACTIVE" &&
        updated_data.productDetails[index].status == "INACTIVE"
      ) {
        updated_data.productDetails.spilce(index, 1);
      } else if (
        this.state.selected_filter == "INACTIVE" &&
        updated_data.productDetails[index].status == "ACTIVE"
      ) {
        updated_data.productDetails.spilce(index, 1);
      }
      this.props
        .dispatch(patchProduct(id, JSON.stringify(formdata)))
        .then(res => {
          this.setState(
            {
              row_data: updated_data
            },
            () => {
              this.get_product_data();
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
    this.props.history.push("/catalogue/product/create");
  }

  download_sample() {
    window.location = "/dist/sample_product_upload.xlsx";
    // window.open("/dist/sample_product_upload.xlsx","_blank")
  }

  handle_upload_csv(event) {
    var self = this;
    var file = event.target.files[0].name.split(".");
    var name = file[file.length - 1].toLowerCase();
    if (name == "xlsx") {
      var formdata = new FormData();
      formdata.append("file", event.target.files[0]);
      formdata.append("userId", this.props.email);
      this.props.dispatch(batchValidate(formdata)).then(res => {
        document.getElementById("upload_csv").value = "";
        if (!self.props.batch_error) {
          alert(this.props.batch_success.data.data.message);
          window.location.reload();
        } else {
          document.getElementById("upload_csv").value = "";
          var message = this.props.batch_error.error.split(",").join("\n");
          alert("ERROR UPLOADING BATCH FILE:\n" + message);
        }
      });
    } else {
      document.getElementById("upload_csv").value = "";
      alert("Please upload the file in .xlsx file format only.");
    }
  }

  handleBatchUpdateCsv = event => {
    const self = this;
    const file = event.target.files[0].name.split(".");
    const name = file[file.length - 1].toLowerCase();
    if (name == "csv") {
      let formdata = new FormData();
      formdata.append("file", event.target.files[0]);
      postBatchUpdateApi(self.props.userId, formdata, self.props.email).then(
        res => {
          if (res.data.message) {
            alert(res.data.message);
            window.location.reload();
          } else {
            document.getElementById("batch_update").value = "";
            alert(res.data.text);
          }
        }
      );
    } else {
      document.getElementById("batch_update").value = "";
      alert("Please upload the file in .csv file format only.");
    }
  };

  handle_modal() {
    this.setState({ showModal: !this.state.showModal }, () => {
      if (this.state.showModal) {
        this.setState({
          selected_brand: "",
          selected_master_category: "",
          selected_parent_category: "",
          created_date: "",
          product_status: ""
        });
        this.get_meta_data();
      }
    });
  }

  get_meta_data() {
    this.props.dispatch(fetchMetadata()).then(() => {
      var global_category = this.props.metadata.data.response.categories
        .filter(i => i.name == "Global Category")[0]
        .attributeTypes.filter(
          i => i.name != "Size" && i.name != "Color" && i.name != "Color Code"
        );
      var all_category = this.props.metadata.data.response.categories.filter(
        i => i.name != "Global Category"
      );
      var size = this.props.metadata.data.response.categories
        .filter(i => i.name == "Global Category")[0]
        .attributeTypes.filter(i => i.name == "Size");
      var color = this.props.metadata.data.response.categories
        .filter(i => i.name == "Global Category")[0]
        .attributeTypes.filter(i => i.name == "Color");
      var color_codes = this.props.metadata.data.response.categories
        .filter(i => i.name == "Global Category")[0]
        .attributeTypes.filter(i => i.name == "Color Code");
      var updated_size = size[0] ? size[0].attributeTypeValue : [];
      updated_size.map(i => {
        i.disabled = false;
      });
      this.setState(
        {
          all_brands: this.props.metadata.data.response.brand,
          global_category: global_category,
          all_category: all_category,
          product_line_color: color[0] ? color[0].attributeTypeValue : [],
          product_line_size: updated_size,
          color_codes: color_codes[0] ? color_codes[0].attributeTypeValue : []
        },
        () => {}
      );
    });
  }

  download_data() {
    var str =
      (this.state.selected_brand
        ? "brand_id=" + this.state.selected_brand.brandId
        : "") +
      (this.state.selected_master_category
        ? "&master_category=" + this.state.selected_master_category.id
        : "") +
      (this.state.selected_parent_category
        ? "&parent_category=" + this.state.selected_parent_category.id
        : "") +
      (this.state.created_date
        ? "&dateFrom=" + dateFormat(this.state.created_date, "yyyy-mm-dd")
        : "") +
      (this.state.product_status
        ? "&status=" + this.state.product_status.name
        : "");
    if (this.state.created_date) {
      var self = this;
      axios
        .get("/product/downloadSkus?" + str)
        .then(res => {
          if (res.data.errorExists) {
            alert("Record Not Found.");
          } else {
            var blob = new Blob([res.data], {
              type: "text/csv;charset=utf-8;"
            });
            if (navigator.msSaveBlob) {
              navigator.msSaveBlob(blob, "product_sku.csv");
            } else {
              var link = document.createElement("a");
              if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "product_sku.csv");
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }
          }
          self.handle_modal();
        })
        .catch(res => {
          alert("Record Not Found.");
        });
    } else {
      alert("Please select created from date to download sku data.");
    }
  }

  handle_product_image(pid) {
    window.open("/catalogue/product-image?pid=" + pid, "_blank");
    // this.props.history.push("/catalogue/product-image?pid=" + pid);
  }

  renderProductClass = status => {
    switch (status) {
      case "LIVE":
        return "product_is_live";
      case "LIVE_LATER":
        return "product_live_later";
      default:
        return "product_can_be_live";
    }
  };

  getSkuClass = status => {
    const { classes } = this.props;
    switch (status) {
      case "LIVE":
        return classes.live;
      case "DELISTED":
        return classes.disable;
      default:
        return "";
    }
  };

  handleFilters = () => {
    this.setState(prevState => ({advanceFilter: !prevState.advanceFilter}));
  }

  handleChangeModal = (e) => {
    this.setState(prevState => (
      {...prevState,
        modalData: {
          ...prevState.modalData,
          [e.target.name] : e.target.value
        }}
    ));
  }

  handleSubmit = () => {
    const { gender, status, category, brand } = this.state.modalData;
    const that = this;
    this.setState({ loading: true, message: "" }, () =>
      fetchFilteredProductsApi(
        that.state.current_page,
        50,
        gender,
        status,
        category,
        brand
      ).then((res) => {
        if (res && res.status < 350) {
          that.setState({
            loading: false,
            row_data: res.data.response.data,
            totalElement: res.data.response.totalElements,
            advanceFilter: false
          });
        } else {
          that.setState({
            loading: false,
            message: res.data.message || "Something went wrong",
          });
        }
      })
    );
  };

  handleClear = () => {
    this.setState({ modalData: { ...this.intialFilters } });
  };

  render() {
    const { row_data, searched_text, selected_filter, message } = this.state;
    const { classes } = this.props;
    const that = this;

    return (
      <React.Fragment>
         {(this.props.loading || this.state.loading) && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid container className={classes.header} spacing={12} >  
            <Typography variant="h5" gutterBottom component="h5">
              All Products
            </Typography>
            <div  className={classes.control}>
                <Button
                  className={classes.space}
                  onClick={this.handleFilters}
                  variant="contained"
                  color="primary"
                >
                  Advance Filters
                </Button>
                <Button
                  className="table_onbutton"
                  onClick={this.go_to_add.bind(this)}
                  variant="contained"
                  color="primary"
                >
                  <Add className="table_icons" /> Product
                </Button>
              </div>
        </Grid>
        <Paper className={classes.paper}  elevation={3}>
            <Grid container>
              <Grid  item xs={8} className={classes.control}>
                <form onSubmit={this.handle_change.bind(this)}>
                    <TextField
                      label="Search Products"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={searched_text}
                      onChange={this.handlesearch.bind(this)}
                      margin="none"
                      onKeyDown={this.handleSearchChange}
                    />
                  </form>
              </Grid>
              <Grid  item xs={4}  className={classes.control}>
              <FormControl className={classes.formControl} fullWidth variant="outlined" >
                  <InputLabel id="demo-simple-select-outlined-label">Search By</InputLabel>
                  <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                    label="Search By"
                    value={selected_filter}
                    onChange={this.handlefilter.bind(this)}
                  >
                      <MenuItem value="Sku">Sku's</MenuItem>
                      <MenuItem value="Product">Product</MenuItem>
                      <MenuItem value="Brand">Brands</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
         </Paper>
         <Paper className={classes.paper}  elevation={3}>
              <Table>
                <TableHead>
                  <TableRow >
                    <TableCell className={classes.heading}>Image</TableCell>
                    <TableCell className={classes.heading}>ID</TableCell>
                    <TableCell className={classes.heading}>Name</TableCell>
                    <TableCell className={classes.heading}>Merchant Code</TableCell>
                    <TableCell className={classes.heading}>Brand</TableCell>
                    <TableCell className={classes.heading}>MRP</TableCell>
                    <TableCell className={classes.heading}>Inventory</TableCell>
                    <TableCell className={classes.heading}>Action</TableCell>
                    <TableCell className={classes.heading}>Live Status</TableCell>
                    <TableCell className={classes.heading}>Live Manager</TableCell>
                  </TableRow>
                </TableHead>  
                <TableBody>
                {row_data && (
                <React.Fragment>
                  {!row_data.errorExists &&
                    row_data &&
                    (row_data.length > 0 ? row_data : []).map(function(
                      i,
                      index
                    ) {
                      return (
                        <TableRow key={index} style={{ height: "40px" }}>
                          <TableCell
                            style={{ cursor: "pointer" }}
                            onClick={this.handle_product_image.bind(
                              this,
                              i.productId
                            )}
                          >
                            {i.productOptions[0] ? (
                              i.productOptions[0].sizes[0] ? (
                                i.productOptions[0].sizes[0].images ? (
                                  <img
                                    src={
                                      ImgUrl.imageUrl +
                                      i.productOptions[0].sizes[0].images
                                        .defaultImage
                                    }
                                    width="50px"
                                    height="50px"
                                    style={{ borderRadius: "50%" }}
                                  />
                                ) : (
                                  "N/A"
                                )
                              ) : (
                                "N/A"
                              )
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>{i.productId}</TableCell>
                          <TableCell>
                            {i.productName.length > 30
                              ? i.productName.slice(0, 30) + "..."
                              : i.productName}
                          </TableCell>
                          <TableCell>{i.merchantCode}</TableCell>
                          <TableCell>{i.globalValues.brand}</TableCell>
                          <TableCell>
                            {i.globalValues.mrp ? i.globalValues.mrp : "N/A"}
                          </TableCell>
                          <TableCell>
                            {i.productOptions.map(function (i, iindex) {
                              var size_inventory = i.sizes.map(function (
                                j,
                                jindex
                              ) {
                                return (
                                  <li
                                    key={jindex}
                                    className={that.getSkuClass(j.status)}
                                  >
                                    {`${j.sizeValue} - ${
                                      j.status
                                    } - ${j.inventory || "N/A"}`}
                                  </li>
                                );
                              });
                              return (
                                <React.Fragment key={iindex}>
                                  <ul
                                    style={{
                                      listStyleType: "none",
                                      margin: "0px",
                                      padding: "0px",
                                      marginBottom: "10px"
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: i.status == "LIVE" ? "green" : ""
                                      }}
                                    >
                                      {i.lineId} : {i.colorValue}
                                    </span>
                                    {size_inventory}
                                  </ul>
                                </React.Fragment>
                              );
                            })}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            <Link
                              className="edit_button"
                              to={
                                "/catalogue/product/edit/" +
                                i.productId + "?status="+
                                (i.liveStatus)
                              }
                            >
                              Edit
                            </Link>{" "}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            <Tooltip title={i.globalValues.status}>
                              <p
                                className={
                                  i.liveStatus
                                    ? this.renderProductClass(
                                        i.globalValues.status
                                      )
                                    : "product_not_live"
                                }
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            <Link
                              className="edit_button"
                              target="_blank"
                              to={
                                "/catalogue/view/product/" +
                                i.productId +
                                "/" +
                                (!i.liveStatus
                                  ? false
                                  : i.liveStatus == true &&
                                    i.globalValues.status == "LIVE"
                                  ? "live"
                                  : i.liveStatus)
                              }
                            >
                              Review
                            </Link>{" "}
                          </TableCell>
                          {/* <td style={{ textAlign: "center" }}>
                            <Link
                              className="edit_button"
                              to={"/catalogue/logs/product/" + i.productId}
                            >
                              Logs
                            </Link>{" "}
                          </td>
                         */}
                        </TableRow>
                      );
                    },
                    this)}
                  {(row_data.errorExists || row_data.length == 0) && (
                    <TableRow className="no_data_found">
                      <TableCell colSpan="10"  style={{padding : "10px",textAlign:"center"}}>
                        No data avaliable.
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )}
              {!row_data && (
                <TableRow className="no_data_found">
                  <TableCell colSpan="10"  style={{padding : "10px",textAlign:"center"}}>
                    No data avaliable.
                  </TableCell>
                </TableRow>
              )}
                </TableBody>
              </Table>
          </Paper>
        <div className="table_container">
          {this.state.totalElement > 0 && (
            <div className="pagination_container">
              <Pagination
                activePage={this.state.current_page}
                itemsCountPerPage={50}
                totalItemsCount={this.state.totalElement}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange.bind(this)}
              />
            </div>
          )}
        </div>
        <Modal
          open={this.state.showModal}
          onClose={this.handle_modal.bind(this)}
          title="Apply Filter to Download Product Skus CSV"
          fullScreen={false}
          maxWidth="sm"
        >
          <div>
          <Grid container spacing={12}>
              <Grid item xs={12} style={{marginTop:"10px"}}>
                <Select
                  onChange={selected_option => {
                    this.setState({ selected_brand: selected_option });
                  }}
                  options={this.state.all_brands}
                  value={this.state.selected_brand}
                  getOptionLabel={({ brandName }) => brandName}
                  getOptionValue={({ brandId }) => brandId}
                  placeholder="Select Brand"
                  backspaceRemovesValue={true}
                />
              </Grid>
              <Grid item xs={12} style={{marginTop:"10px"}} className="filter_react-datepicker-wrapper">
                <DatePicker
                  selected={this.state.created_date || ""}
                  onChange={date => {
                    this.setState({ created_date: date });
                  }}
                  placeholderText="Enter Created From"
                  dateFormat="MMMM d, yyyy"
                />
              </Grid>
              <Grid item xs={12} style={{marginTop:"10px"}}>
                <Select
                  onChange={selected_option => {
                    this.setState({
                      selected_parent_category: selected_option,
                      all_master_category: selected_option
                        ? selected_option.subCategories
                        : [],
                      selected_master_category: "",
                    });
                  }}
                  options={this.state.all_category}
                  value={this.state.selected_parent_category}
                  getOptionLabel={({ name }) => name}
                  getOptionValue={({ id }) => id}
                  placeholder="Select Master Category"
                  backspaceRemovesValue={true}
                  isClearable={true}
                />
              </Grid>
              <Grid item xs={12} style={{marginTop:"10px"}}>
                <Select
                  onChange={selected_option => {
                    this.setState({
                      selected_master_category: selected_option
                    });
                  }}
                  options={this.state.all_master_category}
                  value={this.state.selected_master_category}
                  getOptionLabel={({ name }) => name}
                  getOptionValue={({ id }) => id}
                  placeholder="Select Parent Category"
                  backspaceRemovesValue={true}
                  isClearable={true}
                />
              </Grid>
              <Grid item xs={12} style={{marginTop:"10px"}}>
                <Select
                  onChange={selected_option => {
                    this.setState({ product_status: selected_option });
                  }}
                  options={this.state.all_product_status}
                  value={this.state.product_status}
                  getOptionLabel={({ name }) => name}
                  getOptionValue={({ name }) => name}
                  placeholder="Select Product Status"
                  backspaceRemovesValue={true}
                  isClearable={true}
                />
              </Grid>
              <br />
              <Grid item xs={12} style={{marginTop:"10px"}}>
                <br />
                <label
                  onClick={this.download_data.bind(this)}
                  className="table_onbutton upload_csv"
                  variant="contained"
                  color="primary"
                >
                  {" "}
                  Download{" "}
                </label>
              </Grid>
            </Grid>
          </div>
        </Modal>
        <Filters
          open={this.state.advanceFilter}
          classes={classes}
          modalData={this.state.modalData}
          onChange={this.handleChangeModal}
          onSubmit={this.handleSubmit}
          onClose={this.handleFilters}
          onClear={this.handleClear}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  list: state.product.data.data,
  loading: state.product.loading,
  error: state.product.error,
  batch_success: state.product.batch_success,
  batch_error: state.product.batch_error,
  roles: state.signin.data.roles,
  email: state.signin.data.body.data.user.email,
  vendor: state.signin.data.vendor,
  metadata: state.product.metadata,
  userId: state.signin.data.body.data.user.id
});

export default connect(mapStateToProps)(withStyles(styles)(AllProducts));