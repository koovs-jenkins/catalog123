import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "../../../components/TextField";
import CustomTableCell from "../../../components/CustomTableCell";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: "auto"
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
  }
});

class Tables extends React.Component {
  render() {
    const {
      rows,
      classes,
      isEditable,
      handleFormChange,
      handleReset
    } = this.props;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell padding="checkbox">
                  Merchant Code
                </CustomTableCell>
                <CustomTableCell align="center">SKU ID</CustomTableCell>
                <CustomTableCell align="center">Color</CustomTableCell>
                <CustomTableCell align="center">Size</CustomTableCell>
                <CustomTableCell align="center">PO Qty</CustomTableCell>
                <CustomTableCell align="center">
                  Outstanding Qty
                </CustomTableCell>
                <CustomTableCell align="center">
                  Invoice Qty
                  <br />
                  {isEditable && (
                    <span>
                      <a
                        className={classes.left}
                        value="0"
                        onClick={() => handleReset(0)}
                      >
                        Reset
                      </a>
                      <a
                        className={classes.right}
                        value="1"
                        onClick={() => handleReset(1)}
                      >
                        All
                      </a>
                    </span>
                  )}
                </CustomTableCell>
                <CustomTableCell align="center">EAN Code</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, k) => {
                return (
                  <TableRow key={k} hover>
                    <TableCell component="th" scope="row">
                      {row.Vendor_Item_No}
                    </TableCell>
                    <TableCell align="center">{row.Item_No}</TableCell>
                    <TableCell align="center">
                      <TextField
                        disabled
                        className={classes.textField}
                        value={row.Colour}
                        margin="normal"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        disabled
                        className={classes.textField}
                        value={row.Size}
                        margin="normal"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        disabled
                        className={classes.textField}
                        value={row.Quantity}
                        margin="normal"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        disabled
                        className={classes.textField}
                        value={row.PO_Outstanding_Qty}
                        margin="normal"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        required
                        disabled={!isEditable}
                        className={classes.textField}
                        value={row.Invoice_Qty || ""}
                        margin="normal"
                        name="Invoice_Qty"
                        onChange={e => handleFormChange(e, k)}
                        type="number"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        disabled
                        className={classes.textField}
                        value={row.EAN}
                        margin="normal"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
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
