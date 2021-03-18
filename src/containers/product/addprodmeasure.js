import React from "react";
import {Typography,Select,
  InputLabel,
  MenuItem,
  FormControl} from "@material-ui/core";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import {Grid,Card,CardContent} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Error from "@material-ui/icons/ErrorOutline";
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    fetchAllProduct,
} from "../../store/actions/product";
import { fetchAllMeasurement } from "../../store/actions/addmeasurement";
import {
    fetchProductMeasure,
    postProductMeasure,
    removeErrorMeasure
} from "../../store/actions/productmeasure"

import { connect } from "react-redux";

const styles = theme => ({
  wrapper:{
    marginTop:"20px"
  },
  formControl:{
    textAlign:"left"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: "20px",
    maxWidth: "100%"
  },
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

class AddProductMeasurement extends React.Component {
  initialState = {
    all_products : [],
    all_sizes : [],
    selected_size : "",
    selected_product : "",
    all_line : null,
    selected_line : "",
    loading: false
  };
  state = {
    ...this.initialState
  };

componentDidMount = () => {
  this.get_all_sizes()
  this.props.dispatch(removeErrorMeasure())
  
};

componentDidUpdate(){
  var self = this;
$('#select_product').select2();
$('#select_map').select2();
$(document).ready(function(){
  $("#select_map").on("select2:select select2:unselecting", function (event) { 
    if(event.target.value != self.state.selected_size){
      self.handle_select_size(event);
    }
  });
});
}

get_product_data(id){
    this.props.dispatch(fetchProductMeasure(id)).then(() =>{    
            this.setState({
                    
            })
        }
    );
}

get_all_sizes(){
    this.props.dispatch(fetchAllMeasurement()).then(() =>
        this.setState({
            all_sizes : this.props.all_sizes.response ? this.props.all_sizes.response : [],
        })
    );
}

handle_select_product = (e) => {
  this.setState({ selected_product: e.target.value, selected_size: "" });
  if (e.key == "Enter") {
    this.handleProductSearch();
  }
  if(this.state.selected_product == "" || this.state.selected_product == null){
    this.setState({ all_line :  null})
  }
}

handleProductSearch = () => {
  if (
    this.state.selected_product &&
    this.state.selected_product.length > 0 &&
    !this.state.selected_product.trim()
  ) {
    alert("Nothing found to search");
  } else {
    const that = this;
    that.setState({loading: true}, () => {
        var selected_product_id = that.state.selected_product;
        that.props.dispatch(fetchAllProduct(selected_product_id)).then(() => {
          if(that.props.all_products.response.length > 0){
            that.setState({
                all_products: that.props.all_products.response ? that.props.all_products.response : [],
                all_line: that.props.all_products.response[0].productOptions ? that.props.all_products.response[0].productOptions : [],
                loading: false
            });
          }
          else{
            that.setState({ loading : false, all_line : [] , all_products : []})
          }


        });
    });
  }
};

handle_select_line(event){
  this.setState({ selected_line : event.target.value},()=>{
    this.setState({ selected_size : "" })
  })
}

handle_select_size(event){
    this.setState({ selected_size : event.target.value})
}



handleform(event){
    event.preventDefault();
    var self = this;
    var formdata = {
      "productId" : this.state.selected_product,
      "lineId" : this.state.selected_line,
      "id" : parseInt(this.state.selected_size),
      userId: this.props.email
    };
    this.props.dispatch(postProductMeasure(JSON.stringify(formdata),this.state.selected_product)).then((res)=>{
        if(!self.props.error){
            this.props.history.push("/catalogue/list/product");
            this.setState({...initialState});
        }
    })
}




render() {
    const { classes, match } = this.props;
    const { loading, selected_size, selected_product, selected_line } = this.state;
    return (
      <React.Fragment>
        {loading &&
            <LinearProgress />
        }
        {!loading && (
          <React.Fragment>
 <Grid container lg={12} justify="space-between" className={classes.wrapper}>
 <Typography variant="h5" gutterBottom component="h5">
              Add Product Measurement 
              {this.props.error &&
                  <div className="error_container">
                  {(typeof(this.props.error.error) != "object") &&
                    <p>
                    <Error className="vertical_align_error"/> &nbsp;
                      {this.props.error.error}
                    </p>
                    }
                    {(typeof(this.props.error.error) == "object") &&
                    <p>
                    <Error className="vertical_align_error"/> &nbsp;   &nbsp;
                      {(this.props.error.error.message)}
                    </p>
                    } 
                  </div>
                }
               
            </Typography>
            <Button variant="contained" color="primary"  color="primary" onClick={(e) =>{ this.props.history.goBack()}}> Go Back </Button>
 </Grid>
            <Paper elevation="3" className={classes.paper}>
            <form onSubmit={this.handleform.bind(this)}>
              <Grid container spacing={12}>
                <Grid item xs={12} sm={12}>
                      <TextField
                          id="outlined-basic" 
                          variant="outlined" 
                          value={this.state.selected_product || ""}
                          onChange={this.handle_select_product}
                          onKeyDown={this.handle_select_product}
                          margin="normal"
                          name="selected_product"
                          label="Hit Enter to Search Product by Id"
                          required
                          inputProps={{
                          maxLength : "250",
                          }}
                          fullWidth
                        />
                         {(this.state.selected_product && this.state.all_line != null) &&
                  <Grid item xs={4} sm={4} className="no_measure_line" style={{marginTop:"10px"}}>
                  {this.state.all_line.length > 0 &&
                        <FormControl fullWidth variant="outlined" className={classes.formControl}>
                          <InputLabel id="demo-simple-select-outlined-label-measurement">Please Select Product Line</InputLabel>
                            <Select
                              labelId="demo-simple-select-outlined-label-measurement"
                              id="demo-simple-select-outlined"
                              value={this.state.selected_line || ""}
                              onChange={this.handle_select_line.bind(this)}
                              fullWidth
                              required
                              label={"Please Select Product Line"}
                            >
                              {this.state.all_line.map(function(i,index){
                                return(
                                  <MenuItem key={index} value={i.lineId}>{i.lineId}</MenuItem>
                                )
                              },this)
                              }
                          </Select>
                    </FormControl>
                  }
                  {this.state.all_line.length == 0 &&
                      <span>No line created for selected product.</span>
                  }
                  </Grid>
                  }
                  {this.state.selected_line &&
                  <Grid item xs={4} sm={4} className="no_measure_line" style={{marginTop:"10px"}}>
                 {this.state.all_sizes.length > 0 && 
                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label-measurement">Please Select Measurements*</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label-measurement"
                          id="demo-simple-select-outlined"
                          value={this.state.selected_size || ""}
                          onChange={this.handle_select_size.bind(this)}
                          fullWidth
                          required
                          label="Please Select Measurements*"
                          >
                          {this.state.all_sizes.map(function(i,index){
                            return(
                              <MenuItem key={index} disabled={i.status == "INACTIVE" ? true : false} value={i.id}>{i.name}</MenuItem>
                            )
                          },this)
                          }
                      </Select>
                    </FormControl>
                  }
                  {this.state.all_sizes.length == 0 &&
                      <span>No measurements created yet.</span>
                  }
                  </Grid>
                  }
                    <Grid container justify="left">
                      <Grid item>
                        <Button disabled={!selected_size || !selected_product || !selected_line} variant="contained" color="primary" type="submit" className={classes.button}>
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                </Grid>
                </Grid>
            </form>
            </Paper>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({
  product_measurment: state.productmeasure.product_measurment,
  loading: state.productmeasure.loading,
  error: state.productmeasure.error,
  all_products : state.product.data.data,
  all_sizes : state.addmeasurement.data.data,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(AddProductMeasurement));
