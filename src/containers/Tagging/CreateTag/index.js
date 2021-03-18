import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {Grid,Button} from "@material-ui/core/";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import { getDateTime } from "../../../helpers";
import BackButton from "../../../components/BackButton";
// import Button from "../../../components/Button";
import { connect } from "react-redux";
import { getTagDataByTagName } from "../../../store/actions/tagging";
import { putTagApi, postTagApi } from "../../../api/tagging";
import Notify from "../../../components/Notify";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";

const style = theme => ({
  paper: {
    ...theme.paper,padding:"10px"
  },
  control:{padding:"10px"},
  center: {
    textAlign: "center"
  }
});

class CreateTag extends React.Component {
  state = {
    type: "",
    createdBy: this.props.userMail,
    updatedBy: "",
    expiry: true,
    tagDescription: "",
    tagLabel: "",
    tagName: "",
    tagPage: true,
    tagUrl: "",
    tagStartDt: "",
    tagEndDt: "",
    loading: false,
    message: "",
    redirect: false
  };

  handleChange = e => {
    switch (e.target.name) {
      case "tagLabel":
        this.setState({
          tagLabel: e.target.value.replace(/\W/, "").toUpperCase()
        });
        break;
      case "tagName":
        this.setState({
          tagName: e.target.value,
          tagUrl:
            "/tags/" + e.target.value.replace(/[^A-Z0-9]+/gi, "-").toLowerCase()
        });
        break;
      case "tagPage":
        this.setState({
          tagPage: e.target.checked
        });
        break;
      case "expiry":
        this.setState({
          expiry: e.target.checked
        });
        break;
      case "tagStartDt":
        this.setState({
          tagStartDt: e.target.value,
          tagEndDt : new Date(new Date(e.target.value).setMonth(new Date(e.target.value).getMonth()+6)),
        });
        break;
      case "tagEndDt":
        if (new Date(e.target.value) > new Date(this.state.tagStartDt)) {
          this.setState({
            tagEndDt: e.target.value
          });
        }
        break;
      case "tagDescription":
        this.setState({
          tagDescription: e.target.value
        });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleRequest = () => {
    const that = this;
    const {
      createdBy,
      expiry,
      tagDescription,
      tagLabel,
      tagName,
      tagPage,
      tagUrl,
      tagStartDt,
      tagEndDt,
      updatedBy,
      type
    } = this.state;
    const form = {
      expiry,
      tagDescription,
      tagLabel,
      tagName,
      tagPage,
      tagUrl,
      tagStartDt,
      tagEndDt: expiry ? tagEndDt : null
    };
    if (type === "edit") {
      form.updatedBy = updatedBy;
    } else {
      form.createdBy = createdBy;
    }
    this.setState({ loading: true, message: "" }, () => {
      const api =
        this.state.type == "edit" ? putTagApi(form) : postTagApi(form);
      api.then(res => {
        if (res && res.status < 350) {
          this.setState({
            message: res.data.response + " Redirecting to list...",
            loading: false,
            redirect: true
          });
          setTimeout(() => that.props.history.push("/tagging/list"), 5000);
        } else {
          this.setState({
            message: res.data.message || res.data.text,
            loading: false
          });
        }
      });
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.expiry) {
      if (new Date(this.state.tagEndDt) > new Date(this.state.tagStartDt)) {
        if(this.monthDiff(new Date(this.state.tagStartDt), new Date(this.state.tagEndDt)) <= 6){
          this.handleRequest();
        }
        else{
          this.handleRequest();
        }
      } else {
        alert("End date can not be smaller than start date.");
      }
    } else {
      this.handleRequest();
    }
  };

  monthDiff(dateFrom, dateTo) {
    return dateTo.getMonth() - dateFrom.getMonth() + 
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
   }

  componentDidMount = () => {
    const { match, dispatch } = this.props;
    this.setState({
      type: match.params.type,
      updatedBy: match.params.type === "edit" ? this.props.userMail : ""
    });
    if (match.params.tagname) {
      dispatch(getTagDataByTagName(match.params.tagname));
    }
  };

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.tagData != this.props.tagData) {
      const { tagData } = nextProps;
      tagData &&
        this.setState({
          expiry: true,
          tagDescription: tagData.tagDescription || "",
          tagLabel: tagData.tagLable || "",
          tagName: tagData.tagName || "",
          tagPage: tagData.tagPage || true,
          tagUrl: tagData.tagUrl || "",
          tagStartDt: tagData.tagStartDate || "",
          tagEndDt: tagData.tagEndDate || ""
        });
    }
  };

  render() {
    const { classes, history } = this.props;
    const {
      expiry,
      tagDescription,
      tagLabel,
      tagName,
      tagPage,
      tagUrl,
      tagStartDt,
      tagEndDt,
      type,
      message,
      loading,
      redirect
    } = this.state;

    return (
      <React.Fragment>
        <Grid style={{marginTop:"10px"}}>
          <BackButton
            text={type === "edit" ? "Edit Tag" : "Create Tag"}
            history={history}
          />
        </Grid>
        {redirect && <LinearProgress />}
        {message && <Notify message={message} />}
        <Paper className={classes.paper}>
          <form method="post" onSubmit={this.handleSubmit}>
            <Grid container spacing={12} alignItems="center">
              <Grid item xs={12} sm={6} md={6} className={classes.control}>
                <TextField
                  required
                  label="Tag Code"
                  value={tagLabel}
                  fullWidth
                  variant="outlined"
                  name="tagLabel"
                  onChange={this.handleChange}
                  helperText="Provide alphabet, number and undescore only without space."
                  disabled={type === "edit"}
                  onInput={e =>
                    (e.target.value = e.target.value.toString().slice(0, 240))
                  }
                />
              </Grid>
             
              <Grid item xs={12} sm={6} md={6} className={classes.control}>
                <TextField
                  required
                  label="Tag Name"
                  value={tagName}
                  variant="outlined"
                  fullWidth
                  name="tagName"
                  onChange={this.handleChange}
                  helperText={
                    <b style={{ color: "red" }}>
                      Provide text in lowercase and separated by hyphen(-).
                    </b>
                  }
                  disabled={type === "edit"}
                  onInput={e =>
                    (e.target.value = e.target.value.toString().slice(0, 240))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} className={classes.control}>
                <TextField
                  required
                  label="Tag Description"
                  value={tagDescription}
                   variant="outlined"
                  fullWidth
                  name="tagDescription"
                  onChange={this.handleChange}
                  helperText="Max length 255 character"
                  onInput={e =>
                    (e.target.value = e.target.value.toString().slice(0, 240))
                  }
                />
              </Grid>
                <React.Fragment>
                  <Grid item xs={12} sm={6} md={4} className={classes.control}>
                    <TextField
                      required
                      helperText="Start Date"
                      type="datetime-local"
                      variant="outlined"
                      fullWidth
                      name="tagStartDt"
                      value={tagStartDt ? getDateTime(tagStartDt) : ""}
                      onChange={this.handleChange}
                      disabled={type === "edit"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} className={classes.control}>
                    <TextField
                      required
                      helperText="End Date"
                      type="datetime-local"
                      variant="outlined"
                      fullWidth
                      name="tagEndDt"
                      value={tagEndDt ? getDateTime(tagEndDt) : ""}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} className={classes.control}>
                <Checkbox
                  checked={tagPage ? tagPage : false}
                  name="tagPage"
                  color="primary"
                  onChange={this.handleChange}
                  disabled
                />
                <Typography>Create Tag Page URL with Products</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4} className={classes.control}>
                <TextField
                  required
                  disabled
                  label="Tag URL"
                  value={tagUrl}
                  variant="outlined"
                  fullWidth
                  name="tagUrl"
                  onChange={this.handleChange}
                />
              </Grid>
                </React.Fragment>
              <Grid item xs={12} md={12}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Button type="submit" variant="contained" color="primary" name="Submit">
                    Submit
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userMail: state.signin.data.body.data.user.email,
  response: state.tagging.response,
  tagData: state.tagging.tagData
});

export default withStyles(style)(connect(mapStateToProps)(CreateTag));
