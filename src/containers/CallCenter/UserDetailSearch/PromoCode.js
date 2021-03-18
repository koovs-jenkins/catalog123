import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Grid,
  LinearProgress
} from "@material-ui/core";
import { UserPromoCodeTableHeader } from "../../../../metadata";
import CustomTableCell from "../../../components/CustomTableCell";
import { getCompleteDateMonth } from "../../../helpers";

export default function PromoCode({ classes, rows, loading }) {
  return (
    <div className={classes.tableWrapper}>
      <Grid container lg={12} style={{marginTop:"10px"}} justify="center">
        <Typography variant="h5" gutterBottom component="h5">
          Promo Codes
        </Typography>
      </Grid>
      {loading && <LinearProgress />}
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {UserPromoCodeTableHeader.map((v, k) => (
              <TableCell key={k + v}>{v}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows && rows.length > 0 ? (
            rows.map(
              (row, value) =>
                row &&
                row.promoCodeData &&
                row.promoCodeData.length > 0 && (
                  <TableRow key={row.id} hover>
                    <TableCell component="th" scope="row">
                      {value + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.code}
                    </TableCell>
                    <TableCell>
                      {row.promoCodeData[0].isPercent
                        ? row.promoCodeData[0].discount + "% off "
                        : "Rs. " + row.promoCodeData[0].discount + " off "}
                      {row.promoCodeData[0].minimumAmount > 0 &&
                        "on minumum purchase of " +
                          row.promoCodeData[0].minimumAmount}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.txnId}</TableCell>
                    <TableCell>
                      {getCompleteDateMonth(row.expireDate)}
                    </TableCell>
                    <TableCell>{row.promoCodeData[0].minimumAmount}</TableCell>
                    <TableCell>{row.promoCodeData[0].maximumAmount}</TableCell>
                    <TableCell>
                      {row.promoCodeData[0].paymentMethodApplicable.join(", ")}
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      {row.promoCodeData[0].applicablePlatformSet.join(", ")}
                    </TableCell>
                  </TableRow>
                )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={UserPromoCodeTableHeader.length}>
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
