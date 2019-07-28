import React, {Component} from "react";
import {data1} from "./sample";
import {getBorderStyle, getTextStyle} from "./GetStyle";

class DocViewFrame extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.data);
    this.elementArr = this.props.data.result.body.content;
    this.documentStyle = this.props.data.result.documentStyle;
    this.namedStyles = this.props.data.result.namedStyles.styles;
    this.inlineObjects = this.props.data.result.inlineObjects;
    this.lists = this.props.data.result.lists;
    // this.elementArr = data1.body.content;
    // this.documentStyle = data1.documentStyle;
    // this.namedStyles = data1.namedStyles.styles;
    // this.inlineObjects = data1.inlineObjects;
    // this.lists = data1.lists;
    // this.frameStyle = {};
  }
  
  componentDidMount() {
    this.getFrameStyle();
    this.getNamedStyle();
    this.forceUpdate();
  }
  
  getNamedStyle = () => {
    let namedStyles = {};
    this.namedStyles.forEach(item => {
      namedStyles[item.namedStyleType] = {
        textStyle: item.textStyle,
        paraStyle: item.paragraphStyle
      };
    });
    this.namedStyles = namedStyles;
  };
  
  getFrameStyle = () => {
    const {background, pageNumberStart, marginTop, marginBottom, marginRight, marginLeft, pageSize} = this.documentStyle;
    let tempStyle = {};
    if (background) {
      const {color} = background;
      if (color && color.rgbColor) {
        const rgbColor = color.rgbColor;
        tempStyle.backgroundColor = 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
      }
    }
    if (marginTop) {
      const {magnitude, unit} = marginTop;
      tempStyle.marginTop = magnitude + unit;
    }
    if (marginBottom) {
      const {magnitude, unit} = marginBottom;
      tempStyle.marginBottom = magnitude + unit;
    }
    if (marginLeft) {
      const {magnitude, unit} = marginLeft;
      tempStyle.marginLeft = magnitude + unit;
    }
    if (marginRight) {
      const {magnitude, unit} = marginRight;
      tempStyle.marginRight = magnitude + unit;
    }
    if (pageSize) {
      const {height, width} = pageSize;
      if (height) {
        const {magnitude, unit} = height;
        tempStyle.height = magnitude + unit;
      }
      if (width) {
        const {magnitude, unit} = width;
        tempStyle.width = (magnitude - (marginLeft.magnitude || 0) - (marginRight.magnitude || 0)) + unit;
      }
    }
    this.frameStyle = tempStyle;
  };
  
  renderTextElement = (textElement) => {
    const {content, textStyle} = textElement;
    let renderElement = null;
    let style = getTextStyle(textStyle);
    
    if (textStyle.link && textStyle.link !== {}) {
      renderElement = <a href={textStyle.link.url} style={style}>{content}</a>;
    } else {
      renderElement = <span style={style}>{content}</span>;
    }
    return renderElement;
  };
  
  renderObjectElement = (objElement) => {
    if (objElement.inlineObjectId) {
      const {inlineObjectId, textStyle} = objElement;
      let object = this.inlineObjects[inlineObjectId].inlineObjectProperties.embeddedObject;
      let objStyle = {};
      let src = null;
  
      if (textStyle) {
        objStyle = getTextStyle(textStyle);
      }
      if (object.imageProperties) {
        src = object.imageProperties.contentUri;
        let cropProperties = object.imageProperties.cropProperties;
      }
      if (object.embeddedObjectBorder) {
        // getBorderStyle(object.embeddedObjectBorder);
        console.log(object.embeddedObjectBorder.propertyState === 'NOT_RENDERED');
      }
      if (object.size) {
        objStyle.height = object.size.height.magnitude + object.size.height.unit;
        objStyle.width = object.size.width.magnitude + object.size.width.unit;
      }
      if (object.marginTop && object.marginTop.magnitude) {
        objStyle.marginTop = object.marginTop.magnitude + object.marginTop.unit;
      }
      if (object.marginBottom && object.marginBottom.magnitude) {
        objStyle.marginBottom = object.marginBottom.magnitude + object.marginBottom.unit;
      }
      if (object.marginLeft && object.marginLeft.magnitude) {
        objStyle.marginLeft = object.marginLeft.magnitude + object.marginLeft.unit;
      }
      if (object.marginRight && object.marginRight.magnitude) {
        objStyle.marginRight = object.marginRight.magnitude + object.marginRight.unit;
      }
      return <img src={src} style={objStyle} />;
    } else {
      return null;
    }
  };
  
  renderDocElement = (element) => {
    const {endIndex, startIndex} = element;
    if (element.inlineObjectElement) {
      return this.renderObjectElement(element.inlineObjectElement);
    } else if(element.textRun) {
      return this.renderTextElement(element.textRun);
    }
  };
  
  renderTableCell = (tableCell, columnStyle) => {
    const {content, tableCellStyle} = tableCell;
    let style = columnStyle;
    style.border = 'solid 1px black';
    if (tableCellStyle.rowSpan) {
      style.rowspan = tableCellStyle.rowSpan;
    }
    if (tableCellStyle.columnSpan) {
      style.colspan = tableCellStyle.columnSpan;
    }
    if (tableCellStyle.contentAlignment) {
      style.verticalAlign = tableCellStyle.contentAlignment;
    }
    if (tableCellStyle.backgroundColor && tableCellStyle.backgroundColor.color) {
      let rgbColor = tableCellStyle.backgroundColor.color.rgbColor;
      style.backgroundColor = 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
    }
    if (tableCellStyle.paddingLeft) {
      style.paddingLeft = tableCellStyle.paddingLeft.magnitude + tableCellStyle.paddingLeft.unit;
    }
    if (tableCellStyle.paddingRight) {
      style.paddingRight = tableCellStyle.paddingRight.magnitude + tableCellStyle.paddingRight.unit;
    }
    if (tableCellStyle.paddingTop) {
      style.paddingTop = tableCellStyle.paddingTop.magnitude + tableCellStyle.paddingTop.unit;
    }
    if (tableCellStyle.paddingBottom) {
      style.paddingBottom = tableCellStyle.paddingBottom.magnitude + tableCellStyle.paddingBottom.unit;
    }
    if (tableCellStyle.borderLeft && tableCellStyle.borderLeft.width) {
      let rgbColor = tableCellStyle.borderLeft.color.color.rgbColor;
      style.borderLeft = tableCellStyle.borderLeft.dashStyle + ' ' + tableCellStyle.borderLeft.width.magnitude + tableCellStyle.borderLeft.width.unit + ' ' + 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
    }
    if (tableCellStyle.borderRight && tableCellStyle.borderRight.width) {
      let rgbColor = tableCellStyle.borderRight.color.color.rgbColor;
      style.borderRight = tableCellStyle.borderRight.dashStyle + ' ' + tableCellStyle.borderRight.width.magnitude + tableCellStyle.borderRight.width.unit + ' ' + 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
    }
    if (tableCellStyle.borderTop && tableCellStyle.borderTop.width) {
      let rgbColor = tableCellStyle.borderTop.color.color.rgbColor;
      style.borderTop = tableCellStyle.borderTop.dashStyle + ' ' + tableCellStyle.borderTop.width.magnitude + tableCellStyle.borderTop.width.unit + ' ' + 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
    }
    if (tableCellStyle.borderBottom && tableCellStyle.borderBottom.width) {
      let rgbColor = tableCellStyle.borderBottom.color.color.rgbColor;
      style.borderBottom = tableCellStyle.borderBottom.dashStyle + ' ' + tableCellStyle.borderBottom.width.magnitude + tableCellStyle.borderBottom.width.unit + ' ' + 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
    }
    
    return <td style={style}>{content.map(item => this.renderParagraph(item.paragraph))}</td>;
  };
  
  renderTableRow = (tableRow, columnStyles) => {
    const {tableCells, tableRowStyle} = tableRow;
    let style = {};
    if (tableRowStyle.minRowHeight && tableRowStyle.minRowHeight.magnitude) {
      style.minHeight = tableRowStyle.minRowHeight.magnitude + tableRowStyle.minRowHeight.unit;
    }
    return <tr style={style}>
      {tableCells.map((tableCell, i) => this.renderTableCell(tableCell, columnStyles[i]))}
    </tr>;
  };
  
  renderTableElement = (tableElement) => {
    const {rows, columns, tableRows, tableStyle} = tableElement;
    let columnStyles = [];
    if (tableStyle.tableColumnProperties) {
      tableStyle.tableColumnProperties.forEach(columnStyle => {
        let tempStyle = {};
        if (columnStyle.widthType) {
        
        }
        if (columnStyle.width) {
          tempStyle.width = columnStyle.width.magnitude + columnStyle.width.unit;
        }
        columnStyles.push(tempStyle);
      });
    }
    if (rows > 0) {
      return <table style={{borderSpacing: 'unset', margin: '0 auto'}}>
        <tbody>{tableRows.map(tableRow => this.renderTableRow(tableRow, columnStyles))}</tbody>
      </table>;
    }
  };

  renderParagraph = (paragraph) => {
    const {elements, paragraphStyle, bullet} = paragraph;
    const style = {};
    
    if (paragraphStyle.namedStyleType && this.namedStyles[paragraphStyle.namedStyleType]) {
      // getting named style
      let {textStyle, paraStyle} = this.namedStyles[paragraphStyle.namedStyleType];
      if (paraStyle.alignment === 'START') {
      
      }
      if (paraStyle.direction === 'LEFT_TO_RIGHT') {
      
      }
      if (paraStyle.spacingMode === 'NEVER_COLLAPSE') {
      
      }
      if (paraStyle.spaceAbove && paraStyle.spaceAbove.magnitude && paraStyle.spaceAbove.unit) {
        style.marginTop = paraStyle.spaceAbove.magnitude + paraStyle.spaceAbove.unit;
      }
      if (paraStyle.spaceBelow && paraStyle.spaceBelow.magnitude && paraStyle.spaceBelow.unit) {
        style.marginBottom = paraStyle.spaceBelow.magnitude + paraStyle.spaceBelow.unit;
      }
      if (paraStyle.borderTop) {
        if (paraStyle.borderTop.width && paraStyle.borderTop.width.magnitude)
          style.borderTop = getBorderStyle(paraStyle.borderTop);
      }
      if (paraStyle.borderBottom) {
        if (paraStyle.borderBottom.width && paraStyle.borderBottom.width.magnitude)
          style.borderBottom = getBorderStyle(paraStyle.borderBottom);
      }
      if (paraStyle.borderLeft) {
        if (paraStyle.borderLeft.width && paraStyle.borderLeft.width.magnitude)
          style.borderLeft = getBorderStyle(paraStyle.borderLeft);
      }
      if (paraStyle.borderRight) {
        if (paraStyle.borderRight.width && paraStyle.borderRight.width.magnitude)
          style.borderRight = getBorderStyle(paraStyle.borderRight);
      }
    }
    if (paragraphStyle.lineSpacing) {
      style.lineHeight = paragraphStyle.lineSpacing/100;
    }
    if (paragraphStyle.direction) {
      // style.direction = paragraphStyle.direction === 'LEFT_TO_RIGHT' ? 'ltr' : 'rtl';
      style.textAlign = paragraphStyle.direction === 'LEFT_TO_RIGHT' ? 'left' : 'right';
    }
    if (paragraphStyle.spaceAbove && paragraphStyle.spaceAbove.magnitude && paragraphStyle.spaceAbove.unit) {
      style.marginTop = (paragraphStyle.spaceAbove.magnitude || 0) + paragraphStyle.spaceAbove.unit;
    }
    if (paragraphStyle.spaceBelow && paragraphStyle.spaceBelow.magnitude && paragraphStyle.spaceAbove.unit) {
      style.marginBottom = (paragraphStyle.spaceBelow.magnitude || 0) + paragraphStyle.spaceAbove.unit;
    }
    if (paragraphStyle.alignment) {
      style.textAlign = paragraphStyle.alignment;
      if (paragraphStyle.alignment === 'JUSTIFIED')
        style.textAlign = 'justify';
    }
    if (paragraphStyle.keepLinesTogether) {
    
    }
    if (paragraphStyle.keepWithNext) {
      // display paragraph in one page
    }
    if (paragraphStyle.avoidWidowAndOrphan) {
      // paragraph opening, ending lines control
    }
    if (paragraphStyle.indentFirstLine && paragraphStyle.indentFirstLine && paragraphStyle.indentFirstLine.unit) {
      let magnitude = (paragraphStyle.indentFirstLine.magnitude || 0) + paragraphStyle.indentFirstLine.unit;
    }
    if (paragraphStyle.indentStart && paragraphStyle.indentStart.magnitude && paragraphStyle.indentStart.unit) {
      style.paddingLeft = (paragraphStyle.indentStart.magnitude || 0) + paragraphStyle.indentStart.unit;
    }
    if (paragraphStyle.headingId) {
    
    }
    let domBullet = null;
    
    if (bullet) {
      const {listId, textStyle} = bullet;
      let bulletObj = this.lists[listId];
      let bulletStyle = {};
      bulletObj = bulletObj.listProperties.nestingLevels[0];
      if (bulletObj.indentFirstLine) {
        // bulletStyle.marginLeft = bulletObj.indentFirstLine.magnitude + bulletObj.indentFirstLine.unit;
        bulletStyle.marginLeft = '-20pt';
        bulletStyle.marginRight = '12pt';
      }
      domBullet = <span style={bulletStyle}>●</span>;
    }
    
    return (
      <div style={style}>
        {domBullet}
        {elements.map(element => this.renderDocElement(element))}
      </div>
    )
  };
  
  renderElements = (elementContainer) => {
    const containerStartIndex = elementContainer.startIndex;
    const containerEndIndex = elementContainer.endIndex;
    if (elementContainer.table) {
      return this.renderTableElement(elementContainer.table);
    } else if (elementContainer.paragraph) {
      return this.renderParagraph(elementContainer.paragraph);
    } else {
      return null;
    }
  };
  
  render() {
    
    return (
      <div className='doc-view-frame' style={this.frameStyle}>
        {this.elementArr.map(element => this.renderElements(element))}
      </div>
    )
  }
}

export default DocViewFrame;