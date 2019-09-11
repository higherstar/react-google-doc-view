import React, { useState, useEffect } from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import './index.css';

const DocView = ({ docContent }) => {
  const { docSlideList } = docContent;
  const [curNodeId, setCurNodeId] = useState(0);
  const [curNodeContent, setCurNodeContent] = useState(docSlideList[0]);
  const [openState, setOpenState] = useState(false);
  const [showNavigationList, setShowNavigationList] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    setReadProgress();
  }, [curNodeId]);
  
  const setReadProgress = () => {
    setProgress(curNodeId / docSlideList.length * 100 );
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
        nodeTitle = <h3 key={key} style={{fontSize: '16px'}}>{title}</h3>;
        break;
      case 4:
        nodeTitle = <h4 key={key} style={{fontSize: '15px'}}>{title}</h4>;
        break;
      case 5:
        nodeTitle = <h5 key={key} style={{fontSize: '14px'}}>{title}</h5>;
        break;
      case 6:
        nodeTitle = <h6 key={key} style={{fontSize: '13px'}}>{title}</h6>;
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
      nodeBody.push(renderTitle(level, sectionTitle, `title-${curNodeId}-1`));
    }
    if (nodeTitle) nodeBody.push(nodeTitle);
    
    // render content
    const tNodes = node.content.map(slide => <div dangerouslySetInnerHTML={slide.content} />);
    nodeBody = [...nodeBody, ...tNodes];
    return nodeBody;
  };
  
  const renderNavigationList = (node, pIndex, cIndex) => {
    if (!node.slides) {
      return (
        <li
          key={cIndex}
          className='nav-item'
          onClick={() => {
            setCurNodeContent(node);
            setCurNodeId(node.id);
          }}
        >
          {node.title}
        </li>
      );
    }
    let levelStr = pIndex ? `${pIndex}.${cIndex}` : cIndex;
    let childIndex = 0;
    
    return (
      <React.Fragment key={cIndex}>
        <React.Fragment>
          {/*<li*/}
            {/*className={`nav-item ${ (curSection && curSection.id === node.id) || curNodeId === node.id ? 'active' : ''}`}*/}
            {/*onClick={(e) => {*/}
              {/*node.isOpen = !node.isOpen;*/}
              {/*setCurNodeContent(node);*/}
              {/*setCurNodeId(node.id);*/}
              {/*setOpenState(node.isOpen);*/}
              {/*if (parents) {*/}
                {/*const sectionLevel = levelStr.toString().split('.')[0];*/}
                {/*setProgress((sectionLevel - 1)/docSectionList.sections.length*100);*/}
              {/*}*/}
              {/*e.stopPropagation();*/}
            {/*}}*/}
          {/*>*/}
            {/*{levelStr}. {node.title}*/}
          {/*</li>*/}
          {/*<div>*/}
            {/*{node.isOpen && node.slides && node.slides.length > 0 &&*/}
            {/*<ul>*/}
              {/*{node.slides.map((slide) => {*/}
                {/*if (slide.title) {*/}
                  {/*childIndex++;*/}
                  {/*return renderNavigationList(slide, levelStr, childIndex);*/}
                {/*}*/}
                {/*return null;*/}
              {/*})}*/}
            {/*</ul>*/}
            {/*}*/}
          {/*</div>*/}
        </React.Fragment>
      </React.Fragment>
    );
  };
  
  return (
    <div className='doc-view-container'>
      <div className='page-container'>
        <div className='doc-view-frame-container'>
          <div className='doc-view-frame-header'>
            <div className='doc-view-progress'>
              <Progress percent={progress} status="warning" />
              <div> {progress/100*docSlideList.length}/{docSlideList.length}</div>
            </div>
            <div className='btn-show-list' onClick={() => setShowNavigationList(!showNavigationList)}>
              <svg width="20" height="16" viewBox="0 0 20 18" fill="white" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="1" fill="black"></rect><rect y="8" width="20" height="1" fill="black"></rect><rect y="16" width="20" height="1" fill="black"></rect></svg>
            </div>
          </div>
          <div className='doc-view-frame'>
            {docSlideList[curNodeId].map(item => renderNode(item))}
          </div>
          <div className='doc-view-frame-controller'>
            <div onClick={() => navigateToPrev()}>Previous</div>
            <div onClick={() => navigateToNext()}>Next</div>
          </div>
        </div>
      </div>
      {/*{showNavigationList &&*/}
      {/*<div className='navigation-container'>*/}
        {/*<ul>*/}
          {/*{docSectionList.sections.map((section, index) => renderNavigationList(section, null, index + 1))}*/}
        {/*</ul>*/}
      {/*</div>}*/}
    </div>
  )
};
export default DocView;