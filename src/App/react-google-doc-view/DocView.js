import React, { useState } from 'react';
import './index.css';

const DocView = ({ docContent }) => {
  const { docSectionList, totalElementCount } = docContent;
  const [curNodeId, setCurNodeId] = useState(docSectionList.sections[0].id);
  const [curNodeContent, setCurNodeContent] = useState(docSectionList.sections[0]);
  const [showNavigationList, setShowNavigationList] = useState(false);
  
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
        nodeTitle = <h1 style={{fontSize: '32px'}}>{title}</h1>;
        break;
      case 2:
        nodeTitle = <h2 style={{fontSize: '24px'}}>{title}</h2>;
        break;
      case 3:
        nodeTitle = <h3 style={{fontSize: '16px'}}>{title}</h3>;
        break;
      case 4:
        nodeTitle = <h4 style={{fontSize: '15px'}}>{title}</h4>;
        break;
      case 5:
        nodeTitle = <h5 style={{fontSize: '14px'}}>{title}</h5>;
        break;
      case 6:
        nodeTitle = <h6 style={{fontSize: '13px'}}>{title}</h6>;
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
      let child = nodeContent;
      while (child.level > 1) {
        const parent = findParent(child.id, child.level);
        if (parent) {
          nodeBody.push(renderTitle(parent));
          child = parent;
        } else {
          console.log('no parent');
          break;
        }
      }
      nodeBody.reverse();
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
  
  const renderNavigationList = (node, index) => {
    if (!node.slides) {
      return node.title
        ? <li className='nav-item' onClick={() => {
            setCurNodeContent(node);
            setCurNodeId(node.id);
          }}>{node.title}</li>
        : null;
    }
    return (
      <li className='nav-item' onClick={() => {
        setCurNodeContent(node);
        setCurNodeId(node.id);
      }}>
        {index}. {node.title}
        {node.slides && node.slides.length > 0 &&
          <ul>{node.slides.map((slide, index1) =>
            renderNavigationList(slide, index1))}
          </ul>
        }
      </li>
    );
  };
  
  return (
    <div className='doc-view-container'>
      <div className='page-container'>
        <div className='doc-view-frame-container'>
          <div className='doc-view-frame-header'>
            <div className='btn-show-list' onClick={() => setShowNavigationList(true)}>
              <svg width="20" height="16" viewBox="0 0 20 18" fill="white" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="1" fill="black"></rect><rect y="8" width="20" height="1" fill="black"></rect><rect y="16" width="20" height="1" fill="black"></rect></svg>
            </div>
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
      {showNavigationList &&
      <div className='navigation-container'>
        <ul>
          {docSectionList.sections.map((section, index) => renderNavigationList(section, index + 1))}
        </ul>
      </div>}
    </div>
  )
};
export default DocView;