import React from "react";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import Layout from "../../components/Layout";
import axios from 'axios';
import { Link } from 'react-router-dom'
import Grid from "@material-ui/core/Grid";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core";
import Select from "react-select-v1";
const styles = theme => ({
    paper: {
      padding: theme.spacing.unit * 4,
      marginTop: "10px",
      maxWidth: "100%"
    },
    button: {
      margin: theme.spacing.unit * 4
    }
  });

class AssignEditRoles extends React.Component {
    state = {
        id: "",
        userData: "",
        allRoles: [],
        assignedRoles:[],
        addRoles:[],
        removeRoles:[],
        is_loading : false,
        allTenants : [],
        selected_tenant : ""
    }
    componentDidMount() {
        axios.get(`/getAllRoles`).then(res => {
            this.setState({ allRoles: res.data.response })
        })
        axios.get(`/tenants`).then(res => {
            this.setState({ allTenants: res.data.response })
        })
        this.setState({
            id: this.props.match.params.id ? this.props.match.params.id : ""
        }, () => {
            axios.get(`/getUserInfo?id=${this.state.id}`).then(res => {
                if (res.data.response.length > 0) {
                    this.setState({ userData: res.data.response[0] })
                }
            })
            axios.get(`/userAssignedRoles?id=${this.state.id}`).then(res => {
                if (res.data.response.length > 0) {
                    let assignedRoles = [];
                    let data = res.data.response;
                    for(let i = 0;i < data.length;i++){
                        assignedRoles.push(data[i].roleid_ref)
                    }
                    this.setState({ assignedRoles  , selected_tenant : (data[0].tenantid != null ? data[0].tenantid : "")  },()=>{
                    })
                }
            })
        })
    }

    handle_checkbox = id =>{
        let assignedRoles = this.state.assignedRoles;
        let addRoles = this.state.addRoles;
        let removeRoles = this.state.removeRoles;
        if(assignedRoles.indexOf(id)>-1){
                if(removeRoles.indexOf(id)<0){
                removeRoles.push(id);
                if(addRoles.indexOf(id)>-1){
                    addRoles.splice(addRoles.indexOf(id),1)
                }
            }
            else{
                removeRoles.splice(removeRoles.indexOf(id),1)
            }
        }
        else{
            if(addRoles.indexOf(id)<0){
                addRoles.push(id);
                if(removeRoles.indexOf(id)>-1){
                    removeRoles.splice(removeRoles.indexOf(id),1)
                }
            }
            else{
                addRoles.splice(addRoles.indexOf(id),1)
            }
            
        }
        this.setState({removeRoles,addRoles})
    }

    save=()=>{
        if(this.state.selected_tenant == ""){
            alert("Please select atleast one tenant from dropdown")
            return false;
        }

        this.setState({ is_loading : true})
        let removeRoles = this.state.removeRoles;
        let addRoles = this.state.addRoles;

        if(this.state.removeRoles.length == 0 && this.state.addRoles.length == 0){
            let formData = {};
            formData.userId = this.state.id;
            formData.tenants = this.state.selected_tenant;
            axios.post('/updatetenant',formData).then(res=>{
                console.log(res);
            })
        }

        for(let j=0; j < this.state.allRoles.length; j++){
            for(let i = 0; i < removeRoles.length; i++){
                if(this.state.allRoles[j].id==removeRoles[i]){
                    let formData = this.state.allRoles[j];
                    formData.userId = this.state.id;
                    axios.post('/removeRole',formData).then(res=>{
                        console.log(res);
                    })
                }                
            }
            for(let i = 0; i < addRoles.length; i++){
                if(this.state.allRoles[j].id==addRoles[i]){
                    let formData = this.state.allRoles[j];
                    formData.userId = this.state.id;
                    formData.is_active = 1;
                    formData.datecreated = new Date();
                    formData.dateupdated = new Date();
                    formData.tenants = this.state.selected_tenant;
                    axios.post('/assignNewRole',formData).then(res=>{
                        console.log(res);
                    })
                }
            }
        if(j == this.state.allRoles.length-1){
            var self = this;
            setTimeout(function(){ 
                alert("Roles have been updated for this user.")
                window.open("/role/assign/roles", "_self")
                }, 3000);
        }
        }
    }

    handle_selected_tenant(value){
        if(value){
            this.setState({ selected_tenant : value })
        }
        else{
            this.setState({ selected_tenant : "" })
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                {(this.props.loading || this.state.is_loading) &&
                    <LinearProgress />
                }
                <Grid container lg={12} justify="space-between" style={{marginTop:"10px"}}>
                    <Typography variant="h5" gutterBottom component="h5">
                    Assign Roles to {this.state.userData.username}   
                    </Typography>
                    <Button variant="contained" color="primary" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
                </Grid>
               
                <Paper className={classes.paper}>
                    <Grid container spacing={16}>
                        <Grid item sm={6} xs={6}>
                            <Typography variant="h6" gutterBottom component="h6">
                                Email : {this.state.userData.email}
                            </Typography>
                        </Grid>
                        {/* <Grid item sm={6} xs={6}>
                            <Typography variant="h6" gutterBottom component="h6">
                                UserName : {this.state.userData.username}
                            </Typography>
                        </Grid> */}
                        {/* <Grid item sm={4} xs={4}>
                            <Typography variant="h6" gutterBottom component="h6">
                                Phone No. : {this.state.userData.phoneNumber}
                            </Typography>
                        </Grid> */}
                    </Grid>
                    <Grid container spacing={16}>
                        {this.state.allRoles.map((item, index) => {
                            return (
                                <React.Fragment>
                                {item.is_active != 0 &&
                                    <Grid item xs={3} sm={3}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox color="primary"
                                                    checked={(this.state.assignedRoles.indexOf(item.id)>-1 && this.state.removeRoles.indexOf(item.id)<0) || this.state.addRoles.indexOf(item.id)>-1 ?true:false}
                                                    onChange={e=>this.handle_checkbox(item.id)}
                                                    />
                                                }
                                            label={item.name}
                                        />
                                    </Grid>
                                }
                                </React.Fragment>
                            )
                        })
                        }
                        <Grid item xs={4} sm={4} xs={4} style={{ textAlign : "center" , marginBottom : 30}}>
                            <Select
                                name="select_type"
                                simpleValue
                                value={this.state.selected_tenant || ""}
                                onChange={this.handle_selected_tenant.bind(this)}
                                placeholder="Select Tenant"
                                backspaceRemoves={true}
                                cache={false}
                                required={true}
                                multi={true}
                                searchPromptText = "Enter type tenant name to search"
                                noResultsText = "No tenant found."
                                loadingPlaceholder = "Searching tenant"
                                options={this.state.allTenants.map(function(i,index){
                                    return  {"value":i.name,"label":i.name}
                                })}
                            />
                        </Grid>
                    </Grid>
                    <div style={{ textAlign : "center"}}>
                    <Button variant="contained" color="primary" type="button" onClick={e=>this.save()}>
                      Save
                        </Button>
                </div>
                </Paper>
                <br/>
               
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => ({
    loading: state.brand.loading,
    error: state.brand.error,
});


export default withStyles(styles)(connect(mapStateToProps)(AssignEditRoles));