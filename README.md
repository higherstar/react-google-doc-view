# How to use this component

...
import ReactGoogleDocView from './react-google-doc-view';
...
let clientId='<OAUTH_GOOGLE_CLIENT_ID>';
let apiKey='<GOOGLE_API_KEY>'
let documentId='<GOOGLE_DOCUMENT_ID>';
...
render() {
  return (
    ...
    <div>
      <ReactGoogleDocView
            clientId={clientId}
            apiKey={apiKey}
            documentId={documentId}
          />
    </div>
  )
}
