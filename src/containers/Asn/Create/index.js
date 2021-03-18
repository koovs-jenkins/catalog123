import React from "react";
import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import { connect } from "react-redux";
import { fetchPoList } from "../../../store/actions/po";
import BackButton from "../../../components/BackButton";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    margin: "auto",
    maxWidth: 500
  },
  item: {
    margin: theme.spacing.unit * 2,
    textAlign: "center"
  },
  formControl: {
    margin: theme.spacing.unit,
    width: "90%"
  },
  menuitem: {
    fontSize: "12px"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class Create extends React.Component {
  state = {
    selectedAsn: ""
  };

  componentDidMount = () => {
    this.props.dispatch(fetchPoList(this.props.vendorId));
  };

  handleAsnChange = e => {
    this.setState({ selectedAsn: e.target.value });
  };

  render() {
    const { selectedAsn } = this.state;
    const { classes, data, history } = this.props;

    return (
      <React.Fragment>
        <BackButton text="Create ASN" history={history} />
        <Paper className={classes.paper}>
          <Grid container justify="center" alignItems="center">
            <Grid className={classes.item} item xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="selectAsn-helper">Choose PO</InputLabel>
                <Select
                  value={selectedAsn}
                  onChange={this.handleAsnChange}
                  name="selectAsn"
                >
                  {data &&
                    data.map(result => (
                      <MenuItem
                        className={classes.menuitem}
                        key={result.No}
                        value={result.No}
                      >{`Id No. ${result.No} => Ship To ${
                        result.Ship_to_Name
                      } `}</MenuItem>
                    ))}
                </Select>
                <FormHelperText>
                  Please choose PO => Ship To Location
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid className={classes.item} item xs={12}>
              <Fab
                disabled={!selectedAsn}
                className={classes.button}
                variant="extended"
                color="primary"
                aria-label="Add"
                href={"/asn/detail/" + selectedAsn}
              >
                Create ASN
              </Fab>
              <Fab
                className={classes.button}
                variant="extended"
                color="primary"
                aria-label="Add"
                href="/asn/list"
              >
                View All ASN
              </Fab>
            </Grid>
          </Grid>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: state.po.data.data,
  vendorId: state.signin.data.vendor.navid_ref
});

export default withStyles(styles)(connect(mapStateToProps)(Create));
