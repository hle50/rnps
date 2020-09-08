/**
 * Created by nois on 8/28/17.
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  Icon
} from 'react-native-elements';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import * as _ from  'lodash';
import MyText from '../myText/MyText';
import Colors from '../../constants/Colors';
import Strings from '../I18n/Strings';
import Communications from 'react-native-communications';
class MenuHomeBottom extends Component {
  constructor(props) {
    super(props);
    this.navigate = this.navigate.bind(this);
    this.makeCall = this.makeCall.bind(this);
  }

  /**
   * navigate to screen
   * @param screen
   */
  navigate(screen) {
    switch (screen) {
      case 'alert':
        this.props.navigator.push({
          screen: 'AlertScreen',
          title: `${I18n.t(Strings.ALERTS)}`,
          backButtonTitle: ''
        });
        break;
      case 'forgotPin':
        this.props.navigator.push({
          screen: 'ForgetPinScreen',
          title: `${I18n.t(Strings.FORGOT_PIN)}`,
          backButtonTitle: ''
        });
        break;
      case 'report':
        this.props.navigator.push({
          screen: 'PendingReportScreen',
          title: `${I18n.t(Strings.REPORTS)}`,
          backButtonTitle: ''
        });
        break;
    }
  }


  /**
   * go to call of phone
   */
  makeCall() {
    Communications.phonecall('1800065522', true);
  }

  render() {
    const { wrapper, item, text, notification } = styles;
    const { pendingReport } = this.props;
    let numberOfReport = _.filter(pendingReport, (m,i) => m.status ===1).length;
    return (
      <View style={wrapper}>
        <TouchableOpacity onPress={this.makeCall} style={item}>
          <Icon name="ios-call" type="ionicon" color={Colors.wt} size={25}/>
          <MyText style={text}>{I18n.t(Strings.CALL)}</MyText>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.navigate.bind(this, 'forgotPin')} style={item}>
          <Icon name="ios-mail" type="ionicon" color={Colors.wt} size={25}/>
          <MyText style={text}>{I18n.t(Strings.FORGOT_PIN)}</MyText>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.navigate.bind(this, 'alert')} style={item}>
          <Icon name="check" type="foundation" color={Colors.wt} size={25}/>
          <MyText style={text}>{I18n.t(Strings.ALERTS)}</MyText>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.navigate.bind(this, 'report')} style={item}>
          {numberOfReport > 0 &&
          <View style={notification}><MyText style={text}>{numberOfReport}</MyText></View>}
          <Icon style={{ transform: [{ rotateY: '180deg' }] }} name="report"  color={Colors.wt}
                size={25}/>
          <MyText style={text}>{I18n.t(Strings.REPORT)}</MyText>

        </TouchableOpacity>
      </View>
    )
  }
}

const styles = {
  wrapper: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.black,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.wt
  },
  notification: {
    width: 20,
    height: 20,
    borderColor: Colors.wt,
    position: 'absolute',
    backgroundColor: Colors.red,
    top: 5,
    right: 8,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center'
  }
};
const mapStateToProps = state => {
  let { pendingReport } = state;
  console.log('NUMBER_PENDING', pendingReport);
  return { pendingReport }
};
export default connect(mapStateToProps, null)(MenuHomeBottom)
