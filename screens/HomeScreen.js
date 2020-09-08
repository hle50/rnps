/**
 * Created by nois on 8/28/17.
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Alert,
  Platform,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {Icon, Button} from 'react-native-elements';
import * as _ from 'lodash';
import {GiftedForm, GiftedFormManager} from '@nois/react-native-gifted-form';
import Switch from 'react-native-switch-pro';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import Browser from 'react-native-browser';
import I18n from 'react-native-i18n';
import Strings from '../components/I18n/Strings';
import {fontMaker} from '../utils/Fonts';
import MyText from '../components/myText/MyText';
import ModalWidget from '../components/giftedForm/ModalWidget';
import OptionWidget from '../components/giftedForm/OptionWidget';
import MenuHomeBottom from '../components/home/MenuHomeBottom';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import {RealmService} from '../realm/Provider';
import Wrapper from '../components/wrapper/Wrapper';
import {updateNetwork} from '../actions/NetworkActions';
import ApiService from '../services/ApiService';
import MyButton from '../components/button/MyButton';
import SubmitButton from '../components/button/SubmitButton';
import ViewDisclaimer from '../components/home/ViewDisclaimer';
import {initPending} from '../actions/ReportActions';

const fontFamilySemiBold = fontMaker({
  weight: 'SemiBold',
  style: null,
});
const fontFamily = fontMaker({
  weight: null,
  style: null,
});
const frmName = 'signIn';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      licenseList: [],
      licenseNumber: '',
    };
    this.apiService = new ApiService();
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.navigateToAddLicenceScreen = this.navigateToAddLicenceScreen.bind(
      this,
    );
    this.navigateToDisclaimerScreen = this.navigateToDisclaimerScreen.bind(
      this,
    );
    this.navigateToAddReportScreen = this.navigateToAddReportScreen.bind(this);
    this.getLicenseList = this.getLicenseList.bind(this);
    this.openPortalLink = this.openPortalLink.bind(this);
    this.submit = this.submit.bind(this);
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(
      this,
    );
    this.processingPendingReport = this.processingPendingReport.bind(this);
    this.sendReports = this.sendReports.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedLicense && nextProps.selectedLicense.licenseNumber) {
      let licenseNumber = nextProps.selectedLicense.licenseNumber;
      this.setState({licenseNumber});
      GiftedFormManager.updateValue(frmName, 'licenseNumber', licenseNumber);
    }
  }

  async getLicenseList() {
    let res = await RealmService.getAll('License');
    let licenseList = [];
    if (res.length > 0) {
      res.forEach((t, i) => {
        let {id, licenseId, licenseNumber, pinCode, callerName} = t;
        licenseList.push({id, licenseId, licenseNumber, pinCode, callerName});
      });
      this.setState({licenseList});
    } else {
      //navigate user to add license screen
      this.navigateToAddLicenceScreen();
    }
  }

  //get reports that not sent
  async processingPendingReport() {
    try {
      //get pending list
      let pendingReports = await RealmService.getAll('PendingReport');
      let pendingList = [];
      pendingReports.forEach((d) => {
        let {data, id, status} = d;
        pendingList.push({data: JSON.parse(data), id, status});
      });
      //update store
      this.props.initPending(pendingList);
    } catch (e) {
      Alert.alert('Error', e);
    }
  }

  async sendReports() {
    let pendingList = [];

    let {pendingReport} = this.props;
    pendingReport.forEach((d) => {
      let {data, id, status} = d;
      pendingList.push({data, id, status});
    });
    pendingList.forEach(async (d, i) => {
      try {
        if (d.status === 1) {
          //update status to 2 : resending
          let updatedReport = {};
          updatedReport.data = JSON.stringify(d.data);
          updatedReport.status = 2;
          await RealmService.update('PendingReport', d.id, updatedReport);
          //call API
          let res = await this.apiService.get('phoneapp/saveReport', d.data);
          if (res.referenceNumber) {
            //await RealmService.delete('PendingReport', d.id);
            //update status of report
            //update status to 3: complete
            updatedReport.status = 3;
            await RealmService.update('PendingReport', d.id, updatedReport);
            //update store
            await this.processingPendingReport();
          }
        }
      } catch (e) {
        this.utils.Dialog.alertError(e.message, 'Error');
      }
    });
  }


  handleFirstConnectivityChange(isConnected) {
    this.props.updateNetwork(isConnected);
    //send report when network available
    if (isConnected) {
      this.sendReports();
    }
  }

  componentWillMount() {
    //request user to get location
    //navigator.geolocation.requestAuthorization();
    this.processingPendingReport();
    // NetInfo.isConnected.addEventListener(
    //   'change',
    //   this.handleFirstConnectivityChange,
    // );
    NetInfo.addEventListener((state) => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      this.handleFirstConnectivityChange(state.isConnected);
    });
    this.getLicenseList();

    //android not trigger dectect network firstime

    NetInfo.fetch().then((state) => {
      this.props.updateNetwork(state.isConnected);
    });
  }

  onNavigatorEvent(event) {
    console.log('event', event.id);
    switch (event.id) {
      case 'willAppear':
        this.getLicenseList();
        break;
      case 'didAppear':
        console.log('didAppear');
        break;
      case 'willDisappear':
        console.log('willDisappear');
        break;
      case 'didDisappear':
        console.log('didDisappear');
        break;
    }
  }

  /**
   * open portal link
   */
  openPortalLink() {
    //check if has network

    let {netWorkStatus} = this.props;
    if (netWorkStatus) {
      let url = 'https://mypirsa.pir.sa.gov.au/ui';
      if (Platform.OS === 'ios') {
        Browser.open(url, {
          showPageTitles: false,
        });
      } else {
        this.props.navigator.showModal({
          screen: 'AndroidWebViewScreen',
          passProps: {url: url},
        });
      }
    } else {
      this.utils.Dialog.alertError(I18n.t(Strings.NO_NETWORK));
    }
  }

  formValidators = {
    licenseNumber: {
      validate: [
        {
          validator: (...args) => {
            return !!args[0];
          },
          message: `${I18n.t(Strings.LICENSE_NUMBER_REQUIRED_MESSAGE)}`,
        },
      ],
    },

    pin: {
      validate: [
        {
          validator: (...args) => {
            return !!args[0];
          },
          message: `${I18n.t(Strings.PIN_REQUIRED_MESSAGE)}`,
        },
      ],
    },
    accept: {
      validate: [
        {
          validator: (...args) => {
            return !!args[0];
          },
          message: `${I18n.t(Strings.ACCEPT_DISCLAIMER_REQUIRED_MESSAGE)}`,
        },
      ],
    },
  };

  /**
   * go to add license screen
   */
  navigateToAddLicenceScreen() {
    this.props.navigator.push({
      screen: 'AddLicenceScreen',
      title: `${I18n.t(Strings.ADD_LICENSE)}`,
      backButtonHidden: this.state.licenseList.length === 0,
      disabledBackGesture: true,
      passProps: {licenseList: this.state.licenseList},
    });
  }

  /**
   * go to disclaimer screen
   */
  navigateToDisclaimerScreen() {
    this.props.navigator.push({
      screen: 'DisclaimerScreen',
      title: `${I18n.t(Strings.DISCLAIMER)}`,
      backButtonTitle: '',
    });
  }

  navigateToAddReportScreen(licenseInfo, masterList) {
    this.props.navigator.push({
      screen: 'AddReportScreen',
      title: `${I18n.t(Strings.REPORT_ENTRY_SCREEN)}`,
      passProps: {licenseInfo, masterList},
      backButtonTitle: '',
    });
  }

  /**
   * do login
   * @param isValid
   * @param values
   * @param validationResults
   * @param postSubmit
   * @param modalNavigator
   * @returns {Promise.<void>}
   */
  submit = async (
    isValid,
    values,
    validationResults,
    postSubmit = null,
    modalNavigator = null,
  ) => {
    try {
      // dismiss keyboard
      Keyboard.dismiss();
      if (isValid === true) {
        let {licenseList} = this.state;
        let {licenseNumber, pin} = values;
        let objUpdate = _.find(
          licenseList,
          (o) => o.licenseNumber === licenseNumber,
        );
        //get master info
        let masterData = await RealmService.getAll('MasterData');
        //get master based on licence no
        let selectedMaster = _.find(masterData, (d) => {
          let m = JSON.parse(d.data);
          return (
            m[0][0].license_number.toLowerCase() === licenseNumber.toLowerCase()
          );
        });
        let masterList = JSON.parse(selectedMaster.data);
        //sync license to update pin to realm
        if (this.props.netWorkStatus) {
          if (objUpdate) {
            let licenseInfo = await this.apiService.get(
              `phoneapp/syncLicenseNumber/${objUpdate.licenseId}`,
              {callback: 'callback'},
            );
            if (licenseInfo.messages) {
              this.utils.Dialog.alertError(licenseInfo.messages);
              postSubmit();
              return;
            } else {
              //check if pin is valid
              if (licenseInfo.data[0].appPin != pin) {
                this.utils.Dialog.alertError(
                  `${I18n.t(Strings.INCORRECT_PASSWORD)}`,
                  'Error',
                );
                postSubmit();
                return;
              } else {
                //update license realm
                await RealmService.update('License', objUpdate.id, {
                  pinCode: licenseInfo.data[0].appPin,
                });

                //update report data
                const reportData = await this.apiService.get(
                  'phoneapp/getReports2/',
                  {
                    licenseNumber: licenseNumber,
                    callback: 'callback',
                  },
                );
                await RealmService.update('ReportData', licenseNumber, {
                  data: JSON.stringify(reportData),
                });

                //update option data
                const optionData = await this.apiService.get(
                  'phoneapp/getOptions2/',
                  {
                    format: 'Processor',
                    callback: 'callback',
                  },
                );
                const options = await RealmService.getAll('OptionData');
                const optionId = options[0].id;
                await RealmService.update('OptionData', optionId, {
                  data: JSON.stringify(optionData),
                });
                //update the other licence NO
                const otherLicenceList = licenseList.filter(
                  (o) => o.licenseNumber != licenseNumber,
                );
                for (let i = 0; i < otherLicenceList.length; i++) {
                  let item = await this.apiService.get(
                    `phoneapp/syncLicenseNumber/${otherLicenceList[i].licenseId}`,
                    {callback: 'callback'},
                  );
                  if (!item.messages) {
                    if (item.data[0].appPin != otherLicenceList[i].pinCode) {
                      await RealmService.update(
                        'License',
                        otherLicenceList[i].id,
                        {pinCode: item.data[0].appPin},
                      );
                    }
                  }
                }
                postSubmit();
                this.navigateToAddReportScreen(objUpdate, masterList);
              }
            }
          }
        } else {
          //local check
          if (objUpdate.pinCode != pin) {
            this.utils.Dialog.alertError(
              `${I18n.t(Strings.INCORRECT_PASSWORD)}`,
              'Error',
            );
            postSubmit();
          } else {
            postSubmit();
            this.navigateToAddReportScreen(objUpdate, masterList);
          }
        }
      }
    } catch (e) {
      postSubmit();
      this.utils.Dialog.alertError(e.message, 'Error');
    }
  };

  render() {
    const {licenseList, licenseNumber} = this.state;
    const {
      container,
      image,
      imageText,
      text,
      checkbox,
      borderBottom,
      imageTextWrapper,
      licenceNumberWrapper,
      link,
      linkWrapper,
      outStuffWrapper,
      disclaimerWrapper,
      disclaimerText,
    } = styles;
    return (
      <Wrapper
        ref={(ref) => {
          this.utils = ref;
        }}>
        <KeyboardAwareScrollView style={container}>
          {/*<Image style={image} source={require('../assets/images/pirsalogo.png')}/>*/}
          <View style={imageTextWrapper}>
            <Image
              style={imageText}
              source={require('../assets/images/pirsatitle.png')}
            />
          </View>
          <GiftedForm
            contentContainerStyle={{
              flex: 1,
              marginLeft: 10,
              marginRight: 10,
            }}
            formStyles={{containerView: {backgroundColor: Colors.main}}}
            formName={frmName} // GiftedForm instances that use the same name will also share the same states
            validators={this.formValidators}
            clearOnClose={false}
            scrollEnabled={false}>
            <ModalWidget
              search={false}
              widgetStyles={{
                title: [
                  fontFamily,
                  Styles.GiftedForm.ModalWidget.modalWidgetTitle,
                ],
                text: [fontFamily],
                row: [Styles.GiftedForm.ModalWidget.row],
                rowContainer: [Styles.GiftedForm.ModalWidget.rowContainer],
                valueContainer: [Styles.GiftedForm.ModalWidget.valueContainer],
              }}
              displayValue={licenseNumber}
              title={I18n.t(Strings.LICENSE_NO)}
              name="licenseNumber"
              scrollEnabled={false}
              placeholder={I18n.t(Strings.SELECT_LICENSE)}
              formName={frmName}>
              <GiftedForm.SelectWidget name="licenseNo" multiple={false}>
                {licenseList.map((d, i) => (
                  <OptionWidget
                    widgetStyles={{
                      selectedTextStyle: {color: Colors.green},
                    }}
                    iconColor={Colors.green}
                    key={d.licenseNumber}
                    title={d.licenseNumber}
                    value={d.licenseNumber}
                  />
                ))}
              </GiftedForm.SelectWidget>
            </ModalWidget>
            <GiftedForm.TextInputWidget
              widgetStyles={{
                rowContainer: [Styles.GiftedForm.TextInput.rowContainer],
                textInput: [Styles.GiftedForm.TextInput.textInput, fontFamily],
                textInputTitle: [
                  fontFamily,
                  Styles.GiftedForm.TextInput.textInputTitle,
                ],
              }}
              placeholder={I18n.t(Strings.ENTER_PIN)}
              underlineColorAndroid={'transparent'}
              underlined={false}
              inline={false}
              showInlineErrorMessage={false}
              name="pin" // mandatory
              title={`${I18n.t(Strings.PIN)}*`}
              clearButtonMode="while-editing"
              keyboardType="numeric"
            />
            <GiftedForm.SeparatorWidget />
            <View style={[checkbox, {paddingRight: 10}]}>
              <View style={{flexDirection: 'row'}}>
                <MyText style={[Styles.commonText, {fontSize: 15}]}>
                  {I18n.t(Strings.ACCEPT_DISCLAIMER)}
                </MyText>
              </View>

              <Switch
                onSyncPress={(v) => {
                  GiftedFormManager.updateValue(frmName, 'accept', v);
                }}
              />
            </View>
            <GiftedForm.SeparatorWidget />
            <ViewDisclaimer
              navigate={this.navigateToDisclaimerScreen}
              text={I18n.t(Strings.VIEW_DISCLAIMER)}
            />
            <GiftedForm.SeparatorWidget />
            <GiftedForm.ErrorsWidget
              widgetStyles={Styles.GiftedForm.ErrorWidget}
            />

            <GiftedForm.SubmitWidget
              widgetStyles={{
                submitButton: Styles.GiftedForm.SubmitWidget.submitButton,
                submitButtonWrapper:
                  Styles.GiftedForm.SubmitWidget.submitButtonWrapper,
              }}
              onSubmit={this.submit}>
              <SubmitButton
                iconName="subdirectory-arrow-right"
                type="material-community"
                title={I18n.t(Strings.ENTER)}
                color={{backgroundColor: Colors.red1}}
              />
            </GiftedForm.SubmitWidget>
          </GiftedForm>
          <View style={outStuffWrapper}>
            <MyButton
              onPress={this.navigateToAddLicenceScreen}
              iconName="add"
              type="material-icon"
              title={I18n.t(Strings.ADD_LICENSE)}
              color={{backgroundColor: Colors.green2}}
            />
            <GiftedForm.SeparatorWidget />
            <TouchableOpacity onPress={this.openPortalLink} style={linkWrapper}>
              <MyText style={[fontFamilySemiBold, link]}>
                {I18n.t(Strings.ECATCH_PORTAL_LINK)}
              </MyText>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <MenuHomeBottom {...this.props} />
      </Wrapper>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.main,
  },
  imageText: {
    width: 280,
    resizeMode: 'contain',
  },
  imageTextWrapper: {
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
  },
  text: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: Colors.wt,
    paddingLeft: 10,
  },
  checkbox: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  licenceNumberWrapper: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey,
    borderWidth: 1,
    borderColor: Colors.grey2,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3,
  },
  link: {
    textDecorationLine: 'underline',
    color: Colors.blue,
  },
  linkWrapper: {
    alignItems: 'center',
  },
  outStuffWrapper: {
    paddingBottom: 90,
    backgroundColor: Colors.main,
  },
  disclaimerWrapper: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: Colors.wt,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 8,
    borderColor: Colors.grey1,
    borderWidth: 1,
  },
  disclaimerText: {
    fontSize: 18,
    marginLeft: 5,
  },
};
const mapStateToProps = (state) => {
  let {netWorkStatus, pendingReport, selectedLicense} = state;
  return {netWorkStatus, pendingReport, selectedLicense};
};
export default connect(mapStateToProps, {updateNetwork, initPending})(
  HomeScreen,
);
