import React from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tables from "./Tables";
import {
  fetchAsnDetails,
  postAsnDetails
} from "../../../store/actions/details";
import Button from "../../../components/Button";
import { connect } from "react-redux";
import { getDate, getTime, getSunday } from "../../../helpers";
import BackButton from "../../../components/BackButton";
import Notify from "../../../components/Notify";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 4,
    margin: "auto",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class Detail extends React.Component {
  state = {
    formData: {
      TotalBox: "",
      ChallanNo: "",
      PlannedDelivery: "",
      Status: "Open"
    }
  };

  componentDidMount = () => {
    var payload = {
      Envelope: {
        "@xmlns": "http://schemas.xmlsoap.org/soap/envelope/",
        Body: {
          ReadMultiple: {
            "@xmlns": "urn:microsoft-dynamics-schemas/page/polist",
            filter: { Field: "No", Criteria: this.props.match.params[0] },
            bookmarkKey: "",
            setSize: ""
          }
        }
      }
    };
    this.props.dispatch(fetchAsnDetails(payload)).then(() => {
      this.setState({
        formData: {
          ...this.props.list,
          PurchaseLines: {
            ...this.props.list.PurchaseLines,
            Get_Purchase_Order_Line: Array.isArray(
              this.props.list.PurchaseLines.Get_Purchase_Order_Line
            )
              ? this.props.list.PurchaseLines.Get_Purchase_Order_Line
              : [this.props.list.PurchaseLines.Get_Purchase_Order_Line]
          }
        }
      });
    });
  };

  handleChange = e => {
    const prevState = this.state;
    let value;
    switch (e.target.type) {
      case "number":
        value = e.target.value > 0 ? e.target.value : 0;
        break;
      case "date":
        !getSunday(e.target.value) &&
          alert(
            "OH NOES! We are close on Sundays! Please pick any day other then Sunday."
          );
        value = getSunday(e.target.value) ? e.target.value : 0;
        break;
      default:
        value = e.target.value;
        break;
    }
    this.setState({
      ...prevState,
      formData: {
        ...prevState.formData,
        [e.target.name]: value
      }
    });
  };

  handleTableChange = (e, id) => {
    const prevState = this.state;
    const newState = prevState.formData.PurchaseLines.Get_Purchase_Order_Line;
    newState[id][e.target.name] = e.target.value;
    this.setState({
      ...prevState,
      formData: {
        ...prevState.formData,
        PurchaseLines: {
          ...prevState.formData.PurchaseLines,
          Get_Purchase_Order_Line: newState
        }
      }
    });
    if (
      parseInt(newState[id].InvoiceQty) >
      parseInt(newState[id].Outstanding_Quantity)
    ) {
      newState[id][e.target.name] = e.target.value.slice(0, -1);
      this.setState({
        ...prevState,
        formData: {
          ...prevState.formData,
          PurchaseLines: {
            ...prevState.formData.PurchaseLines,
            Get_Purchase_Order_Line: newState
          }
        }
      });
      alert("Above Quantity Should  Not Be More Than Outstanding Quantity");
    }
  };

  handleReset = id => {
    const prevState = this.state;
    const rows = prevState.formData.PurchaseLines.Get_Purchase_Order_Line;
    rows.map(v => (v.InvoiceQty = id == 1 ? v.Outstanding_Quantity : "0"));
    this.setState({
      formData: {
        ...prevState.formData,
        PurchaseLines: {
          ...prevState.formData.PurchaseLines,
          Get_Purchase_Order_Line: rows
        }
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { formData } = this.state;
    const data = {
      Envelope: {
        "@xmlns": "http://schemas.xmlsoap.org/soap/envelope/",
        Body: {
          ImportASNInbound: {
            "@xmlns": "urn:microsoft-dynamics-schemas/codeunit/NAVWebServices",
            inboundASNXmlport: {
              InboundAsnheader: {
                "@xmlns": "urn:microsoft-dynamics-nav/xmlports/x50081",
                No: "",
                HeaderVendorNo: formData.vendorno,
                VendorName: formData.Buy_from_Vendor_Name,
                Status: formData.Status,
                TotalBox: formData.TotalBox,
                PlannedDelivery: formData.PlannedDelivery,
                HeaderWarehouseLocation: formData.Location_Code,
                ShippingDetail: formData.ChallanNo,
                CreationDate: getDate(),
                CreationTime: getTime(),
                VendorInvoiceNo: formData.VendorInvoiceNo,
                TotalQty: formData.InvoiceQty,
                Tolerance: formData.Tolerance_Applicable,
                HeaderPoOutstandingQty: formData.HeaderPoOutstandingQty || 0,
                PK: formData.PK || 0,
                VendorPONo: formData.No
              },
              InboundAsnLine: []
            }
          }
        }
      }
    };
    formData.PurchaseLines.Get_Purchase_Order_Line.map(v => {
      data.Envelope.Body.ImportASNInbound.inboundASNXmlport.InboundAsnLine.push(
        {
          "@xmlns": "urn:microsoft-dynamics-nav/xmlports/x50081",
          DocumentNo: "",
          LineNo: 0,
          ItemNo: v.ItemNo || 0,
          VendorNo: formData.vendorno,
          Quantity: v.Quantity,
          PostedGateEntryNo: "",
          Size: v.Size,
          Colour: v.Color,
          PlannedDeliveryDate: formData.PlannedDelivery,
          WareHouseLocation: "",
          VendorPoNo: formData.No,
          VendorPoLineNo: v.Line_No,
          MRP: v.MRP,
          UnitPrice: v.Unit_Price_LCY,
          UnitCost: v.Unit_Cost,
          InvoiceQty: v.InvoiceQty,
          VendorItemNo: v.Vendor_Item_No,
          POOutstandingQty: v.Outstanding_Quantity,
          EAN: v.EAN
        }
      );
    });
    this.props.dispatch(postAsnDetails(data)).then(() =>
      this.props.history.push({
        pathname: "/asn/list",
        state: {
          from: this.props.location.pathname,
          poNo: this.props.match.params[0]
        }
      })
    );
  };

  render() {
    const { classes, match, loading, response, history } = this.props;
    const { formData } = this.state;

    return (
      <React.Fragment>
        {!loading && formData.PurchaseLines ? (
          <React.Fragment>
            <BackButton
              text={"Create ASN for PO " + match.params[0]}
              history={history}
            />
            <Paper className={classes.paper}>
              <form onSubmit={this.handleSubmit}>
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      disabled
                      label="Vendor ID"
                      
                      value={formData.vendorno || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="vendorno"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      disabled
                      label="Vendor Name"
                      
                      value={formData.Buy_from_Vendor_Name || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="Buy_from_Vendor_Name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      disabled
                      label="PO ID"
                      
                      value={formData.No || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="No"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      disabled
                      label="ASN Status"
                      
                      value={formData.Status || "Open"}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="Status"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      label="Total Boxes"
                      type="number"
                      
                      value={formData.TotalBox || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="TotalBox"
                      onChange={this.handleChange}
                      inputProps={{ min: 0, max: 9999999 }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      label="Invoice No"
                      
                      value={formData.VendorInvoiceNo || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="VendorInvoiceNo"
                      onChange={this.handleChange}
                      inputProps={{ min: 0, max: 999999999999999 }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Challan No"
                      
                      value={formData.ChallanNo || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="ChallanNo"
                      onChange={this.handleChange}
                      inputProps={{ min: 0, max: 9999999999999 }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="date"
                      label="Delivery Date"
                      
                      value={formData.PlannedDelivery}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      name="PlannedDelivery"
                      onChange={this.handleChange}
                      inputProps={{
                        min: new Date().toISOString().split("T")[0]
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      disabled
                      label="Tolerance Applicable"
                      
                      value={formData.Tolerance ? "Yes" : "No"}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      name="Tolerance"
                    />
                  </Grid>
                </Grid>
                {formData.PurchaseLines.Get_Purchase_Order_Line ? (
                  <Tables
                    rows={formData.PurchaseLines.Get_Purchase_Order_Line}
                    handleTableChange={this.handleTableChange}
                    handleReset={this.handleReset}
                  />
                ) : null}
                <Grid container justify="center">
                  <Grid item>
                    <Button
                      className={classes.button}
                      type="submit"
                      name="Create ASN"
                      value="Create ASN"
                    />
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </React.Fragment>
        ) : loading ? (
          <LinearProgress color="secondary" />
        ) : (
          <React.Fragment>
            <BackButton text="" history={history} />
            <Notify
              message={`All PO quantity has been delieverd. No further ASN can be created against PO ID: ${
                match.params[0]
              }`}
              variant="h5"
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  list: state.details.data,
  loading: state.details.loading,
  error: state.details.error,
  response: state.details.response
});

export default withStyles(styles)(connect(mapStateToProps)(Detail));
