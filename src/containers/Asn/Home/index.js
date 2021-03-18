import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { fetchAsnList } from "../../../store/actions/home";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const styles = {
  card: {
    color: "blue",
    cursor: "pointer"
  }
};

class Home extends React.Component {
  state = {
    open: 0,
    closed: 0,
    released: 0,
    rejected: 0,
    pending: 0,
    confirmed: 0,
    cancel: 0
  };

  handleClick = path => {
    this.setState({ path: path });
    this.props.history.push("/asn/list/" + path);
  };

  componentDidMount = () => {
    if (false) {
      this.props.dispatch(fetchAsnList(this.props.vendor.navid_ref)).then(() =>
        this.setState({
          open: this.props.list.filter(a => a.Status === "Open"),
          closed: this.props.list.filter(a => a.Status === "Closed"),
          released: this.props.list.filter(a => a.Status === "Released"),
          confirmed: this.props.list.filter(a => a.Status === "Confirmed"),
          cancel: this.props.list.filter(a => a.Status === "Cancel")
        })
      );
    }
  };

  render() {
    const { classes, vendor } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h5" gutterBottom component="h5">
          Dashboard
        </Typography>
        {false && (
          <Grid container spacing={40}>
            <Grid item xs={12} sm={3}>
              <Card
                className={classes.card}
                onClick={() => this.handleClick("Open")}
              >
                <CardContent>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    Open
                  </Typography>
                  <Typography align="center" gutterBottom component="p">
                    Asn No Response Recieved
                  </Typography>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    {this.state.open.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card
                className={classes.card}
                onClick={() => this.handleClick("Confirmed")}
              >
                <CardContent>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    Confirmed
                  </Typography>
                  <Typography align="center" gutterBottom component="p">
                    Asn Date Change Requested
                  </Typography>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    {this.state.confirmed.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card
                className={classes.card}
                onClick={() => this.handleClick("Released")}
              >
                <CardContent>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    Released
                  </Typography>
                  <Typography align="center" gutterBottom component="p">
                    Asn Delievery Pending
                  </Typography>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    {this.state.released.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card
                className={classes.card}
                onClick={() => this.handleClick("Closed")}
              >
                <CardContent>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    Closed
                  </Typography>
                  <Typography align="center" gutterBottom component="p">
                    ASN Delievered Succesfully
                  </Typography>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    {this.state.closed.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card
                className={classes.card}
                onClick={() => this.handleClick("Cancel")}
              >
                <CardContent>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    Cancelled
                  </Typography>
                  <Typography align="center" gutterBottom component="p">
                    Asn Cancelled
                  </Typography>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    {this.state.cancel.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card
                className={classes.card}
                onClick={() => this.props.history.push("/asn/create")}
              >
                <CardContent>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    Create ASN
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card
                className={classes.card}
                onClick={() => this.props.history.push("/asn/list")}
              >
                <CardContent>
                  <Typography
                    align="center"
                    variant="h5"
                    gutterBottom
                    component="h5"
                  >
                    List ASN
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  list: state.home.data,
  loading: state.home.loading,
  error: state.home.error,
  vendor: state.signin.data.vendor
});

export default withStyles(styles)(connect(mapStateToProps)(Home));
