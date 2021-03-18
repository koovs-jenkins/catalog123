import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import DataUsageIcon from '@material-ui/icons/DataUsage';
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MainListItems from "./ListItem";
import logo from "../../../public/images/logo.jpg";
import withWidth from "@material-ui/core/withWidth";
import ExitToApp from "@material-ui/icons/ExitToApp";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { handleSignOut } from "../../store/actions/signin";
import { validateTokenApi } from "../../api/login";
import Lock from "@material-ui/icons/Lock";
import { Link } from "react-router-dom";
import { routesPath } from "../../routes";
import { getLocalStorage, getCookie } from "../../helpers/localstorage";
const drawerWidth = 260;
import axios from "axios";
import Notify from "../../components/Notify";
import { namespace, koovsLogoUrl, env } from "../../../config";

const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    background: "#4354b1"
  },
  appBarShift: {
    width: '100%',
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1,
    color:"#d1d1d1",
  },
  heading:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    '& svg': {
      marginRight:"10px;"
    },
    '& span' :{
      color:"#d1d1d1",
      fontSize:"16px",
      marginLeft:"10px",
    }
  },
  listitems: {
    marginTop:"60px",
    paddingTop: 0
  },
  drawerPaper: {
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    padding:"15px",
    overflow: "auto",
    position: "fixed"
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: "0px"
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto",
    padding:"0px 24px",
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  },
  h5: {
    marginBottom: theme.spacing.unit * 2
  },
  image: {
    margin: "auto"
  },
  contentSpace: {
    marginLeft: drawerWidth,
    background : "#e4e4e4"
  }
});

class Layout extends React.Component {
  state = {
    open: this.props.width !== "xs" ? true : false,
    assigned_roles: "",
    role_error: ""
  };

  componentDidMount() {
    console.log("Rendering Menu")
    this.get_access();
  }


  get_access() {
    var self = this;
    var headers = {
      "x-api-client": "web",
      "X-AUTH-TOKEN": getCookie("_koovs_token"),
      "Content-Type": "application/json",
      "x-user" : localStorage[env + "_koovs_userid"],
      "api-call-from": location.pathname ? location.pathname : window.location.pathname
    };
    axios.get("/assigned-access", { headers }).then(res => {
      if (!res.data.statusCode) {
        var check = [];
        Object.keys(res.data).map(function(i, index) {
          var data =
            i == "cat" ? "catalog" : i == "customer" ? "call_center" : i;
          check.push(data);
        });
        self.setState({ assigned_roles: res.data }, () => {
          localStorage["modules"] = JSON.stringify(check);
        });
      }
      else if (res.data.statusCode == "403") {
        self.props.dispatch(handleSignOut());
      }
      else if (res.data.statusCode == "404") {
        self.setState({ role_error: res.data.message }, () => {
          self.props.history.push("/not-authorized?redirect_url=" + (location.pathname ? location.pathname : window.location.pathname));
        });
        // self.props.dispatch(handleSignOut())
      }
    });
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, children, roles, email, vendor, name } = this.props;
    return (
      <div className={classes.root}>
        {this.state.role_error && (
          <Notify
            message={this.state.role_error ? this.state.role_error : ""}
          />
        )}
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(
            classes.appBar,
            this.state.open && classes.appBarShift
          )}
        >
          <Toolbar
            disableGutters={!this.state.open}
            className={classes.toolbar}
          >
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h5"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.heading}
            >
             <DataUsageIcon/> OPS |<span>Hi! {name}</span>
            </Typography>
            <Typography
              component="h5"
              variant="h6"
              color="inherit"
              noWrap
              align="right"
              className={classes.title}
            >
              {/* {email.split("@")[0]} */}
            </Typography>
            <Link
              style={{ textDecoration: "none" }}
              to={routesPath.CHANGE_PASSWORD}
            >
              <IconButton
                style={{ color: "white" }}
                aria-label="Change Password"
                title="Change Password"
              >
                <Lock color="inherit" />
              </IconButton>
            </Link>
            <IconButton
              color="inherit"
              title="Logout"
              aria-label="Logout"
              onClick={() => this.props.dispatch(handleSignOut())}
            >
              <ExitToApp />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            )
          }}
          open={this.state.open}
        >
          {/* <div className={classes.toolbarIcon}>
            <img
              className={classes.image}
              src={namespace === "koovs" ? koovsLogoUrl : logo}
              width="100px"
            />
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div> */}
          {/* <Divider /> */}
          <List className={classes.listitems}>
            <MainListItems
              assigned_roles={this.state.assigned_roles}
              vendor={vendor}
            />
          </List>
        </Drawer>
        <main
          id="main_container"
          className={classNames(
            classes.content,
            this.state.open && classes.contentSpace
          )}
        >
          <div className={classes.appBarSpacer} />
          {children}
        </main>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  name:state.signin.data.body.data.user.name,
  email: state.signin.data.body.data.user.email,
  vendor: state.signin.data.vendor
});

export default withRouter(
  withStyles(styles)(withWidth()(connect(mapStateToProps)(Layout)))
);