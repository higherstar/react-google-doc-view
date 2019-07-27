import React, { Component } from 'react';
import DocViewFrame from './DocViewFrame';
import './view.css';

class ReactGoogleDocView extends Component {
  docData = {};
  constructor(props) {
    super(props);
    this.state = {isLoading: false};
  }
  
  componentDidMount() {
    // window.gapi.load("client:auth2", () => {
    //   console.log('auth signing ...');
    //   window.gapi.auth2.init({client_id: this.props.clientId}).then(() => {
    //     console.log('init client!');
    //     this.authenticate();
    //   })
    // });
  }
  
  authenticate = () => {
    return window.gapi.auth2.getAuthInstance()
      .signIn({scope: "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly"})
      .then(() => {
        console.log("Sign-in successful");
        this.loadClient();
      }, function(err) {
        console.error("Error signing in", err);
      });
  };
  
  loadClient = () => {
    window.gapi.client.setApiKey(this.props.apiKey);
    return window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/docs/v1/rest")
      .then(() => {
        console.log("GAPI client loaded for API");
        this.execute();
      }, (err) => {
        console.error("Error loading GAPI client for API", err);
      });
  };
  
  // Make sure the client is loaded and sign-in is complete before calling this method.
  execute = () => {
    return window.gapi.client.docs.documents.get({
      "documentId": this.props.documentId,
      "suggestionsViewMode": "DEFAULT_FOR_CURRENT_ACCESS"
    }).then((response) => {
      // Handle the results here (response.result has the parsed body).
      console.log("Response", response);
      this.docData = response;
      this.setState({isLoading: false});
      console.log(this.docData);
    }, (err) => {
      console.error("Execute error", err);
    });
  };
  
  render() {
    return (
      <div>
        <h2>React Google Doc View</h2>
        <p>client id: {this.props.clientId}</p>
        <p>api key: {this.props.apiKey}</p>
        <p>doc id: {this.props.documentId}</p>
        {/*<iframe style={{width: '90vw', height: '100vh', margin: '0 auto'}} src={`https://docs.google.com/document/d/` + this.props.documentId + `/edit?usp=sharing`}/>*/}
        {this.state.isLoading && <p>Loading ...</p>}
        {!this.state.isLoading &&
          <div>
            <DocViewFrame data={this.docData}/>
          </div>
        }
      </div>
    )
  }
}

export default ReactGoogleDocView;
