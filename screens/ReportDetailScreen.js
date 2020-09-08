/**
 * Created by nois on 9/1/17.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Button as ButtonNative
} from 'react-native'
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import Wrapper from '../components/wrapper/Wrapper';
import Detail from '../components/report/Detail';

import {
  fontMaker
} from '../utils/Fonts';

const fontFamilySemiBold = fontMaker({
  weight: 'SemiBold',
  style: null
});
const fontFamily = fontMaker({
  weight: null,
  style: null
});

export default class ReportDetailScreen extends Component {
  static navigatorStyle = Styles.navBar;

  constructor(props) {
    super(props);

  }


  render() {
    const { container, reportTitle, reportTitleWrapper, submitButton } = styles;
    let { data, submitDate, collectionResult } = this.props;
    return (
      <Wrapper ref={(ref) => {
        this.utils = ref;
      }}>
        <ScrollView style={container}>
          <Detail
            title={decodeURIComponent(data.report_title)}
            licenseNumber={data.license_number}
            masterName={decodeURIComponent(data.master_name)}
            phoneNumber={data.phone_number}
            submitTime={submitDate}
            collectionResult={collectionResult}
          />
        </ScrollView>
      </Wrapper>
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

