import $ from "jquery";
import React from "react";
import { Link } from "react-router-dom";
import {Typography,Paper} from "@material-ui/core";
import queryString from "query-string";
import Add from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Download from "@material-ui/icons/CloudDownload";
import Upload from "@material-ui/icons/CloudUpload";
import { connect } from "react-redux";
import {
  fetchAllProduct,
  patchProduct,
  batchValidate,
} from "../../store/actions/product";
import LinearProgress from "@material-ui/core/LinearProgress";
import Pagination from "react-js-pagination";
import ImgUrl from "../../../config.js";
import axios from "axios";
import Modal from "../../components/Modal";
import {Grid,Card,CardContent} from "@material-ui/core";
import Select from "react-select";
import DatePicker from "react-datepicker";
var dateFormat = require("dateformat");
import { fetchMetadata } from "../../store/actions/product";
import { postBatchUpdateApi } from "../../api/productapi";
import { downloadCsv } from "../../../utils/csv";
import { withStyles } from "@material-ui/core/styles";
import { batchUpdateCsvHeader, batchUpdateCsvSample } from "../../../metadata";
import Tooltip from "@material-ui/core/Tooltip";

const styles = theme => ({
  batchUpdate: { display: "inline-block" },
  link: { cursor: "pointer", color: "blue", textDecoration: "underline",marginTop:"20px" },
  disable: { opacity: "0.5" }
});

class AllProducts extends React.Component {
  state = {
    searched_text: "",
    selected_filter: "",
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
    ]
  };

  componentDidMount() {
    this.get_product_data();
  }

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
          var data = this.props.list.productMap[this.state.searched_text]
            ? [this.props.list.productMap[this.state.searched_text]]
            : [];
          this.setState({
            row_data: data,
            totalElement: 1
          });
        }
      });
  }

  handlePageChange(pageNumber) {
    document.querySelector(".table_button").scrollIntoView(false);
    this.setState({ current_page: pageNumber }, () => {
      this.get_product_data();
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
    this.setState({ searched_text: event.target.value.trim() }, () => {
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
          console.log(updated_data, res, this.props.list);
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
    // window.location = "/dist/sample_product_upload.xlsx";
    window.open("/dist/sample_product_upload.xlsx","_blank")
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
        if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
        console.log(this.props.batch_success.data);
        if (!self.props.batch_error) {
          alert(this.props.batch_success.data.data.message);
          window.location.reload();
        } else {
          if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
          var message = this.props.batch_error.error.split(",").join("\n");
          alert("ERROR UPLOADING BATCH FILE:\n" + message);
        }
      });
    } else {
      if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
      alert("Please upload the file in .xlsx file format only.");
    }
  }

  handle_upload_csv_new(event) {
    var self = this;
    var file = event.target.files[0].name.split(".");
    var name = file[file.length - 1].toLowerCase();
    if (name == "csv") {
      var formdata = new FormData();
      formdata.append("file", event.target.files[0]);
      formdata.append("userId", this.props.email);
      this.props.dispatch(batchValidate(formdata,"/product/batch/updateLineStatus?userId=" +  this.props.email)).then(res => {
        if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
        console.log(this.props.batch_success.data);
        if (!self.props.batch_error) {
          alert(this.props.batch_success.data.data.message);
          window.location.reload();
        } else {
          if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
          var message = this.props.batch_error.error.split(",").join("\n");
          alert("ERROR UPLOADING BATCH FILE:\n" + message);
        }
      });
    } else {
      if(document.getElementById("upload_csv")){ document.getElementById("upload_csv").value = "";}
      alert("Please upload the file in .csv file format only.");
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
            if(document.getElementById("batch_update")){document.getElementById("batch_update").value = "";}
            alert(res.data.text);
          }
        }
      );
    } else {
      if(document.getElementById("batch_update")){document.getElementById("batch_update").value = "";}
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
    console.log(this.state);
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
    this.props.history.push("/catalogue/product-image?pid=" + pid);
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

  render() {
    const { row_data, searched_text, selected_filter } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        {this.props.loading && (
          <LinearProgress />
        )}
        <Grid container alignItems="center" style={{height:"80vh"}}>
          <Grid container justify="center">
          <Typography variant="h6" gutterBottom component="h6">
              {this.props.location.pathname == "/catalogue/batchadd/product" &&
                <React.Fragment>
                    Batch Add Products
                </React.Fragment>
              }
              {this.props.location.pathname == "/catalogue/batchupdate/product" &&
                <React.Fragment>
                    Batch Edit Products
                </React.Fragment>
              }
              {this.props.location.pathname == "/catalogue/batchdownload/sku" &&
                <React.Fragment>
                    Batch Download SKU's
                </React.Fragment>
              }
              {this.props.location.pathname == "/catalogue/batchlinestatuschange" &&
                <React.Fragment>
                    Batch Line Status Change
                </React.Fragment>
              }
            </Typography>
            {this.props.location.pathname == "/catalogue/batchlinestatuschange" &&
            <React.Fragment>
               <Grid container justify="center">
                <Grid xs={2} sm={2}>
                      <Card>
                        <CardContent>
                            <div className={classes.batchUpdate}>
                              <input
                                allowed=".csv"
                                type="file"
                                id="upload_csv"
                                onChange={this.handle_upload_csv_new.bind(this)}
                                hidden
                              />
                              <label
                                className="table_onbutton upload_csv"
                                htmlFor="upload_csv"
                                variant="contained"
                                color="primary"
                              >
                                <Upload
                                  style={{ verticalAlign: "middle" }}
                                  className="table_icons"
                                />
                                &nbsp; Batch Upload
                              </label>
                          </div>
                          </CardContent>
                    </Card>
                  </Grid>
               </Grid>
              </React.Fragment>
            }
            {this.props.location.pathname == "/catalogue/batchadd/product" &&
              <React.Fragment>
                <Grid container justify="center">
                <Grid xs={2} sm={2}>
                    <Card>
                      <CardContent>
                        <div className={classes.batchUpdate}>
                          <input
                            allowed=".xlsx, .xls"
                            type="file"
                            id="upload_csv"
                            onChange={this.handle_upload_csv.bind(this)}
                            hidden
                          />
                          <label
                            htmlFor="upload_csv"
                            className="table_onbutton upload_csv"
                            variant="contained"
                            color="primary"
                          >
                            <Upload
                              style={{ verticalAlign: "middle" }}
                              className="table_icons"
                            />
                            &nbsp; Batch Upload
                          </label>
                        </div>
                        <Typography
                          className={classes.link}
                          onClick={() =>
                            (window.open("https://images.koovs.com/uploads/sample_product_upload.xlsx","_blank"))
                          }
                        >
                          <Download
                            style={{ verticalAlign: "middle" }}
                            className="table_icons"
                          />
                          Sample Sheet
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </React.Fragment>
          }
            {this.props.location.pathname == "/catalogue/batchupdate/product" &&
              <React.Fragment>
                <Grid container justify="center">
                <Grid xs={2} sm={2} justify="center">
                      <Card>
                        <CardContent>
                        <div className={classes.batchUpdate}>
                          <input
                            allowed=".csv"
                            type="file"
                            id="batch_update_csv"
                            onChange={this.handleBatchUpdateCsv}
                            hidden
                          />
                            <label
                              htmlFor="batch_update_csv"
                              className="table_onbutton upload_csv"
                              variant="contained"
                              color="primary"
                            >
                              <Upload
                                style={{ verticalAlign: "middle" }}
                                className="table_icons"
                              />
                            &nbsp; Batch Update
                            </label>
                          </div>
                          <Typography
                            className={classes.link}
                            onClick={() =>
                              (window.open("https://images.koovs.com/uploads/sample_product_upload_edit.csv","_blank"))
                            }
                          >
                            <Download
                              style={{ verticalAlign: "middle" }}
                              className="table_icons"
                            />
                            Sample File
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
              </React.Fragment>
            }
            {this.props.location.pathname == "/catalogue/batchdownload/sku" &&
              <React.Fragment>
                <Grid container  justify="center">
                  <Grid xs={2} sm={2} justify="center">
                  <Card>
                    <CardContent>
                      <label
                      onClick={this.handle_modal.bind(this)}
                      className="table_onbutton upload_csv"
                      variant="contained"
                      color="primary"
                    >
                      <Download
                        style={{ verticalAlign: "middle" }}
                        className="table_icons"
                      />
                      &nbsp; Download Sku
                    </label>
                    </CardContent>
                  </Card>
                  </Grid>
                </Grid>
              </React.Fragment>
            }
        </Grid>
        </Grid>
        <Modal
          open={this.state.showModal}
          onClose={this.handle_modal.bind(this)}
          title="Apply Filter to Download Product Skus CSV"
          fullScreen={false}
          maxWidth="sm"
        >
          <div>
            <Grid container spacing={12}>
              <Grid item xs={12} style={{marginTop:"10px",marginBottom:"10px"}}>
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
              <Grid item xs={12}  style={{top:"10px"}} className="filter_react-datepicker-wrapper">
                <DatePicker
                  selected={this.state.created_date || ""}
                  onChange={date => {
                    this.setState({ created_date: date });
                  }}
                  placeholderText="Enter Created From"
                  dateFormat="MMMM d, yyyy"
                />
              </Grid>
              <Grid item xs={12}  style={{marginTop:"10px"}}>
                <Select
                  onChange={selected_option => {
                    this.setState({
                      selected_parent_category: selected_option,
                      all_master_category: selected_option
                        ? selected_option.subCategories
                        : [],
                      selected_master_category: ""
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
              <Grid item xs={12}  style={{marginTop:"10px"}}>
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
              <Grid item xs={12}  style={{marginTop:"10px"}}>
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
              <Grid item xs={12}  style={{marginTop:"10px"}}>
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
