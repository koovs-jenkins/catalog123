import React from "react";
import {Link} from 'react-router-dom'
import {
    Typography,
    InputLabel,
    Table,
    TableCell,
    Grid,
    TableContainer,
    TableRow,
    TableHead,
    TableBody,
    Paper,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Add from "@material-ui/icons/Add";
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from "react-js-pagination";
import queryString from 'query-string';
import axios from "axios";
var dateFormat = require('dateformat');


const styles = theme => ({
    wrapper:{
        marginTop:"10px"
    },
    paper: {
        marginTop:"10px",
      padding: theme.spacing.unit * 4,
      maxWidth: "100%"
    },
    button: {
      margin: theme.spacing.unit * 4
    },
    control:{padding:"10px"}
  });
  



class ListZones extends React.Component {
    state = {
        searched_text :  "",
        selected_filter : "",
        row_data : "",
        status : "",
        current_page : 1,
        loading : false
    };

    componentDidMount(){
        this.get_query_params(this.props.location.search)
    }

    UNSAFE_componentWillReceiveProps(newProps){
        if(newProps.location.search != this.props.location.search){
          this.get_query_params(newProps.location.search)
        }
    }

    get_query_params(location){
        var all_query_params = queryString.parse(location);
        this.setState({ 
         //   searched_text :  all_query_params.q ? all_query_params.q : "",
          //  selected_filter : all_query_params.filter ? all_query_params.filter  :"",
            current_page : all_query_params.page ? all_query_params.page : 1,
        },()=>{
            this.get_zone_data()
        })
    }

    update_url(){
        if(this.state.searched_text  !== ""){
            this.get_zone_data()
        }else{
            this.props.history.push("/lsp/zones/list/all?page="+ this.state.current_page + "&pageSize=10")
        }
    }

    get_zone_data(){
        var self = this ;
        if(this.state.searched_text && this.state.searched_text.length > 0 &&!this.state.searched_text.trim()){
            alert("Nothing found to search");
        }
        else{
            this.setState({ loading : true },()=>{
                axios.get("/pincode-service/internal/zones?" + "page=" + this.state.current_page +"&pageSize=10").then((res) =>{
                    self.setState({
                        row_data : res.data ? res.data.data : "",
                        loading : false
                    })
                }).catch(error => { self.setState({row_data : "", loading : false })});
            })
          }
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

    handlesearchapi(){
        this.setState({ current_page : 1},()=>{ 
            this.update_url();
        })
    }

    handlefilter(event){
        this.setState({ selected_filter : event.target.value},()=>{
            this.setState({ current_page : 0},()=>{ 
                this.update_url();
            })
        })
    }

    go_to_add(){
        this.props.history.push("/lsp/zoneCreate/create")
    }

    handlePageChange(pageNumber){
       // document.querySelector('.table_button').scrollInt141oView(false);
       this.setState({ current_page : parseInt(pageNumber)},()=>{
           this.update_url();
       })
    }
    
  render() {
    const { classes } = this.props;
    const { row_data, searched_text, selected_filter } = this.state;
    return (
      <React.Fragment>
        {this.state.loading &&
            <LinearProgress />
        }
        <Grid lg={12} className={classes.wrapper} container justify="space-between">
            <Typography variant="h5" gutterBottom component="h5">
                All Zones list  
            </Typography>
        <Button style={{float:"right"}} className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary"> Add Zone </Button>
        </Grid>
        <Paper className={classes.paper}>
                <Table>
                    <TableHead>
                        <TableRow colSpan="12">
                            <TableCell colSpan="2">Zone</TableCell>
                            <TableCell colSpan="2">Status</TableCell>
                            <TableCell colSpan="1">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {row_data &&
                        <React.Fragment>
                        {(!row_data.errorMessage && row_data.data) &&
                            row_data.data.map(function(i,index){
                                return(
                                    <TableRow key={index} colSpan="12">
                                        <TableCell  colSpan="2">{i.zone}</TableCell>
                                        <TableCell colSpan="2">{i.isActive ? "Active" : "Inactive"}</TableCell>
                                        <TableCell colSpan="1" style={{ textAlign :  "left"}}><Link className="edit_button" to={"/lsp/zoneCreate/edit/" + i.id}>Edit</Link> </TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.errorExists || row_data.length == 0) &&
                            <TableRow className="no_data_found">
                                <TableCell colSpan="8" style={{padding : "10px"}}>No data avaliable.</TableCell>
                            </TableRow>
                        }
                        </React.Fragment>
                    }
                    {!row_data &&
                        <TableRow className="no_data_found">
                                <TableCell colSpan="8" style={{padding : "10px"}}>No data avaliable.</TableCell>
                        </TableRow>
                    }
                    </TableBody>
                </Table>
        </Paper>
         <Pagination
                activePage={this.state.current_page}
                itemsCountPerPage={10}
                totalItemsCount={row_data && row_data.totalElement}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange.bind(this)}
                /> 
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({

  });
  

export default withStyles(styles)(connect(mapStateToProps)(ListZones));