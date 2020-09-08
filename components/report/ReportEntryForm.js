/**
 * Created by nois on 8/28/17.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Keyboard,
  AsyncStorage
} from 'react-native';
import {
  GiftedForm,
  GiftedFormManager
} from "@nois/react-native-gifted-form";
import * as _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'react-native-i18n';
import Strings from '../../components/I18n/Strings';
import ModalWidget from '../../components/giftedForm/ModalWidget';
import OptionWidget from '../../components/giftedForm/OptionWidget';
import Colors from  '../../constants/Colors'
import Styles from '../../constants/Styles';
import { RealmService } from '../../realm/Provider';
import SubmitButton from '../../components/button/SubmitButton';
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

const frmName = 'reportEntryForm';
export default class AddReportScreen extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      report: {}
    }

  }

  async componentWillMount() {
    //get report title list from realm
    const rs = await RealmService.getById('ReportData', this.props.licenseInfo.licenseNumber);
    const report = JSON.parse(rs.data);
    this.setState({ report })
  }

  defaults = {
    licenseNo: this.props.licenseInfo.licenseNumber
  };
// /^(\+|)?[0-9]{0,3}?(-|\s|)?[0-9]{1,3}?(-|\s|)?[0-9]{3}?(-|\s|)?[0-9]{3,5}$/
  formValidators = {
    licenseNo: {
      validate: [{
        validator: (...args) => {
          return !!args[0]
        },
        message: `${I18n.t(Strings.LICENSE_NUMBER_REQUIRED_MESSAGE)}`
      }]
    },
    masterName: {
      validate: [{
        validator: (...args) => {
          return !!args[0]
        },
        message: `${I18n.t(Strings.MASTER_NAME_REQUIRED_MESSAGE)}`
      }]
    },
    telephone: {
      validate: [{
        validator: 'isLength',
        arguments: [1],
        message: `${I18n.t(Strings.TELEPHONE_REQUIRED_MESSAGE)}`
      }, {
        validator: 'matches',
        arguments: /^(\+|)?[0-9]{0,3}?(-|\s|)?[0-9]{1,3}?(-|\s|)?[0-9]{3}?(-|\s|)?[0-9]{3,5}$/,
        message: `${I18n.t(Strings.TELEPHONE_INVALID)}`
      }]
    },
    reportId: {
      validate: [{
        validator: (...args) => {
          return !!args[0]
        },
        message: `${I18n.t(Strings.REPORT_TITLE_REQUIRED_MESSAGE)}`
      }]
    },

  };


  submit = async (isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
    console.log('values', values);
    // dismiss keyboard

    Keyboard.dismiss();
    if (isValid === true) {
      let masterList = this.props.masterList[0];
      //get selected master
      let selectedMaster = _.find(masterList, (d) => d.masterId === values.masterName);
      let { data } = this.state.report;
      let reportObj = data[values.reportId];
      let formValue = { ...values, reportObj, selectedMaster };
      for  (item of reportObj.collections[0]){
        if(item.format === "Port"){
          try{
            const value = await AsyncStorage.getItem(item.collectionId);
            if (value !== null) {
              console.log(value);
              item.default = value;
            }
          }catch(e){

          }
        }
      }
      this.props.moveNext(formValue, postSubmit);
      //this.props.submit(values, postSubmit);
    }
  };

  render() {
    const { container } = styles;
    let { data } = this.state.report;
    data = _.values(data);
    let masterList = this.props.masterList[0];
    return (
      <View style={container}>
        <KeyboardAwareScrollView>
          <GiftedForm
            contentContainerStyle={{
              flex: 1,
              marginLeft: 10,
              marginRight: 10,
            }}
            formStyles={{ containerView: { backgroundColor: Colors.main } }}
            formName={frmName}// GiftedForm instances that use the same name will also share the same states
            validators={this.formValidators}
            defaults={this.defaults}
            clearOnClose={true}
            scrollEnabled={false}
          >


            <GiftedForm.TextInputWidget
              widgetStyles={{
                rowContainer:[Styles.GiftedForm.TextInput.rowContainer],
                textInput: [Styles.GiftedForm.TextInput.textInput, fontFamily],
                textInputTitle: [ fontFamily, Styles.GiftedForm.TextInput.textInputTitle],

              }}
              underlineColorAndroid={'transparent'}
              underlined={false}
              inline={false}
              showInlineErrorMessage={false}
              name='licenseNo' // mandatory
              title={`${I18n.t(Strings.LICENSE_NO)}*`}
              clearButtonMode='while-editing'
              editable={false}
            />

            <ModalWidget
              search={false}
              widgetStyles={{
                title: [fontFamily, Styles.GiftedForm.ModalWidget.modalWidgetTitle],
                text: [fontFamily],
                row:[Styles.GiftedForm.ModalWidget.row, {paddingTop: 5}],
                rowContainer:[Styles.GiftedForm.ModalWidget.rowContainer],
                valueContainer: [Styles.GiftedForm.ModalWidget.valueContainer]
              }}
              placeholder={I18n.t(Strings.SELECT_MASTER_NAME)}
              title={I18n.t(Strings.MASTER_NAME)}
              name="masterName"
              scrollEnabled={false}
              formName={frmName}>
              <GiftedForm.SelectWidget name="masterName" multiple={false}>
                {
                  masterList.map((d, i) =>
                    <OptionWidget key={d.masterId}
                                  widgetStyles={{
                                    selectedTextStyle: { color: Colors.green }
                                  }}
                                  iconColor={Colors.green}
                                  title={d.masterName}
                                  value={d.masterId}/>)
                }
              </GiftedForm.SelectWidget>
            </ModalWidget>

            <GiftedForm.TextInputWidget
              widgetStyles={{
                rowContainer:[Styles.GiftedForm.TextInput.rowContainer],
                textInput: [Styles.GiftedForm.TextInput.textInput, fontFamily],
                textInputTitle: [ fontFamily, Styles.GiftedForm.TextInput.textInputTitle],

              }}
              placeholder={I18n.t(Strings.ENTER_TELEPHONE)}
              underlineColorAndroid={'transparent'}
              underlined={false}
              inline={false}
              showInlineErrorMessage={false}
              name='telephone' // mandatory
              title={`${I18n.t(Strings.TELEPHONE)}*`}
              clearButtonMode='while-editing'
              keyboardType="phone-pad"
            />
            <ModalWidget
              search={true}
              widgetStyles={{
                title: [fontFamily, Styles.GiftedForm.ModalWidget.modalWidgetTitle],
                text: [fontFamily],
                row:[Styles.GiftedForm.ModalWidget.row, {paddingTop: 5}],
                rowContainer:[Styles.GiftedForm.ModalWidget.rowContainer],
                valueContainer: [Styles.GiftedForm.ModalWidget.valueContainer]
              }}
              placeholder={I18n.t(Strings.SELECT_REPORT_TITLE)}
              title={`${I18n.t(Strings.REPORT_TITLE)}*`}
              name="reportId"
              scrollEnabled={false}
              formName={frmName}>
              <GiftedForm.SelectWidget name="reportId" multiple={false}>
                {
                  data && data.length > 0 && data.map((d, i) =>
                    <OptionWidget
                      widgetStyles={{
                        selectedTextStyle: { color: Colors.green }
                      }}
                      iconColor={Colors.green}
                      key={d.reportId} title={d.title}
                      value={d.reportId}/>)

                }
              </GiftedForm.SelectWidget>
            </ModalWidget>
            <GiftedForm.SeparatorWidget/>
            <GiftedForm.ErrorsWidget widgetStyles={Styles.GiftedForm.ErrorWidget}/>
            <GiftedForm.SubmitWidget
              widgetStyles={{
                submitButton: Styles.GiftedForm.SubmitWidget.submitButton,
                submitButtonWrapper: Styles.GiftedForm.SubmitWidget.submitButtonWrapper,
              }}
              onSubmit={this.submit}
            >
              <SubmitButton rightIcon={true} iconName='arrow-forward' type='material-icon' title={I18n.t(Strings.NEXT)}
                            color={ {backgroundColor: Colors.green3} }/>
            </GiftedForm.SubmitWidget>


          </GiftedForm>
        </KeyboardAwareScrollView>
      </View>
    )
  }

}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.main
  }
};
