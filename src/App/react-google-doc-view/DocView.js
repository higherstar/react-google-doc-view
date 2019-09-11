import React, { useState, useEffect } from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import './index.css';

const DocView = ({ docContent }) => {
  const { docSectionStructure } = docContent;
  const [docSlideList, setDocSlideList] = useState([]);
  const [curNodeId, setCurNodeId] = useState(0);
  const [showNavigationList, setShowNavigationList] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    getDocSlideList();
  }, []);
  
  useEffect(() => {
    setReadProgress();
  }, [curNodeId]);
  
  const getDocSlideList = () => {
    let slideList = [];
    docSectionStructure.sections.forEach(section => {
      section.slides.forEach(slide => slideList.push({ ...slide, sectionTitle: section.title }));
    });
    setDocSlideList(slideList);
  };
  
  const setReadProgress = () => {
    docSlideList.length && setProgress(parseInt(curNodeId / docSlideList.length * 100));
  };
  
  const navigateToPrev = () => {
    let nodeId = curNodeId - 1;
    if (nodeId < 0) {
      nodeId = docSlideList.length - 1;
    }
    setCurNodeId(nodeId);
  };
  
  const navigateToNext = () => {
    let nodeId = curNodeId + 1;
    if (nodeId >= docSlideList.length) {
      nodeId = 0;
    }
    setCurNodeId(nodeId);
  };
  
  const renderTitle = (level, title, key) => {
    let nodeTitle = '';

    switch (level) {
      case 1:
        nodeTitle = <h1 key={key} style={{fontSize: '32px'}}>{title}</h1>;
        break;
      case 2:
        nodeTitle = <h2 key={key} style={{fontSize: '24px'}}>{title}</h2>;
        break;
      case 3:
        nodeTitle = <h3 key={key} style={{fontSize: '20px'}}>{title}</h3>;
        break;
      case 4:
        nodeTitle = <h4 key={key} style={{fontSize: '18px'}}>{title}</h4>;
        break;
      case 5:
        nodeTitle = <h5 key={key} style={{fontSize: '16px'}}>{title}</h5>;
        break;
      case 6:
        nodeTitle = <h6 key={key} style={{fontSize: '14px'}}>{title}</h6>;
        break;
    
      default:
        nodeTitle = '';
        break;
    }
    return nodeTitle;
  };
  
  const renderNode = (node) => {
    let level = node.level;
    let title = node.title;
    let sectionTitle = node.sectionTitle;
    let nodeBody = [];
    
    // render title
    let nodeTitle = renderTitle(level, title, `title-${curNodeId}-${level}`);
    if (level !== 1) {
      let tNodeId = curNodeId - 1;
      let tLevel = level;
      while (tNodeId >= 0 && docSlideList[tNodeId].level > 1) {
        const tSlide = docSlideList[tNodeId];
        tSlide.level < tLevel && nodeBody.push(renderTitle(tSlide.level, tSlide.title, `title-${tNodeId}-${tSlide.level}`));
        if (tSlide.level > tLevel) break;
        tLevel = tSlide.level;
        tNodeId--;
      }
      nodeBody.push(renderTitle(1, sectionTitle, `title-${curNodeId}-1`));
      nodeBody.reverse();
    }
    if (nodeTitle) nodeBody.push(nodeTitle);
    
    // render content
    const tNodes = node.content.map((slide, index) => <div key={index} dangerouslySetInnerHTML={{__html: slide}} />);
    nodeBody = [...nodeBody, ...tNodes];
    return nodeBody;
  };
  
  const getNodeId = (node) => {
    return docSlideList.findIndex(
      item =>
        item.title === node.title &&
        item.level === node.level &&
        item.wordCount === node.wordCount
    );
  };
  
  const getSection = (node) => {
    return docSectionStructure.sections.find(item => item.title === node.sectionTitle);
  };
  
  const renderNavigationList = (node, key, listIndex) => {
    let nodeId = getNodeId(node);
    let section = getSection(node);
    let siblings = section ? section.slides.map(item => getNodeId(item)) : [];
    if (nodeId === -1) {
      if (docSlideList[curNodeId].sectionTitle === node.title) {
        siblings.push(curNodeId);
      }
      nodeId = getNodeId(node.slides[0])
    }
    siblings.push(nodeId);
    const preIndex = listIndex ? `${listIndex}.${key + 1}` : key + 1;
    return (
      <React.Fragment key={key}>
        <li
          className={`nav-item ${siblings.indexOf(curNodeId) >= 0 ? 'active' : ''}`}
          onClick={(e) => {
            setCurNodeId(nodeId);
            e.stopPropagation();
          }}
        >
          {preIndex}. {node.title}
        </li>
        {node.slides &&
        <div>
          <ul>
            {node.slides.map((item, index) => renderNavigationList(item, index, preIndex))}
          </ul>
        </div>}
      </React.Fragment>
    )
  };
  
  return (
    <div className='doc-view-container'>
      <div className='page-container'>
        <div className='doc-view-frame-container'>
          <div className='doc-view-frame-header'>
            <div className='doc-view-progress'>
              <Progress percent={progress} status="warning" />
              <div> {curNodeId + 1}/{docSlideList.length}</div>
            </div>
            <div className='btn-show-list' onClick={() => setShowNavigationList(!showNavigationList)}>
              <svg width="20" height="16" viewBox="0 0 20 18" fill="white" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="1" fill="black"></rect><rect y="8" width="20" height="1" fill="black"></rect><rect y="16" width="20" height="1" fill="black"></rect></svg>
            </div>
          </div>
          <div className='doc-view-frame'>
            {docSlideList.length && renderNode(docSlideList[curNodeId])}
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
          {docSectionStructure.sections.map((item, key) => renderNavigationList(item, key))}
        </ul>
      </div>}
    </div>
  )
};
export default DocView;