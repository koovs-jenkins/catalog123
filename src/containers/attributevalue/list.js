import React from "react";
import {Typography ,
Table,
TableBody,
TableHead,
Button,
Paper,
TableRow,
TableCell,} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import { connect } from "react-redux";
import { fetchAllAttributeValue , patchAttributeValue } from "../../store/actions/attributevalue";
import LinearProgress from '@material-ui/core/LinearProgress';
class AllAttributevalue extends React.Component {
    state = {
        searched_text :  "",
        selected_filter : "",   
        row_data : "",
        status : "",
        current_page : 1,
    };

    componentDidMount(){
        this.get_attributevalue_data()
    }

    get_attributevalue_data(){
        this.props.dispatch(fetchAllAttributeValue(this.props.match.params.attr_id,this.state.searched_text, this.state.selected_filter)).then(() =>
            this.setState({
                row_data : this.props.list.response ? this.props.list.response : [],
            })
        );
    }

    
    handlePageChange(pageNumber){
        this.setState({ current_page : pageNumber},()=>{
            this.get_attributevalue_data()
        })
    }

    handlesearch(event){
        this.setState({ searched_text : event.target.value },()=>{
            if(this.state.searched_text.length > 2){
                this.handlesearchapi()
            }
            else if(this.state.searched_text.length == 0){
                this.handlesearchapi()
            }
        })
    }

    handlestatus(id,index,value){
        if(confirm("Are you sure you want to change status to "+ (value == "INACTIVE" ? "ACTIVE" : "INACTIVE"))){
        var formdata = {
            "status": value == "INACTIVE" ? "ACTIVE" : "INACTIVE"
        }
        var updated_data = this.state.row_data
        updated_data.attributeValues[index].status =  value == "INACTIVE" ? "ACTIVE" : "INACTIVE"
        
        this.props.dispatch(patchAttributeValue(id, JSON.stringify(formdata))).then((res) => {
            this.setState({ 
                row_data :  updated_data
            },()=>{
                this.get_attributevalue_data();
            })
        }
        )
    } 
    }
    
    handlesearchapi(){
        this.get_attributevalue_data();
    }

    handlefilter(event){
        this.setState({ selected_filter : event.target.value},()=>{
            this.setState({ current_page : pageNumber},()=>{
                this.get_attributevalue_data();
            })
        })
    }

    go_to_add(){
        this.props.history.push("/catalogue/attribute-value/create")
    }

    handlePageChange(pageNumber){
        document.querySelector('.table_button').scrollIntoView(false);
        this.setState({ current_page : pageNumber},()=>{
            this.get_brand_data()
        })
    }
    
  render() {
    const { row_data, searched_text, selected_filter } = this.state
    return (
      <React.Fragment>
        {this.props.loading &&
            <LinearProgress />
        }
        <Typography variant="h5" gutterBottom component="h5" style={{marginTop:"10px"}}>
          All Attribute Value of ({this.props.match.params.attr_name})    
          <Button color="primary" variant="contained" className="go_back_create" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
        </Typography>
        <Paper>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Attribute Value</TableCell>
                    <TableCell>Status</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            
            {row_data &&
                        <React.Fragment>
                        {(!row_data.errorExists && row_data.attributeValues && row_data.attributeValues.length > 0) &&
                            row_data.attributeValues.map((v,i) => v && v.attributeValue && <TableRow key={i}>
                            <TableCell>{v.attributeValue}</TableCell>
                            <TableCell style={{ textAlign :  "left"}}> <Switch onChange={this.handlestatus.bind(this,v.attributeValueId,i,v.status)}  color="primary" checked={v.status == "ACTIVE" ? true : false}/></TableCell>
                        </TableRow>)
                        }
                        {(row_data.errorExists) &&
                            <TableRow className="no_data_found">
                                <TableCell colSpan="2" style={{padding : "10px"}}>No data avaliable.</TableCell>
                            </TableRow>
                        }
                        {row_data.attributeValues.length == 0  &&
                        <TableRow className="no_data_found">
                                <TableCell colSpan="2" style={{padding : "10px"}}>No data avaliable.</TableCell>
                        </TableRow>
                        }
                        </React.Fragment>
                    }
                   
            </TableBody>
        </Table>
        <div className="table_container">
      
      {/* <div className="pagination_container">
              <Pagination
              activePage={this.state.current_page}
              itemsCountPerPage={10}
              totalItemsCount={this.state.row_data.totalElement}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange.bind(this)}
              /> 
      </div> */}
  </div>

        </Paper>
      
       
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({
    list: state.attributevalue.data.data,
    loading: state.attributevalue.loading,
    error: state.attributevalue.error,
  });
  

export default connect(mapStateToProps)(AllAttributevalue);