import React from "react";
import { connect } from "react-redux";
import {
    LinearProgress,
    Grid,
    TextField,
    TableContainer,
    Table,
    TableRow,
    Paper,
    TableCell,
    Button,
    TableBody,
    TableHead
} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

import axios from 'axios';
import {Link} from 'react-router-dom'
import Typography from "@material-ui/core/Typography";
import Notify from "../../components/Notify";
const styles = theme => ({
    paper: {
      padding: theme.spacing.unit * 2,
      marginTop: "10px",
      maxWidth: "100%"
    },
    wrapper:{
      marginTop:"20px"
    },
    control:{
      padding:"10px"
    },
    async:{
      marginTop:"15px",
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
    helper: {
      color: "rgba(0, 0, 0, 0.54)",
      margin: "0",
      fontSize: "0.75rem",
      textAlign: "left",
      margin: "8px 0",
      minHeight: "1em",
      fontFamily:
        'Roboto,"Lato",-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      lineHeight: "1em"
    },
    red: {
      color: "red"
    }
  });
class AssignRoles extends React.Component {
    state = {
        searched_text: "",
        userList : [],
        loading: false
    }

    getUser = (e) => {
        const that = this;
        if (e.key == "Enter" && that.state.searched_text && that.state.searched_text.trim()) {
            this.setState({loading: true, message: ""} , () => axios.get(`/getUsers?text=${that.state.searched_text}`).then(res => {
                if(res && res.data && res.data.response && res.data.response.length>0){
                    that.setState({userList:res.data, loading: false })
                }
                else{
                    that.setState({userList: [], loading: false, message: "No record found" })
                }
              }))
          }else{
              this.setState({message: "Nothing found to search"});
          }
    }

    render() {
        const {classes} = this.props
        const { userList, loading, message} = this.state;
        return (
            <React.Fragment>
                 {(this.props.loading || loading) &&
                        <LinearProgress  />
                    }
                {message && <Notify message={message} />}
                <Grid container lg={12} justify="space-between" className={classes.wrapper}>
                    <Typography variant="h5" gutterBottom component="h5">
                        Search User   
                    </Typography>
                <Button style={{"float":"right"}} variant="contained" color="primary" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
                </Grid>
                <Paper className={classes.paper}>
                <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                 id="outlined-basic"
                                 variant="outlined"
                                 label="Search user by email"
                                value={this.state.searched_text}
                                onKeyDown={this.getUser}
                                onChange={e => {
                                    let searched_text = this.state.searched_text;
                                    searched_text = e.target.value;
                                    this.setState({ searched_text }, () => {
                                        if (this.state.searched_text.length > 3 || this.state.searched_text.length == 0) {
                                            this.getUser(this.state.searched_text);
                                        }
                                    })
                            }} />
                        </Grid>
                    </Grid>
                </Paper>
                <Paper className={classes.paper}>
                   <TableContainer>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No.</TableCell>
                                    <TableCell>userName</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {userList &&
                                <React.Fragment>
                                    {(!userList.errorExists && userList.response) &&
                                        userList.response.map(function(i,index){
                                            return(<React.Fragment key={index}>
                                                <TableRow key={index}>
                                                    <TableCell style={{padding:'10px 10px'}}>{index+1}</TableCell>
                                                    <TableCell>{i.username.length > 30 ? i.username.slice(0,30) + "..." : i.username}</TableCell>
                                                    <TableCell>{i.email.length > 30 ? i.email.slice(0,30) + "..." : i.email}</TableCell>
                                                    <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/role/assignRoles/edit/" + i.id}>Edit</Link> </TableCell>
                                                </TableRow>
                                                </React.Fragment>
                                            )
                                        },this)
                                    }
                                    {(userList.errorExists || userList.length == 0) &&
                                        <TableRow className="no_data_found">
                                            <TableCell colSpan="4" style={{padding : "10px"}}>No data avaliable.</TableCell>
                                        </TableRow>
                                    }
                                </React.Fragment>
                            }
                            {!userList &&
                                <TableRow className="no_data_found">
                                        <TableCell colSpan="4" style={{padding : "10px"}}>No data avaliable.</TableCell>
                                </TableRow>
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>
                   </Paper>
                   
                   
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => ({
    loading: state.brand.loading,
    error: state.brand.error,
});

export default withStyles(styles)(connect(mapStateToProps)(AssignRoles));