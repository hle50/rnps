import React from 'react';
import {
  Text,
  View
} from 'react-native';
import {
  fontMaker
} from '../../utils/Fonts';
import Colors from '../../constants/Colors';

export default class MyText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let fontFamily = fontMaker({
      weight: this.props.weight || null,
      style: null
    });
    return <Text {...this.props} style={[fontFamily, this.props.style]}>{this.props.children}</Text>;
  }
}