import React, { useState } from 'react';
import './index.css';

const DocView = ({ docContent }) => {
  const { docSectionList, docSections, docFrameStyle } = docContent;
  const { curNodeId, setCurNodeId } = useState(docSectionList.sections[0].id);
  const { curNodeContent, setCurNodeContent } = useState(docSectionList.sections[0]);
  
  const findInSection = (nodeId, section) => {
  
  };
  
  const findInList = (nodeId) => {
    let searchResult = '';
    for (let i = 0; i < docSectionList.sections.length; i++) {
      const res = findInSection(nodeId, docSectionList.sections[i]);
      if (res) {
        searchResult = res;
        break;
      }
    }
    return searchResult;
  };
  
  const navigateToNode = (nodeId) => {
    const nodeContent = findInList(nodeId);
    setCurNodeContent(nodeContent);
    setCurNodeId(nodeId);
  };
  
  const navigateToPrev = (curNodeId) => {
  
  };
  
  const navigateToNext = (curNodeId) => {
  
  };
  
  console.log(docContent.docSectionList);
  return (
    <div className='doc-view-container'>
      <div className='page-container'>
        <div className='doc-view-frame' style={docFrameStyle}>
          {docSections.map(block => block.content)}
          {/*{curNodeContent.map(item => item)}*/}
        </div>
        <div className='doc-view-controller'>
          <span onClick={() => navigateToPrev(curNodeId)}>Prev</span>
          <span onClick={() => navigateToNext(curNodeId)}>Next</span>
        </div>
      </div>
    </div>
  )
};
export default DocView;