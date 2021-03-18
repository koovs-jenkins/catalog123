import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Error from "@material-ui/icons/ErrorOutline";
import LinearProgress from '@material-ui/core/LinearProgress';
import {
    fetchProductLog,
} from "../../store/actions/productlog";
import { connect } from "react-redux";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 4,
    margin: "auto",
    maxWidth: "100%"
  },
  button: {
    margin: theme.spacing.unit * 4
  },
  modalpaper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
});
var dateFormat = require('dateformat');
class LogProduct extends React.Component {
  state = {
    row_data : "",
    current_page : 1,
    totalElement : 0,
};

  

componentDidMount = () => {
   this.get_product_log();
};


get_product_log(){
  this.props.dispatch(fetchProductLog(this.props.match.params.id,this.state.current_page)).then(() =>{
      this.setState({
          row_data : this.props.data.data.auditLogList,
          totalElement : this.props.data.totalElement
      })
  });
}

handlePageChange(pageNumber){
  document.querySelector('.table_button').scrollIntoView(false);
  this.setState({ current_page : pageNumber},()=>{
      this.get_product_log()
  })
}



  render() {
    const { match, loading } = this.props;
    const { row_data } = this.state
    return (
      <React.Fragment>
        {loading &&
            <LinearProgress />
        }
        {!loading && (
          <React.Fragment>
            <Typography variant="h4" gutterBottom component="h2">
              Logs ({match.params.id})
              {this.props.error &&
                  <div className="error_container">
                  {(typeof(this.props.error.error) != "object") &&
                    <p>
                    <Error className="vertical_align_error"/> &nbsp;
                      {this.props.error.error}
                    </p>
                    }
                    {(typeof(this.props.error.error) == "object") &&
                    <p>
                    <Error className="vertical_align_error"/> &nbsp;   &nbsp;
                      {(this.props.error.error.message)}
                    </p>
                    }
                  </div>
                }
                <div className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </div>
                <div className="table_button">
                </div>
            </Typography>
            <div className="table_container">
            <table id="product_table" className="table_wrapper" style={{width: "100%"}}>
                <thead >
                    <tr>
                        <th>Updated At</th>
                        <th>Updated By</th>
                        <th>Log Message</th>
                        <th>Old Value </th>
                        <th>Updated Value</th>
                    </tr>
                </thead>
                <tbody>
                    {row_data &&
                        <React.Fragment>
                        {(!row_data.errorExists && row_data) &&
                            row_data.map(function(k,index){
                                return(
                                    <tr key={index} style={{ height: "40px"}}>
                                        <td>{dateFormat(k.updatedAt,"dd-mm-yyyy hh:mm")}</td>    
                                        <td>{k.updatedBy}</td>    
                                        <td>{k.auditLogMessage}</td>    
                                        <td style={{ verticalAlign : "top" }}>
                                            {k.changeList.oldValue &&
                                              Object.keys(k.changeList.oldValue).map(function(i,index){
                                              if(typeof(k.changeList.oldValue[i]) != "object" && i != "liveStatus"){
                                                  return(<p style={{ textAlign : "left", margin : "0", padding : "0"}}><b>{i}</b>: {k.changeList.oldValue[i]}</p>)
                                              }
                                              else if(typeof(k.changeList.oldValue[i]) == "object" && i != "productOptions" && i != "productLines"){
                                                  var attr = Object.keys(k.changeList.oldValue[i]).map(function(l,lindex){
                                                    if(typeof(k.changeList.oldValue[i][l]) != "object"){
                                                        return(<p style={{ textAlign : "left", margin : "0", padding : "0"}}><b>{l}</b>: {k.changeList.oldValue[i][l]}</p>)
                                                    }
                                                  })
                                                  return(attr)
                                              }
                                              else if(typeof(k.changeList.oldValue[i]) == "object" && i == "productLines"){
                                                  var attr = k.changeList.oldValue[i].map(function(l,lindex){
                                                        return(<p style={{ textAlign : "left", margin : "0", padding : "0"}}><b>Line Data</b>:{l.lineId}</p>)
                                                  })
                                                  return(attr)
                                              }
                                            })}
                                            {!k.changeList.oldValue &&
                                              "N/A"
                                            }
                                        </td> 
                                        <td style={{ verticalAlign : "top" }}>{k.changeList.oldValue &&
                                            Object.keys(k.changeList.newValue).map(function(i,index){
                                              if(typeof(k.changeList.newValue[i]) != "object" && i != "liveStatus"){
                                                  return(<p style={{ textAlign : "left", margin : "0", padding : "0"}}><b>{i}</b>: {k.changeList.newValue[i]}</p>)
                                              }
                                              else if(typeof(k.changeList.newValue[i]) == "object" && i != "productOptions" && i != "productLines"){
                                                  var attr = Object.keys(k.changeList.newValue[i]).map(function(l,lindex){
                                                    if(typeof(k.changeList.newValue[i][l]) != "object"){
                                                        return(<p style={{ textAlign : "left", margin : "0", padding : "0"}}><b>{l}</b>: {k.changeList.newValue[i][l]}</p>)
                                                    }
                                                  })
                                                  return(attr)
                                              }
                                              else if(typeof(k.changeList.newValue[i]) == "object" && i == "productLines"){
                                                  var attr = k.changeList.newValue[i].map(function(l,lindex){
                                                        return(<p style={{ textAlign : "left", margin : "0", padding : "0"}}><b>Line Data</b>:{l.lineId}</p>)
                                                  })
                                                  return(attr)
                                              }
                                            })}
                                            {!k.changeList.oldValue &&
                                              "Product Created"
                                            }
                                        </td>    
                                    </tr>
                                )
                            },this)
                        }
                        {(row_data.errorExists || row_data.length == 0) &&
                            <tr className="no_data_found">
                                <td colSpan="5" style={{padding : "10px"}}>No logs avaliable.</td>
                            </tr>
                        }
                        </React.Fragment>
                    }
                    {!row_data &&
                        <tr className="no_data_found">
                                <td colSpan="5" style={{padding : "10px"}}>No logs avaliable.</td>
                        </tr>
                    }
                </tbody>
            </table>
            {(this.state.totalElement > 0) &&
            <div className="pagination_container">
                <Pagination
                activePage={this.state.current_page}
                itemsCountPerPage={10}
                totalItemsCount={this.state.totalElement}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange.bind(this)}
                /> 
            </div>
            }
          </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}



const mapStateToProps = state => ({
  data: state.logdata.data,
  loading: state.logdata.loading,
  error: state.logdata.error,
});

export default withStyles(styles)(connect(mapStateToProps)(LogProduct));
