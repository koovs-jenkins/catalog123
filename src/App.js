import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { Switch, Route, Redirect} from "react-router-dom";
import { routes } from "./routes";
import { connect } from "react-redux";
import { getCookie } from "./helpers/localstorage";
import axios from "axios";
import Signin from "./containers/SignIn";
import Layout from "./components/Layout";
import { withRouter } from "react-router";
import { handleSignOut } from "../src/store/actions/signin";
import { env } from "../config";
class App extends Component {
  constructor() {
    super();
    this.state = {
      currentCookie: "",
      modules: localStorage["modules"] ? JSON.parse(localStorage["modules"]): []
    };
  }

  componentDidMount() {
    
  }
  
  UNSAFE_componentWillReceiveProps(prevProps) {
     console.log("Rendering Routes", this.props)
    if(this.props.location != prevProps.location){
        this.get_access();
    }
  }


  get_access() {
    var self = this;
    var headers = {
      "x-api-client": "web",
      "X-AUTH-TOKEN": getCookie("_koovs_token"),
      "x-user" : localStorage[env + "_koovs_userid"],
      "Content-Type": "application/json",
      "api-call-from": location.pathname ? location.pathname : window.location.pathname
    };
    axios.get("/assigned-access", { headers }).then(res => {
      if (!res.data.statusCode) {
        var roles = [];
        var check = [];
        Object.keys(res.data).map(function(i, index) {
          var data =  i == "cat" ? "catalog" : i == "customer" ? "call_center" : i;
          check.push(data);
          res.data[i].map(function(j, jindex) {
            roles.push(j);
          });
        });
        self.setState({ modules: check }, () => {
          localStorage["modules"] = JSON.stringify(self.state.modules);
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

  render() {
    const { isAuthenticated, roles } = this.props;
    var router = [];
    routes.map(function(i, index) {
      if (i.customHeader) {
        if (i.path == "/") {
          router.push(
            <PrivateRoute
              key={index}
              exact={i.exact}
              path={i.path}
              component={i.component}
              isAuthenticated={isAuthenticated}
            />
          );
        } 
        else if (i.path == "/change_password") {
          router.push(
            <PrivateRoute
              key={index}
              exact={i.exact}
              path={i.path}
              component={i.component}
              isAuthenticated={isAuthenticated}
            />
          );
        } 
        else if (i.path != "/") {
          if (this.state.modules.length > 0) {
            this.state.modules.map(function(j, jindex) {
              if (i.path.includes(j) || (j == "vm" && i.path.includes("virtual-merchandise"))){
                router.push(
                  <PrivateRoute
                    key={jindex + "_" + index}
                    exact={i.exact}
                    path={i.path}
                    component={i.component}
                    isAuthenticated={isAuthenticated}
                  />
                );
              }
            }, this);
          } 
          else {
            router.push(
              <NotAuthorized
                key={index}
                exact={i.exact}
                path={i.path}
                component={i.component}
                notAuthorized={false}
              />
            );
          }
        }
      } 
      else {
        if (i.path == "/login") {
          router.push(
            <Route
              key={index}
              exact={i.exact}
              path={i.path}
              render={props =>
                isAuthenticated ? (
                  <Redirect
                    to={{ pathname: "/", state: { from: props.location } }}
                  />
                ) : (
                  <Signin {...props} />
                )
              }
            />
          );
        } else {
          router.push(
            <Route
              key={index}
              exact={i.exact}
              path={i.path}
              component={i.component}
            />
          );
        }
      }
    }, this);

    const common = (
      <Switch>
        {router}
        <Route path="*" component={NotAuthorized} />
      </Switch>
    );

    return (
      <React.Fragment>
        {isAuthenticated ? <Layout>{common}</Layout> : common}
      </React.Fragment>
    );
  }
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        rest.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

function NotAuthorized({ component: Component, ...rest }) {
  return (
    <Route 
    {...rest} 
    render={ (props) => rest.notAuthorized ? (<Component {...props} />) : (<Redirect to={{ pathname: "/not-authorized", state: { from: props.location }}}/> )}
    />
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.signin.isAuthenticated
});

export default hot(module)(withRouter(connect(mapStateToProps)(App)));
