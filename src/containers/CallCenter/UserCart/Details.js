import React from "react";
import { Paper, Tabs, Tab } from "@material-ui/core";
import Cart from "./SubComp/Cart";
import WishList from "./SubComp/WishList";
import Address from "./SubComp/Address";
import Search from "./SubComp/Search";
import { CallCenterConsumer } from "../../../context/CallCenter/UserCart";

const Details = props => {
  return (
    <CallCenterConsumer>
      {context =>
        !context.isSubmitted ? (
          <React.Fragment>
            <Paper square className={context.classes.paper}>
              <Tabs
                style={{padding:"10px 0px"}}
                value={context.value}
                onChange={context.handleChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Cart" disabled={!context.cartData.items} />
                <Tab
                  disabled={!context.cartData.items}
                  label="Address Details"
                />
                <Tab label="Search" />
                <Tab label="Wishlist" />
              </Tabs>
            {context.value === 0 && <Cart />}
            {context.value === 1 && <Address title="Select delivery address" />}
            {context.value === 2 && <Search title="Search Product By Id" />}
            {context.value === 3 && <WishList />}
            </Paper>
          </React.Fragment>
        ) : null
      }
    </CallCenterConsumer>
  );
};

export default Details;
