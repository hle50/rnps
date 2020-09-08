/**
 * Created by nois on 8/28/17.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Keyboard
} from 'react-native';
import {
  GiftedForm,
  GiftedFormManager
} from "@nois/react-native-gifted-form";
import * as _ from 'lodash';
import  Switch from 'react-native-switch-pro';
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'react-native-i18n';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import Strings from '../../components/I18n/Strings';
import Config from '../../constants/Config';
import ModalWidget from '../../components/giftedForm/ModalWidget';
import OptionWidget from '../../components/giftedForm/OptionWidget';
import Colors from  '../../constants/Colors'
import Styles from '../../constants/Styles';
import SubmitButton from '../../components/button/SubmitButton';
import {
  fontMaker
} from '../../utils/Fonts';
const fontFamily = fontMaker({
  weight: null,
  style: null
});


import MyText from "../myText/MyText";
const frmName = 'FillReportForm';

export default class FillReportForm extends Component {

  constructor(props) {
    super(props);
    this.renderForm = this.renderForm.bind(this);
    this.state = {}

  }

  /**
   * set required for field
   * @param d
   */
  setRequireValidation(d) {
    if (d.format === 'n') {
      GiftedFormManager.setValidators(frmName, d.collectionId, {
        validate: [{
          validator: 'isLength',
          arguments: [1],
          message: `${d.name} is required`
        }, {
          validator: 'matches',
          arguments: /^[0-9]*$/,
          message: `${d.name} must be number`
        }]
      });
    }
    else {
      GiftedFormManager.setValidators(frmName, d.collectionId, {

        validate: [{
          validator: 'isLength',
          arguments: [1],
          message: `${d.name} is required`
        }]
      });
    }

  }

  /**
   * render options
   * @param d
   * @returns {XML}
   */
  renderOption(d) {
    const { text } = styles;
    const { options } = this.props;
    let optionData = [];
    let format = d.format;
    let displayValue = '';
    //if format == Master => get caller name
    if (format === 'Master') {
      optionData = [{ id: 1, name: this.props.data.selectedMaster.masterName.toString() }]
    }
    else {
      optionData = options[format];
      if(d.format === "Port" && !!d.default){
        const selectedValue = _.find(optionData, (v,i)=> v.id == d.default);
        if(selectedValue){
          GiftedFormManager.updateValue(frmName, d.collectionId, selectedValue);
          GiftedFormManager.updateValueIfNotSet(frmName,d.collectionId, selectedValue);
          displayValue = selectedValue.name;
        }
      }
    }
    const parentId = d.parentId;
    const isShow = parentId == 0 || this.state[parentId] === true;
    console.log("Options Data", optionData);
    if (isShow) {
      this.setRequireValidation(d);
      return (
        <GiftedForm.GroupWidget key={d.collectionId}>
          {/*<MyText style={[fontFamilySemiBold, text]}>{d.name}</MyText>*/}
          <ModalWidget
            search={true}
            widgetStyles={{
              title: [fontFamily, Styles.GiftedForm.ModalWidget.modalWidgetTitle],
              text: [fontFamily],
              row: [Styles.GiftedForm.ModalWidget.row, { paddingTop: 5 }],
              rowContainer: [Styles.GiftedForm.ModalWidget.rowContainer],
              valueContainer: [Styles.GiftedForm.ModalWidget.valueContainer]
            }}
            title={d.name}
            placeholder={I18n.t(Strings.PLEASE_SELECT)}
            name={d.collectionId}
            scrollEnabled={false}
            displayValue={displayValue}
            formName={frmName}>
            <GiftedForm.SelectWidget name={d.collectionId} multiple={false}>
              {
                optionData.map((d, i) =>
                  <OptionWidget widgetStyles={{
                    selectedTextStyle: { color: Colors.green }
                  }}
                                iconColor={Colors.green} key={d.id} title={d.name}
                                value={d}/>)
              }
            </GiftedForm.SelectWidget>
          </ModalWidget>
          <GiftedForm.SeparatorWidget/>
        </GiftedForm.GroupWidget>
      )
    }
    else {
      //remove validation
      GiftedFormManager.setValidators(frmName, d.collectionId, null);
      GiftedFormManager.clearSelect(frmName, d.collectionId);
      return null;
    }
  }

  /**
   * render switch
   * @param d
   * @returns {XML}
   */
  renderSwitch(d) {
    const parentId = d.parentId;
    const isShow = parentId == 0 || this.state[parentId] === true;
    const { text } = styles;

    if (isShow) {
       let v = GiftedFormManager.getValue(frmName, d.collectionId);
       GiftedFormManager.updateValue(frmName, d.collectionId, v ? v : false);
      return (
        <GiftedForm.GroupWidget key={d.collectionId}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <MyText style={[text, { flex: 0.8 }]}>{d.name}</MyText>
            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center', paddingRight: 5 }}>
              <Switch
                onSyncPress={(v) => {
                  GiftedFormManager.updateValue(frmName, d.collectionId, v);
                  this.setState({ [d.collectionId]: v }, () => {
                    this.renderForm();
                  });
                }}
              />
            </View>
          </View>
          <GiftedForm.SeparatorWidget/>
        </GiftedForm.GroupWidget>
      )
    }
    else {
      //remove value field of form
      GiftedFormManager.clearSelect(frmName, d.collectionId);
      return null;
    }
  }

  /**
   * render input
   * @param d
   * @returns {XML}
   */
  renderInput(d) {
    const { text } = styles;
    let parentId = d.parentId;
    let isShow = parentId == 0 || this.state[parentId] === true;
    if (isShow) {
      this.setRequireValidation(d);
      return (<GiftedForm.GroupWidget key={d.collectionId}>
        <GiftedForm.TextInputWidget
          widgetStyles={{
            rowContainer: [Styles.GiftedForm.TextInput.rowContainer],
            textInput: [Styles.GiftedForm.TextInput.textInput, fontFamily],
            textInputTitle: [fontFamily, Styles.GiftedForm.TextInput.textInputTitle],
          }}
          numberOfLines={3}
          title={d.name}
          placeholder={I18n.t(Strings.ENTER_DOT)}
          underlineColorAndroid={'transparent'}
          underlined={false}
          inline={false}
          showInlineErrorMessage={false}
          name={d.collectionId} // name=mandatory
          clearButtonMode='while-editing'
        />
        <GiftedForm.SeparatorWidget/>
      </GiftedForm.GroupWidget>)
    }
    else {
      //remove validation
      GiftedFormManager.setValidators(frmName, d.collectionId, null);
      GiftedFormManager.clearSelect(frmName, d.collectionId);
      return null;
    }
  }

  /**
   * render date
   * @param d
   * @returns {XML}
   */
  renderDate(d) {

    const { text } = styles;
    this.setRequireValidation(d);
    const parentId = d.parentId;
    const isShow = parentId == 0 || this.state[parentId] === true;

    if (!this.state[d.collectionId]) {
      GiftedFormManager.updateValue(frmName, d.collectionId, new Date());
    }

    if (isShow) {
      return (
        <GiftedForm.GroupWidget key={d.collectionId}>
          <MyText style={[text]}>{d.name}</MyText>

          <DatePicker
            style={Styles.datePickerWrapper}
            mode="date"
            date={this.state[d.collectionId] ? this.state[d.collectionId] : new Date()}
            format={Config.format.moment.datePicker}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateInput: Styles.datePicker,
              dateText: [text, fontFamily, { color: Colors.black }],
              // dateIcon: {
              //  flexDirection: 'flex-end'
              // },
            }}
            iconComponent={<Icon containerStyle={Styles.dateIcon} name='event' color={Colors.grey4}/>}
            showIcon={true}
            onDateChange={(date) => {
              this.setState({ [d.collectionId]: date });
              GiftedFormManager.updateValue(frmName, d.collectionId, date);
            }}
          />

          <GiftedForm.SeparatorWidget/>
        </GiftedForm.GroupWidget>
      )
    }
    else {
      //remove validation
      GiftedFormManager.setValidators(frmName, d.collectionId, null);
      GiftedFormManager.clearSelect(frmName, d.collectionId);
      return null;
    }
  }

  renderTime(d) {
    const { text } = styles;
    const parentId = d.parentId;
    const isShow = parentId == 0 || this.state[parentId] === true;

    if (!this.state[d.collectionId]) {
      GiftedFormManager.updateValue(frmName, d.collectionId, moment().format('HH:mm'));
    }
    if (isShow) {
      this.setRequireValidation(d);
      return (
        <GiftedForm.GroupWidget key={d.collectionId}>
          <MyText style={[text]}>{d.name}</MyText>
          <DatePicker
            style={Styles.datePickerWrapper}
            mode="time"
            date={this.state[d.collectionId] || new Date()}
            format="HH:mm"
            minuteInterval={10}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateInput: Styles.datePicker,
              dateText: [text, { color: Colors.black }],
            }}
            iconComponent={<Icon containerStyle={Styles.dateIcon} name='access-time' color={Colors.grey4}/>}
            showIcon={true}
            onDateChange={(time) => {
              this.setState({ [d.collectionId]: time });
              GiftedFormManager.updateValue(frmName, d.collectionId, time);
            }}
          />
          <GiftedForm.SeparatorWidget/>
        </GiftedForm.GroupWidget>
      )
    }
    else {
      //remove validation
      GiftedFormManager.setValidators(frmName, d.collectionId, null);
      GiftedFormManager.clearSelect(frmName, d.collectionId);
      return null;
    }
  }

  /**
   * render form
   */

  renderForm() {

    let { collections } = this.props.data.reportObj;

    return collections[0].map((d, i) => {
      if (d.field === 'select') {
        if (d.format === 'Y/N') {
          return this.renderSwitch(d)
        }
        else {
          return this.renderOption(d)
        }
      }
      else if (d.field === 'input') {
        if (d.format === 'an' || d.format === 'n') {
          return this.renderInput(d)
        }
        else if (d.format === 'Date') {
          return this.renderDate(d)
        }
        else if (d.format === 'Time') {
          return this.renderTime(d)
        }
      }

    })
  }

  submit = async (isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
    console.log('values', values);
    // dismiss keyboard
    Keyboard.dismiss();
    if (isValid === true) {
      postSubmit();
      this.props.moveNext(values);
    }
  };

  render() {
    const { container } = styles;
  
    return (

      <KeyboardAwareScrollView style={container}>
        <GiftedForm
          contentContainerStyle={{
            flex: 1,
            marginLeft: 10,
            marginRight: 10
          }}
          formStyles={{ containerView: { backgroundColor: Colors.main } }}
          formName={frmName}// GiftedForm instances that use the same name will also share the same states
          clearOnClose={true}
          scrollEnabled={false}
        >
          {this.renderForm()}

          <GiftedForm.SeparatorWidget/>
          <GiftedForm.ErrorsWidget widgetStyles={Styles.GiftedForm.ErrorWidget}/>
          <GiftedForm.SubmitWidget
            widgetStyles={{
              submitButton: Styles.GiftedForm.SubmitWidget.submitButton,
              submitButtonWrapper: [Styles.GiftedForm.SubmitWidget.submitButtonWrapper, { marginBottom: 100 }]
            }}
            onSubmit={this.submit}
          >
            <SubmitButton rightIcon={true} iconName='arrow-forward' type='material-icon' title={I18n.t(Strings.NEXT)}
                          color={ { backgroundColor: Colors.green3 } }/>
          </GiftedForm.SubmitWidget>
        </GiftedForm>
      </KeyboardAwareScrollView>

    )
  }

}

const styles = {
  container: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: Colors.main,
  },
  text: {
    color: Colors.green1,
    fontSize: 15,
    paddingLeft: 10
  }
};
