/**
 * Created by nois on 9/1/17.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Button as ButtonNative,
  AsyncStorage,
} from 'react-native';

import moment from 'moment';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import * as _ from 'lodash';
import Strings from '../components/I18n/Strings';
import Config from '../constants/Config';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import MyText from '../components/myText/MyText';
import ApiService from '../services/ApiService';
import Utils from '../utils/Utils';
import { updatePendingReport } from '../actions/ReportActions';
import { RealmService } from '../realm/Provider';
import Wrapper from '../components/wrapper/Wrapper';
import SummaryItem from '../components/report/SummaryItem';
import Detail from '../components/report/Detail';
import MyButton from '../components/button/MyButton';
import MenuHomeBottom from '../components/home/MenuHomeBottom';
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

class SummaryScreen extends Component {
  static navigatorStyle = Styles.navBar;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.apiService = new ApiService();
    this.renderReportSummary = this.renderReportSummary.bind(this);
    this.submit = this.submit.bind(this);
    this.goToHome = this.goToHome.bind(this);
    this.convert = this.convert.bind(this);
    this.processSubmitData = this.processSubmitData.bind(this);
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


  goToHome() {
    this.props.navigator.popToRoot({
      animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
      animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
    });
  }

  convert(str) {
    if (str === true) {
      return 'YES'
    }
    else if (str === false) {
      return 'NO'
    }
    else {
      return encodeURIComponent(str);
    }
  }

  async processSubmitData(params, displayValue) {
    let isConnected = this.props.netWorkStatus;
    console.log('STATS', isConnected);
    //save data to realm
    // 1 Pending 2 Resending 3 Resent
    let pendingReport = {
      id: (new Date().getTime()).toString() + (Utils.getRandomInt(0, 100)).toString(),
      data: JSON.stringify(params),
      displayFields: JSON.stringify(displayValue),
      submitDate: moment().format(Config.format.moment.full)
    };

    if (!isConnected) {
      pendingReport.status = 1;
      await RealmService.insert('PendingReport', pendingReport);
      this.setState({ isLoading: false });
      //update store
      this.props.updatePendingReport({ id: pendingReport.id, data: JSON.parse(pendingReport.data), status: 1 });
      this.utils.Dialog.alert(I18n.t(Strings.OFFLINE_SUBMIT_MESSAGE), 'Message', () => {
        this.goToHome();
      });
    }
    else {
      // fix error that when submitting and network service is interrupted
      try{
        console.log('PARAMS', params)
        let res = await this.apiService.get('phoneapp/saveReport', params);
        pendingReport.status = 3;
        await RealmService.insert('PendingReport', pendingReport);
        this.props.updatePendingReport({ id: pendingReport.id, data: JSON.parse(pendingReport.data), status: 3 });
        this.setState({ isLoading: false }, () => {
          this.props.navigator.push({
            screen: 'ReportSentScreen',
            title: 'Request Sent',
            backButtonHidden: true,
            disabledBackGesture: true,
            passProps: { result: res, ...this.props }
          })
        });
      }
      catch (e){
        // if submit is false, we store this report to pending report list
        pendingReport.status = 1;
        await RealmService.insert('PendingReport', pendingReport);
        this.setState({ isLoading: false });
        //update store
        this.props.updatePendingReport({ id: pendingReport.id, data: JSON.parse(pendingReport.data), status: 1 });
        this.utils.Dialog.alert(I18n.t(Strings.OFFLINE_SUBMIT_MESSAGE), 'Message', () => {
          this.goToHome();
        });
      }
      finally{
        for(var i = 0; i< displayValue.length; i++){
            if(displayValue[i].format == 'Port'){
              AsyncStorage.setItem(displayValue[i].collectionId, displayValue[i].selectedId);
            }
        }
      }
    }
   
  }

  /**
   * submit report
   */

  async submit() {
    try {
      this.setState({ isLoading: true });
      let { data, collectionResult } = this.props;
      let params = {
        license_id: data.licenseId,
        license_number: data.licenseNo,
        master_id: data.selectedMaster.masterId,
        master_name: encodeURIComponent(data.selectedMaster.masterName),
        phone_number: data.telephone,
        report_title: encodeURIComponent(data.reportObj.title),
        report_id: data.reportObj.reportId,
        caller_name: encodeURIComponent(data.callerName),
        call_reason: 'report',
        date_created: encodeURIComponent(moment().format('YYYY/MM/DD HH:mm:ss')),
      };
      //get selected ids
      for (let i = 0; i < collectionResult.length; i++) {
        params[`collectionId_${collectionResult[i].collectionId}`] = this.convert(collectionResult[i].selectedValue);
      }
      let displayValue = _.map(collectionResult, (d, i) => {
        return {
          name: d.name,
          selectedValue: d.selectedValue,
          field: d.field,
          format: d.format,
          collectionId: d.collectionId,
          selectedId: d.selectedId,
        }
      });

      // get user location put to params
      navigator.geolocation.getCurrentPosition(
        (position) => {
          params.gpsLocation = `${position.coords.latitude} , ${position.coords.longitude}`;
          params.callback = 'callback';
          this.processSubmitData(params, displayValue);
        },
        (error) => {
          params.callback = 'callback';
          this.processSubmitData(params, displayValue);
        }
      );

    }
    catch (e) {
      this.utils.Dialog.alertError(e.message, 'Error');
      this.setState({ isLoading: false });
    }
  }


  render() {
    const { container, reportTitle, reportTitleWrapper, submitButton } = styles;
    let { data, collectionResult } = this.props;
    let { isLoading } = this.state;
    return (
      <Wrapper ref={(ref) => {
        this.utils = ref;
      }}>
        <ScrollView style={container}>

          <Detail
            title={data.reportObj.title}
            licenseNumber={data.licenseNo}
            masterName={data.selectedMaster.masterName}
            phoneNumber={data.telephone}
            submitTime={moment().format(Config.format.moment.full)}
            collectionResult={collectionResult}
          />
          <View style={{ marginTop: 5 }}>
            <MyButton rightIcon={true} wrapperStyle={{ marginTop: 10, marginBottom: 100 }} onPress={this.submit}
                      iconName='send' type='material-community' title={I18n.t(Strings.CONFIRM_AND_SUBMIT)}
                      color={ { backgroundColor: Colors.red1 } }/>
          </View>
          <Spinner visible={isLoading}/>

        </ScrollView>
        <MenuHomeBottom  {...this.props}/>
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
const mapStateToProps = state => {
  let { netWorkStatus } = state;
  return { netWorkStatus }
};
export default connect(mapStateToProps, { updatePendingReport })(SummaryScreen)
