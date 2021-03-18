import React from "react";
import {Link} from 'react-router-dom'
import {Typography,Table,TableContainer,TableBody,TableHead,TableRow,TableCell} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import { withStyles,Grid,Paper } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
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

class PaymentOptions extends React.Component {
    state = {
        row_data : [],
        status : "",
        loading : false,
        selected_row : "",
    };

    componentDidMount(){
        this.get_payment_modes()
    }
    get_payment_modes(){
        var self = this ;
        var headers = {
            "Content-Type": "Application/json",
            "x-api-client": "OPS",
            "x-user-id": this.props.userId
        }
        this.setState({ loading : true },()=>{
            axios.get("/jarvis-order-service/internal/v1/payment/paymodes/all" , {headers}).then((res) =>{
                self.setState({
                    row_data : res.data.data.length > 0 ? res.data.data : [],
                    loading : false
                })
            }).catch(error => { self.setState({row_data : [], loading : false })});
        })
    }
    handlestatus(id,status,mode){
        var self = this ;
        if(confirm("Are you sure you want to change status to "+ ( status == true ? "false" : "true"))){
            this.setState({ loading : true },()=>{
                var formdata = {
                    "updatedModeList":[
                        {
                            "id": id,
                            "active": status ? false : true,
                            "type": mode
                        }
                    ]
                }
                var headers = {
                    "Content-Type": "Application/json",
                    "x-api-client": "OPS",
                    "x-user-id": this.props.userId
                }
                axios.post("/jarvis-order-service/internal/v1/payment/paymodes/update" ,formdata, {headers}).then(res => {
                    self.setState({ 
                        loading : false
                    },()=>{
                        self.get_payment_modes();
                    })
                }).catch(error => { 
                    alert(error.response.data.errorMessage)
                    self.get_payment_modes();
                    self.setState({ loading : false })});;
            })
        }
    }

    handle_selected_row(index){
        if(index !== this.state.selected_row){
            this.setState({ selected_row : index })
        }
        else{
            this.setState({ selected_row : "" })
        }
    }

  render() {
    const {classes} = this.props;
    const { row_data, searched_text, selected_filter } = this.state
    return (
      <React.Fragment>
        {this.state.loading &&
            <LinearProgress />
        }
        <Grid container lg={12} className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
                All Payment Options
            </Typography>
        </Grid>
       <Paper>
       <TableContainer>
            <Table  >
                <TableHead >
                    <TableRow>
                        <TableCell>S.No.</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {row_data.map(function(i,index){
                        return(
                            <React.Fragment>
                            <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>
                                    {i.name == "zeroPayment" && "Zero Payment"}
                                    {i.name == "creditcard" && "Credit Card"}
                                    {i.name == "debitcard" && "Debit Card"}
                                    {i.name == "netbanking" && "Net Banking"}
                                    {i.name == "atmcard" && "Atm Card"}
                                    {i.name == "wallet" && "Wallet"}
                                    {i.name == "cod" && "COD"}
                                    {i.name == "paylater" && "Pay Later"}
                                    {i.name == "emi" && "Emi"}
                                    {i.name == "koovswallet" && "Koovs Wallet/Gift Card"}
                                </TableCell>
                                <TableCell style={{ textAlign :  "left"}}>
                                    <Switch onChange={this.handlestatus.bind(this,i.id,i.active,"mode")}  color="primary" checked={i.active}/>
                                </TableCell>
                                <TableCell><a style={{ cursor : "pointer" }} className="edit_button" onClick={this.handle_selected_row.bind(this,index)}>
                                        {this.state.selected_row !== index && "Expand"}
                                        {this.state.selected_row === index && "Minimize"}
                                    </a>
                                </TableCell>
                            </TableRow>
                            {this.state.selected_row === index &&
                                <TableRow>
                                    <TableCell colSpan="4">
                                        <Table style={{width: "96%" , margin : "20px" }}>
                                            <TableHead >
                                                <TableRow>
                                                    <TableCell >S.No.</TableCell>
                                                    <TableCell >Name</TableCell>
                                                    <TableCell >Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {i.subModes.map(function(j,jindex){
                                                    return(
                                                        <TableRow key={jindex}>
                                                            <TableCell>{jindex+1}</TableCell>
                                                            <TableCell>{j.name}</TableCell>
                                                            <TableCell style={{ textAlign :  "left"}}>
                                                                <Switch onChange={this.handlestatus.bind(this,j.id,j.active,"submode")}  color="primary" checked={j.active}/>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                },this)}
                                                {i.subModes.length == 0 && 
                                                    <TableRow className="no_data_found">
                                                        <TableCell colSpan="3" style={{padding : "10px"}}>No submodes avaliable.</TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                </TableRow>
                            }
                            </React.Fragment>
                        )
                    },this)}
                    {row_data.length  == 0 &&
                        <TableRow className="no_data_found">
                                <TableCell colSpan="4" style={{padding : "10px"}}>No Payment options avaliable.</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </TableContainer>
       </Paper>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
    userId: state.signin.data.body.data.user.id
});

export default withStyles(styles)(PaymentOptions);