import React, { useState, useEffect } from 'react';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

// Viewer Helpers
import {
    closeNodes,
    getDocSlideList,
    getNodeId,
    getParents,
    getReadProgress,
    getNonEmptyNodeId,
    renderNode,
} from './viewer';
import './index.css';

const DocView = ({ docContent, finishReading }) => {
    const { docSectionStructure, errors } = docContent;
    const [curNodeId, setCurNodeId] = useState(0);
    const [curNode, setCurNode] = useState({});
    const [showNavigationList, setShowNavigationList] = useState(false);
    const [progress, setProgress] = useState(0);
    const [docSlideList, setDocSlideList] = useState([]);
    const [menuList, setMenuList] = useState([]);
    
    useEffect(() => {
        if (docSlideList.length === 0) {
            return;
        }
        const nextId = getNonEmptyNodeId(curNodeId + 1, +1, docSlideList);
        if (nextId < curNodeId) {
            finishReading();
        }
    }, [curNodeId]);

    const navigateToPrev = () => {
        if (docSlideList.length < 1 || curNodeId === -1) {
            return;
        }
        const nodeId = getNonEmptyNodeId(curNodeId - 1, -1, docSlideList);
        closeNodes(getParents(docSlideList, curNode));
        getParents(docSlideList, docSlideList[nodeId]).forEach(item => (item.isOpen = true));
        setCurNodeId(nodeId);
        setCurNode(docSlideList[nodeId]);
    };

    const navigateToNext = () => {
        if (docSlideList.length < 1 || curNodeId === -1) {
            return;
        } else if (docSlideList.length === 1) {
            finishReading();
            return;
        }
        const nodeId = getNonEmptyNodeId(curNodeId + 1, +1, docSlideList);
        closeNodes(getParents(docSlideList, curNode));
        getParents(docSlideList, docSlideList[nodeId]).forEach(item => (item.isOpen = true));
        setCurNodeId(nodeId);
        setCurNode(docSlideList[nodeId]);
    };

    const renderNavigationList = (item, key) => {
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
                        const prevNode = docSlideList.find(
                            listItem => listItem.nodeId === curNode.nodeId,
                        );
                        if (item.nodeId !== prevNode.nodeId) {
                            prevNode.isOpen = false;
                        }
                        // find non-empty slide
                        let targetNodeId = getNodeId(docSlideList, item);
                        for (let i = targetNodeId;; i += 1) {
                            if (i >= docSlideList.length) {
                                break;
                            }
                            if (docSlideList[i].content) {
                                targetNodeId = i;
                                break;
                            }
                        }
                        const targetItem = docSlideList[targetNodeId];
                        const parents = getParents(docSlideList, targetItem);
                        item.isOpen = !item.isOpen;
                        if (item.isOpen) {
                            closeNodes(getParents(docSlideList, curNode));
                            parents.forEach(parent => (parent.isOpen = true));
                        }
                        
                        setCurNodeId(targetNodeId);
                        setCurNode({ ...targetItem, isOpen: item.isOpen });
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
                                return renderNavigationList(slide, index);
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
    }, [setProgress, curNodeId, docSlideList]);

    // Generate slide list
    useEffect(() => {
        const { slideList, updatedMenuList } = getDocSlideList(
            docSectionStructure.sections,
        );
        const nodeId = getNonEmptyNodeId(0, +1, slideList);
        setCurNodeId(nodeId);
        setCurNode(slideList[nodeId]);
        setDocSlideList(slideList);
        setMenuList(updatedMenuList);
    }, []);

    return (
        <div className="doc-view-container">
            <div className="page-container">
                <div className="error-warning-container">
                    {errors.map((error, index) => (
                        <div key={`error-${index}`} className="error-warning-item">
                            <div>type: {error.type}</div>
                            <div>action: {error.action}</div>
                            <div>context: {error.context}</div>
                            <div>message: {error.message}</div>
                        </div>
                    ))}
                </div>
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
                        {docSlideList.length && curNodeId >= 0
                            ? renderNode(docSlideList, docSlideList[curNodeId], curNodeId)
                            : null
                        }
                    </div>
                    {docSlideList.length && curNodeId >= 0 ? (
                        <div className="doc-view-frame-controller">
                            {docSlideList.length > 1 && getNonEmptyNodeId(curNodeId - 1, -1, docSlideList) !== curNodeId ? (
                                <div onClick={() => navigateToPrev()}>Previous</div>
                            ) : <span/>}
                            
                            <div onClick={() => navigateToNext()}>
                                {getNonEmptyNodeId(curNodeId + 1, +1, docSlideList) <= curNodeId ? 'Finish' : 'Next'}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            {showNavigationList && (
                <div className="navigation-container">
                    <ul>{menuList.map((item, index) => renderNavigationList(item, index))}</ul>
                </div>
            )}
        </div>
    );
};

export default DocView;
