import React from "react";
import {Link} from 'react-router-dom'
import queryString from 'query-string';
import Add from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import { fetchAllPCategory , patchPCategory } from "../../store/actions/parentcategory";
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from "react-js-pagination";
import {Card, CardContent,TextField,Typography,Button,Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    TableRow,
} from '@material-ui/core';

const style = theme => ({
    paper: {
        marginTop:"10px",
        padding: theme.spacing.unit * 2,
        maxWidth: "100%"
      },
    wrapper: {
      marginTop:"20px"
    },
    textField:{
      padding:"10px"
    },
    header:{
      display:"flex",
      padding: "10px",
      marginBottom: "10px",
      justifyContent: "space-between"
    },
    select: {
      marginTop:"15px",
      borderRadius:"5px",
      width: "100%",
      color: "rgba(0, 0, 0, 0.54)",
      fontSize:"16px",
      paddingLeft:"10px",
      height: "56px",
      border: "1px solid rgba(0, 0, 0, 0.23)",
      backgroundColor: "white"
    },
    heading:{
      fontSize:"0.75rem",
      color:"#000",
      fontWeight:"bold",
      fontFamily:"Roboto"
    }
  });


class AllParentCategory extends React.Component {
    state = {
        searched_text :  "",
        selected_filter : "",
        row_data : "",
        status : "",
        current_page : 1,
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
            current_page : all_query_params.page ? all_query_params.page : 1,
        },()=>{
            this.get_category_data()
        })
    }

    update_url(){
        this.props.history.push(this.props.location.pathname + "?q="+ this.state.searched_text +"&filter="+ this.state.selected_filter +"&page="+ this.state.current_page)
    }

    get_category_data(){
      if (
        this.state.searched_text &&
        this.state.searched_text.length > 0 &&
        !this.state.searched_text.trim()
      ) {
        alert("Nothing found to search");
      } else {
        this.props.dispatch(fetchAllPCategory(this.state.searched_text, this.state.selected_filter,this.state.current_page)).then(() =>
            this.setState({
                row_data : this.props.list ? this.props.list : "",
            })
        );
      }
    }

    handlePageChange(pageNumber){
        document.querySelector('.table_button').scrollIntoView(false);
        this.setState({ current_page : pageNumber},()=>{
            this.update_url()
        })
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
        if(confirm("Are you sure you want to change status to "+ (value == "INACTIVE" ? "ACTIVE" : "INACTIVE"))){
        var formdata = {
            "status": value == "INACTIVE" ? "ACTIVE" : "INACTIVE"
        }
        var updated_data = this.state.row_data
        updated_data.response[index].status =  value == "INACTIVE" ? "ACTIVE" : "INACTIVE"
        this.props.dispatch(patchPCategory(id, JSON.stringify(formdata))).then((res) => {
            this.setState({ 
                row_data :  updated_data
            },()=>{
                this.get_category_data()
            })
        }
        )
    }
    }
    
    handlesearchapi(){
        this.setState({ current_page : 1},()=>{ 
            this.update_url();
        })
    }

    handlefilter(event){
        this.setState({ selected_filter : event.target.value},()=>{
            this.setState({ current_page : 1},()=>{ 
                this.update_url();
            })
        })
    }

    go_to_add(){
        this.props.history.push("/catalogue/category/parent/create")
    }

    go_to_master(){
        this.props.history.push("/catalogue/category/child/create")
    }
    
  render() {
    const { classes } = this.props;
    const { row_data, searched_text, selected_filter } = this.state
    return (
      <React.Fragment>
        {this.props.loading &&
            <LinearProgress />
        }
          <Grid container className={classes.header} spacing={12}>  
            <Typography variant="h5" gutterBottom component="h5">
                All Master Category  
            </Typography>
            <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_master.bind(this)} variant="contained" color="primary"> <Add className="table_icons"/> Parent Category </Button> &nbsp; <Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary"> <Add className="table_icons"/> Master Category </Button></div>
          </Grid>
       
        <Paper className={classes.paper} elevation={3}>
                <Grid container>
                    <Grid item xs={8} className={classes.textField}>
                        <TextField
                        label="Search Master Catagory"
                        variant="outlined"
                        value={searched_text} 
                        name="brand_name"
                        onChange={this.handlesearch.bind(this)}
                        required
                        inputProps={{
                            readOnly: this.state.edit_id ? true : false,
                            pattern: "^[a-zA-Z1-9].*",
                            maxLength: "100"
                        }}
                        onInput={e =>
                            (e.target.value = e.target.value
                            .toString()
                            .slice(0, 100))
                        }
                        fullWidth
                        />
                    </Grid>
                    <Grid item xs={4} className={classes.textField}
                    >
                        <FormControl fullWidth variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">All Master Category</InputLabel>
                                <Select
                                label="All Master Category" 
                                onChange={this.handlefilter.bind(this)} value={selected_filter}>
                                    <MenuItem value="ACTIVE">Active Master Category</MenuItem>
                                    <MenuItem value="INACTIVE">Inactive Master Category</MenuItem>
                                </Select>
                            </FormControl>
                    </Grid>
                </Grid>
        </Paper>
        <Paper elevation={3} className={classes.paper}>
                <Grid container>
                <Table>
                    <TableHead >
                        <TableRow >
                            <TableCell className={classes.heading}>
                            S.No.
                            </TableCell>
                            <TableCell className={classes.heading}>
                            Category Name
                            </TableCell>
                            <TableCell className={classes.heading}>
                            Category Description
                            </TableCell>
                            <TableCell className={classes.heading}>
                            Parent Category
                            </TableCell>
                            <TableCell className={classes.heading}>
                            Status
                            </TableCell>
                            <TableCell className={classes.heading}>
                            Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {row_data &&
                        <React.Fragment>
                        {(!row_data.errorExists && row_data.response) &&
                            row_data.response.map(function(i,index){
                                return(
                                    <TableRow
                                        hover
                                        key={index}
                                    >
                                    <TableCell>{this.state.current_page > 1 ? (this.state.current_page-1)*10+(index+1) : (index+1)}</TableCell>
                                        <TableCell>{i.name.length > 30 ? i.name.slice(0,30) + "..." : i.name}</TableCell>
                                        <TableCell>{i.description.length > 30 ? i.description.slice(0,30) + "..." : i.description}</TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/catalogue/list/child/category/" + i.id +"/" + (i.name.split("/").length > 1 ? i.name.split("/").join("-") : i.name) }>View</Link> </TableCell>
                                        <TableCell style={{ textAlign :  "lefts"}}>  <Switch onChange={this.handlestatus.bind(this,i.id,index,i.status)}  color="primary" checked={i.status == "ACTIVE" ? true : false}/></TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/catalogue/category/parent/edit/" + i.id}>Edit</Link> </TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.errorExists || row_data.response.length == 0) &&
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
                </Grid>
        </Paper>
        <>
            {(this.state.row_data.totalElement > 0) &&
            <div className="pagination_container">
                <Pagination
                activePage={this.state.current_page}
                itemsCountPerPage={10}
                totalItemsCount={this.state.row_data.totalElement}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange.bind(this)}
                /> 
            </div>
            }
        </>
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({
    list: state.pcategory.data.data,
    loading: state.pcategory.loading,
    error: state.pcategory.error,
  });
  

export default withStyles(style)(connect(mapStateToProps)(AllParentCategory));