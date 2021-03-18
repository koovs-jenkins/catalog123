import React from "react";
import { getDateTime } from "../helpers";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(
      "error-2 for data fetching " +
        getDateTime() +
        " => Error : " +
        error +
        " Error Info " +
        info
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <React.Fragment>
          <h1>Something went wrong.</h1>
        </React.Fragment>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
