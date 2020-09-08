/**
 * Created by nois on 9/1/17.
 */
import React, { Component } from 'react';
import {
  View,
} from 'react-native'


import I18n from 'react-native-i18n';
import Strings from '../../components/I18n/Strings';
import Colors from '../../constants/Colors';
import MyText from '../../components/myText/MyText';
import SummaryItem from './SummaryItem';

import {
  fontMaker
} from '../../utils/Fonts';

const fontFamilySemiBold = fontMaker({
  weight: 'SemiBold',
  style: null
});
const fontFamily = fontMaker({
  weight: null,
  style: null
});

export default class Detail extends Component {


  constructor(props) {
    super(props);
    this.renderReportSummary = this.renderReportSummary.bind(this);
  }

  renderReportSummary() {
    let { collectionResult } = this.props;

    return collectionResult.map((d, i) => {
      if (d.field === 'select' && d.format === 'Y/N') {
        return <SummaryItem key={i} content={d.selectedValue ? 'YES' : 'NO'} title={d.name}/>
      }
      else {
        return <SummaryItem key={i} content={d.selectedValue} title={d.name}/>
      }
    })
  }

  render() {
    const { container, reportTitle, reportTitleWrapper, submitButton } = styles;
    let { title, licenseNumber, masterName, phoneNumber, submitTime } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <SummaryItem content={title} title={I18n.t(Strings.REPORT_TITLE)}/>
        <SummaryItem content={licenseNumber} title={I18n.t(Strings.LICENSE_NO)}/>
        <SummaryItem content={masterName} title={I18n.t(Strings.MASTER_NAME)}/>
        <SummaryItem content={phoneNumber} title={I18n.t(Strings.TELEPHONE)}/>
        <SummaryItem content={submitTime} title={I18n.t(Strings.DATE_TIME_SUBMIT)}/>
        {this.renderReportSummary()}
      </View>
    )
  }

}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.main,
  },
  reportTitle: {
    fontSize: 18,
    color: Colors.green1
  },
  reportTitleWrapper: {
    alignItems: 'center'
  },
  submitButton: {
    backgroundColor: Colors.mainButton,
    marginTop: 5,
    marginBottom: 15
  }
};

