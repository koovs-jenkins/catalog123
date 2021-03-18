import React from "react";
import {Link} from 'react-router-dom'
import {Typography,TextField,Grid,Paper,Select,TableCell,Table,TableHead,TableBody,TableRow,FormControl,MenuItem,InputLabel} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Add from "@material-ui/icons/Add";
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import { fetchAllUserPromo } from "../../store/actions/userpromo";
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from "react-js-pagination";
import axios from "axios";
var dateFormat = require('dateformat');
const styles = theme => ({
        wrapper:{
        marginTop:"10px"
      },
      paper: {
        padding: theme.spacing.unit * 2,
        marginTop: "10px",
        maxWidth: "100%"
      },
    button: {
      margin: theme.spacing.unit * 2
    },
    control:{padding:"10px"}
});

class AllUserPromo extends React.Component {
    state = {
        searched_text :  "",
        selected_filter : "code",
        row_data : [],
        status : "",
        current_page : 1,
        totalElement : 0,
    };

    componentDidMount(){
        this.get_user_promo_data()
        // this.get_count();
    }

    get_count(){
        var self = this;
        axios.get("/rules/v1/promotion/code/count?genre=user").then(function(res){
            self.setState({ totalElement : res.data.itemCount })
        })
    }

    get_user_promo_data(){
        this.props.dispatch(fetchAllUserPromo(this.state.searched_text, this.state.selected_filter, this.state.current_page)).then(() =>
            this.setState({
                row_data : this.props.list,
                totalElement : this.props.itemCount
            })
        );
    }

    handlesearch(event){
        if (
            event.target.value &&
            event.target.value.length > 0 &&
            event.target.value.trim() == ""
          ) {
            this.setState({ message: "Nothing found to search" });
          } else {
            this.setState({ searched_text : event.target.value },()=>{
                if(this.state.searched_text.length > 2){
                    this.handlesearchapi()
                }
                else if(this.state.searched_text.length == 0){
                    this.get_count()
                    this.handlesearchapi()
                }
            })
        }
    }

    handlestatus(id,index,value){
           
        if(confirm("Are you sure you want to change status to "+ (value == "INACTIVE" ? "ACTIVE" : "INACTIVE"))){
            var formdata = {
                "status": value == "INACTIVE" ? "ACTIVE" : "INACTIVE"
            }
            var updated_data = this.state.row_data
            updated_data.response[index].status =  value == "INACTIVE" ? "ACTIVE" : "INACTIVE"
            this.props.dispatch(patchBrand(id, JSON.stringify(formdata))).then((res) => {
                console.log(updated_data, res, this.props.list)
                this.setState({ 
                    row_data :  updated_data
                },()=>{
                    this.get_user_promo_data();
                })
            })
        }
    }
    
    handlesearchapi(){
        this.setState({ current_page : 1, totalElement : 1},()=>{ 
            this.get_user_promo_data();
        })
    }

    handlefilter(event){
        this.setState({ selected_filter : event.target.value},()=>{
            this.setState({ current_page : 1},()=>{ 
                this.get_user_promo_data();
            })
        })
    }

    go_to_add(){
        this.props.history.push("/promo/user/create")
    }

    handlePageChange(pageNumber){
        document.querySelector('.table_button').scrollIntoView(false);
        this.setState({ current_page : pageNumber},()=>{
            this.get_user_promo_data()
        })
    }
    
  render() {
    const { classes } = this.props;
    const { row_data, searched_text, selected_filter } = this.state
    return (
      <React.Fragment>
        {this.props.loading &&
            <LinearProgress />
        }
        <Grid container lg={12} justify="space-between" className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
            All User Promo  
            </Typography>
            <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary"> <Add className="table_icons"/>  User Promo </Button></div>
        </Grid>

        <Paper>
            <Grid container>
                <Grid item xs={8} className={classes.control}>
                    <TextField fullWidth variant="outlined"  label="Search user promo by code" value={searched_text} onChange={this.handlesearch.bind(this)}/>
                </Grid>
                <Grid item xs={4} className={classes.control}>
                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Search By</InputLabel>
                    <Select label="Search by"  labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"  onChange={this.handlefilter.bind(this)} value={selected_filter}>
                        <MenuItem value="user">Email</MenuItem>
                        <MenuItem value="code">Promocode</MenuItem>
                        <MenuItem value="txnId">Txn ID</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Paper>
        <Paper className={classes.paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>S.No.</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>Expire On</TableCell>
                        <TableCell>Min-Max Qty</TableCell>
                        <TableCell>Free Shipping</TableCell>
                        <TableCell>Edit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {row_data &&
                        <React.Fragment>
                        {(row_data.length > 0) &&
                            row_data.map(function(i,index){
                                return(
                                    <TableRow key={index}>
                                        <TableCell>{this.state.current_page > 1 ? (this.state.current_page-1)*10+(index+1) : (index+1)}</TableCell>
                                        <TableCell>{i.code}</TableCell>
                                        <TableCell>{i.status}</TableCell>
                                        <TableCell>{i.type}</TableCell>
                                        <TableCell>{dateFormat(i.startDate,"dd-mm-yyyy hh:mm")}</TableCell>
                                        <TableCell>{dateFormat(i.expireDate,"dd-mm-yyyy hh:mm")}</TableCell>
                                        <TableCell>{i.promoCodeData[0].minQuantity || "N/A"} - {i.promoCodeData[0].maxQuantity || "N/A"}</TableCell>
                                        <TableCell>{i.freeShipping == "false" ? "False" : "True"}</TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/promo/user/edit/" + i.id}>Edit</Link> </TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.length == 0) &&
                            <TableRow className="no_data_found">
                                <TableCell colSpan="12" style={{padding : "10px",textAlign:"center"}}>No data avaliable.</TableCell>
                            </TableRow>
                        }
                        </React.Fragment>
                    }
                    {!row_data &&
                        <TableRow className="no_data_found">
                                <TableCell colSpan="12" style={{padding : "10px",textAlign:"center"}}>No data avaliable.</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </Paper>
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
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({
    list: state.userpromo.data.data ? state.userpromo.data.data.response : [],
    itemCount: state.userpromo.data.data ? state.userpromo.data.data.totalElement : 0,
    loading: state.userpromo.loading,
    error: state.userpromo.error,
  });
  

export default withStyles(styles)(connect(mapStateToProps)(AllUserPromo));