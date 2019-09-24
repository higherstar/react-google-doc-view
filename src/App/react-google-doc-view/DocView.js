import React, { useState, useEffect } from 'react';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
import './index.css';
import { closeNodes, getDocSlideList, getNodeId, getParents, getReadProgress, renderNode } from './viewer';

const DocView = ({ docContent }) => {
    const { docSectionStructure } = docContent;
    const [curNodeId, setCurNodeId] = useState(0);
    const [curNode, setCurNode] = useState({});
    const [showNavigationList, setShowNavigationList] = useState(false);
    const [progress, setProgress] = useState(0);
    const [docSlideList, setDocSlideList] = useState([]);
    const [menuList, setMenuList ] = useState([]);
    
    const navigateToPrev = (list) => {
        let nodeId = curNodeId - 1;
        if (nodeId < 0) {
            nodeId = list.length - 1;
        }
        closeNodes(getParents(list, curNode));
        getParents(list, list[nodeId]).forEach(item => (item.isOpen = true));
        setCurNodeId(nodeId);
        setCurNode(list[nodeId]);
    };
    
    const navigateToNext = (list) => {
        let nodeId = curNodeId + 1;
        if (nodeId >= list.length) {
            nodeId = 0;
        }
        closeNodes(getParents(list, curNode));
        getParents(list, list[nodeId]).forEach(item => (item.isOpen = true));
        setCurNodeId(nodeId);
        setCurNode(list[nodeId]);
    };
    
    const renderNavigationList = (list, item, key, curNode) => {
        const parents = getParents(list, item);
        return (
            <React.Fragment key={key}>
                <li
                    className={`nav-item ${
                        curNode.nodeId === item.nodeId
                            ? 'active focus'
                            : curNode.nodeId.indexOf(item.nodeId) === 0
                            ? 'active'
                            : ''
                        }`}
                    onClick={e => {
                        const prevNode = list.find(
                            listItem => listItem.nodeId === curNode.nodeId,
                        );
                        if (item.nodeId !== prevNode.nodeId) {
                            prevNode.isOpen = false;
                        }
                        item.isOpen = !item.isOpen;
                        if (item.isOpen) {
                            closeNodes(getParents(list, curNode));
                            parents.forEach(parent => (parent.isOpen = true));
                        }
                        setCurNodeId(getNodeId(list, item));
                        setCurNode({ ...item, isOpen: item.isOpen });
                        e.stopPropagation();
                    }}
                    style={{ paddingLeft: `${10 * (item.level - 1)}px` }}
                >
                    {item.nodeId}. {item.title}
                </li>
                {item.slides && item.isOpen && (
                    <div>
                        <ul>
                            {item.slides.map((slide, index) => {
                                return renderNavigationList(list, slide, index, curNode);
                            })}
                        </ul>
                    </div>
                )}
            </React.Fragment>
        );
    };

    // Set current progress
    useEffect(() => {
        setProgress(getReadProgress(curNodeId, docSlideList.length));
    }, [curNodeId, docSlideList]);

    // Generate slide list
    useEffect(() => {
        const { slideList, menuList } = getDocSlideList(docSectionStructure.sections);
        setDocSlideList(slideList);
        setCurNode(slideList[0]);
        setMenuList(menuList);
    }, []);

    return (
        <div className="doc-view-container">
            <div className="page-container">
                <div className="doc-view-frame-container">
                    <div className="doc-view-frame-header">
                        <div className="doc-view-progress">
                            <Progress percent={progress} status="warning" />
                            <div>
                                {' '}
                                {curNodeId + 1}/{docSlideList.length}
                            </div>
                        </div>
                        <div
                            className="btn-show-list"
                            onClick={() => setShowNavigationList(!showNavigationList)}
                        >
                            <svg
                                width="20"
                                height="16"
                                viewBox="0 0 20 18"
                                fill="white"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width="20" height="1" fill="black"></rect>
                                <rect y="8" width="20" height="1" fill="black"></rect>
                                <rect y="16" width="20" height="1" fill="black"></rect>
                            </svg>
                        </div>
                    </div>
                    <div className="doc-view-frame">
                        {docSlideList.length && renderNode(docSlideList, docSlideList[curNodeId], curNodeId)}
                    </div>
                    <div className="doc-view-frame-controller">
                        <div onClick={() => navigateToPrev(docSlideList)}>Previous</div>
                        <div onClick={() => navigateToNext(docSlideList)}>Next</div>
                    </div>
                </div>
            </div>
            {showNavigationList && (
                <div className="navigation-container">
                    <ul>{menuList.map((item, index) => renderNavigationList(docSlideList, item, index, curNode))}</ul>
                </div>
            )}
        </div>
    );
};
export default DocView;
