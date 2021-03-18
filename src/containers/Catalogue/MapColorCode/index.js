import React from "react";
import Select from "react-select-v1";
import { connect } from "react-redux";
import {
  Grid,
  Paper,
  Button,
  Typography,
  withStyles,
  CircularProgress
} from "@material-ui/core";
import {
  fetchPrimaryColorApi,
  fetchSecondaryColorApi,
  postColorMappingApi
} from "../../../api/catalogue";
import Notify from "../../../components/Notify";

const style = theme => ({
  paper: { ...theme.paper },
  select: { margin: 0 },
  submit: { margin: theme.spacing.unit * 2 },
  buttonProgress: {
    color: "green",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  },
  root: {
    display: "flex",
    alignItems: "center"
  },
  control:{
    padding:"15px"
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: "relative"
  }
});

class MapColorCode extends React.Component {
  state = {
    primary: "",
    primaryOptions: [],
    secondary: "",
    secondaryOptions: [],
    message: "",
    secondaryLoading: false,
    loading: false
  };

  handleSubmit = () => {
    const that = this;
    const form = {
      createdBy: this.props.emailId,
      primaryColorId: this.state.primary,
      secondaryColorId: this.state.secondary,
      updatedBy: this.props.emailId
    };
    this.setState({ loading: true, message: "" }, () =>
      postColorMappingApi(this.props.userId, form).then(res =>
        that.setState({
          message: res && res.data && res.data.message,
          primary: "",
          secondary: "",
          loading: false
        })
      )
    );
  };

  componentDidMount = () => {
    fetchPrimaryColorApi(this.props.userId).then(res => {
      if (res.status < 350 && res.data && res.data.primaryColorList) {
        const arr = [];
        res.data.primaryColorList.map(v =>
          arr.push({
            ...v,
            label: v.primaryColor,
            value: v.id,
            disabled: v.status != "ACTIVE"
          })
        );
        this.setState({ primaryOptions: arr });
      } else {
        this.setState({ message: res.data.message });
      }
    });
  };

  handleSearch = search => {
    this.setState({ message: "", secondaryLoading: true }, () =>
      search && search.length > 2 && search.trim() !== ""
        ? fetchSecondaryColorApi(this.props.userId, search).then(res => {
            if (res.status < 350 && res.data && res.data.response) {
              const arr = [];
              res.data.response.map(v =>
                arr.push({
                  ...v,
                  label: v.attributeValue,
                  value: v.attributeValueId,
                  disabled: v.status != "ACTIVE"
                })
              );
              this.setState({ secondaryOptions: arr, secondaryLoading: false });
            } else {
              this.setState({
                message: res.data.message || res.statusText,
                secondaryLoading: false
              });
            }
          })
        : this.setState({
            message: "Please provide text to search",
            secondaryLoading: false
          })
    );
  };

  render() {
    const { classes } = this.props;
    const {
      message,
      loading,
      primary,
      secondary,
      primaryOptions,
      secondaryOptions,
      secondaryLoading
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        <Typography variant="h5" gutterBottom component="h5">
          Map Color Code
        </Typography>
        <Paper className={classes.paper}>
          <Grid container spacing={12}>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <Typography>Primary Color</Typography>
              <Select
                name="primary"
                options={primaryOptions}
                className={classes.select}
                value={primary}
                onChange={e => this.setState({ primary: e.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <Typography>Secondary Color</Typography>
              <Select
                isClearable
                isSearchable
                name="secondary"
                value={secondary}
                isLoading={secondaryLoading}
                options={secondaryOptions}
                className={classes.select}
                onInputChange={this.handleSearch}
                onChange={e => this.setState({ secondary: e.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.control}>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                  className={classes.submit}
                  disabled={loading || !primary || !secondary}
                >
                  Submit
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </Grid>
          </Grid>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(style)(connect(mapStateToProps)(MapColorCode));