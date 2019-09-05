import React, { useState, useEffect } from 'react';
import './index.css';

const DocView = ({ docContent }) => {
  const { docSectionList, docSections, docFrameStyle, totalElementCount } = docContent;
  const [curNodeId, setCurNodeId] = useState(docSectionList.sections[0].id);
  const [curNodeContent, setCurNodeContent] = useState(docSectionList.sections[0]);

  const findInSection = (nodeId, section) => {
    if (section.id === nodeId) {
      return section;
    } else if (!section.slides) {
      return false;
    }
    let searchedNode = null;
    for (let i = 0; i < section.slides.length; i++) {
      searchedNode = findInSection(nodeId, section.slides[i]);
      if (searchedNode) {
        break;
      }
    }
    return searchedNode;
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
  
  const findParent = (curNodeId, curNodeLevel) => {
    let nodeId = curNodeId;
    let nodeContent = {};
    do {
      nodeId--;
      nodeContent = findInList(nodeId);
    } while ((!nodeContent || !nodeContent.level || nodeContent.level >= curNodeLevel) && nodeId >= 0);
    if (nodeContent && nodeId >= 0) {
      return nodeContent;
    } else {
      return false;
    }
  };
  
  const navigateToNode = (nodeId) => {
    const nodeContent = findInList(nodeId);
  };
  
  const navigateToPrev = () => {
    let nodeId = curNodeId;
    let nodeContent = {};
    do {
      nodeId--;
      nodeContent = findInList(nodeId);
    } while ((!nodeContent || !nodeContent.level) && nodeId >= 0);
    if (nodeContent && nodeId >= 0) {
      setCurNodeContent(nodeContent);
      setCurNodeId(nodeId);
    }
  };
  
  const navigateToNext = () => {
    let nodeId = curNodeId;
    let nodeContent = {};
    do {
      nodeId++;
      console.log(nodeId);
      nodeContent = findInList(nodeId);
    } while ((!nodeContent || !nodeContent.level) && nodeId < totalElementCount);
    if (nodeContent && nodeId < totalElementCount) {
      setCurNodeContent(nodeContent);
      setCurNodeId(nodeId);
    }
  };
  
  const renderTitle = (nodeContent) => {
    let nodeTitle = '';
    let level = nodeContent.level;
    let title = nodeContent.title;
    // render title
    switch (level) {
      case 1:
        nodeTitle = <h1>{title}</h1>;
        break;
      case 2:
        nodeTitle = <h2>{title}</h2>;
        break;
      case 3:
        nodeTitle = <h3>{title}</h3>;
        break;
      case 4:
        nodeTitle = <h4>{title}</h4>;
        break;
      case 5:
        nodeTitle = <h5>{title}</h5>;
        break;
      case 6:
        nodeTitle = <h6>{title}</h6>;
        break;
    
      default:
        nodeTitle = '';
        break;
    }
    return nodeTitle;
  };
  
  const renderNode = (nodeContent) => {
    let level = nodeContent.level;
    let nodeTitle = renderTitle(nodeContent);
    let nodeBody = [];
    
    if (level > 1) {
      const parent = findParent(nodeContent.id, level);
      if (parent) {
        nodeBody.push(renderTitle(nodeContent));
      }
    }
    if (nodeTitle) nodeBody.push(nodeTitle);
    
    // render content
    if (nodeContent.slides) {
      const tNodes = nodeContent.slides.map(slide => renderNode(slide));
      nodeBody = [...nodeBody, ...tNodes];
    } else {
      nodeBody.push(nodeContent.html);
    }
    return nodeBody;
  };
  
  return (
    <div className='doc-view-container'>
      <div className='page-container'>
        <div className='doc-view-frame-container'>
          <div className='doc-view-frame-header'>
  
          </div>
          <div className='doc-view-frame'>
            {curNodeContent && renderNode(curNodeContent).map(item => item)}
          </div>
          <div className='doc-view-frame-controller'>
            <div onClick={() => navigateToPrev()}>Previous</div>
            <div onClick={() => navigateToNext()}>Next</div>
          </div>
        </div>
      </div>
    </div>
  )
};
export default DocView;