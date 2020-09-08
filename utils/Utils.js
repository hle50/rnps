import ReactNative from 'react-native';
// import RIS from 'react-native/lib/TextInputState';

import entities from 'entities';

export default {
  stripHtmlTags(str) {
    return str ? entities.decodeHTML(str.replace(/<(?:.|\n)*?>/gm, '')) : '';
  },

  // focusTextInput(textInputRef){
  //   /* Example
  //    <TextInput
  //    ref={'input'}
  //    />
  //
  //    textInputRef => this.refs.input
  //    */
  //
  //   const reactTag = ReactNative.findNodeHandle(textInputRef);
  //   if (reactTag) {
  //     RIS.focusTextInput(reactTag);
  //   }
  // },

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  getExtension(uri) {
    return uri.split('.').pop();
  },

  isImage(uri) {
    return uri && uri.match(/.(jpg|jpeg|png|gif)$/i);
  },

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};
