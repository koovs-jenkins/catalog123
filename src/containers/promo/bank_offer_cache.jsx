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
    Paper
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Add from "@material-ui/icons/Add";
import Button from '@material-ui/core/Button';
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


class BankOfferCache extends React.Component {
    state = {
        row_data : [],
        message : ""
    };

    componentDidMount(){
        this.get_bankpromo_promo_cache()
    }

    get_bankpromo_promo_cache(){
        var self = this;
        axios.get("/rules/v1/promotion/active/cached-bank-offers").then(function(res){
            self.setState({ row_data : res.data.data , message : res.data })
        })
    }
    
    go_to_add(){
        var self = this;
        axios.post("/rules/v1/promotion/refresh-cache/bank-offers").then(function(res){
            self.get_bankpromo_promo_cache()
        })
    }
    
  render() {
      const {classes} = this.props;
    const { row_data } = this.state
    return (
      <React.Fragment>
        {this.props.loading &&
            <LinearProgress />
        }
        <Grid container lg={12} className={classes.wrapper} justify="space-between">
            <Typography variant="h5" gutterBottom component="h5">
            Bank Offer Cache List  
            </Typography>
            <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary"> Refresh Promo Cache </Button></div>
        </Grid>
        <Paper className={classes.paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Bank Name</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>Expire On</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {row_data &&
                        <React.Fragment>
                        {(row_data.length > 0) &&
                            row_data.map(function(i,index){
                                return(
                                    <TableRow key={index}>
                                        <TableCell>{i.promoCode}</TableCell>
                                        <TableCell>{i.status}</TableCell>
                                        <TableCell>{i.bankName}</TableCell>
                                        <TableCell>{dateFormat(i.startDate)}</TableCell>
                                        <TableCell>{dateFormat(i.expireDate)}</TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.length == 0) &&
                            <TableRow className="no_data_found">
                                <TableCell colSpan="5" style={{padding : "10px",textAlign:"center"}}>No data avaliable.</TableCell>
                            </TableRow>
                        }
                        </React.Fragment>
                    }
                    {!row_data &&
                        <TableRow className="no_data_found">
                                <TableCell colSpan="5" style={{padding : "10px",textAlign:"center"}}>No data avaliable.</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
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
        </Paper>
           
      </React.Fragment>
    );
  }
}


export default withStyles(styles)(BankOfferCache);