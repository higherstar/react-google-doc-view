import React, {Component} from "react";
import {data1} from "./sample";

class DocViewFrame extends Component {
  constructor(props) {
    super(props);
    // elementArr = this.props.data.result.body.content;
    // documentStyle = this.props.data.result.documentStyle;
    // namedStyle = this.props.data.result.namedStyle;
    // inlineObjects = this.props.data.result.inlineObjects;
    // lists = this.props.data.result.lists;
    this.elementArr = data1.body.content;
    this.documentStyle = data1.documentStyle;
    this.namedStyles = data1.namedStyles.styles;
    this.inlineObjects = data1.inlineObjects;
    this.lists = data1.lists;
    this.frameStyle = {};
  }
  
  componentDidMount() {
    this.getFrameStyle();
  }
  
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
      tempStyle.paddingTop = magnitude + unit;
    }
    if (marginBottom) {
      const {magnitude, unit} = marginBottom;
      tempStyle.paddingBottom = magnitude + unit;
    }
    if (marginLeft) {
      const {magnitude, unit} = marginLeft;
      tempStyle.paddingLeft = magnitude + unit;
    }
    if (marginRight) {
      const {magnitude, unit} = marginRight;
      tempStyle.paddingRight = magnitude + unit;
    }
    if (pageSize) {
      const {height, width} = pageSize;
      if (height) {
        const {magnitude, unit} = height;
        tempStyle.height = magnitude + unit;
      }
      if (width) {
        const {magnitude, unit} = width;
        tempStyle.width = magnitude + unit;
      }
    }
    this.frameStyle = tempStyle;
    this.forceUpdate();
  };
  
  renderTextElement = (textElement) => {
    console.log(textElement);
    const {content, textStyle} = textElement;
    const keyArr = Object.keys(textStyle);
    let style = {};
    let renderElement = null;
    
    keyArr.forEach(styleItem => {
      if (styleItem === 'bold' && textStyle.bold) {
        style.fontWeight = 'bold';
      }
      if (styleItem === 'fontSize' && textStyle.fontSize !== {}) {
        style.fontSize = textStyle.fontSize.magnitude + textStyle.fontSize.unit;
      }
      if (styleItem === 'foregroundColor' && textStyle.foregroundColor !== {}) {
        let rgbColor = textStyle.foregroundColor.color.rgbColor;
        style.color = 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
      }
      if (styleItem === 'backgroundColor' && textStyle.backgroundColor !== {}) {
        let rgbColor = textStyle.backgroundColor.color.rgbColor;
        style.backgroundColor = 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
      }
      if (styleItem === 'underline' && textStyle.underline) {
        style.textDecoration = 'underline';
      }
      if (styleItem === 'italic' && textStyle.underline) {
        style.fontStyle = 'italic';
      }
      if (styleItem === 'strikethrough' && textStyle.strikethrough) {
        style.textDecoration = 'line-through';
      }
      if (styleItem === 'weightedFontFamily' && textStyle.weightedFontFamily !== {}) {
        style.fontFamily = textStyle.weightedFontFamily.fontFamily;
        style.fontWeight = textStyle.weightedFontFamily.fontWeight;
      }
      if (styleItem === 'baselineOffset') {
        // baselineOffset
      }
    });
    if (textStyle.link && textStyle.link !== {}) {
      renderElement = <a href={textStyle.link.url} style={style}>{content}</a>;
    } else {
      renderElement = <span style={style}>{content}</span>;
    }
    return renderElement;
  };
  
  renderObjectElement = (objElement) => {
    // console.log(ObjElement);
  };
  
  renderDocElement = (element) => {
    const {endIndex, startIndex, textRun} = element;
    if (!textRun) {
      const {inlineObjectElement} = element;
      return this.renderObjectElement(inlineObjectElement);
    } else {
      return this.renderTextElement(textRun);
    }
  };
  
  renderTableElement = (tableElement) => {
    console.log("*********************");
    console.log(tableElement);
  };

  renderParagraph = (paragraph) => {
    const {elements, paragraphStyle} = paragraph;
    const style = {};
    
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
    
    }
    if (paragraphStyle.avoidWidowAndOrphan) {
    
    }
    if (paragraphStyle.namedStyleType) {
      // getting named style
      // let namedStyle = this.namedStyle[paragraphStyle.namedStyleType];
    }
    if (paragraphStyle.indentFirstLine && paragraphStyle.indentFirstLine && paragraphStyle.indentFirstLine.unit) {
      let magnitude = (paragraphStyle.indentFirstLine.magnitude || 0) + paragraphStyle.indentFirstLine.unit;
    }
    if (paragraphStyle.indentStart && paragraphStyle.indentStart.magnitude && paragraphStyle.indentStart.unit) {
      let magnitude = (paragraphStyle.indentStart.magnitude || 0) + paragraphStyle.indentStart.unit;
    }
    if (paragraphStyle.headingId) {
    
    }
    
    return (
      <div style={style}>
        {elements.map(element => this.renderDocElement(element))}
      </div>
    )
  };
  
  renderElements = (elementContainer) => {
    const containerStartIndex = elementContainer.startIndex;
    const containerEndIndex = elementContainer.endIndex;
    if (elementContainer.table) {
      return null;
      // elementContainer.table
      // return this.renderTableElement(elementContainer.table);
    } else if (elementContainer.paragraph) {
      return this.renderParagraph(elementContainer.paragraph);
    } else {
      return null;
    }
  };
  
  render() {
    console.log(data1);
    console.log(this.namedStyles);
    
    return (
      <div className='doc-view-frame' style={this.frameStyle}>
        {this.elementArr.map(element => this.renderElements(element))}
      </div>
    )
  }
}

export default DocViewFrame;