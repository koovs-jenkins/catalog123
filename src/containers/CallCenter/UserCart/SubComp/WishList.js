import React from "react";
import { Grid, Fab } from "@material-ui/core";
import WishListCard from "../../../../components/WishListCard";
import { CallCenterConsumer } from "../../../../context/CallCenter/UserCart";

const WishList = props => {
  const [append, useAppend] = React.useState({});
  return (
    <CallCenterConsumer>
      {context => (
        <Grid container spacing={24}>
          {context.wishlist && context.wishlist.length > 0 &&
            context.wishlist.map((v, k) => (
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                key={k}
                onClick={() =>
                  useAppend({
                    [k]: true
                  })
                }
              >
                <WishListCard
                  classes={context.classes}
                  product={v.product}
                  attributes={v.attributes}
                  mapping={v.mapping}
                  quantity={v.quantity}
                  onClick={context.handleMoveToBag}
                  append={append[k]}
                />
              </Grid>
            ))}
        </Grid>
      )}
    </CallCenterConsumer>
  );
};

export default WishList;
