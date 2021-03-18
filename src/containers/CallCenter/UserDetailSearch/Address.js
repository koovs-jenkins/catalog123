import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  LinearProgress,
  Grid,
} from "@material-ui/core";
import { UserAddressTableHeader } from "../../../../metadata";
import CustomTableCell from "../../../components/CustomTableCell";

export default function Address({ classes, rows, loading }) {
  return (
    <div className={classes.tableWrapper}>
      <Grid container lg={12} style={{marginTop:"10px"}} justify="center">
        <Typography variant="h6" gutterBottom component="h6">
          Shipping Address Detail
        </Typography>
      </Grid>
      {loading && <LinearProgress />}
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {UserAddressTableHeader.map((v, k) => (
              <TableCell key={k + v}>{v}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows && rows.length > 0 ? (
            rows.map((row, key) => (
              <TableRow key={key} hover>
                <TableCell component="th" scope="row">
                  {key + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.shippingAddress.name}
                </TableCell>
                <TableCell>{row.shippingAddress.phone}</TableCell>
                <TableCell>{row.shippingAddress.mobile}</TableCell>
                <TableCell>{row.shippingAddress.email}</TableCell>
                <TableCell
                  nowrap="true"
                  style={{
                    width: "300px",
                    overflowWrap: "break-word",
                    padding: "0px 16px"
                  }}
                >
                  {row.shippingAddress.address}
                </TableCell>
                <TableCell>{row.shippingAddress.city}</TableCell>
                <TableCell>{row.shippingAddress.state}</TableCell>
                <TableCell>{row.shippingAddress.country}</TableCell>
                <TableCell>{row.shippingAddress.zip}</TableCell>
                <TableCell>{row.shippingAddress.landmark}</TableCell>
                <TableCell>{row.isDefault ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={UserAddressTableHeader.length}>
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
