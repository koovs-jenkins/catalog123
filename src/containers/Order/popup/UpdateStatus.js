import React from "react";
import Modal from "../../../components/Modal";
import {
  Grid,
  Fab,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
var dateFormat = require('dateformat');
import CustomTableCell from "../../../components/CustomTableCell";


class StatusUpdate extends React.Component {
  state = {
    status :  "",
  };

  componentDidMount(){
    this.setState({ status :  "" , rtoReasonothers : "",rtoReasonId : ""})
  }

  handleform(){
    if(this.state.status  && this.state.rtoReason){
      var data = {"txnDetails":[  
        {  
          "txnId": this.props.modalData.txnId,
          "state":"RTO",
           "status": this.state.status,
           "reasonCode":"",
           "invoiceNo":"",
           "awb":"",
           "courier":"",
           "dateUpdated": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
           "additionalComment":"",
           "rtoReason" : this.state.rtoReason == "Others" ? (this.state.rtoReasonothers ? this.state.rtoReasonothers : "Others") : this.state.rtoReason,
           "rtoReasonId" : this.state.rtoReasonId
        }
     ]}
      this.props.handleFormSubmit(data)
    }
    else{
      alert("Please select order Status & Reason in order to update.")
    }
  }

  render() {
      const {
        classes,
        handleModalClose,
        showModal,
        handleChange,
        modalData,
        rtoReasonData
      } = this.props;
  
  return (
    <Modal
      open={showModal}
      onClose={() =>{ this.setState({ status  : "", rtoReasonothers : "",rtoReasonId : "" },()=>{ handleModalClose();}) }}
      title={
        modalData.title ||
        "Update Shipment Status"
      }
      fullScreen
      maxWidth="l"
    >
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" padding="dense">
                  Transaction Id
                </TableCell>
                <TableCell align="center" padding="dense">
                  Product Name
                </TableCell>
                <TableCell align="center" padding="dense">
                  Select Status
                </TableCell>
                <TableCell align="center" padding="dense">
                  Select Reason
                </TableCell>
                {this.state.rtoReason == "Others" &&
                  <TableCell align="center" padding="dense">
                    Other Reason
                  </TableCell>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell align="center" padding="dense">
                  {modalData.txnId}
                </TableCell>
                <TableCell align="center" padding="dense">
                  {modalData.productName}
                </TableCell>
                <TableCell align="center" padding="dense">
                <Grid item xs={12} sm={12}>
                    <TextField
                        select
                        id="status"
                        value={this.state.status}
                        onChange={(e) => { this.setState({ status  :  e.target.value})}}
                        SelectProps={{
                        native: true,
                        }}
                        margin="normal"
                        fullWidth
                        helperText="Please select status"
                        >
                        <option value="">Select Status</option>
                        <option value="QC Pass">QC Pass</option>
                        <option value="QC Fail">QC Fail</option>
                    </TextField>
                  </Grid>
                </TableCell>
                {this.state.status == "QC Pass" &&
                <React.Fragment>
                <TableCell align="center" padding="dense">
                <Grid item xs={12} sm={12}>
                  <TextField
                      select
                      id="rtoReason"
                      value={this.state.rtoReasonId + "_" + this.state.rtoReason}
                      onChange={(e) => { this.setState({ rtoReason  :  e.target.value.split("_")[1] , rtoReasonId : e.target.value.split("_")[0]})}}
                      SelectProps={{
                      native: true,
                      }}
                      margin="normal"
                      fullWidth
                      helperText="Please select RTO Reason"
                      >
                      <option value="">Select Reason</option>
                      {rtoReasonData.map(option => (
                          <option key={option.id} value={option.id+"_"+option.title}>
                          {option.title}
                          </option>
                      ))}
                  </TextField>
                  </Grid> 
                  </TableCell>
                  {this.state.rtoReason == "Others" &&
                  <TableCell align="center" padding="dense">
                  <Grid item xs={12}>
                    <TextField
                      label="Other Reason"
                      name="other"
                      variant="outlined"
                      margin="none"
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={this.state.rtoReasonothers}
                      onChange={(e)=>{this.setState({ rtoReasonothers : e.target.value })}}
                    />
                  </Grid>
                  </TableCell>
                  }
                  </React.Fragment>
                }
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} className={classes.right}>
          <Button
            color="primary"
            className={classes.fab}
            variant="contained"
            onClick={this.handleform.bind(this)}
          >
            Update
          </Button>
          <Button
            color="primary"
            className={classes.fab}
            variant="contained"
            onClick={() =>{ this.setState({ status  : "", rtoReasonothers : "",rtoReasonId : ""},()=>{ handleModalClose(); }) }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
}

export default StatusUpdate;