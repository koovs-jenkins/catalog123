import React from "react";
import {Link} from 'react-router-dom'
import {
    Typography,
    TextField,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Grid,
    Paper,
    TableContainer
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Add from "@material-ui/icons/Add";
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import CustomTableCell from "../../components/CustomTableCell";
import { connect } from "react-redux";
import { fetchAllPromotionalPromo } from "../../store/actions/promotionalpromo";
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



class AllBankOfferPromo extends React.Component {
    state = {
        searched_text :  "",
        selected_filter : "",
        row_data : [],
        status : "",
        current_page : 1,
        totalElement : 0,
    };

    componentDidMount(){
        this.get_bankpromo_promo_data()
        // this.get_count();
    }

    get_count(){
        var self = this;
        axios.get("/rules/v1/promotion/code/count?type=IMPLICIT_BANK_OFFER").then(function(res){
            self.setState({ totalElement : res.data.itemCount })
        })
    }

    get_bankpromo_promo_data(){
        this.props.dispatch(fetchAllPromotionalPromo(this.state.searched_text, this.state.selected_filter, this.state.current_page, "bankoffer")).then(() =>
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
                this.setState({ 
                    row_data :  updated_data
                },()=>{
                    this.get_bankpromo_promo_data();
                })
            })
        }
    }
    
    handlesearchapi(){
        this.setState({ current_page : 1, totalElement : 1},()=>{ 
            this.get_bankpromo_promo_data();
        })
    }

    handlefilter(event){
        this.setState({ selected_filter : event.target.value},()=>{
            this.setState({ current_page : 1},()=>{ 
                this.get_bankpromo_promo_data();
            })
        })
    }

    go_to_add(){
        this.props.history.push("/promo/bankoffer/create")
    }

    handlePageChange(pageNumber){
        document.querySelector('.table_button').scrollIntoView(false);
        this.setState({ current_page : pageNumber},()=>{
            this.get_bankpromo_promo_data()
        })
    }
    
  render() {
      const {classes}  = this.props;
    const { row_data, searched_text, selected_filter } = this.state
    return (
      <React.Fragment>
        {this.props.loading &&
            <LinearProgress />
        }
        <Grid container lg={12} justify="space-between" className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
            All Bank Offer Promo  
            </Typography>
            <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary"> <Add className="table_icons"/> Bank Offer Promo </Button></div>
        </Grid>
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs={12}>
                 <TextField fullWidth variant="outlined" label="Search bankoffer promo" value={searched_text} onChange={this.handlesearch.bind(this)}/>
                </Grid>
            </Grid>
        </Paper>
        <Paper className={classes.paper}>
        <TableContainer>
            <Table className={classes.table}  stickyHeader  aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <CustomTableCell>S.No.</CustomTableCell>
                    <CustomTableCell>Code</CustomTableCell>
                    <CustomTableCell>Status</CustomTableCell>
                    <CustomTableCell>Type</CustomTableCell>
                    <CustomTableCell>Start Date</CustomTableCell>
                    <CustomTableCell>Expire On</CustomTableCell>
                    <CustomTableCell>Min-Max Qty</CustomTableCell>
                    <CustomTableCell>Free Shipping</CustomTableCell>
                    <CustomTableCell>Edit</CustomTableCell>
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
                                        <TableCell>{dateFormat(i.startDate)}</TableCell>
                                        <TableCell>{dateFormat(i.expireDate)}</TableCell>
                                        <TableCell>{i.promoCodeData[0].minQuantity || "N/A"} - {i.promoCodeData[0].maxQuantity || "N/A"}</TableCell>
                                        <TableCell>{i.freeShipping == "false" ? "False" : "True"}</TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/promo/bankoffer/edit/" + i.id}>Edit</Link> </TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.length == 0) &&
                            <TableRow className="no_data_found">
                                <TableCell colSpan="5" style={{padding : "10px"}}>No data avaliable.</TableCell>
                            </TableRow>
                        }
                        </React.Fragment>
                    }
                    {!row_data &&
                        <TableRow className="no_data_found">
                                <TableCell colSpan="5" style={{padding : "10px"}}>No data avaliable.</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </TableContainer>
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
    list: state.promotionalpromo.data.data ? state.promotionalpromo.data.data.response : [],
    itemCount: state.promotionalpromo.data.data ? state.promotionalpromo.data.data.totalElement : 0,
    loading: state.promotionalpromo.loading,
    error: state.promotionalpromo.error,
  });
  

export default withStyles(styles)(connect(mapStateToProps)(AllBankOfferPromo));