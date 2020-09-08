/**
 * Created by nois on 8/28/17.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Keyboard
} from 'react-native';

import {
  fontMaker
} from '../../utils/Fonts';
const fontFamilyBold = fontMaker({
  weight: 'Bold',
  style: null
});
const fontFamily = fontMaker({
  weight: null,
  style: null
});
import Colors from  '../../constants/Colors'
import MyText from "../myText/MyText";
export default class SummaryItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { title, content } = this.props;
    const { container, textTitle, contentText, textPadding, value } = styles;
    return (
      <View style={container}>
        <MyText  style={[fontFamilyBold, textTitle, textPadding]}>{title}</MyText>
        <View style={[contentText, textPadding]}>
          <MyText  numberOfLines={1} style={value}>{content}</MyText>
        </View>
      </View>
    )
  }
}

const styles = {
  container: {
    paddingTop:5,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey4
  },
  textTitle: {
    fontSize: 14,
    color: Colors.green1
  },
  contentText: {
    height: 25,
    justifyContent: 'center'
  },
  textPadding: {
    paddingLeft: 15
  },
  value: {
    color: Colors.black,
    fontSize: 16,
    paddingLeft: 10
  }
};
