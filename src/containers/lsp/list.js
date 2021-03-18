import React from "react";
import {Link} from 'react-router-dom'
import {
    Typography,
    Paper,
    Grid,
    TableRow,
    TextField,
    Table,
    TableContainer,
    TableBody,
    TableHead,
    TableCell
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
      padding: theme.spacing.unit * 2,
      maxWidth: "100%"
    },
    button: {
      margin: theme.spacing.unit * 2
    },
    control:{padding:"10px"}
  });
  



class CourierService extends React.Component {
   
    state = {
        searched_text :  "",
        selected_filter : "",
        row_data : "",
        status : "",
        current_page : 0,
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
            searched_text :  all_query_params.q ? all_query_params.q : "",
            current_page : all_query_params.page ? all_query_params.page : 1,
        },()=>{
            this.get_courier_data()
        })
    }

    update_url(){
    
        
       if(this.state.searched_text !== ""){
        this.get_courier_data()
    }
        else{
            this.props.history.push("/lsp/courier/list/all?page="+ this.state.current_page + "&pageSize=10")
        }
    }


    get_courier_data(){
        var self = this ;
        if(this.state.searched_text && this.state.searched_text.length > 0 && !this.state.searched_text.trim()){
            alert("Nothing found to search");
        }
        else{
            this.setState({ loading : true },()=>{
                if(this.state.searched_text){
                    axios.get("/courier-service/internal/courier-service-search?keyword=" + this.state.searched_text).then((res) =>{
                        self.setState({
                            row_data : res.data ? res.data.data : "",
                            loading : false
                        })
                    }).catch(error => { self.setState({row_data : "", loading : false })});
                }else{
                    axios.get("/courier-service/internal/courier-services?page=" + this.state.current_page + "&pageSize=10").then((res) =>{
                        self.setState({
                            row_data : res.data ? res.data.data : "",
                            loading : false
                        })
                    }).catch(error => { self.setState({row_data : "", loading : false })});
                }
            })
          }
    }

    handlesearch(event){
        console.log("event", event.target.value)
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

    go_to_add(){
        this.props.history.push("/lsp/courierCreate/create")
    }

    handlePageChange(pageNumber){
        document.querySelector('.table_button').scrollIntoView(false);
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
        <Grid lg={12} container justify="space-between" className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
            Courier Data List 
            </Typography>
            <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary"> Courier List </Button></div>
        </Grid>
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs={12}>
                    <TextField variant="outlined" fullWidth label="Search by Courier" value={searched_text} onChange={this.handlesearch.bind(this)}/> 
                </Grid>
            </Grid>
        </Paper>
        <Paper className={classes.paper}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan="1">Code</TableCell>
                            <TableCell colSpan="1">ID</TableCell>
                            <TableCell colSpan="2">Courier Service</TableCell>
                            <TableCell colSpan="1">Status</TableCell>
                            <TableCell colSpan="1">International Support</TableCell>
                            <TableCell colSpan="1">Return Support</TableCell>
                            <TableCell colSpan="3">Secret Key</TableCell>
                            <TableCell colSpan="2">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {row_data &&
                        <React.Fragment>
                        {(!row_data.errorMessage && row_data.data) &&
                            row_data.data.map(function(i,index){
                                return(
                                    <TableRow colSpan="12" key={index}>
                                        <TableCell colSpan="1">{i.code}</TableCell>
                                        <TableCell colSpan="1">{i.id}</TableCell>
                                        <TableCell colSpan="2">{i.courierService}</TableCell>
                                        <TableCell colSpan="1">{i.enableStatus == true ? "Active" :"Inactive" }</TableCell>
                                        <TableCell colSpan="1">{i.internationalSupported == true ? "Active" :"Inactive"}</TableCell>
                                        <TableCell colSpan="1">{i.returnSupported == true ? "Yes" : "No"}</TableCell> 
                                        <TableCell colSpan="3">{i.secretKey}</TableCell>
                                        <TableCell colSpan="2" style={{ textAlign :  "left"}}><Link className="edit_button" to={"/lsp/courierCreate/edit/" + i.id}>Edit</Link> </TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.errorMessage || row_data.data.length == 0) &&
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
            </TableContainer>
        </Paper>
        <div className="pagination_container">
                <Pagination
                activePage={this.state.current_page}
                itemsCountPerPage={10}
                totalItemsCount={row_data && row_data.totalElement}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange.bind(this)}
                /> 
        </div>
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({

  });
  

export default withStyles(styles)(connect(mapStateToProps)(CourierService));