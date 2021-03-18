import React from "react";
import {Link} from 'react-router-dom'
import Typography from "@material-ui/core/Typography";

import Add from "@material-ui/icons/Add";
import Button from '@material-ui/core/Button';
import {
    Switch,
    Grid,
    Table,
    TableBody,
    TableCell ,
    TableContainer,
    TableHead,
    TableRow,
    Paper, 
} from '@material-ui/core';
import { connect } from "react-redux";
import { fetchAllBrand, patchBrand } from "../../store/actions/brand";
import { fetchAllRoles } from "../../store/actions/roles";
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from "react-js-pagination";
import axios from "axios";
class AllRoles extends React.Component {
    state = {
        searched_text :  "",
        selected_filter : "",
        table_row_data : "",
        data:"",
        status : "",
        current_page : 1,
    };

    componentDidMount(){
        this.get_roles_data()
    }

    get_roles_data(){
        if (
            this.state.searched_text &&
            this.state.searched_text.length > 0 &&
            !this.state.searched_text.trim()
          ) {
            alert("Nothing found to search");
          } else {
            this.props.dispatch(fetchAllRoles(this.state.searched_text, this.state.selected_filter, this.state.current_page)).then(()=>{
                this.setState({
                    data:this.props.roleList,
                    table_row_data : this.props.roleList.response.slice((this.state.current_page-1)*10,this.state.current_page*10)
                })
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
        console.log(id,index,value);
        if(confirm("Are you sure you want to change status to "+ (value == 0 ? "ACTIVE" : "INACTIVE"))){
           
            var table_row_data = this.state.table_row_data
            table_row_data[index].is_active =  value == 0 ? 1 : 0
            this.setState({table_row_data})
            let formData = {
                is_active : value == 0 ? 1 : 0,
                id : id
            }
            axios.put('/updateStatus',formData).then(res=>{
                console.log(res);
            })
        }
    }

    handlesearchapi(){
        this.setState({ current_page : 1},()=>{
            this.get_roles_data();
        })
    }

    handlefilter(event){
        this.setState({ selected_filter : event.target.value},()=>{
            this.setState({ current_page : 1})
        })
    }

    go_to_add(){
        this.props.history.push("/role/roles/create")
    }

    handlePageChange(pageNumber){
        document.querySelector('.table_button').scrollIntoView(false);
        this.setState({ current_page : pageNumber},()=>{
          this.setState({
            table_row_data : this.props.roleList.response.slice((this.state.current_page-1)*10,this.state.current_page*10)
            })
          })
    }

  render() {
    const { data, table_row_data, searched_text, selected_filter } = this.state
    return (
      <React.Fragment>
          <Grid container ls={12} justify="space-between" style={{marginTop:"10px"}}>
            <Typography variant="h5" gutterBottom component="h5">
            All Roles   
            </Typography>
            <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary"> 
            <Add className="table_icons"/> Role </Button></div>
          </Grid>
       
        {this.props.loading &&
            <LinearProgress />
        }
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                            <TableCell>S.No.</TableCell>
                            <TableCell>Role Name</TableCell>
                            <TableCell>Descrition</TableCell>
                            <TableCell>Notification Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
            {data &&
            <React.Fragment>
            {(!data.errorExists && data.response) &&
                table_row_data.map(function(i,index){
                    return(<React.Fragment key={index}>
                        {(this.state.selected_filter == '' || this.state.selected_filter== i.is_active) &&
                            <TableRow key={index}>
                                <TableCell>{this.state.current_page > 1 ? (this.state.current_page-1)*10+(index+1) : (index+1)}</TableCell>
                                <TableCell>{i.name.length > 30 ? i.name.slice(0,30) + "..." : i.name}</TableCell>
                                <TableCell>{i.descrition.length > 30 ? i.descrition.slice(0,30) + "..." : i.descrition}</TableCell>
                                <TableCell>{i.notification_email_list.length > 30 ? i.notification_email_list.slice(0,30) + "..." : i.notification_email_list}</TableCell>
                                <TableCell style={{ textAlign :  "left"}}><Switch onChange={this.handlestatus.bind(this,i.id,index,i.is_active)}  color="primary" checked={i.is_active == 1 ? true : false}/></TableCell>
                                <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/role/roles/edit/" + i.id}>Edit</Link> </TableCell>
                            </TableRow>
                        }
                        </React.Fragment>
                    )
                },this)
            }
                        {(data.errorExists || data.response.length == 0) &&
                            <TableRow className="no_data_found">
                                <TableCell colSpan="6" style={{padding : "10px"}}>No data avaliable.</TableCell>
                            </TableRow>
                        }
                        </React.Fragment>
                    }
                    {!data &&
                        <TableRow className="no_data_found">
                                <TableCell colSpan="6" style={{padding : "10px"}}>No data avaliable.</TableCell>
                        </TableRow>
                    }
            </TableBody>
            </Table>
        </TableContainer>
            {(this.state.data.totalElement > 0) &&
            <div className="pagination_container">
                    <Pagination
                    activePage={this.state.current_page}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.data.totalElement}
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
    loading: state.brand.loading,
    error: state.brand.error,
    roleList: state.roles.data
  });


export default connect(mapStateToProps)(AllRoles);
