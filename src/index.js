import React from 'react';
import './index.css';

const ReactGoogleDocView = ({ docContent }) => {
  return (
    <div className='doc-view-container'>
      <div className='page-container'>
        <div className='doc-view-frame' style={docContent.docFrameStyle}>
          {docContent.docSections.map(block => block.content)}
        </div>
      </div>
    </div>
  )
};
export default ReactGoogleDocView;
export { getSectionBlocks } from './GetSectionBlocks';