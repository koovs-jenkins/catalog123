import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import {BrowserRouter} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configureStore from "../configureStore";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import { Helmet } from "react-helmet";
const { persistor, store } = configureStore();
import bugsnag from "@bugsnag/js";
import bugsnagReact from "@bugsnag/plugin-react";
import { bsid, namespace } from "../config";
const bugsnagClient = bugsnag({
  apiKey: bsid,
  notifyReleaseStages: ["production"]
});
bugsnagClient.use(bugsnagReact, React);

// wrap your entire app tree in the ErrorBoundary provided
const ErrorBoundary = bugsnagClient.getPlugin("react");

class Root extends React.Component {

  componentDidMount(){
    console.log(this.props)
  }

  render() {
    return (
      <ErrorBoundary>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Helmet>
              {namespace === "koovs" ? (
                <link
                  rel="icon"
                  href="https://images.koovs.com/uploads/koovs/kv-favicon.ico"
                  type="image/gif"
                  sizes="16x16"
                />
              ) : (
                <link
                  rel="icon"
                  href="http://brandfactoryimages.s3-website.ap-south-1.amazonaws.com/uploads/fg/bf-favicon.ico"
                  type="image/gif"
                  sizes="16x16"
                />
              )}
            </Helmet>
            <BrowserRouter>
              <App {...this.props}/>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </MuiThemeProvider>
    </ErrorBoundary>
    )
  }
}

ReactDOM.render(<Root/>, document.getElementById("root"));
