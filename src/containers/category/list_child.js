import React from "react";
import {Link} from 'react-router-dom'
import {Typography,Grid,Paper,TextField,
    Select,
    Table,
    TableHead,
    TableBody,
    Button,
    TableContainer,
    TableRow,
    MenuItem,
    FormControl,
    InputLabel,
    TableCell
}
 from "@material-ui/core";
import queryString from 'query-string';
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import { fetchAllCCategory , patchCCategory } from "../../store/actions/childcategory";
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from "react-js-pagination";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    paper: {
      padding: theme.spacing.unit * 2,
      marginTop: "20px",
      maxWidth: "100%"
    },
    wrapper:{marginTop:"20px"},
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
    control:{
      padding:"10px"
    },
    button: {
      margin: theme.spacing.unit * 4
    },
    item: {
      margin: theme.spacing.unit * 2,
      textAlign: "center"
    },
    menuitem: {
      fontSize: "12px"
    },
  });
class AllChildCategory extends React.Component {
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

  get_category_data() {
    if (
      this.state.searched_text &&
      this.state.searched_text.length > 0 &&
      !this.state.searched_text.trim()
    ) {
      alert("Nothing found to search");
    } else {
      this.props
        .dispatch(
          fetchAllCCategory(
            this.props.match.params.parent_id,
            this.state.searched_text,
            this.state.selected_filter,
            this.state.current_page
          )
        )
        .then(() =>
          this.setState({
            row_data: this.props.list ? this.props.list : ""
          })
        );
    }
  }

    handlePageChange(pageNumber){
        // document.querySelector('.table_button').scrollIntoView(false);
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
        this.props.dispatch(patchCCategory(id, JSON.stringify(formdata))).then((res) => {
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
        this.update_url();
    }

    handlefilter(event){
        this.setState({ selected_filter : event.target.value},()=>{
            this.setState({ current_page : 1},()=>{ 
                this.update_url();
            })
        })
    }

    handleGoBack = (e) => {
        if(this.props.location.search){
            this.props.history.push(this.props.match.url);
        }else{
            this.props.history.push("/catalogue/list/parent/category");
        }
    }
    
  render() {
    const {classes} = this.props;
    const { row_data, searched_text, selected_filter } = this.state
    return (
      <React.Fragment>
        {this.props.loading &&
            <LinearProgress />
        }
        <Grid container lg={12} className={classes.wrapper} justify="space-between">
            <Typography variant="h5" gutterBottom component="h5">
            All Parent Category  of ({this.props.match.params.parent_name})
            </Typography>
            <Button variant="contained" color="primary" className="go_back_create" onClick={this.handleGoBack}> Go Back </Button>
        </Grid>
        <Paper className={classes.paper}>
            <Grid container>
                <Grid lg={8} className={classes.control}>
                    <TextField variant="outlined" fullWidth label="Search Parent Category by Name" value={searched_text} onChange={this.handlesearch.bind(this)}/>
                </Grid>
                <Grid lg={4} className={classes.control}>
                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">All Parent Category</InputLabel>
                        <Select 
                        label="All Parent Category"
                         labelId="demo-simple-select-outlined-label"
                         id="demo-simple-select-outlined"
                         onChange={this.handlefilter.bind(this)} 
                         value={selected_filter}>
                                <MenuItem value="">All Parent Category</MenuItem>
                                <MenuItem value="ACTIVE">Active Parent Category</MenuItem>
                                <MenuItem value="INACTIVE">Inactive Parent Category</MenuItem>
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
                        <TableCell>Category Name</TableCell>
                        <TableCell>Category Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {row_data &&
                        <React.Fragment>
                        {(!row_data.errorExists && row_data.response) &&
                            row_data.response.map(function(i,index){
                                return(
                                    <TableRow key={index}>
                                        <TableCell>{this.state.current_page > 1 ? (this.state.current_page-1)*10+(index+1) : (index+1)}</TableCell>
                                        <TableCell>{ i.name && i.name.length > 30 ? i.name.slice(0,30) + "..." : i.name}</TableCell>
                                        <TableCell>{i.description && i.description.length > 30 ? i.description.slice(0,30) + "..." : i.description}</TableCell>
                                        <TableCell style={{ textAlign :  "left"}}>  <Switch onChange={this.handlestatus.bind(this,i.id,index,i.status)}  color="primary" checked={i.status == "ACTIVE" ? true : false}/></TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/catalogue/category/child/edit/" + i.id}>Edit</Link> </TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.errorExists || (row_data.response && row_data.response.length == 0)) &&
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
        </Paper>
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({
    list: state.ccategory.data.data,
    loading: state.ccategory.loading,
    error: state.ccategory.error,
  });
  

export default withStyles(styles)(connect(mapStateToProps)(AllChildCategory));
