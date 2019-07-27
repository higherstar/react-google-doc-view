import React, {Component} from "react";
import {data1} from "./sample";

class DocViewFrame extends Component {
  // elementArr = this.props.data.result.body.content;
  // documentStyle = this.props.data.result.documentStyle;
  // namedStyle = this.props.data.result.namedStyle;
  // inlineObjects = this.props.data.result.inlineObjects;
  // lists = this.props.data.result.lists;
  elementArr = data1.body.content;
  documentStyle = data1.documentStyle;
  namedStyles = data1.namedStyles.styles;
  inlineObjects = data1.inlineObjects;
  lists = data1.lists;
  
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
        style.fontSize = textStyle.fontSize.magnitude + 'px'; // textStyle.fontSize.unit;
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
    console.log(style);
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
    const style = null;
    
    if (paragraphStyle.lineSpacing) {
      style.lineHeight = paragraphStyle.lineSpacing + 'px';
    }
    if (paragraphStyle.direction) {
      style.direction = paragraphStyle.direction === 'LEFT_TO_RIGHT' ? 'ltr' : 'rtl';
    }
    if (paragraphStyle.spaceAbove) {
      style.marginTop = (paragraphStyle.spaceAbove.magnitude || 0) + 'px';
    }
    if (paragraphStyle.spaceBelow) {
      style.marginBottom = (paragraphStyle.spaceBelow.magnitude || 0) + 'px';
    }
    if (paragraphStyle.alignment) {
      style.textAlign = paragraphStyle.alignment;
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
    if (paragraphStyle.indentFirstLine) {
      let magnitude = (paragraphStyle.indentFirstLine.magnitude || 0) + 'px';
    }
    if (paragraphStyle.indentStart) {
      let magnitude = (paragraphStyle.indentStart.magnitude || 0) + 'px';
    }
    if (paragraphStyle.headingId) {
    
    }
    
    return (
      <div>
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
      this.renderParagraph(elementContainer.paragraph);
    } else {
    
    }
  };
  
  render() {
    console.log(data1);
    console.log(this.namedStyles);
    return (
      <div className='doc-view-frame'>
        {this.elementArr.map(element => this.renderElements(element))}
      </div>
    )
  }
}

export default DocViewFrame;