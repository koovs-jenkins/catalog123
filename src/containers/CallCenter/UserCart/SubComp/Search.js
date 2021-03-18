import React from "react";
import {
  Grid,
  Card,
  Button,
  CardMedia,
  TextField,
  IconButton,
  Typography,
  CardActions,
  CardContent,
  InputAdornment,
  LinearProgress
} from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import { baseUrl } from "../../../../../config";
import { CallCenterConsumer } from "../../../../context/CallCenter/UserCart";

const Search = props => {
  const [size, setSize] = React.useState("");
  const [lineId, setLineId] = React.useState("");

  const handleClick = data => {
    setSize(data.skuId);
    setLineId(data.colorId);
  };

  function renderProduct(param) {
    const { classes, searchProductInfo, productMap } = param;
    return searchProductInfo.map(v => (
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
              <Typography gutterBottom variant="h5" component="h2">
                {v.productName}
              </Typography>
              <Typography variant="subtitle2">{v.brand}</Typography>
            </a>
            <Typography>Rs. {v.discountPrice || v.price}</Typography>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Select Size</Typography>
              {productMap &&
                productMap[v.lineId] &&
                productMap[v.lineId].combine.map(x => (
                  <IconButton
                    key={x.skuId}
                    onClick={() => handleClick(x)}
                    disabled={
                      x.inventory &&
                      x.inventory.feDetails &&
                      x.inventory.feDetails.quantity &&
                      x.inventory.feDetails.quantity == 0
                    }
                    style={{
                      fontSize: "small",
                      backgroundColor: size == x.skuId ? "#000" : "white",
                      color: size == x.skuId && "white",
                      margin: "2px",
                      border: "1px solid black",
                      borderRadius: 0,
                      padding: "7px"
                    }}
                  >
                    {x.code}
                  </IconButton>
                ))}
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              size="small"
              color="primary"
              disabled={lineId != v.lineId}
              onClick={() => param.handleProductSelect(size)}
              fullWidth
            >
              Move to Bag
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ));
  }

  return (
    <CallCenterConsumer>
      {context => (
        <React.Fragment>
          {context.loading && <LinearProgress />}
          <Grid container spacing={12}>
            
            <Grid item xs={4}>
              <Typography variant="h5">{props.title}</Typography>
              <TextField
                fullWidth
                name="productId"
                label="Product Id"
                variant="outlined"
                onChange={context.handleSearchProduct}
                onKeyDown={context.handleSearchProduct}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Product Id"
                        onClick={context.handleSearchSubmit}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            {renderProduct(context)}
          </Grid>
        </React.Fragment>
      )}
    </CallCenterConsumer>
  );
};
export default Search;
