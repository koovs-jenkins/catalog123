import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";

const CustomTableCell = withStyles(theme => ({
  head: {
    minWidth: "190px",
    zIndex: 1,
  },
  body: {
    fontSize: 14,
    minWidth:"180px",
    fontWeight: "normal"
  }
}))(TableCell);

export default CustomTableCell;