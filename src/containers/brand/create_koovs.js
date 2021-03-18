import React from "react";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Error from "@material-ui/icons/ErrorOutline";
import { getBrandDetail, postBrandApi, putBrandApi } from "../../api/brandapi";
import { connect } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import sanitizeHtml from "sanitize-html";
import Notify from "../../components/Notify";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    margin: "auto",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  }
});

class CreateKoovsBrand extends React.Component {
  state = {
    type: "add",
    edit_id: "",
    brand_name: "",
    brand_description_men: "",
    brand_description_women: "",
    message: "",
    loading: ""
  };

  componentDidMount = () => {
    this.setState(
      {
        type: this.props.match.params.type
          ? this.props.match.params.type
          : "add",
        edit_id: this.props.match.params.id ? this.props.match.params.id : ""
      },
      () => {
        if (this.state.type == "edit" && this.state.edit_id) {
          getBrandDetail(this.state.edit_id).then(res =>
            res && res.status < 350 && res.data && res.data.brandDetail
              ? this.setState({
                  brand_name: res.data.brandDetail.brandName,
                  brand_description_men: res.data.brandDetail.description
                    ? JSON.parse(res.data.brandDetail.description).men
                    : "",
                  brand_description_women: res.data.brandDetail.description
                    ? JSON.parse(res.data.brandDetail.description).women
                    : ""
                })
              : this.setState({ message: "Error in fetching brand info" })
          );
        }
      }
    );
  };

  UNSAFE_componentWillReceiveProps = newProps => {
    if (newProps.match.params.type != this.props.match.params.type) {
      this.setState({ type: newProps.match.params.type }, () => {
        if (this.state.type == "add") {
          this.setState({
            type: "add",
            edit_id: "",
            brand_name: "",
            brand_description_men: "",
            brand_description_women: ""
          });
        }
      });
    }
    if (newProps.match.params.id != this.props.match.params.id) {
      this.setState({ id: newProps.match.params.id }, () => {
        if (this.state.type == "edit" && this.state.edit_id) {
          getBrandDetail(this.state.edit_id).then(res =>
            res && res.status < 350 && res.data && res.data.brandDetail
              ? this.setState({
                  brand_name: res.data.brandDetail.brandName,
                  brand_description_men: res.data.brandDetail.description
                    ? JSON.parse(res.data.brandDetail.description).men
                    : "",
                  brand_description_women: res.data.brandDetail.description
                    ? JSON.parse(res.data.brandDetail.description).women
                    : ""
                })
              : this.setState({ message: "Error in fetching brand info" })
          );
        }
      });
    }
  };

  handleform(event) {
    event.preventDefault();
    var self = this;
    this.setState({ message: "", loading: true }, () => {
      if (
        (self.state.brand_description_men.trim() &&
          self.state.brand_description_men.trim().length < 50) ||
        (self.state.brand_description_women.trim() &&
          self.state.brand_description_women.trim().length < 50)
      ) {
        self.setState({
          loading: false,
          message: `${
            self.state.brand_description_men.trim().length < 50
              ? "Men"
              : "Women"
          } description can not be less than 50 character.`
        });
      } else {
        if (self.state.type == "create") {
          var formdata = {
            brandName: sanitizeHtml(self.state.brand_name).replace(/amp;/g, ""),
            createdBy: self.props.email
          };
          if (
            self.state.brand_description_men.trim() ||
            self.state.brand_description_women.trim()
          ) {
            formdata.description = JSON.stringify({
              men: self.state.brand_description_men
                ? sanitizeHtml(self.state.brand_description_men).replace(
                    /amp;/g,
                    ""
                  )
                : "",
              women: self.state.brand_description_women
                ? sanitizeHtml(self.state.brand_description_women).replace(
                    /amp;/g,
                    ""
                  )
                : ""
            });
          }
          postBrandApi(JSON.stringify(formdata)).then(res => {
            res && res.status < 350 && res.data
              ? self.setState({
                  loading: false,
                  message: (res && res.data && res.data.reason) || ""
                })
              : self.setState({
                  loading: false,
                  message:
                    (res && res.data && res.data.reason) ||
                    "Something went wrong"
                });
            if (!res.data.error) {
              self.props.history.push("/catalogue/list/brand");
            }
          });
        } else if (self.state.type == "edit" && self.state.edit_id) {
          var formdata = {
            brandId: self.state.edit_id,
            brandName: sanitizeHtml(self.state.brand_name).replace(/amp;/g, ""),
            updatedBy: self.props.email
          };
          if (
            self.state.brand_description_men.trim() ||
            self.state.brand_description_women.trim()
          ) {
            formdata.description = JSON.stringify({
              men: self.state.brand_description_men
                ? sanitizeHtml(self.state.brand_description_men).replace(
                    /amp;/g,
                    ""
                  )
                : "",
              women: self.state.brand_description_women
                ? sanitizeHtml(self.state.brand_description_women).replace(
                    /amp;/g,
                    ""
                  )
                : ""
            });
          }
          putBrandApi(self.state.edit_id, JSON.stringify(formdata)).then(
            res => {
              res && res.status < 350 && res.data
                ? self.setState({
                    loading: false,
                    message: (res && res.data && res.data.reason) || ""
                  })
                : self.setState({
                    loading: false,
                    message:
                      (res && res.data && res.data.reason) ||
                      "Something went wrong"
                  });
              if (!res.data.error) {
                self.props.history.push("/catalogue/list/brand");
              }
            }
          );
        }
      }
    });
  }

  render() {
    const { classes, match } = this.props;
    const { message, loading } = this.state;
    return (
      <React.Fragment>
        {loading && (
          <LinearProgress />
        )}
        {message && <Notify message={message} />}
        {!loading && (
          <React.Fragment>
            <Grid container lg={12} style={{marginTop:"10px"}} justify="space-between">
              <Typography variant="h5" gutterBottom component="h5">
                {this.state.type == "edit" ? "Edit" : "Create"} Brand
                {this.props.error && (
                  <div className="error_container">
                    {typeof this.props.error.error != "object" && (
                      <p>
                        <Error className="vertical_align_error" /> &nbsp;
                        {this.props.error.error}
                      </p>
                    )}
                    {typeof this.props.error.error == "object" && (
                      <p>
                        <Error className="vertical_align_error" /> &nbsp; Server
                        Error : &nbsp;
                        {this.props.error.error.message}
                      </p>
                    )}
                  </div>
                )}
              </Typography>
            <Button
                variant="contained"
                color="primary"
                className="go_back_create"
                onClick={e => {
                  this.props.history.goBack();
                }}
              >
                {" "}
                Go Back{" "}
              </Button>
            </Grid>
           
            <form onSubmit={this.handleform.bind(this)}>
              <Paper className={classes.paper} style={{marginTop:"10px"}}>
                <Grid container spacing={12}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="
                      Enter Brand Name"
                      variant="outlined"
                      value={this.state.brand_name || ""}
                      margin="normal"
                      name="brand_name"
                      onChange={e => {
                        this.setState({ brand_name: e.target.value });
                      }}
                      required
                      inputProps={{
                        readOnly: this.state.edit_id ? true : false,
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "100"
                      }}
                      onInput={e =>
                        (e.target.value = e.target.value
                          .toString()
                          .slice(0, 100))
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                    variant="outlined"
                      label="Enter Brand Description for men"
                      value={this.state.brand_description_men || ""}
                      margin="normal"
                      multiline
                      fullWidth
                      name="brand_description_men"
                      rows={2}
                      onChange={e => {
                        this.setState({
                          brand_description_men: e.target.value
                        });
                      }}
                      placeholder=""
                      helperText="Description can be between 50-250 character."
                      inputProps={{
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250"
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      label="Enter Brand Description for women"
                      value={this.state.brand_description_women || ""}
                      margin="normal"
                      multiline
                      fullWidth
                      variant="outlined"
                      name="brand_description_women"
                      rows={2}
                      onChange={e => {
                        this.setState({
                          brand_description_women: e.target.value
                        });
                      }}
                      helperText="Description can be between 50-250 character."
                      inputProps={{
                        pattern: "^[a-zA-Z1-9].*",
                        maxLength: "250"
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container justify="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className={classes.button}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </form>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  brand_data: state.brand.data,
  loading: state.brand.loading,
  error: state.brand.error,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(CreateKoovsBrand));
