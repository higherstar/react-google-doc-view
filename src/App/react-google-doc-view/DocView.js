import React, { useState, useEffect } from 'react';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
import './index.css';

const DocView = ({ docContent }) => {
    const { docSectionStructure } = docContent;
    const [curNodeId, setCurNodeId] = useState(0);
    const [curNode, setCurNode] = useState({});
    const [showNavigationList, setShowNavigationList] = useState(false);
    const [progress, setProgress] = useState(0);
    const [docSlideList, setDocSlideList] = useState([]);
    const [menuList, setMenuList ] = useState([]);

    const setReadProgress = (curPos, totalLen) => {
        setProgress(parseInt(totalLen ? (curPos / totalLen) * 100 : '0', 10));
    };

    const findInNestedList = (list, nodeId, node) => {
        if (list.nodeId === nodeId) {
            list.slides.push(node);
            return true;
        }
        for (let i = 0; i < list.slides.length; i += 1) {
            if (findInNestedList(list.slides[i], nodeId, node)) {
                return true;
            }
        }
        return false;
    };

    const getDocSlideList = (sections) => {
        const slideList = [];
        sections.forEach((section, index1) => {
            section.slides.forEach((slide, index2) => {
                const { level } = slide;
                let pos = slideList.length - 1;
                // get parent index
                let siblingCount = 0;
                while (pos >= 0 && slideList[pos].level + 1 !== level) {
                    if (slideList[pos].level === level) siblingCount += 1;
                    pos -= 1;
                }
                const parentNodeId = pos >= 0 ? `${slideList[pos].nodeId}.${siblingCount + 1}` : '';
                const nodeId =
                    index2 === 0
                        ? (index1 + 1).toString()
                        : parentNodeId || (index2 + 1).toString();
                slideList.push({
                    ...slide,
                    sectionTitle: section.title,
                    nodeId,
                    isOpen: false,
                    slides: [],
                });
            });
        });
        const tMenuList = [];
        slideList.forEach(item => {
            if (item.level === 1) {
                tMenuList.push(item);
            } else {
                const { nodeId } = item;
                const pNodeId = nodeId.substr(0, nodeId.length - 2);
                for (let i = 0; i < tMenuList.length; i += 1) {
                    if (findInNestedList(tMenuList[i], pNodeId, item)) {
                        break;
                    }
                }
            }
        });
        return { slideList, menuList: tMenuList };
    };

    const closeNodes = nodes => {
        nodes.forEach(item => (item.isOpen = false));
    };

    const getNodeId = (list, node) => {
        return list.findIndex(item => item.nodeId === node.nodeId);
    };

    const getParents = (list, node) => {
        return list.filter(
            item => node.nodeId !== item.nodeId && node.nodeId.indexOf(item.nodeId) === 0,
        );
    };
    
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

    const renderTitle = (level, title, key) => {
        let nodeTitle = '';

        switch (level) {
        case 1:
            nodeTitle = (
                <h1 key={key} style={{ fontSize: '32px' }}>
                    {title}
                </h1>
            );
            break;
        case 2:
            nodeTitle = (
                <h2 key={key} style={{ fontSize: '24px' }}>
                    {title}
                </h2>
            );
            break;
        case 3:
            nodeTitle = (
                <h3 key={key} style={{ fontSize: '20px' }}>
                    {title}
                </h3>
            );
            break;
        case 4:
            nodeTitle = (
                <h4 key={key} style={{ fontSize: '18px' }}>
                    {title}
                </h4>
            );
            break;
        case 5:
            nodeTitle = (
                <h5 key={key} style={{ fontSize: '16px' }}>
                    {title}
                </h5>
            );
            break;
        case 6:
            nodeTitle = (
                <h6 key={key} style={{ fontSize: '14px' }}>
                    {title}
                </h6>
            );
            break;

        default:
            nodeTitle = '';
            break;
        }
        return nodeTitle;
    };

    const renderNode = (list, node) => {
        const { level, title, sectionTitle } = node;
        let nodeBody = [];

        // render title
        const nodeTitle = renderTitle(level, title, `title-${curNodeId}-${level}`);
        if (level !== 1) {
            let tLevel = level;
            for (let tNodeId = curNodeId - 1; tNodeId >= 0 && list[tNodeId].level > 1; tNodeId -= 1) {
                const tSlide = list[tNodeId];
                if (tSlide.level < tLevel) {
                    nodeBody.push(
                        renderTitle(tSlide.level, tSlide.title, `title-${tNodeId}-${tSlide.level}`),
                    );
                }
                if (tSlide.level > tLevel) break;
                tLevel = tSlide.level;
            }
            nodeBody.push(renderTitle(1, sectionTitle, `title-${curNodeId}-1`));
            nodeBody.reverse();
        }
        if (nodeTitle) nodeBody.push(nodeTitle);

        // render content
        const tNodes = <div key="node-key" dangerouslySetInnerHTML={{ __html: node.content }} />;
        nodeBody = [...nodeBody, tNodes];
        return nodeBody;
    };

    const renderNavigationList = (list, item, key) => {
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
                        const prevNode = docSlideList.find(
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
                                return renderNavigationList(list, slide, index);
                            })}
                        </ul>
                    </div>
                )}
            </React.Fragment>
        );
    };

    // Set current progress
    useEffect(() => {
        setReadProgress(curNodeId, docSlideList.length);
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
                        {docSlideList.length && renderNode(docSlideList, docSlideList[curNodeId])}
                    </div>
                    <div className="doc-view-frame-controller">
                        <div onClick={() => navigateToPrev(docSlideList)}>Previous</div>
                        <div onClick={() => navigateToNext(docSlideList)}>Next</div>
                    </div>
                </div>
            </div>
            {showNavigationList && (
                <div className="navigation-container">
                    <ul>{menuList.map((item, index) => renderNavigationList(docSlideList, item, index))}</ul>
                </div>
            )}
        </div>
    );
};
export default DocView;
