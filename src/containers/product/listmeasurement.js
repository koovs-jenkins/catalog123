import React from "react";
import {Link} from 'react-router-dom'
import {
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    FormControl,
    InputLabel,
    TableCell,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Select,
} from "@material-ui/core";
import queryString from 'query-string';
import Add from "@material-ui/icons/Add";
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import { fetchAllMeasurement , patchMeasurement } from "../../store/actions/addmeasurement";
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from "react-js-pagination";
import ImgUrl from '../../../config.js'
import { isThisSecond } from "date-fns/esm";
import { withStyles } from "@material-ui/core/styles";



const styles = (theme) => ({
    paper: {
      marginTop:"10px",
      padding: theme.spacing.unit * 2,
      maxWidth: "100%"
    },
    header:{
      display:"flex",
      padding: "10px",
      marginBottom: "10px",
      justifyContent: "space-between"
    },
    formControl: {
      marginLeft: theme.spacing.unit ,
      minWidth: 120,
    },
    heading:{
      fontSize:"0.75rem",
      color:"#000",
      fontWeight:"bold",
      fontFamily:"Roboto"
    },
    wrapper: {
      marginTop:"20px"
    },
    control:{
        padding:"10px"
    },
    batchUpdate: { display: "inline-block" },
    link: { cursor: "pointer", color: "blue", textDecoration: "underline" },
    disable: { opacity: "0.5" },
    live: { color: "green" },
    space: { marginRight: theme.spacing.unit },
  });


class AllMeasurements extends React.Component {
    state = {
        searched_text :  "",
        selected_filter : "",
        row_data : "",
        status : "",
        current_page : 1,
        last_length: -2
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
            this.get_measurement_data()
        })
    }

    update_url(){
        this.props.history.push(this.props.location.pathname + "?q="+ this.state.searched_text +"&filter="+ this.state.selected_filter +"&page="+ this.state.current_page)
    }


    get_measurement_data(){
        if (
            this.state.searched_text &&
            this.state.searched_text.length > 0 &&
            !this.state.searched_text.trim()
          ) {
            alert("Nothing found to search");
          } else {
            this.props.dispatch(fetchAllMeasurement(this.state.searched_text, this.state.selected_filter, this.state.current_page)).then(() =>
                this.setState({
                    row_data : this.props.list,
                })
            );
        }
    }

    handlesearch(event){
        this.setState({ searched_text : event.target.value, last_length: event.target.value.length - 1 },()=>{
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
        this.props.dispatch(patchMeasurement(id, JSON.stringify(formdata))).then((res) => {
            console.log(updated_data, res, this.props.list)
            this.setState({ 
                row_data :  updated_data
            },()=>{
                this.get_measurement_data();
            })
        }
        )
    }
    }
    
    handlesearchapi(){
        this.setState({ current_page : 1})
    }

    handleModelSearch = e => {
        if (e.key == "Enter") {
          this.update_url();
        } else if (e.key == "Backspace" && (this.state.last_length == 0 || this.state.last_length == -1)) {
          this.setState({ searched_text: "", last_length: -1 }, () =>
            this.update_url()
          );
        }
      };

    handlefilter(event){
        this.setState({ selected_filter : event.target.value},()=>{
            this.setState({ current_page : 1},()=>{ 
                this.update_url();
            })
        })
    }

    go_to_add(){
        this.props.history.push("/catalogue/product-measurement/create")
    }

    handlePageChange(pageNumber){
        document.querySelector('.table_button').scrollIntoView(false);
        this.setState({ current_page : pageNumber},()=>{
            this.update_url()
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
                All Models   
            </Typography>
            <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary"> <Add className="table_icons"/> Model </Button></div>
        </Grid>
        <Paper elevation={3} className={classes.paper}>
            <Grid container>
                <Grid item xs={8} className={classes.control}>
                    <TextField variant="outlined" fullWidth label="Press enter to search by model name" value={searched_text} onChange={this.handlesearch.bind(this)} onKeyDown={this.handleModelSearch}/>
                </Grid>
            <Grid item xs={4} className={classes.control}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">All Models</InputLabel>
                    <Select
                    label="All Models"
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined" 
                    onChange={this.handlefilter.bind(this)} value={selected_filter}>
                        <MenuItem value="ACTIVE">Active Models</MenuItem>
                        <MenuItem value="INACTIVE">Inactive Models</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            </Grid>
        </Paper>
        <Paper elevation={3} className={classes.paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Info</TableCell>
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
                                    <tr key={index}>
                                        <TableCell><img src={ImgUrl.imageUrl + i.image} width="50px" height="50px" style={{ borderRadius : "50%"}}/></TableCell>
                                        <TableCell>{i.name.length > 30 ? i.name.slice(0,30) + "..." : i.name}</TableCell>
                                        <TableCell>{i.info ? (i.info.length > 30 ? i.info.slice(0,30) + "..." : i.info) : "N/A"}</TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Switch onChange={this.handlestatus.bind(this,i.id,index,i.status)}  color="primary" checked={i.status == "ACTIVE" ? true : false}/></TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/catalogue/product-measurement/edit/" + i.id}>Edit</Link> </TableCell>
                                    </tr>
                                )
                            },this)
                        }
                        {(row_data.errorExists || row_data.response.length == 0) &&
                            <tr className="no_data_found">
                                <td colSpan="5" style={{padding : "10px"}}>No data avaliable.</td>
                            </tr>
                        }
                        </React.Fragment>
                    }
                    {!row_data &&
                        <tr className="no_data_found">
                                <td colSpan="5" style={{padding : "10px"}}>No data avaliable.</td>
                        </tr>
                    }
                </TableBody>
            </Table>
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
    list: state.addmeasurement.data.data,
    loading: state.addmeasurement.loading,
    error: state.addmeasurement.error,
  });
  
export default connect(mapStateToProps)(withStyles(styles)(AllMeasurements));
