import React from "react";
import {Link} from 'react-router-dom'
import {
    Typography,
    Paper,
    Grid,
    Table,
    TableBody,
    TableContainer,
    TableCell,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
    TableHead,
    TableRow,
    TextField,
} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from "react-js-pagination";
import queryString from 'query-string';
import { getCookie } from "../../helpers/localstorage";
import { withStyles } from "@material-ui/core/styles";

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



class AllVendor extends React.Component {
    state = {
        searched_text :  "",
        selected_filter : "",
        row_data : "",
        status : "",
        current_page : 0,
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
            this.get_vendor_data()
        })
    }

    update_url(){
        this.props.history.push("/vendor/list/all?q="+ this.state.searched_text +"&filter="+ this.state.selected_filter +"&page="+ this.state.current_page)
    }

    get_vendor_data(){
        if (
            this.state.searched_text &&
            this.state.searched_text.length > 0 &&
            !this.state.searched_text.trim()
          ) {
            alert("Nothing found to search");
          } else {
            
            this.setState({ loading : true })
            var self = this;
            var headers = {
              headers: {
                "Content-Type": "Application/json",
                "x-api-client": "OPS",
                "X-AUTH-TOKEN": getCookie("_koovs_token"),
                "X-API-KEY": "SDx7JDUtZCU/RDVlfSE8WA=="
              }
            }
            let formdata = {};
            if(this.state.searched_text){
                formdata["vendorName"] =  this.state.searched_text
            }
            if(this.state.selected_filter){
                formdata["status"] =  this.state.selected_filter
            }
            axios.post("/koovs-auth-service/internal/v1/vendor/summary?page="+this.state.current_page+"&page-size=10", formdata , headers).then((res)=>{
               console.log(res)
               self.setState({ loading : false })
               if(res.data.data){
                   this.setState({ 
                       row_data : res.data.data
                   })
               }
            }).catch((error)=>{
              self.setState({ loading : false })
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
           
        if(confirm("Are you sure you want to change status to "+ (value == 0 ? 1 : 0))){
            var formdata = {
                "isActive": value == 0 ? 1 : 0
            }
            var updated_data = this.state.row_data
            updated_data.data[index].isActive =  value == 0 ? 1 : 0
            // this.props.dispatch(patchSeo(id,(formdata))).then((res) => {
            //     console.log(updated_data, res, this.props.list)
            //     this.setState({ 
            //         row_data :  updated_data
            //     },()=>{
            //         this.get_vendor_data();
            //     })
            // })
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
        this.props.history.push("/vendor/vendor/create")
    }

    handlePageChange(pageNumber){
        document.querySelector('.table_button').scrollIntoView(false);
        this.setState({ current_page : (pageNumber - 1)},()=>{
            this.update_url();
        })
    }
    
  render() {
    const {classes} = this.props;
    const { row_data, searched_text, selected_filter } = this.state
    return (
      <React.Fragment>
        {this.props.loading &&
            <LinearProgress />
        }
        <Grid container lg={12} justify="space-between" className={classes.wrapper}>
        <Typography variant="h5" gutterBottom component="h5">
          All Vendor Data   
        </Typography>
        <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary">Vendor </Button></div>
        </Grid>
      
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs={8} className={classes.control}>
                    <TextField variant="outlined" fullWidth label="Search by Vendor Name" value={searched_text} onChange={this.handlesearch.bind(this)}/>
                </Grid>
                <Grid item xs={4} className={classes.control}>
                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-filled-label">All Data</InputLabel>
                        <Select
                            label="All Data"
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined" 
                            onChange={this.handlefilter.bind(this)} value={selected_filter} >
                            <MenuItem value="ACTIVE">Active Data</MenuItem>
                            <MenuItem value="INACTIVE">Inactive Data</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Paper>
        <Paper className={classes.paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>Pincode</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {row_data &&
                        <React.Fragment>
                        {(!row_data.errorExists && row_data.vendors) &&
                            row_data.vendors.map(function(i,index){
                                return(
                                    <TableRow key={index}>
                                        <TableCell>{i.name.length > 30 ? i.name.slice(0,30) + "..." : i.name}</TableCell>
                                        <TableCell>{i.city.length > 30 ? i.city.slice(0,30) + "..." : i.city}</TableCell>
                                        <TableCell>{i.pincode}</TableCell>
                                        <TableCell>{i.state}</TableCell>
                                        <TableCell>{i.email}</TableCell>
                                        {/* <td style={{ textAlign :  "center"}}><Switch onChange={this.handlestatus.bind(this,i.id,index,i.status)}  color="primary" checked={i.status == "ACTIVE" ? true : false}/></td> */}
                                        <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/vendor/vendor/edit/" + i.id}>Edit</Link> </TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.errorExists || row_data.vendors.length == 0) &&
                            <TableRow className="no_data_found">
                                <TableCell colSpan="6" style={{padding : "10px",textAlign:"center"}}>No data avaliable.</TableCell>
                            </TableRow>
                        }
                        </React.Fragment>
                    }
                    {!row_data &&
                        <TableRow className="no_data_found">
                                <TableCell colSpan="6" style={{padding : "10px",textAlign:"center"}}>No data avaliable.</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
           
        </Paper>
        {(this.state.row_data.totalCount > 0) &&
            <div className="pagination_container">
                    <Pagination
                    activePage={this.state.current_page}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.row_data.totalCount}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                    /> 
            </div>
        }
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({
});
  

export default withStyles(styles)(connect(mapStateToProps)(AllVendor));
