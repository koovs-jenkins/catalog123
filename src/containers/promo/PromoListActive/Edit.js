import React from "react";
import {
  Grid,
  Fab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  IconButton,
  LinearProgress,
  Button,
} from "@material-ui/core";
import {
  fetchActivePromos,
  postPromoRankApi,
  deleteActivePromos,
  fetchAllActivePromoList,
} from "../../../api/promotionalpromoapi";
import HandleRows from "./handleRows";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import Modal from "../../../components/Modal";
import Notify from "../../../components/Notify";
import { Add, Delete } from "@material-ui/icons";
import CustomTableCell from "../../../components/CustomTableCell";
import { viewDateTime, getCompleteDateTime } from "../../../helpers";

class Edit extends React.Component {
  state = {
    rows: [],
    loading: false,
    message: "",
    showModal: false,
    expireDate: new Date(),
    listData: [],
  };

  componentDidMount = () => {
    this.handleRequest();
  };

  handleRequest = (msg) => {
    const that = this;
    this.setState({ loading: true, message: "" }, () =>
      fetchActivePromos(that.props.userId).then((res) =>
        that.setState({
          rows: res.status < 350 ? res.data.activePromos : [],
          loading: false,
          message:
            res.status > 350
              ? "Error occured."
              : res.data &&
                res.data.activePromos &&
                !res.data.activePromos.length
              ? "Active promo list does not exist"
              : msg || "",
        })
      )
    );
  };

  handleOrderChange = (e, row) => {
    const that = this;
    const value = e.target.value;
    const list = [...this.state.rows];
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
    const { rows: list } = this.state;
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
            that.props.handleBackButton(null, "Data updated successfully");
          } else {
            that.setState({
              message: res.statusText,
              loading: false,
            });
          }
        });
    });
  };

  handleDelete = (promoCode) => {
    const that = this;
    this.setState({ loading: true, message: "" }, () =>
      deleteActivePromos(that.props.userId, promoCode).then((res) => {
        if (res && res.status < 350) {
          that.handleRequest(res.data.message || "Successfully deleted");
        } else {
          that.setState({
            loading: false,
            message: res.data.message || "Error in deleting",
          });
        }
      })
    );
  };

  handleModal = () => {
    this.setState((state) => ({ showModal: !state.showModal, listData: [] }));
  };

  handleChange = (expireDate) => {
    new Date(expireDate).getTime() >= new Date().getTime() &&
      this.setState({ expireDate });
  };

  handleSubmit = () => {
    const that = this;
    this.setState({ loading: true, message: "" }, () =>
      fetchAllActivePromoList(that.props.userId, {
        expireDate: getCompleteDateTime(that.state.expireDate),
      }).then((res) =>
        that.setState({
          listData: res.data.activePromos ? res.data.activePromos : [],
          loading: false,
          message: !res.data.activePromos ? res.statusText : "",
        })
      )
    );
  };

  handleAddToList = (obj) => {
    const { rows } = this.state;
    this.setState({ message: "" }, () =>
      rows.length >= 20
        ? this.setState({
            message: "Selected promo count cannot be more than 20",
          })
        : this.setState({
            rows: rows.concat(obj),
          })
    );
  };

  handleRemoveFromList = (obj) => {
    const { rows } = this.state;
    this.setState({
      rows: rows.filter((v) => v.promoId != obj.promoId),
    });
  };

  render() {
    const { handleBackButton, classes } = this.props;
    const {
      rows,
      message,
      loading,
      showModal,
      expireDate,
      listData,
    } = this.state;

    return (
      <React.Fragment>
        {message && <Notify message={message} />}
        {loading && <LinearProgress />}
        <Grid lg={12} style={{padding:"15px"}}>
          <Typography variant="button" align="right" className={classes.expiry}>
            {rows &&
              rows.length > 0 &&
              `This promo list expires on: 
            ${viewDateTime(
              Math.max.apply(
                null,
                rows.map((v) => new Date(v.expireDate).getTime())
              )
            )}`}
          </Typography>
        </Grid>
       
        <Table>
          <TableHead>
            <TableRow>
              {["#", "Promo code", "Rank"].map((v, k) => (
                <TableCell key={k} align="center" padding="dense">
                  {v}
                </TableCell>
              ))}
              <TableCell align="center" padding="dense">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.length ? (
              rows.map((v, k) => (
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
                  <TableCell align="center" padding="dense">
                    <IconButton
                      color="primary"
                      onClick={() => this.handleDelete(v.promoCode)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow hover>
                <TableCell colSpan={4} align="center" padding="dense">
                  No Record Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Grid container justify="space-between">
          <Grid item>
            {rows && rows.length > 0 && (
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
              onClick={handleBackButton}
              className={classes.fab}
              variant="contained"
            >
              Back
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              className={classes.fab}
              onClick={this.handleModal}
            >
              ADD PROMO
            </Button>
          </Grid>
        </Grid>
        <Modal
          open={showModal}
          onClose={this.handleModal}
          title="Add Promo"
          style={{ minHeight: "400px" }}
          maxWidth="lg"
          fullWidth
          actions={
            <Button
              color="primary"
              onClick={this.handleModal}
              className={classes.fab}
              variant="contained"
            >
              Close
            </Button>
          }
        >
          <Grid container  alignItems="center">
            <Grid item lg={3} style={{padding:"10px"}}>
                <DatePicker
                  helperText="Select Expiry Date"
                  selected={expireDate || ""}
                  onChange={this.handleChange}
                  style={{ marginTop: "15px", marginBottom: "10px" }}
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
            <Grid item lg={3} style={{padding:"10px"}}>
              <Button
                color="primary"
                onClick={this.handleSubmit}
                variant="contained"
              >
                Create
              </Button>
            </Grid>
            {listData.length > 0 && (
              <HandleRows
                rows={listData}
                list={rows}
                classes={classes}
                handleAddToList={this.handleAddToList}
                handleRemoveFromList={this.handleRemoveFromList}
              />
            )}
          </Grid>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  userId: state.signin.data.body.data.user.id,
});

export default connect(mapStateToProps)(Edit);
