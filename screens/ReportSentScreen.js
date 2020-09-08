/**
 * Created by nois on 9/1/17.
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView
} from 'react-native'
import moment from 'moment';
import I18n from 'react-native-i18n';
import Strings from '../components/I18n/Strings';
import Config from '../constants/Config';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import MyText from '../components/myText/MyText';
import {
  fontMaker
} from '../utils/Fonts';
import Wrapper from '../components/wrapper/Wrapper';
import SummaryItem from '../components/report/SummaryItem';
import MyButton from '../components/button/MyButton';
const fontFamilySemiBold = fontMaker({
  weight: 'SemiBold',
  style: null
});
const fontFamily = fontMaker({
  weight: null,
  style: null
});

export default class SummaryScreen extends Component {
  static navigatorStyle = Styles.navBar;
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }

  close() {
    this.props.navigator.popToRoot({
      animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
      animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
    });
  }

  render() {
    const {container, reportTitle, reportTitleWrapper, submitButton} = styles;
    let {data, result} = this.props;
    return (
      <Wrapper ref={(ref) => {
        this.utils = ref;
      }}>
        <ScrollView style={container}>
          <View style={reportTitleWrapper}>
            <MyText numberOfLines={2}
                    style={[fontFamilySemiBold, reportTitle]}>{I18n.t(Strings.THANK_YOU)} {data.reportObj.title}{I18n.t(Strings.HAS_BEEN_SUBMITTED)}</MyText>
          </View>
          <SummaryItem content={result.referenceNumber} title={I18n.t(Strings.REFERENCE_NUMBER)}/>
          <SummaryItem content={data.licenseNo} title={I18n.t(Strings.LICENSE_NO)}/>
          <SummaryItem content={data.selectedMaster.masterName} title={I18n.t(Strings.MASTER_NAME)}/>
          <SummaryItem content={data.telephone} title={I18n.t(Strings.TELEPHONE)}/>
          <SummaryItem content={moment(result.dateSubmitted).format(Config.format.moment.full)}
                       title={I18n.t(Strings.DATE_TIME_SUBMIT)}/>

          <MyButton wrapperStyle={{marginTop: 10, marginBottom: 10}} onPress={this.close}
                    iconName='arrow-back' type='material-icon' title={I18n.t(Strings.BACK_TO_MAIN)}
                    color={ {backgroundColor: Colors.grey7} }/>
        </ScrollView>
      </Wrapper>
    )
  }

}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.main
  },
  reportTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: Colors.red1,
    textAlign: 'center'
  },
  reportTitleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  submitButton: {
    backgroundColor: Colors.mainButton,
    marginTop: 5,
    marginBottom: 15
  }
};
