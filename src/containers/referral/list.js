import React from "react";
import {Link} from 'react-router-dom'
import {Typography,Grid,Card,CardContent,TextField,Select,InputLabel,FormControl,MenuItem,
Table,
TableBody,
TableHead,
TableContainer,
TableCell,
TableRow
} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from "react-js-pagination";
import queryString from 'query-string';
import axios from "axios";
var dateFormat = require('dateformat');


class AllReferral extends React.Component {
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
            selected_filter : all_query_params.filter ? all_query_params.filter  :"",
            current_page : all_query_params.page ? all_query_params.page : 0,
        },()=>{
            this.get_referral_data()
        })
    }

    update_url(){
        this.props.history.push("/referral_program/ref/list/all?q="+ this.state.searched_text +"&filter="+ this.state.selected_filter +"&page="+ this.state.current_page)
    }

    get_referral_data(){
        var self = this ;
        if(this.state.searched_text &&this.state.searched_text.length > 0 &&!this.state.searched_text.trim()){
            alert("Nothing found to search");
        }
        else{
            this.setState({ loading : true },()=>{
                axios.get("/referral/programs/?search-key="+ this.state.searched_text +"&status=" + this.state.selected_filter + "&page-size=10&page=" + this.state.current_page).then((res) =>{
                    self.setState({
                        row_data : res.data ? res.data : "",
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

    handlestatus(id,index,value){
        var self = this ;
        if(confirm("Are you sure you want to change status to "+ ( value == "ACTIVE" ? "INACTIVE" : "ACTIVE"))){
            this.setState({ loading : true },()=>{
                var updated_data = this.state.row_data
                var formdata = updated_data.data[index]
                    formdata["status"] =  ((value == "ACTIVE") ? "INACTIVE" : "ACTIVE")
                updated_data.data[index].status =  ((value == "ACTIVE") ? "INACTIVE" : "ACTIVE")
                axios.post("/referral/programs/update" ,formdata, {headers: {'Content-Type': 'application/json'}}).then(res => {
                    self.setState({ 
                        loading : false
                    },()=>{
                        self.get_referral_data();
                    })
                }).catch(error => { 
                    alert(error.response.data.errorMessage)
                    self.get_referral_data();
                    self.setState({ loading : false })});;
            })
        }
    }
    
    handlesearchapi(){
        this.setState({ current_page : 0},()=>{ 
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
        this.props.history.push("/referral_program/create")
    }

    handlePageChange(pageNumber){
        document.querySelector('.table_button').scrollIntoView(false);
        this.setState({ current_page : parseInt(pageNumber) - 1},()=>{
            this.update_url();
        })
    }
    
  render() {
    const { row_data, searched_text, selected_filter } = this.state
    return (
      <React.Fragment>
        {this.state.loading &&
            <LinearProgress />
        }
        <Grid container lg={12} style={{marginTop:"10px"}} justify="space-between">
            <Typography variant="h5" gutterBottom component="h5">
            All Referral Programs  
            </Typography>
            <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary"> Referral </Button></div>
        </Grid>
        

        <Card >
            <CardContent>
                <Grid container>
                    <Grid item xs={8} style={{padding:"10px"}}>
                        <TextField variant="outlined" fullWidth label="Search by Referral Program" value={searched_text} onChange={this.handlesearch.bind(this)}/>
                    </Grid>
                    <Grid item xs={4} style={{padding:"10px"}}>
                    <FormControl fullWidth variant="outlined" >
                        <InputLabel id="demo-simple-select-outlined-label">All Data</InputLabel>
                        <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        onChange={this.handlefilter.bind(this)} value={selected_filter}
                        label="All Data"
                        >
                        <MenuItem value="">All Data</MenuItem>
                        <MenuItem value="ACTIVE">Active Data</MenuItem>
                        <MenuItem value="INACTIVE">Inactive Data</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
        <Card style={{marginTop:"10px"}}>
            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>S.No.</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Referral Type</TableCell>
                            <TableCell>Order Amount</TableCell>
                            <TableCell>Program Expiry</TableCell>
                            <TableCell>Referred Cashback Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {row_data &&
                        <React.Fragment>
                        {(!row_data.errorExists && row_data.data) &&
                            row_data.data.map(function(i,index){
                                return(
                                    <TableRow key={index}>
                                        <TableCell>{this.state.current_page > 0 ? (this.state.current_page)*10+(index+1) : (index+1)}</TableCell>
                                        <TableCell>{i.title.length > 30 ? i.title.slice(0,30) + "..." : i.title}</TableCell>
                                        <TableCell>{i.referralType}</TableCell>
                                        <TableCell>{i.thresholdOrderAmount}</TableCell>
                                        <TableCell>{dateFormat(i.programExpiryTime,"dd-mm-yyyy hh:mm")}</TableCell>
                                        <TableCell>{i.referredCashbackType}</TableCell>
                                        <TableCell style={{ textAlign :  "center"}}>
                                            {i.status == "EXPIRED" &&
                                                "Expired"
                                            } 
                                            {i.status != "EXPIRED" &&
                                                <Switch onChange={this.handlestatus.bind(this,i.id,index,i.status)}  color="primary" checked={i.status == "ACTIVE" ? true : false}/>
                                            } 
                                        </TableCell>
                                        <TableCell style={{ textAlign :  "center"}}><Link className="edit_button" to={"/referral_program/edit/" + i.id}>Edit</Link> </TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.errorExists || row_data.data.length == 0) &&
                            <TableRow className="no_data_found">
                                <td colSpan="8" style={{padding : "10px"}}>No data avaliable.</td>
                            </TableRow>
                        }
                        </React.Fragment>
                    }
                    {!row_data &&
                        <TableRow className="no_data_found">
                                <td colSpan="8" style={{padding : "10px"}}>No data avaliable.</td>
                        </TableRow>
                    }
                        </TableBody>
                    </Table>
                </TableContainer>
              
           
            </CardContent>
        </Card>
        {(this.state.row_data.totalElement > 0) &&
                    <Pagination
                    activePage={this.state.current_page}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.row_data.totalElement}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                    /> 
            }
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({

  });
  

export default connect(mapStateToProps)(AllReferral);