// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Operations
import { doStartLoading, doStopLoading } from '../App/operations';

// Presentation Components
import DocViewer from '../../components/DocViewer';
import { closeNodes, getDocSlideList, getNodeId, getParents, getReadProgress, renderNode } from './viewer';

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
