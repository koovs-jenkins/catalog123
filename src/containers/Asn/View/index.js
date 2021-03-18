import React from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import { fetchAsnDetailsByPono } from "../../../store/actions/view";
import { postAsnDetails } from "../../../store/actions/details";
import { connect } from "react-redux";
import { getDate, getSunday } from "../../../helpers";
import Tables from "./Tables";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 4,
    margin: "auto",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  }
});

class View extends React.Component {
  state = {
    formData: {},
    isEditable: false
  };

  componentDidMount = () => {
    var payload = {
      Envelope: {
        "@xmlns": "http://schemas.xmlsoap.org/soap/envelope/",
        Body: {
          ReadMultiple: {
            "@xmlns": "urn:microsoft-dynamics-schemas/page/asndoc",
            filter: { Field: "No", Criteria: this.props.match.params[0] },
            bookmarkKey: "",
            setSize: ""
          }
        }
      }
    };
    this.props.dispatch(fetchAsnDetailsByPono(payload)).then(() => {
      const data = this.props.list
        ? this.props.list["Soap:Envelope"]["Soap:Body"]["ReadMultiple_Result"][
            "ReadMultiple_Result"
          ]["ASNDoc"]
        : {};
      this.setState({
        formData: {
          ...data,
          AsnLines: {
            ...data.AsnLines,
            ASN_Line: Array.isArray(data.AsnLines.ASN_Line)
              ? data.AsnLines.ASN_Line
              : [data.AsnLines.ASN_Line]
          }
        }
      });
    });
    this.props.match.path.indexOf("edit") > -1
      ? this.setState({
          isEditable: true
        })
      : this.setState({
          isEditable: false
        });
  };

  handleTableChange = (e, id) => {
    const prevState = this.state;
    const newState = prevState.formData.AsnLines.ASN_Line;
    newState[id][e.target.name] = e.target.value;
    this.setState({
      ...prevState,
      formData: {
        ...prevState.formData,
        AsnLines: {
          ...prevState.formData.AsnLines,
          ASN_Line: newState
        }
      }
    });
    if (
      parseInt(newState[id].Invoice_Qty) >
      parseInt(newState[id].PO_Outstanding_Qty)
    ) {
      newState[id][e.target.name] = e.target.value.slice(0, -1);
      this.setState({
        ...prevState,
        formData: {
          ...prevState.formData,
          AsnLines: {
            ...prevState.formData.AsnLines,
            ASN_Line: newState
          }
        }
      });
      alert("Above Quantity Should  Not Be More Than Outstanding Quantity");
    }
  };

  handleReset = id => {
    const prevState = this.state;
    const rows = prevState.formData.AsnLines.ASN_Line;
    rows.map(v => (v.Invoice_Qty = id == 1 ? v.PO_Outstanding_Qty : "0"));
    this.setState({
      formData: {
        ...prevState.formData,
        AsnLines: {
          ...prevState.formData.AsnLines,
          ASN_Line: rows
        }
      }
    });
  };

  handleFormChange = e => {
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
        value = getSunday(e.target.value) ? e.target.value : "";
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
                No: formData.No,
                HeaderVendorNo: formData.Vendor_No,
                VendorName: formData.Vendor_Name,
                Status: formData.Status,
                TotalBox: formData.Total_Box,
                PlannedDelivery: formData.Planned_Delivery_Date,
                HeaderWarehouseLocation: formData.Warehouse_Location,
                ShippingDetail: formData.Shipping_Details,
                CreationDate: formData.Creation_Date,
                CreationTime: formData.Creation_Time,
                VendorInvoiceNo: formData.Vendor_Invoice_No,
                TotalQty: formData.Total_Qty,
                Tolerance: formData.Tolerance,
                VendorPONo: formData.Vendor_PO_No
              },
              InboundAsnLine: []
            }
          }
        }
      }
    };
    formData.AsnLines.ASN_Line.map(v => {
      data.Envelope.Body.ImportASNInbound.inboundASNXmlport.InboundAsnLine.push(
        {
          "@xmlns": "urn:microsoft-dynamics-nav/xmlports/x50081",
          DocumentNo: formData.No,
          LineNo: v.Line_No,
          ItemNo: v.Item_No,
          VendorNo: formData.Vendor_No,
          Quantity: v.Quantity,
          Size: v.Size,
          Colour: v.Colour,
          PlannedDeliveryDate: v.Planned_Delivery_Date,
          WareHouseLocation: formData.Warehouse_Location,
          VendorPoNo: formData.Vendor_PO_No,
          VendorPoLineNo: v.Vendor_PO_Line_No,
          MRP: v.MRP,
          UnitPrice: v.Unit_Price,
          UnitCost: v.Unit_Cost,
          InvoiceQty: v.Invoice_Qty,
          VendorItemNo: v.Vendor_Item_No,
          POOutstandingQty: v.PO_Outstanding_Qty,
          EAN: v.EAN
        }
      );
    });
    this.props.dispatch(postAsnDetails(data)).then(() =>
      this.props.history.push({
        pathname: "/asn/list",
        state: {
          from: this.props.location.pathname,
          poNo: this.state.formData.Vendor_PO_No
        }
      })
    );
  };

  render() {
    const { classes, match, loading, history } = this.props;
    const { formData, isEditable } = this.state;

    return (
      <React.Fragment>
        {!loading && formData ? (
          <React.Fragment>
            <BackButton
              text={"ASN Detail for ASN ID " + match.params[0]}
              history={history}
            />
            <Paper className={classes.paper}>
              <form onSubmit={this.handleSubmit}>
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      disabled
                      label="Vendor ID"
                      
                      value={formData.Vendor_No || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="Vendor_No"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      disabled
                      label="Vendor Name"
                      
                      value={formData.Vendor_Name || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="Vendor_Name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      disabled
                      label="PO ID"
                      
                      value={formData.Vendor_PO_No || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="Vendor_PO_No"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      disabled
                      label="ASN Status"
                      
                      value={formData.Status || ""}
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
                      disabled={!isEditable}
                      label="Total Boxes"
                      type="number"
                      
                      value={formData.Total_Box || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="Total_Box"
                      onChange={this.handleFormChange}
                      inputProps={{ min: 0, max: 9999999 }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      disabled={!isEditable}
                      label="Invoice No"
                      
                      value={formData.Vendor_Invoice_No || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="Vendor_Invoice_No"
                      onChange={this.handleFormChange}
                      inputProps={{ min: 0, max: 9999999999999 }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      disabled={!isEditable}
                      label="Challan No"
                      
                      value={formData.Shipping_Details || ""}
                      margin="normal"
                          InputLabelProps={{
                        shrink: true
                      }}
                      name="Shipping_Details"
                      onChange={this.handleFormChange}
                      inputProps={{ min: 0, max: 9999999999999 }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      disabled={!isEditable}
                      type="date"
                      label="Delivery Date"
                      
                      value={getDate(formData.Planned_Delivery_Date) || ""}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      name="Planned_Delivery_Date"
                      onChange={this.handleFormChange}
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
                      
                      value={formData.Tolerance === "true" ? "Yes" : "No"}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      name="Tolerance"
                    />
                  </Grid>
                </Grid>
                {formData.AsnLines && (
                  <Tables
                    rows={formData.AsnLines.ASN_Line}
                    isEditable={isEditable}
                    handleFormChange={this.handleTableChange}
                    handleReset={this.handleReset}
                  />
                )}
                {isEditable && (
                  <Grid container justify="center">
                    <Grid item>
                      <Button
                        className={classes.button}
                        type="submit"
                        name="Update ASN"
                        value="Update ASN"
                      />
                    </Grid>
                  </Grid>
                )}
              </form>
            </Paper>
          </React.Fragment>
        ) : (
          <LinearProgress color="secondary" />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  list: state.view.data,
  loading: state.view.loading,
  error: state.view.error
});

export default withStyles(styles)(connect(mapStateToProps)(View));
