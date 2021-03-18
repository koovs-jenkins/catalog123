import React from "react";
class NotAuthorized extends React.Component {
  
  handle_local(){
    delete localStorage["modules"]
  }

  render() {
    return (
        <div style={{ textAlign : "center", fontSize : "20px"}}>
            <p>You are not authorized to view this page. Please contact admin.</p>
            <a onClick={this.handle_local.bind(this)}   href="/">Click here to go to Dashboard.</a>
        </div>
    );
  }
}
export default NotAuthorized;