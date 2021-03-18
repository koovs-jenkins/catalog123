import React from "react";
import {
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import CustomTableCell from "../../../components/CustomTableCell";
import { promoListMeta } from "../../../../metadata";

const HandleRows = (props) => {
  const { rows, list, classes, handleAddToList, handleRemoveFromList } = props;
  return (
    <Grid item xs={12} style={{padding:"15px"}}>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              {promoListMeta.map((v, k) => (
                <TableCell key={k} align="center" padding="dense">
                  {v}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((v, k) => (
              <TableRow hover key={v.promoId}>
                <TableCell align="center" padding="dense">
                  {k + 1}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {v.promoCode}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {v.type}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {v.startDate}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {v.expireDate}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {list.filter((r) => r.promoId == v.promoId).length > 0 ? (
                    <IconButton
                      color="primary"
                      aria-label="delete"
                      onClick={() => handleRemoveFromList(v)}
                    >
                      <Remove />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="primary"
                      aria-label="add"
                      onClick={() => handleAddToList(v)}
                    >
                      <Add />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Grid>
  );
};

export default HandleRows;
