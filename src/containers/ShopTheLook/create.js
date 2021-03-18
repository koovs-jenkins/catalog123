import React, { useState, useEffect } from "react";
import {
  Fab,
  Grid,
  Card,
  Paper,
  Button,
  CardMedia,
  TextField,
  withStyles,
  Typography,
  CardActions,
  CardContent,
  LinearProgress,
  Select,
  FormControl,
  MenuItem,
  InputLabel
} from "@material-ui/core";
import { connect } from "react-redux";
import { baseUrl } from "../../../config";
import Notify from "../../components/Notify";
import { fetchProductById } from "../../api/callCenter";
import {
  getOutfitByIdApi,
  postEditOutfitApi,
  postCreateOutfitApi
} from "../../api/shopthelookapi";
import SelectBox from "../../components/SelectBox";

const style = theme => ({
  paper: { ...theme.paper,padding:"10px" },
  anchor: { textDecoration: "none" },
  tableWrapper: { ...theme.tableWrapper },
  control:{padding:"10px"}
});

const ShopTheLookCreate = props => {
  const [request, setRequest] = useState({
    productId: "",
    loading: false,
    searchData: [],
    message: "",
    gender: "",
    previewPane: [],
    outfitId:
      props.match.params && props.match.params.id ? props.match.params.id : "",
    searchBy: 0,
    parentCategories: "",
    brandsData: "",
    parent_category: "",
    brand: "",
    page_number: 1,
    page_size: 10
  });
  const {
    productId,
    loading,
    searchData,
    message,
    gender,
    previewPane,
    outfitId
  } = request;
  const { classes, userId } = props;

  useEffect(() => {
    const result = [...request.previewPane];
    if (outfitId) {
      setRequest({ ...request, loading: true });
      getOutfitByIdApi(props.match.params.id, userId).then(res => {
        if (res && res.status < 350 && res.data && !res.data.errorExists) {
          res.data.outfitDetail.outfitMappings.map(k =>
            fetchProductById(userId, k.productId).then(resp => {
              if (
                resp &&
                resp.data &&
                resp.data.data &&
                resp.data.data[0] &&
                resp.data.data[0].data
              ) {
                const productFound = resp.data.data[0].data.find(
                  product => product.lineId == k.productLineId
                );
                productFound && result.push(productFound);
                setRequest({
                  ...request,
                  loading: false,
                  previewPane: result,
                  gender: res.data.outfitDetail.gender,
                  message: result.length ? "" : "No data found for one of the product"
                });
              }else{
                setRequest({
                  ...request,
                  loading: false,
                  message: "No data found"
                });
              }
            })
          );
        }
      });
    }
  }, []);

  const handleSearchProduct = e => {
    if (e.key === "Enter") {
      handleRequest(productId);
    } else {
      setRequest({ ...request, productId: e.target.value });
    }
  };

  const handleRequest = id => {
    setRequest({ ...request, loading: true });
    if (id) {
      fetchProductById(userId, id).then(resp => {
        if (
          resp &&
          resp.data &&
          resp.data.data &&
          resp.data.data[0] &&
          resp.data.data[0].data &&
          resp.data.data[0].data[0] &&
          resp.data.data[0].data[0].sku
        ) {
          setRequest({
            ...request,
            loading: false,
            searchData: resp.data.data[0].data
          });
        } else {
          setRequest({
            ...request,
            loading: false,
            message:
              (resp && resp.data && resp.data.message) || "Error in fetching"
          });
        }
      });
    }
  };

  const handleAddToStyle = lineId => {
    const tempArry = [...request.previewPane];
    const findInstered = tempArry.filter(v => v.lineId == lineId) || [];
    tempArry.push(searchData.filter(v => v.lineId == lineId)[0]);
    findInstered.length < 1 &&
      setRequest({ ...request, previewPane: tempArry });
  };

  const handleRemoveStyle = lineId => {
    const tempArry = [...request.previewPane];
    const findInstered = tempArry.filter(v => v.lineId != lineId) || [];
    setRequest({ ...request, previewPane: findInstered });
  };

  const handleSubmit = () => {
    setRequest({ ...request, loading: true, message: "" });
    const api = !outfitId ? postCreateOutfitApi : postEditOutfitApi;
    let lineIds = previewPane.map(a => a.lineId);
    if (lineIds && lineIds.length > 1) {
      const formData = {
        lineIds: lineIds,
        type: 0,
        gender: gender,
        entityidRef: userId,
        status: 2
      };
      if (outfitId) {
        formData.outfitId = outfitId;
      }
      api(formData, userId).then(res => {
        if (res && res.status < 350) {
          if (res.data.errorExists) {
            setRequest({ ...request, message: res.data.status });
          } else {
            setRequest({
              ...request,
              productId: "",
              searchData: [],
              previewPane: [],
              message: `Outfit ${!outfitId ? "created" : "edited"} successfully`
            });
          }
        } else {
          setRequest({
            ...request,
            message: res.data.reason || "Something went wrong"
          });
        }
      });
    } else {
      setRequest({
        ...request,
        loading: false,
        message: "Select at least 2 line id to create outfit."
      });
    }
  };

  const handleChange = e => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const renderProduct = () => {
    return (
      searchData &&
      searchData.map(v => (
        <Grid item xs={12} sm={4} key={v.lineId}>
          <Card className={classes.card}>
            <CardMedia
              component="img"
              alt={v.productName}
              className={classes.media}
              height="200px"
              width="151px"
              image={v.imageSmallUrl}
            />
            <CardContent>
              <a className={classes.anchor} href={baseUrl + v.links[0].href}>
                <Typography>{v.brand}</Typography>
                <Typography gutterBottom>{v.productName}</Typography>
              </a>
              <Typography>Rs. {v.discountPrice || v.price}</Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                size="small"
                color="primary"
                disabled={
                  v.isOutofStcok ||
                  (previewPane.find(x => x.lineId == v.lineId) &&
                    previewPane.find(x => x.lineId == v.lineId).hasOwnProperty("id"))
                }
                onClick={() => handleAddToStyle(v.lineId)}
                fullWidth
              >
                Add to style
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))
    );
  };

  return (
    <React.Fragment>
      <Typography variant="h5">
        {!outfitId ? "Create" : "Edit"} Shop The Look
      </Typography>
      {loading && <LinearProgress />}
      {message && <Notify message={message} />}
      <Grid container spacing={12}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <Grid container spacing={12}>
              <Grid item xs={12} sm={6} className={classes.control}>
                  <SelectBox
                    required
                    name="Gender"
                    id="gender"
                    value={gender}
                    onChange={handleChange}
                    menu={[
                      { key: "1", value: "Male" },
                      { key: "2", value: "Female" }
                    ]}
                  />
              </Grid>
              <Grid item xs={12} sm={6} className={classes.control}>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="productId"
                  label="Product Id"
                  value={productId}
                  onChange={handleSearchProduct}
                  onKeyDown={handleSearchProduct}
                />
              </Grid>
              <Grid container spacing={8} className={classes.tableWrapper}>
                {renderProduct()}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <Grid container spacing={24} justify="space-between">
              <Grid item>
                <Typography variant="h6">Preview</Typography>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleSubmit()}
                >
                  {!outfitId ? "Save" : "Update"} Outfit
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={24} className={classes.tableWrapper}>
              {previewPane.map(v => (
                <Grid item xs={12} sm={4} key={v.id + v.lineId}>
                  <Card className={classes.card}>
                    <CardMedia
                      component="img"
                      alt={v.productName}
                      className={classes.media}
                      height="200px"
                      width="151px"
                      image={v.imageSmallUrl}
                    />
                    <CardContent>
                      <a
                        className={classes.anchor}
                        href={baseUrl + v.links[0].href}
                        target="_blank"
                      >
                        <Typography>{v.brand}</Typography>
                        <Typography gutterBottom>{v.productName}</Typography>
                      </a>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleRemoveStyle(v.lineId)}
                        fullWidth
                      >
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(connect(mapStateToProps)(ShopTheLookCreate));
