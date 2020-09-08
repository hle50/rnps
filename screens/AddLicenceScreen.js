/**
 * Created by nois on 8/28/17.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Button
} from 'react-native';
import * as _ from 'lodash';
import I18n from 'react-native-i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux';
import Strings from '../components/I18n/Strings';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import AddLicenseForm from '../components/license/AddLicenseForm';
import ApiService from '../services/ApiService';
import Utils from '../utils/Utils';
import { RealmService } from '../realm/Provider';
import Wrapper from '../components/wrapper/Wrapper';
import {
  setSelectedLicense
} from '../actions/LicenseActions';
class AddLicenceScreen extends Component {

  static navigatorStyle = Styles.navBar;

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.apiService = new ApiService();
  }

  componentDidMount() {
    setTimeout(() => {
      // this.utils.Dialog.alertSuccess('500 - Internal Server Error!', 'Success', () => {
      // });

      // this.utils.Dialog.confirm('500 - Internal Server Error!', (result) => {
      //   this.utils.Dialog.confirmCustomActions('HELLO', (dismiss) => {
      //     return [
      //       <Button title="BCS" onPress={() => {
      //         dismiss(() => {
      //           this.utils.Dialog.alertSuccess('BCSSSSSS');
      //         })
      //       }}/>,
      //       <Button title="OK" onPress={() => {
      //         dismiss(() => {
      //           this.utils.Dialog.alertInfo('OKAAAAAAAA');
      //         })
      //       }}/>,
      //       <Button title="!!!!" onPress={() => {
      //         dismiss(() => {
      //           this.utils.Dialog.alertWarning('!!!!!!!!!');
      //         })
      //       }}/>,
      //     ]
      //   });
      // });

      // this.utils.Dialog.alert('500 - Internal Server Error!', 'Success', ()=> {
      //   this.utils.Dialog.alertSuccess('500 - Internal Server Error!', 'Success', ()=> {
      //     this.utils.Dialog.alertError('500 - Internal Server Error!', 'Success', ()=> {
      //       this.utils.Dialog.alertWarning('500 - Internal Server Error!', 'Success', ()=> {
      //         this.utils.Dialog.alertInfo('500 - Internal Server Error!', 'Success', ()=> {
      //
      //         });
      //       });
      //     });
      //   });
      // });
    }, 3000);
  }

  async submit(values, postSubmit) {
    try {
      let { licenseNo, pin } = values;
      let { licenseList } = this.props;
      let isExisted = _.find(licenseList, (d) => {
        return d.licenseNumber.toLowerCase() === licenseNo.toLowerCase();
      });

      //check if licenseExit
      if (isExisted) {
        postSubmit();
        this.utils.Dialog.alertError(`${I18n.t(Strings.LICENSE_NUMBER_ALREADY_EXIST)}`, 'Error');
        return;
      }
      //check  network status

      let isConnected = this.props.netWorkStatus;
      if (!isConnected) {
        this.utils.Dialog.alertError(I18n.t(Strings.OFFLINE));
        postSubmit();
        return;
      }
      let res = await this.apiService.get(`phoneapp/verifyCode2/${pin}/${licenseNo.toString().toUpperCase()}`, { callback: 'callback' });
      if (res.messages) {
        this.utils.Dialog.alertError(res.messages);
        postSubmit();
      }
      else {
        let id = (new Date().getTime()).toString() + (Utils.getRandomInt(0, 100)).toString();
        // init data to insert to realm
        let license = {
          id: id,
          licenseId: res.licenseId.toString(),
          licenseNumber: licenseNo.toString(),
          pinCode: pin.toString(),
          callerName: '',
          isAccept: "1"
        };
        //update store
        this.props.setSelectedLicense(license);
        let licenseInfo = await this.apiService.get(`phoneapp/syncLicenseNumber/${res.licenseId}`, { callback: 'callback' });
        if (licenseInfo.messages) {
          this.utils.Dialog.alertError(res.messages);
        }
        else {

          //add caller name to realm
          let { data } = licenseInfo;
          license.callerName = data[0].callerName;
          let rs = await RealmService.insert('License', license);

          //do  insert options and report type when licence list empty
          if (licenseList.length == 0) {

            //get option
            let optionData = await this.apiService.get(`phoneapp/getOptions2/`, {
              format: 'Processor',
              callback: 'callback'
            });

            // //prepare option data to insert
            let optionId = (new Date().getTime()).toString() + (Utils.getRandomInt(0, 100)).toString();
            let option = {
              id: optionId,
              data: JSON.stringify(optionData)
            };
            await RealmService.insert('OptionData', option);


            //prepare disclaimer data to insert
            let result = await this.apiService.get('phoneapp/getDisclaimers', { callback: 'callback' });
            let data = result.login;
            //replace <br\/> to <br/>
            let content = data.replace(/<br\\\/>/g, '<br/>');
            //save to realm
            let disclaimer = {
              id: (new Date().getTime()).toString() + (Utils.getRandomInt(0, 100)).toString(),
              content: content
            };
            await RealmService.insert('Disclaimer', disclaimer);

            //prepare alert data to insert
            let feedResult = await this.apiService.get('phoneapp/feeds', { callback: 'callback' });

            for(let i = 0; i <feedResult.length; i++){
              //strip HTML
              feedResult[i].text = Utils.stripHtmlTags(feedResult[i].text);
              if(feedResult[i].url && feedResult[i].url.endsWith('.pdf')){
                feedResult[i].url =`https://docs.google.com/gview?embedded=true&url=${feedResult[i].url}`
              }
            }
            //save to realm
            let alertData = {
              id: (new Date().getTime()).toString() + (Utils.getRandomInt(0, 100)).toString(),
              data: JSON.stringify(feedResult)
            };
            await RealmService.insert('AlertData', alertData);
          }
          //get master
          let masterData = await this.apiService.get(`phoneapp/getMasters2`, {
            licenseNumber: licenseNo.toUpperCase(),
            callback: 'callback'
          });

          //prepare master data to insert
          let masterDataId = (new Date().getTime()).toString() + (Utils.getRandomInt(0, 100)).toString();
          let master = {
            id: masterDataId,
            data: JSON.stringify(masterData)
          };
          await RealmService.insert('MasterData', master);

          //get report data
          const reportData = await this.apiService.get(`phoneapp/getReports2/`, {
            licenseNumber: licenseNo,
            callback: 'callback'
          });

          //prepare report data to insert

          const report = {
            id: licenseNo.toString(),
            data: JSON.stringify(reportData)
          };
          await RealmService.insert('ReportData', report);

          this.props.navigator.pop({
            animated: true,
            animationType: 'fade'
          })
        }
        postSubmit();
      }
    }
    catch (e) {
      postSubmit();
      this.utils.Dialog.alertError(e.message, 'Error')
    }
  }

  render() {
    const { container } = styles;
    return (
      <Wrapper ref={(ref) => {
        this.utils = ref;
      }}>
        {/*<Button title="Back" onPress={() => this.props.navigator.pop({*/}
        {/*animated: true, // does the pop have transition animation or does it happen immediately (optional)*/}
        {/*animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)*/}
        {/*})}/>*/}
        <KeyboardAwareScrollView style={container}>
          <AddLicenseForm submit={this.submit}/>
        </KeyboardAwareScrollView>
      </Wrapper>
    )
  }

}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.main
  }
};
const mapStateToProps = state => {
  let { netWorkStatus, selectedLicense } = state;
  console.log('NETWORKSTATUS_ADD', netWorkStatus, selectedLicense);
  return { netWorkStatus, selectedLicense }
};
export default connect(mapStateToProps, {setSelectedLicense})(AddLicenceScreen)
