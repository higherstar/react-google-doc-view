# How to use this component
```
...
import ReactGoogleDocView from './react-google-doc-view';
...
let clientId='<OAUTH_GOOGLE_CLIENT_ID>';
let apiKey='<GOOGLE_API_KEY>'
let documentId='<GOOGLE_DOCUMENT_ID>';
...

  state = {
    isDocLoaded: false,
    sectionBlocks: [],  // [{title, content, type}]
    docFrameStyle: {}
  };
  
  getSectionBlock = ({sectionBlocks, docFrameStyle}) => {
    this.setState({sectionBlocks, docFrameStyle, isDocLoaded: true});
  };

  render() {
    const {isDocLoaded, sectionBlocks, docFrameStyle} = this.state;
    return (
      ...
      <div>
        <ReactGoogleDocView
          clientId={clientId}
          apiKey={apiKey}
          documentId={documentId}
          getSections={this.getSectionBlock}
          afterLoading={() => this.setState({isDocLoaded: true})}
        />
        {isDocLoaded ?
        <div className='doc-view-container'>
          <div className='page-container'>
            <div className='doc-view-frame' style={docFrameStyle}>
              {sectionBlocks.map(block => block.content)}
            </div>
          </div>
        </div>: null}
      </div>
    )
  }
```
