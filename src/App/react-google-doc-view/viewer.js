import React from 'react';

const getReadProgress = (curPos, totalLen) => {
    return parseInt(totalLen ? (curPos / totalLen) * 100 : '0', 10);
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
            for (; pos >= 0 && slideList[pos].level + 1 !== level; pos -= 1) {
                if (slideList[pos].level === level) {
                    siblingCount += 1;
                }
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

const renderNode = (list, node, curNodeId) => {
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

export {
    getReadProgress,
    findInNestedList,
    getDocSlideList,
    closeNodes,
    getNodeId,
    getParents,
    renderTitle,
    renderNode
}