import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  Icon
} from 'react-native-elements';
import MyText from '../myText/MyText';
import Colors from '../../constants/Colors'

export default class MyButton extends Component {
  
  
  render() {
    const {wrapper, container, textWrapper, text, iconWrapper} = styles;
    const {iconName, type, title, color, onPress, wrapperStyle, rightIcon} = this.props;
    return (
      <View style={[wrapper, wrapperStyle]}>
        <TouchableOpacity onPress={() => onPress()} style={[container, color]}>
          <View  style={[container, color]}>
            { !rightIcon && <View style={[iconWrapper, {paddingLeft: 5}]}>
              <Icon color={Colors.wt} name={iconName} type={type}/>
            </View>}
            <View style={textWrapper}>
              <MyText style={[text, !rightIcon ? {marginRight: 30} : {marginLeft: 30}]}>{title}</MyText>
            </View>
            { rightIcon && <View style={[iconWrapper]}>
              <Icon color={Colors.wt} name={iconName} type={type}/>
            </View>}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = {
  wrapper: {
    flex: 1,
    alignItems: 'center'
  },
  container: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    width: 230,
    alignItems: 'center',
    borderRadius: 8
  },
  textWrapper: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',

  },
  text: {
    color: Colors.wt,
    fontSize:16,
  },
  iconWrapper: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }
};