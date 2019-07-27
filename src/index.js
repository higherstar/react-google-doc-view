import React, { Component } from 'react';
import './view.css';

let DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1&key=AIzaSyDFmA7ocmXeYPu5bn2fhvJ-vYMSzvZWZFY'];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
let SCOPES = "https://www.googleapis.com/auth/documents.readonly";

class ReactGoogleDocView extends Component {
  componentDidMount() {
    this.handleClientLoad();
  }
  
  handleClientLoad() {
    // window.gapi && window.gapi.load('client:auth2', initClient);
    window.gapi.load('client:auth2', this.initClient);
  }
  
  initClient = () => {
    console.log('init client...');
    window.gapi.client.init({
      apiKey: this.props.apiKey,
      clientId: this.props.clientId,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      this.getDocContent();
      // Listen for sign-in state changes.
      // window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      
      // Handle the initial sign-in state.
      // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      // authorizeButton.onclick = handleAuthClick;
      // signoutButton.onclick = handleSignoutClick;
    }, function(error) {
      console.log(JSON.stringify(error, null, 2));
    });
  };
  
  getDocContent = () => {
    console.log('getting doc content...');
    window.gapi.client.docs.documents.get({
      documentId: this.props.documentId
    }).then((response) => {
      let doc = response.result;
      let title = doc.title;
      console.log(doc);
      console.log(title);
    },function(response) {
      console.log(response.result.error.message);
    });
  };
  
  render() {
    return (
      <div>
        <h2>React Google Doc View</h2>
        <p>client id: {this.props.clientId}</p>
        <p>api key: {this.props.apiKey}</p>
        <p>doc id: {this.props.documentId}</p>
      </div>
    )
  }
}

export default ReactGoogleDocView;
