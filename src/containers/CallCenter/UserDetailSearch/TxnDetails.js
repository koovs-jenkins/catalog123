import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  Grid,
  TableCell,
  Typography,LinearProgress
} from "@material-ui/core";
import {
  UserTxnDetailsTableHeader,
  paymentMethodMeta,
  statusMeta
} from "../../../../metadata";
import CustomTableCell from "../../../components/CustomTableCell";
import { getSelectedItem } from "../../../helpers";
import { Link } from "react-router-dom";

export default function TxnDetails({
  classes,
  rows,
  handleTxnModalOpen,
  handleShipmentModal,
  loading
}) {
  const { data } = rows;
  return (
    <div className={classes.tableWrapper}>
      <Grid container lg={12} style={{marginTop:"10px"}} justify="center">
        <Typography variant="h5" gutterBottom component="h5">
          All Txns
        </Typography>
      </Grid>
      {loading && <LinearProgress />}
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {UserTxnDetailsTableHeader.map((v, k) => (
              <TableCell key={k + v}>{v}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data && data.length > 0 ? (
            data.map((row, key) => (
              <TableRow key={key} hover>
                <TableCell>{key + 1}</TableCell>
                <TableCell component="th" scope="row">
                  {getSelectedItem(paymentMethodMeta, row.paymentMethod)}
                </TableCell>
                <TableCell>{row.paymentGateway}</TableCell>
                <TableCell>{row.parentOrderId}</TableCell>
                <TableCell component="th" scope="row">
                  {row.orderId + " / " + row.txnId}
                </TableCell>
                <TableCell>{row.purchaseDate}</TableCell>
                <TableCell>{row.productName}</TableCell>
                <TableCell>{getSelectedItem(statusMeta, row.status)}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.sellingPrice}</TableCell>
                <TableCell>{row.actualPrice}</TableCell>
                <TableCell>{row.promocodeDiscount}</TableCell>
                <TableCell>{row.promoCode}</TableCell>
                <TableCell>
                  <Link to="#" onClick={() => handleShipmentModal(row)}>
                    View
                  </Link>
                </TableCell>
                <TableCell>
                  {[1, 6].indexOf(row.status) > -1 && (
                    <Link to="#" onClick={() => handleTxnModalOpen(row)}>
                      Cancel Transaction
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={UserTxnDetailsTableHeader.length}>
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
