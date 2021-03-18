import React from "react";
import DatePicker from "react-datepicker";
import {
  Grid,
  Typography,
  Fab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  Button,
} from "@material-ui/core";
import {
  fetchAllActivePromoList,
  postPromoRankApi,
} from "../../../api/promotionalpromoapi";
import HandleRows from "./handleRows";
import { connect } from "react-redux";
import Modal from "../../../components/Modal";
import Notify from "../../../components/Notify";
import { getCompleteDateTime } from "../../../helpers";
import CustomTableCell from "../../../components/CustomTableCell";

class Create extends React.Component {
  state = {
    expireDate: new Date(),
    rows: [],
    loading: false,
    list: [],
    
    message: "",
    showList: false,
  };

  handleSubmit = () => {
    const that = this;
    this.setState({ loading: true, message: "" }, () =>
      fetchAllActivePromoList(that.props.userId, {
        expireDate: getCompleteDateTime(that.state.expireDate),
      }).then((res) =>
        that.setState({
          rows: res.data.activePromos ? res.data.activePromos : [],
          loading: false,
          message: !res.data.activePromos ? res.statusText : "",
        })
      )
    );
  };

  handleAddToList = (obj) => {
    const { list } = this.state;
    this.setState({ message: "" }, () =>
      list.length >= 20
        ? this.setState({
            message: "Selected promo count cannot be more than 20",
          })
        : this.setState({
            list: list.concat(obj),
          })
    );
  };

  handleRemoveFromList = (obj) => {
    const { list } = this.state;
    this.setState({
      list: list.filter((v) => v.promoId != obj.promoId),
    });
  };

  handleToggleSelectedList = () => {
    this.setState({ showList: !this.state.showList });
  };

  handleOrderChange = (e, row) => {
    const that = this;
    const value = e.target.value;
    const list = [...this.state.list];
    this.setState({ message: "" }, () => {
      if (value > 20) {
        that.setState({ message: "Rank should be less than 20" });
      } else if (value < 1 && value != "") {
        that.setState({ message: "Rank should be greater than 0" });
      } else {
        let newArr = [];
        let newObj = {};
        list.map((v) => {
          newObj = v;
          if (v.promoId == row.promoId) {
            newObj.rank = value;
          }
          newArr.push(newObj);
        });
        that.setState({ list: newArr });
      }
    });
  };

  handleRankSubmit = () => {
    const that = this;
    let isDuplicate = false;
    const { list } = this.state;
    that.setState({ message: "", loading: true }, () => {
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        if (arr.filter((v) => v.rank == list[i].rank).length > 0) {
          isDuplicate = true;
          that.setState({
            message: `Found duplicate rank for ${list[i].rank}`,
            loading: false,
          });
          break;
        } else {
          if (!list[i].rank) {
            isDuplicate = true;
            that.setState({
              message: `Found empty rank field`,
              loading: false,
            });
            break;
          } else {
            arr.push({ promoId: list[i].promoId, rank: list[i].rank });
          }
        }
      }
      !isDuplicate &&
        postPromoRankApi(that.props.userId, arr).then((res) => {
          if (res.status == 200) {
            that.props.handleBackButton(null, "Data submitted successfully");
          } else {
            that.setState({
              message: res.statusText,
              loading: false,
            });
          }
        });
    });
  };

  handleChange = (expireDate) => {
    new Date(expireDate).getTime() >= new Date().getTime() &&
      this.setState({ expireDate });
  };

  render() {
    const { handleBackButton, classes } = this.props;
    const { expireDate, rows, loading, list, message, showList } = this.state;

    return (
      <React.Fragment>
        {loading && <LinearProgress />}
        <Grid container>
          <Grid item xs={12} sm={2} style={{padding:"10px"}}>
            <DatePicker
              helperText="Select Expiry Date"
              selected={expireDate || ""}
              onChange={this.handleChange}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="Time"
              placeholderText="Enter Expiry Date"
              timeIntervals={1}
              minDate={new Date()}
            />
            <Typography>Select Expiry Date</Typography>
          </Grid>
          {message && <Notify message={message} />}
          {list.length > 0 && (
            <Button
              className={classes.selected}
              variant="contained"
              color="primary"
              onClick={this.handleToggleSelectedList}
            >
              Assign Order ({list.length})
            </Button>
          )}
          {rows.length > 0 && (
            <HandleRows
              rows={rows}
              list={list}
              classes={classes}
              handleAddToList={this.handleAddToList}
              handleRemoveFromList={this.handleRemoveFromList}
            />
          )}
        </Grid>
        <Grid container>
        <Grid item xs={12} sm={9} style={{padding:"10px"}}>
            <Button
              color="primary"
              onClick={this.handleSubmit}
              className={classes.fab}
              variant="contained"
            >
              Create
            </Button>
            <Button
              color="primary"
              onClick={handleBackButton}
              className={classes.fab}
              variant="contained"
            >
              Back
            </Button>
          </Grid>
        </Grid>
        <Modal
          open={showList}
          onClose={this.handleToggleSelectedList}
          title="Choose priority order"
          fullWidth
        >
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {["#", "Promo code", "Rank"].map((v, k) => (
                  <TableCell key={k} align="center" padding="dense">
                    {v}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((v, k) => (
                <TableRow hover key={v.promoId}>
                  <TableCell align="center" padding="dense">
                    {k + 1}
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    {v.promoCode}
                  </TableCell>
                  <TableCell align="center" padding="dense">
                    <input
                      name="rank"
                      type="number"
                      onChange={(e) => this.handleOrderChange(e, v)}
                      value={v.rank || ""}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Grid container justify="flex-end">
            <Grid item xs={12}>
              {list && list.length && (
                <Button
                  color="primary"
                  className={classes.fab}
                  variant="contained"
                  onClick={this.handleRankSubmit}
                >
                  Submit
                </Button>
              )}
              <Button
                color="primary"
                className={classes.fab}
                variant="contained"
                onClick={this.handleToggleSelectedList}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  userId: state.signin.data.body.data.user.id,
});

export default connect(mapStateToProps)(Create);
