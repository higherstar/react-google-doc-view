// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Operations
import { doStartLoading, doStopLoading } from '../App/operations';

// Presentation Components
import DocViewer from '../../components/DocViewer';

// Main Component
const ViewerContainer = props => {
    /**
     *
     */
    const { fetching, content } = props;
    const { docFrameStyle, docSectionStructure } = content;
    const [curNodeId, setCurNodeId] = useState(0);
    const [curNode, setCurNode] = useState({});
    const [showNavigationList, setShowNavigationList] = useState(false);
    const [progress, setProgress] = useState(0);
    const [docSlideList, setDocSlideList] = useState([]);
    const [menuList, setMenuList] = useState([]);

    const setReadProgress = () => {
        setProgress(parseInt((curNodeId / docSlideList.length) * 100, 10));
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

    const getDocSlideList = () => {
        const slideList = [];
        docSectionStructure.sections.forEach((section, index1) => {
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
        setDocSlideList(slideList);
        setCurNode(slideList[0]);
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
        setMenuList(tMenuList);
    };

    const closeNodes = nodes => {
        nodes.forEach(item => (item.isOpen = false));
    };

    const getNodeId = node => {
        return docSlideList.findIndex(item => item.nodeId === node.nodeId);
    };

    const getParents = node => {
        return docSlideList.filter(
            item => node.nodeId !== item.nodeId && node.nodeId.indexOf(item.nodeId) === 0,
        );
    };

    const navigateToPrev = () => {
        let nodeId = curNodeId - 1;
        if (nodeId < 0) {
            nodeId = docSlideList.length - 1;
        }
        closeNodes(getParents(curNode));
        getParents(docSlideList[nodeId]).forEach(item => (item.isOpen = true));
        setCurNodeId(nodeId);
        setCurNode(docSlideList[nodeId]);
    };

    const navigateToNext = () => {
        let nodeId = curNodeId + 1;
        if (nodeId >= docSlideList.length) {
            nodeId = 0;
        }
        closeNodes(getParents(curNode));
        getParents(docSlideList[nodeId]).forEach(item => (item.isOpen = true));
        setCurNodeId(nodeId);
        setCurNode(docSlideList[nodeId]);
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

    const renderNode = node => {
        const { level, title, sectionTitle } = node;
        let nodeBody = [];

        // render title
        const nodeTitle = renderTitle(level, title, `title-${curNodeId}-${level}`);
        if (level !== 1) {
            let tNodeId = curNodeId - 1;
            let tLevel = level;
            while (tNodeId >= 0 && docSlideList[tNodeId].level > 1) {
                const tSlide = docSlideList[tNodeId];
                if (tSlide.level < tLevel) {
                    nodeBody.push(
                        renderTitle(tSlide.level, tSlide.title, `title-${tNodeId}-${tSlide.level}`),
                    );
                }
                if (tSlide.level > tLevel) break;
                tLevel = tSlide.level;
                tNodeId -= 1;
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

    const renderNavigationList = (item, key) => {
        const parents = getParents(item);
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
                            closeNodes(getParents(curNode));
                            parents.forEach(parent => (parent.isOpen = true));
                        }
                        setCurNodeId(getNodeId(item));
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
        setReadProgress();
    }, [setReadProgress, curNodeId]);

    // Generate slide list
    useEffect(() => {
        getDocSlideList();
    }, [getDocSlideList]);

    return (
        <DocViewer
            {...props}
            docSlideList={docSlideList}
            loading={fetching}
            style={docFrameStyle}
            nextSlide={navigateToNext}
            prevSlide={navigateToPrev}
            progress={progress}
            curNodeId={curNodeId}
            showTOC={showNavigationList}
            setShowTOC={setShowNavigationList}
            renderTOC={renderNavigationList}
            menuList={menuList}
        >
            {docSlideList.length > 0 && renderNode(docSlideList[curNodeId])}
        </DocViewer>
    );
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            doStartLoading,
            doStopLoading,
        },
        dispatch,
    );

// Property Types
ViewerContainer.propTypes = {
    doStartLoading: PropTypes.func,
    doStopLoading: PropTypes.func,
    fetching: PropTypes.bool,
    content: PropTypes.object,
};

// Export view container (for LMS viewer)
export default connect(mapDispatchToProps)(ViewerContainer);

// Export raw data (for populating tables)
export { getSectionBlocks } from './GetSectionBlocks';
