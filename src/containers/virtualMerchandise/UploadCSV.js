import React from 'react';
import axios from 'axios';

import {
  Paper,
  Grid,
  TextField,
  Typography,
  Fab,
  Button,
  LinearProgress,
  FormHelperText,
  withStyles,
} from '@material-ui/core';


import { baseUrl } from '../../../config';
import { downloadCsv } from '../../../utils/csv';

import Notify from '../../components/Notify';
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
class UploadCSV extends React.Component {
  state = {
    url: '',
    file: null,
    isLoading: false,
    isUploading: false,
    productList: [],
    errors: {},
  }

  constructor(props) {
    super(props);
    this.pageSize = 100;
    this.pageNo = 0;
  }

  handleChange = (e) => {
    if (
      e.target.value &&
      e.target.value.length > 0 &&
      e.target.value.trim() == ""
    ) {
      this.setState({ message: "Nothing found to search" });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  fetchProductList = async() => {
    let finalData = [];
    for (let i = 0; i < this.pages; i++) {
      const res = await axios.get(`/jarvis-service/v1/product/listing/complete?href=${this.state.url}
&page-size=100&page=${i + 1}`);
      if (res.data && res.data.data[0].data) {
        finalData = finalData.concat(res.data.data[0].data);
      }
    }
    return finalData;
  }

  fetchPageListNDownload = () => {
    this.setState({ errors: {} });
    if (!this.state.url) {
      this.setState({ errors: { url: 'Enter url' } });
      return;
    }
    this.setState({ isLoading: true });
    axios.get(`/jarvis-service/v1/product/listing/complete?href=${this.state.url}&page-size=100`)
      .then((res) => {
        console.log('res', res);
        if (res.status === 200) {
          if (res.data && res.data.data[0].data) {
            let restPagesPromise;
            const firstPageData = res.data.data[0].data;
            if (res.data.data[0].count > this.pageSize) {
              this.pages = Math.floor(res.data.data[0].count / this.pageSize);
              restPagesPromise = this.fetchProductList();
            } else {
              restPagesPromise = new Promise(res => res([]));
            }
            this.setState({ isLoading: false });

            restPagesPromise.then((result) => {
              const listData = [ ...firstPageData, ...result ];
              const reducedProductList = listData.map((item, index) => ({
                position: index + 1,
                productId: item.id,
                lineId: item.lineId,
              }));
              console.log('listData', reducedProductList);
              this.setState(
                { productList: reducedProductList },
                () => {
                  downloadCsv({
                    filename: "product.csv",
                    data: this.state.productList,
                    header: [
                      "position",
                      "productId",
                      "lineId",
                    ],
                  });
                },
              );
            });
          } else {
            console.log('err', res);
            this.setState({ isLoading: false, error: res.message })
          }
        } else {
          console.log('err', res);
          this.setState({ isLoading: false, error: res.message })
        }
      })
      .catch((err) => {
        console.log('err', err);
        this.setState({ isLoading: false, error: err && err.message });
      });
  }

  handleFileSelect = (e) => {
    console.log('file', e.target.files[0]);
    this.setState({ file: e.target.files[0] });
  }

  handleUploadCsv = () => {
    if (!this.state.url) {
      this.setState({ errors: { url: 'Enter url' } });
      return;
    }
    if (!this.state.file) {
      this.setState({ errors: { file: 'Select File' } });
      return;
    }
    const formdata = new FormData();
    formdata.append("file", this.state.file);
    this.setState({ isUploading: true });
    axios.put(`/vm-service/update-vm/file-upload?href=${this.state.url}`, formdata)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            isUploading: false,
            error: 'Uploaded Successfully',
            errors: {},
          });
        } else {
          this.setState({ isUploading: false, error: res && res.message });
        }
        return res;
      })
      .catch((err) => err.response)
      .then(err => {
        console.log('err', err.data);
        this.setState({ isUploading: false, error: err.data && err.data.errorMessage })
      });

  }

  render() {
    const { classes } = this.props;
    const { errors, isLoading, isUploading } = this.state;

    return (
      <React.Fragment>
        {this.state.error && <Notify message={this.state.error} />}
        {(isLoading || isUploading) &&
          <LinearProgress />
        }
        <Grid container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Upload CSV File
          </Typography>
        </Grid>
        <Paper className={classes.paper}>
          <Grid
            container
            spacing={12}
            alignItems="left"
            justify="flex-start"
          >
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                label="Page Url"
                name="url"
                fullWidth
                className={classes.textField}
                variant="outlined"
                onChange={this.handleChange}
                value={this.state.url}
                helperText="Url Format: https://example.com/category/apparels/"
              />
              {errors.url &&
                <FormHelperText className={classes.red}>{errors.url}</FormHelperText>
              }
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                color="primary"
                className={classes.fab}
                variant="contained"
                onClick={this.fetchPageListNDownload}
                disabled={isLoading}
              >
                Download CSV
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12} className={classes.wrapper}>
              <TextField
                type="file"
                fullWidth
                variant="outlined"
                name="csv_file"
                variant="outlined"
                className={classes.textField}
                onChange={this.handleFileSelect}
                helperText="Upload not more than 500 records"
              />
              {errors.file &&
                <FormHelperText className={classes.red}>{errors.file}</FormHelperText>
              }
            </Grid>
            <Grid item xs={12} sm={12} md={12} className={classes.wrapper}>
              <Button
                color="primary"
                onClick={this.handleUploadCsv}
                className={classes.fab}
                variant="contained"
                disabled={isUploading}
              >
                Upload
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </React.Fragment>
    );
  }
}


export default withStyles(styles)(UploadCSV);
