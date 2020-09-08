import {
  Platform
} from 'react-native';

// we define available font weight and styles for each font here
const font = {
  SourceSansPro: {
    weights: {
      Black: '800',
      Bold: '700',
      SemiBold: '600',
      ExtraLight: '200',
      Light: '300',
      Regular: '400'
    },
    styles: {
      Italic: 'italic'
    }
  }
};

// generate styles for a font with given weight and style
export const fontMaker = (options = {}) => {
  let { weight, style, family, fontName } = Object.assign({
    weight: null,
    style: null,
    fontName: 'SourceSansPro',
    ...Platform.select({
      ios: {
        family: 'Source Sans Pro'
      },
      android: {
        family: 'SourceSansPro'
      }
    })
  }, options);
  
  const { weights, styles } = font[fontName];
  
  if (Platform.OS === 'android') {
    weight = weights[weight] ? weight : '';
    style = styles[style] ? style : '';
    
    if(!weight && !style){
      style = 'Regular';
    }
    
    if(style.toLowerCase() === 'italic'){
      style = 'It';
    }
    
    const suffix = weight + style;
    
    return {
      fontFamily: family + (suffix.length ? `-${suffix}` : '')
    }
  } else {
    weight = weights[weight] || weights.Regular;
    style = styles[style] || 'normal';
    
    return {
      fontFamily: family,
      fontWeight: weight,
      fontStyle: style
    }
  }
};