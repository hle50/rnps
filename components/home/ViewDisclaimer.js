/**
 * Created by nois on 9/20/17.
 */
import React, {Component} from 'react';
import {
  View,
  TouchableOpacity
} from 'react-native';
import {
  Icon
} from 'react-native-elements';
import MyText from '../../components/myText/MyText';
import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

export default class ViewDisclaimer extends Component {

  render(){
    const {disclaimerText, disclaimerWrapper} = styles;
    return(
      <TouchableOpacity onPress={this.props.navigate} style={disclaimerWrapper}>
        <View style={{flex: 0.9}}>
          <MyText style={[Styles.commonText, disclaimerText]}> {this.props.text}</MyText>
        </View>
        <View style={{flex: 0.1}}>
          <Icon name="keyboard-arrow-right" color={Colors.grey4} type="material-icon"/>
        </View>
      </TouchableOpacity>
    )
  }
}
const styles = {
  disclaimerWrapper:{
    height: 40,
    flexDirection: 'row',
    backgroundColor: Colors.wt,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:10,
    marginRight: 10,
    borderRadius: 8,
    borderColor: Colors.grey1,
    borderWidth:1
  },
  disclaimerText:{
    fontSize: 18,
    marginLeft: 5,
  }
};
