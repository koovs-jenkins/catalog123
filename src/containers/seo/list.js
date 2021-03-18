import React from "react";
import {Link} from 'react-router-dom'
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";


import Add from "@material-ui/icons/Add";
import {Button,Card,CardContent,Grid,TextField,FormControl ,MenuItem ,InputLabel ,Select,TableBody,TableCell,TableContainer ,TableHead ,TableRow ,Paper,Table   } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import { fetchAllSeo , patchSeo } from "../../store/actions/seo";
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from "react-js-pagination";
import queryString from 'query-string';

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


class AllSeo extends React.Component {
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
            this.get_seo_data()
        })
    }

    update_url(){
        this.props.history.push("/catalogue/list/banner?q="+ this.state.searched_text +"&filter="+ this.state.selected_filter +"&page="+ this.state.current_page)
    }

    get_seo_data(){
        if (
            this.state.searched_text &&
            this.state.searched_text.length > 0 &&
            !this.state.searched_text.trim()
          ) {
            alert("Nothing found to search");
          } else {
            this.props.dispatch(fetchAllSeo(this.state.searched_text, this.state.selected_filter, this.state.current_page)).then(() =>
                this.setState({
                    row_data : this.props.list ? this.props.list : "",
                })
            );
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
            this.props.dispatch(patchSeo(id,(formdata))).then((res) => {
                console.log(updated_data, res, this.props.list)
                this.setState({ 
                    row_data :  updated_data
                },()=>{
                    this.get_seo_data();
                })
            })
        }
    }
    
    handlesearchapi(){
        this.setState({ current_page : 1},()=>{ 
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
        this.props.history.push("/catalogue/banner/create")
    }

    handlePageChange(pageNumber){
        document.querySelector('.table_button').scrollIntoView(false);
        this.setState({ current_page : pageNumber},()=>{
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
        <Grid lg={12} spacing={24} className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
            All SEO Data   <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary">URL's </Button></div>
            </Typography>
        </Grid>
        <Paper className={classes.paper}>
            <Grid container spacing={12}>
                    <Grid xs={8} sm={8} md={8} style={{padding:"10px"}}>
                        <TextField fullWidth id="outlined-basic"  value={searched_text} onChange={this.handlesearch.bind(this)} label="Outlined" variant="outlined" />
                    </Grid>
                    <Grid xs={4} sm={4} md={4} style={{padding:"10px"}}>
                        <FormControl fullWidth variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">All Data</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            onChange={this.handlefilter.bind(this)} 
                            value={selected_filter}
                            label="All Data"
                        >
                            <MenuItem value="">All Data</MenuItem>
                            <MenuItem value="1">Active Data</MenuItem>
                            <MenuItem value="0">Inactive Data</MenuItem>
                        </Select>
                    </FormControl>
            </Grid>
            </Grid>
        </Paper>
            <Card style={{"margin-top":"10px"}}>
                <CardContent>
                    <TableContainer >
                        <Table  aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No</TableCell>
                                    <TableCell >Banner Url</TableCell>
                                    <TableCell >Meta Title</TableCell>
                                    <TableCell >Status</TableCell>
                                    <TableCell >Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {row_data &&
                        <React.Fragment>
                        {(!row_data.errorExists && row_data.data) &&
                            row_data.data.map(function(i,index){
                                return(
                                    <TableRow key={index}>
                                        <TableCell>{this.state.current_page > 1 ? (this.state.current_page-1)*10+(index+1) : (index+1)}</TableCell>
                                        <TableCell>{ i.bannerUrl && i.bannerUrl.length > 30 ? i.bannerUrl.slice(0,30) + "..." : i.bannerUrl}</TableCell>
                                        <TableCell>{i.metaTitle && i.metaTitle.length > 30 ? i.metaTitle.slice(0,30) + "..." : i.metaTitle}</TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Switch onChange={this.handlestatus.bind(this,i.id,index,i.isActive)}  color="primary" checked={i.isActive == 1 ? true : false}/></TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/catalogue/banner/edit/" + i.id}>Edit</Link> </TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.errorExists || row_data.data.length == 0) &&
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
                </CardContent>
            </Card>
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
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({
    list: state.seo.data.data,
    loading: state.seo.loading,
    error: state.seo.error,
  });
  
export default connect(mapStateToProps)(withStyles(styles)(AllSeo));
