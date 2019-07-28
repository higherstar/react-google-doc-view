
// get border style of paragraph
const getBorderStyle = (border) => {
  const {color, width, dashStyle} = border;
  const rgbColor = color.color.rgbColor;
  return dashStyle + ' ' + width.magnitude + width.unit + 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
};

const getTextStyle = (textStyle) => {
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
  if (textStyle.italic) {
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

export {getBorderStyle, getTextStyle};