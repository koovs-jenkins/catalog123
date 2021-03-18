import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getDate } from "../../../helpers";
import {
  renderButtons,
  view,
  edit,
  accept,
  reject,
  cancel
} from "../../../helpers/asn";
import { fetchAsnList } from "../../../store/actions/home";
import { fade } from "@material-ui/core/styles/colorManipulator";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { postAsnDetails } from "../../../store/actions/details";
import Typography from "@material-ui/core/Typography";
import { recordMessage } from "../../../../config";
import CustomTableCell from "../../../components/CustomTableCell";

const styles = theme => ({
  root: {
    ...theme.paper
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: "auto"
  },
  actions: {
    padding: "1px"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  },
  record: {
    textAlign: "center"
  }
});

class Tables extends React.Component {
  state = {
    rows: []
  };

  componentDidMount = () => {
    const filter = this.props.filter;
    this.props.dispatch(fetchAsnList(this.props.vendorId)).then(() =>
      this.setState({
        rows: filter
          ? this.props.list.filter(a => a.Status === filter)
          : this.props.list
      })
    );
  };

  handleFindAsn = e => {
    const filter = this.props.filter;
    const list = filter
      ? this.props.list.filter(a => a.Status === filter)
      : this.props.list;
    let id = e.target.value.toLowerCase();
    this.setState({
      rows: list
        .reverse()
        .filter(
          v =>
            v.No.toLowerCase().indexOf(id) > -1 ||
            v.Vendor_No.toLowerCase().indexOf(id) > -1 ||
            v.Vendor_PO_No.toLowerCase().indexOf(id) > -1
        )
    });
  };

  handleStatus = (e, id, status, msg = "") => {
    e.preventDefault();
    const data = {
      Envelope: {
        "@xmlns": "http://schemas.xmlsoap.org/soap/envelope/",
        Body: {
          UpdateAsnstatus: {
            "@xmlns": "urn:microsoft-dynamics-schemas/codeunit/NAVWebServices",
            asnUpdateStatusXmlport: {
              UpdateAsnStatus: {
                "@xmlns": "urn:microsoft-dynamics-nav/xmlports/x50082",
                No: id,
                Status: status
              }
            }
          }
        }
      }
    };
    this.props.dispatch(postAsnDetails(data)).then(() => {
      alert(
        `${
          msg ? msg : status
        } Operation successfully done on ASN number = ${id}`
      );
      window.location.reload();
    });
  };

  renderSwitch = (param, className, pono) => {
    switch (param) {
      case "Pending":
        return renderButtons(
          [
            view,
            edit,
            accept(e => {
              if (
                window.confirm(
                  "Warehouse team will be expecting shipment to be delivered on Warehouse confirmation date"
                )
              )
                this.handleStatus(e, pono, "Released");
            }),
            reject(e => {
              if (
                window.confirm(
                  "Are you sure you want to reject warehouse confirmation Date"
                )
              )
                this.handleStatus(e, pono, "Cancel", "Reject");
            })
          ],
          className,
          pono
        );
      case "Open":
        return renderButtons(
          [
            view,
            edit,
            cancel(e => {
              if (window.confirm("Are you sure you want to cancel ASN"))
                this.handleStatus(e, pono, "Cancel");
            })
          ],
          className,
          pono
        );
      case "Confirmed":
        return renderButtons(
          [
            view,
            cancel(e => {
              if (window.confirm("Are you sure you want to cancel ASN"))
                this.handleStatus(e, pono, "Cancel");
            }),
            accept(e => {
              if (
                window.confirm(
                  "Warehouse team will be expecting shipment to be delivered on Warehouse confirmation date"
                )
              )
                this.handleStatus(e, pono, "Released");
            }),
            reject(e => {
              if (
                window.confirm(
                  "Are you sure you want to reject warehouse confirmation Date"
                )
              )
                this.handleStatus(e, pono, "Cancel", "Reject");
            })
          ],
          className,
          pono
        );
      default:
        return renderButtons([view], className, pono);
    }
  };

  render() {
    const { classes, filter, loading } = this.props;
    const { rows } = this.state;

    return (
      <Paper className={classes.root}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            onChange={this.handleFindAsn}
          />
        </div>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell padding="dense">Sr No.</CustomTableCell>
                <CustomTableCell align="center" padding="dense">
                  ASN No.
                </CustomTableCell>
                <CustomTableCell align="center" padding="dense">
                  PO No.
                </CustomTableCell>
                <CustomTableCell align="center" padding="dense">
                  Date Created
                </CustomTableCell>
                <CustomTableCell align="center" padding="dense">
                  Planned Delivery Date
                </CustomTableCell>
                <CustomTableCell align="center" padding="dense">
                  Warehouse Confirmation
                </CustomTableCell>
                <CustomTableCell align="center" padding="dense">
                  Status
                </CustomTableCell>
                <CustomTableCell align="right">Action</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length !== 0 ? (
                rows.map((row, k) => {
                  return (
                    <TableRow key={row.No} hover>
                      <TableCell component="th" scope="row">
                        {k + 1}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.No}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.Vendor_PO_No}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {getDate(row.Creation_Date)}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {getDate(row.Planned_Delivery_Date)}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.Status === "Confirmed" ||
                        row.Status === "Released" ||
                        row.Status === "Closed"
                          ? getDate(row.Warehouse_Conf_Date)
                          : row.Status === "Open"
                          ? "Pending"
                          : "Cancelled"}
                      </TableCell>
                      <TableCell align="center" padding="dense">
                        {row.Status}
                      </TableCell>
                      <TableCell align="right">
                        {this.renderSwitch(row.Status, classes.actions, row.No)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell colSpan={8}>
                    <Typography variant="h5" align="center" padding="dense">
                      {!loading && recordMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

Tables.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Tables);
