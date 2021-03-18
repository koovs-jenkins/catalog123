import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Category from "@material-ui/icons/Category";
import Money from "@material-ui/icons/MonetizationOn";
import ProductScale from "@material-ui/icons/LinearScale";
import Product from "@material-ui/icons/AddShoppingCart";
import ProductImage from "@material-ui/icons/AddPhotoAlternate";
import Brand from "@material-ui/icons/FontDownload";
import { NavLink } from "react-router-dom";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { withRouter } from "react-router-dom";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import List from "@material-ui/icons/ViewList";
import Add from "@material-ui/icons/AddCircle";
import Offer from "@material-ui/icons/LocalOffer";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { routesPath } from "../../routes";
import axios from "axios";
import { env } from "../../../config";
import RemoveFromQueue from "@material-ui/icons/RemoveFromQueue";
import { getLocalStorage, getCookie } from "../../helpers/localstorage";


/* Import Icons */
import Icon from '@material-ui/core/Icon'

const CExpansionPanel = withStyles({
  root: {
    border: "0px",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    }
  },
  listItem:{
    padding:"0px",
    borderBottom:"1px solid #ccc",
   
  },
  expanded: {
    margin: "auto"
  }
})(ExpansionPanel);

const styles = {
  text: {
    padding: "0px",
  },
  textItem:{
    paddingTop:"0px",
  },
  listItem:{
    padding:"0px",
    "& p": {
      fontWeight: "bold"
    }
  },
  listItemIcon:{
    "& svg":{
      fontSize:"10px",
    },
  },
  head:{
    textAlign:"center"
  }
};

var alias = [
  {"cat" : "Catalogue"},
  {"vm" : "Virtual Merchandise"},
  {"style_stories" : "Style Stories"}
]


class MainListItems extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  findSelected = str => {
    if (this.props.location.pathname === str) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <a style={{ textDecoration: "none" }} href={routesPath.HOME}>
          <ListItem className={classes.head} selected={this.findSelected(routesPath.HOME)}>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </a>
        {Object.keys(this.props.assigned_roles).map(function(i, index) {
          var nav_link = this.props.assigned_roles[i].map(function(j, jindex) {
            return (
              <React.Fragment key={index + jindex}>
                {j.name == "CMS" && (
                  <a style={{ textDecoration: "none" }} href={j.url}>
                    <ListItem style={{ paddingTop : 5, paddingBottom : 5,paddingLeft:0}}  selected={this.findSelected(j.url)} button>
                      <ListItemIcon style={{fontSize:"16px"}}>
                        <KeyboardArrowRightIcon  style={{fontSize:"16px"}} />
                      </ListItemIcon>
                      <ListItemText
                        classes={{
                          primary: classes.text
                        }}
                        primary={j.name}
                      />
                    </ListItem>
                  </a>
                )}
                {j.name == "The Edit" && (
                  <a style={{ textDecoration: "none" }} target="_blank" href={"https://ops-mbm.koovs.com"}>
                    <ListItem style={{ paddingTop : 5, paddingBottom : 5}} selected={this.findSelected(j.url)} button>
                      <ListItemIcon>
                        <List />
                      </ListItemIcon>
                      <ListItemText
                        classes={{
                          primary: classes.text
                        }}
                        primary={j.name}
                      />
                    </ListItem>
                  </a>
                )}
                {(j.url && j.name != "CMS" && j.name != "The Edit" && j.url != "/order/viewTxnHistory") && (
                  <NavLink  style={{ textDecoration: "none" }} to={j.url}>
                    <ListItem className={classes.listItemIcon} style={{ paddingTop : 5, paddingBottom : 5,paddingLeft:0}} selected={this.findSelected(j.url)} button>
                      <ListItemIcon style={{fontSize:"16px"}}>
                        <KeyboardArrowRightIcon  style={{fontSize:"16px"}} />
                      </ListItemIcon>
                      <ListItemText className={classes.text} primary={j.name} />
                    </ListItem>
                  </NavLink>
                )}
              </React.Fragment>
            );
          }, this);
          return (
            <React.Fragment key={index}>
              {i != "asn" && (
                <CExpansionPanel>
                  <ExpansionPanelSummary className={classes.listItem}  style={{ minHeight : 40, paddingLeft : 0, }} expandIcon={<ArrowDropDownIcon />}>
                    {/* <Icon></Icon> */}
                    <span style={{marginRight:10}} className="material-icons">
                    {this.props.assigned_roles[i][0]['icon']}
</span>
                    <Typography >
                      {i == "cat" ? "Catalogue" : (i == "vm" ? "Virtual Merchandise" : i == "style_stories" ? "Style Stories" : (i == "shopthelook" ? "Shop The Look" : ( i == "auditlogs" ? "Audit Logs" : ( i == "bannercms" ? "Banner Cms"  : i.charAt(0).toUpperCase() + i.slice(1).replace(/([A-Z])/g, ' $1') ) )))}
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails
                    style={{ padding: "0px", display: "block" }}
                  >
                    {nav_link}
                  </ExpansionPanelDetails>
                </CExpansionPanel>
              )}
            </React.Fragment>
          );
        }, this)}
      </div>
    );
  }
}
export default withStyles(styles)(withRouter(MainListItems));