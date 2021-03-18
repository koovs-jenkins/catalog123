import React from "react";
import {
  Card,
  Button,
  CardMedia,
  Typography,
  CardActions,
  CardContent,
  IconButton
} from "@material-ui/core";

const WishListCard = props => {
  const [isSelected, useSelected] = React.useState({});

  return (
    <Card className={props.classes.card}>
      <CardMedia
        component="img"
        alt={props.product.brandName}
        className={props.classes.media}
        height="200px"
        width="151px"
        image={props.product.imageMap.default_img}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {props.product.brandName}
        </Typography>
        <Typography variant="subtitle2">{props.product.label}</Typography>
        <Typography variant="subtitle1">
          Rs.{" "}
          {props.product.discountPrice
            ? props.product.discountPrice
            : props.product.price}
        </Typography>
      </CardContent>
      {props.append && (
        <React.Fragment>
          {props.attributes.sizes.map(v => (
            <IconButton
              style={{
                fontSize: "small",
                backgroundColor: isSelected[v.id] ? "#000" : "white",
                color: isSelected[v.id] && "white",
                margin: "2px"
              }}
              disabled={v.isOutOfStock}
              id={v.id}
              key={v.code + v.id}
              onClick={() => useSelected({ [v.id]: true })}
            >
              {v.code}
            </IconButton>
          ))}
          <CardActions>
            <Button
              variant="contained"
              size="small"
              color="primary"
              disabled={
                props.product.isProductOutOfStock ||
                props.product.isSkuOutOfStock ||
                Object.keys(isSelected).length < 1
              }
              onClick={() =>
                props.onClick(
                  props.product,
                  props.quantity.data.filter(v => v.skuId == props.product.sku)
                )
              }
              fullWidth
            >
              Move to Bag
            </Button>
          </CardActions>
        </React.Fragment>
      )}
    </Card>
  );
};

export default WishListCard;
