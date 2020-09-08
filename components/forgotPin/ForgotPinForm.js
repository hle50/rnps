/**
 * Created by nois on 8/30/17.
 */

import React, { Component } from 'react';
import {
  View,
  Keyboard
} from 'react-native';
import {
  GiftedForm,
  GiftedFormManager
} from "@nois/react-native-gifted-form";
import I18n from 'react-native-i18n';
import Strings from '../I18n/Strings';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
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

const frmName = 'forgotPinForm';
export default class AddLicenseForm extends Component {

  constructor(props) {
    super(props)
  }


  formValidators = {
    licenseNumber: {
      validate: [{
        validator: (...args) => {
          return !!args[0]
        },
        message: `${I18n.t(Strings.LICENSE_NUMBER_REQUIRED_MESSAGE)}`
      }]
    },
    email: {
      validate: [{
        validator: 'isLength',
        arguments: [1],
        message: `${I18n.t(Strings.EMAIL_REQUIRED_MESSAGE)}`
      }, {
        validator: 'isEmail',
        message: `${I18n.t(Strings.EMAIL_NOT_VALID)}`
      }]
    },


  };
  onSubmit = async (isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
    // dismiss keyboard
    Keyboard.dismiss();
    if (isValid === true) {
      this.props.submit(values, postSubmit);
    }
  };

  render() {
    const { container } = styles;
    return (
      <View style={container}>
        <GiftedForm
          contentContainerStyle={{
            flex: 1,
            marginLeft: 10,
            marginRight: 10
          }}
          formStyles={{ containerView: { backgroundColor: Colors.main } }}
          formName={frmName}// GiftedForm instances that use the same name will also share the same states
          validators={this.formValidators}
          clearOnClose={true}
          scrollEnabled={false}
        >

          <GiftedForm.TextInputWidget
            widgetStyles={{
              rowContainer:[Styles.GiftedForm.TextInput.rowContainer],
              textInput: [Styles.GiftedForm.TextInput.textInput, fontFamily],
              textInputTitle: [ fontFamily, Styles.GiftedForm.TextInput.textInputTitle],

            }}
            placeholder={I18n.t(Strings.ENTER_LICENSE_NUMBER)}
            underlineColorAndroid={'transparent'}
            underlined={false}
            inline={false}
            showInlineErrorMessage={false}
            name='licenseNumber' // mandatory
            title={`${I18n.t(Strings.LICENSE_NO)}*`}
            clearButtonMode='while-editing'
          />
          <GiftedForm.TextInputWidget
            widgetStyles={{
              rowContainer:[Styles.GiftedForm.TextInput.rowContainer],
              textInput: [Styles.GiftedForm.TextInput.textInput, fontFamily],
              textInputTitle: [ fontFamily, Styles.GiftedForm.TextInput.textInputTitle],

            }}
            placeholder={I18n.t(Strings.ENTER_EMAIL)}
            underlineColorAndroid={'transparent'}
            underlined={false}
            inline={false}
            showInlineErrorMessage={false}
            name='email' // mandatory
            title={`${I18n.t(Strings.EMAIL)}*`}
            clearButtonMode='while-editing'
          />
          <GiftedForm.SeparatorWidget/>
          <GiftedForm.ErrorsWidget widgetStyles={Styles.GiftedForm.ErrorWidget}/>

          <GiftedForm.SubmitWidget
            widgetStyles={{
              submitButton: Styles.GiftedForm.SubmitWidget.submitButton,
              submitButtonWrapper: Styles.GiftedForm.SubmitWidget.submitButtonWrapper,
            }}
            onSubmit={this.onSubmit}
          >
            <SubmitButton iconName='loop' type='material-icon' title={I18n.t(Strings.RECOVERY_PIN)}
                          color={ {backgroundColor: Colors.red1} }/>
          </GiftedForm.SubmitWidget>
        </GiftedForm>
      </View>
    )
  }

}
const styles = {
  container: {
    flex: 1,
  }
};

