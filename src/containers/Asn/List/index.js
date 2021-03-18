import React from "react";
import Tables from "./Tables";
import BackButton from "../../../components/BackButton";
import Notify from "../../../components/Notify";
import { connect } from "react-redux";

class List extends React.Component {
  state = {
    message: {
      text: "",
      status: false
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      window.location.reload();
    }
    let text;
    if (nextProps.location.state) {
      if (nextProps.location.state.from.indexOf("edit") > -1) {
        text = this.props.response
          ? `ASN number = ${
              this.props.response
            } Update successfully for PO id = ${nextProps.location.state.poNo}`
          : "Error in updating asn";
      } else if (nextProps.location.state.from.indexOf("detail") > -1) {
        text = this.props.response
          ? `ASN number = ${
              this.props.response
            } Created successfully for PO id = ${nextProps.location.state.poNo}`
          : "Error in creating asn";
      }
      this.setState({
        message: {
          text: text,
          status:
            nextProps.location.state.from.indexOf("detail") ||
            nextProps.location.state.from.indexOf("edit")
              ? true
              : false
        }
      });
    }
  }

  render() {
    const {
      match,
      history,
      list,
      loading,
      error,
      vendorId,
      dispatch
    } = this.props;
    const { text, status } = this.state.message;
    return (
      <React.Fragment>
        <BackButton
          text={(match.params.filter || "All") + " ASN List"}
          history={history}
        />
        {status && <Notify message={text} />}
        <Tables
          filter={match.params.filter}
          list={list}
          loading={loading}
          error={error}
          vendorId={vendorId}
          dispatch={dispatch}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  list: state.home.data,
  loading: state.home.loading,
  error: state.home.error,
  vendorId: state.signin.data.vendor.navid_ref,
  response: state.details.response
});

export default connect(mapStateToProps)(List);
