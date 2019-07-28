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
    console.log(namedStyles);
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
  };
  
  // get border style of paragraph
  getBorderStyle = (border) => {
    const {color, width, dashStyle} = border;
    const rgbColor = color.color.rgbColor;
    return dashStyle + ' ' + width.magnitude + width.unit + 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
  };
  
  getTextStyle = (textStyle) => {
    let style = {};
    if (textStyle.bold) {
      style.fontWeight = 'bold';
    }
    if (textStyle.fontSize && textStyle.fontSize !== {}) {
      style.fontSize = textStyle.fontSize.magnitude + textStyle.fontSize.unit;
    }
    if (textStyle.foregroundColor && textStyle.foregroundColor !== {}) {
      let rgbColor = textStyle.foregroundColor.color.rgbColor;
      style.color = 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
    }
    if (textStyle.backgroundColor && textStyle.backgroundColor !== {}) {
      let rgbColor = textStyle.backgroundColor.color.rgbColor;
      style.backgroundColor = 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
    }
    if (textStyle.underline) {
      style.textDecoration = 'underline';
    }
    if (textStyle.underline) {
      style.fontStyle = 'italic';
    }
    if (textStyle.strikethrough) {
      style.textDecoration = 'line-through';
    }
    if (textStyle.weightedFontFamily && textStyle.weightedFontFamily !== {}) {
      style.fontFamily = textStyle.weightedFontFamily.fontFamily;
      style.fontWeight = textStyle.weightedFontFamily.fontWeight;
    }
    if (textStyle.baselineOffset) {
      // baselineOffset
    }
    return style;
  };
  
  renderTextElement = (textElement) => {
    const {content, textStyle} = textElement;
    let renderElement = null;
    let style = this.getTextStyle(textStyle);
    
    if (textStyle.link && textStyle.link !== {}) {
      renderElement = <a href={textStyle.link.url} style={style}>{content}</a>;
    } else {
      renderElement = <span style={style}>{content}</span>;
    }
    return renderElement;
  };
  
  renderObjectElement = (objElement) => {
    // console.log(ObjElement);
    if (objElement.inlineObjectId) {
      const {inlineObjectId, textStyle} = objElement;
      let object = this.inlineObjects[inlineObjectId].inlineObjectProperties.embeddedObject;
      let objStyle = {};
      let src = null;
  
      if (textStyle) {
        objStyle = this.getTextStyle(textStyle);
      }
      if (object.imageProperties) {
        src = object.imageProperties.contentUri;
        let cropProperties = object.imageProperties.cropProperties;
      }
      if (object.embeddedObjectBorder) {
        // this.getBorderStyle(object.embeddedObjectBorder);
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
      return <img src={src} style={objStyle} />
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
  
  renderTableElement = (tableElement) => {
    console.log("*********************");
    console.log(tableElement);
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
          style.borderTop = this.getBorderStyle(paraStyle.borderTop);
      }
      if (paraStyle.borderBottom) {
        if (paraStyle.borderBottom.width && paraStyle.borderBottom.width.magnitude)
          style.borderBottom = this.getBorderStyle(paraStyle.borderBottom);
      }
      if (paraStyle.borderLeft) {
        if (paraStyle.borderLeft.width && paraStyle.borderLeft.width.magnitude)
          style.borderLeft = this.getBorderStyle(paraStyle.borderLeft);
      }
      if (paraStyle.borderRight) {
        if (paraStyle.borderRight.width && paraStyle.borderRight.width.magnitude)
          style.borderRight = this.getBorderStyle(paraStyle.borderRight);
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
      let magnitude = (paragraphStyle.indentStart.magnitude || 0) + paragraphStyle.indentStart.unit;
    }
    if (paragraphStyle.headingId) {
    
    }
    if (bullet) {
      const {listId, textStyle} = bullet;
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
    
    return (
      <div className='doc-view-frame' style={this.frameStyle}>
        {this.elementArr.map(element => this.renderElements(element))}
      </div>
    )
  }
}

export default DocViewFrame;