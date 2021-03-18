import React from "react";
import {Link} from 'react-router-dom';
import {Card, CardContent,TextField,Typography,Button,Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    withStyles
} from '@material-ui/core';
import queryString from 'query-string';
import Add from "@material-ui/icons/Add";
import Switch from '@material-ui/core/Switch';
import { connect } from "react-redux";
import { fetchAllAttributeType , patchAttributeType } from "../../store/actions/attributetype";
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from "react-js-pagination";

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
      marginRight:"10px"
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


class AllAttributetype extends React.Component {

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
            this.get_attributetype_data()
        })
    }

    update_url(){
        this.props.history.push("/catalogue/list/attribute?q="+ this.state.searched_text +"&filter="+ this.state.selected_filter +"&page="+ this.state.current_page)
    }

    get_attributetype_data(){
        if (
            this.state.searched_text &&
            this.state.searched_text.length > 0 &&
            !this.state.searched_text.trim()
          ) {
            alert("Nothing found to search");
          } else {
            this.props.dispatch(fetchAllAttributeType(this.state.searched_text, this.state.selected_filter,this.state.current_page)).then(() =>
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
        this.props.dispatch(patchAttributeType(id, JSON.stringify(formdata))).then((res) => {
            this.setState({ 
                row_data :  updated_data
            },()=>{
                // this.get_attributetype_data();
            })
        }
        )
        }  
    }
    
    handlesearchapi(){
        this.setState({ current_page : 1},()=>{ 
        this.update_url();
        });
    }

    handlefilter(event){
        this.setState({ selected_filter : event.target.value},()=>{
            this.setState({ current_page : 1},()=>{ 
                this.update_url();
            });
        })
    }

    go_to_add(){
        this.props.history.push("/catalogue/attribute/create")
    }

    go_to_attr_value(){
        this.props.history.push("/catalogue/attribute-value/create")
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
            All Attribute Type 
        </Typography>
        <div className="table_button"><Button className="table_onbutton" onClick={this.go_to_attr_value.bind(this)} variant="contained" color="primary"> <Add className="table_icons"/> Attribute Value </Button> &nbsp; <Button className="table_onbutton" onClick={this.go_to_add.bind(this)} variant="contained" color="primary"> <Add className="table_icons"/> Attribute Type </Button></div>
       </Grid>

        <Paper className={classes.paper}  elevation={3}>
                <Grid container>
                    <Grid xs={12}>
                        <TextField
                            label="Search Attribute Type by Name"
                            variant="outlined"
                            value={searched_text} 
                        margin="normal"
                        name="brand_name"
                        onChange={this.handlesearch.bind(this)}
                        required
                        fullWidth
                        />
                    </Grid>
                </Grid>
        </Paper>
        <Paper className={classes.paper}  elevation={3}>
            <Grid container>
                <Table>
                    <TableHead >
                        <TableRow >
                            <TableCell className={classes.heading}>
                                S.No. 
                            </TableCell>
                            <TableCell className={classes.heading}>Name</TableCell>
                            <TableCell className={classes.heading}>Category</TableCell>
                            <TableCell className={classes.heading}>Label</TableCell>
                            <TableCell className={classes.heading}>Status</TableCell>
                            <TableCell className={classes.heading}>Values</TableCell>
                            <TableCell className={classes.heading}>Action</TableCell>
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
                                        <TableCell>{i.attributeTypeName.length > 30 ? i.attributeTypeName.slice(0,30) + "..." : i.attributeTypeName}</TableCell>
                                        <TableCell>{i.categoryName.length > 30 ? i.categoryName.slice(0,30) + "..." : i.categoryName}</TableCell>
                                        <TableCell>{i.label.length > 30 ? i.label.slice(0,30) + "..." : i.label}</TableCell>
                                        <TableCell style={{ textAlign :  "left"}}>  <Switch onChange={this.handlestatus.bind(this,i.attributeTypeId,index,i.status)}  color="primary" checked={i.status == "ACTIVE" ? true : false}/></TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/catalogue/list/attribute-value/" + i.attributeTypeId + "/" + (i.attributeTypeName.split("/").length > 1 ? i.attributeTypeName.split("/").join("-"): i.attributeTypeName) }>View</Link> </TableCell>
                                        <TableCell style={{ textAlign :  "left"}}><Link className="edit_button" to={"/catalogue/attribute/edit/" + i.attributeTypeId}>Edit</Link> </TableCell>
                                    </TableRow>
                                )
                            },this)
                        }
                        {(row_data.errorExists || row_data.response.length == 0) &&
                            <TableRow className="no_data_found">
                                <TableCell colSpan="7" style={{padding : "10px",textAlign:"center"}}>No data avaliable.</TableCell>
                            </TableRow>
                        }
                        </React.Fragment>
                    }
                    {!row_data &&
                        <TableRow className="no_data_found">
                                <TableCell colSpan="7" style={{padding : "10px",textAlign:"center"}}>No data avaliable.</TableCell>
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
    list: state.attributetype.data.data,
    loading: state.attributetype.loading,
    error: state.attributetype.error,
  });
  

export default withStyles(style)(connect(mapStateToProps)(AllAttributetype));