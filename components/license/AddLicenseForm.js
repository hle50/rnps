/**
 * Created by nois on 8/29/17.
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
import {
  fontMaker
} from '../../utils/Fonts';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import SubmitButton from '../../components/button/SubmitButton';
const fontFamilySemiBold = fontMaker({
  weight: 'SemiBold',
  style: null
});
const fontFamily = fontMaker({
  weight: null,
  style: null
});
const frmName = 'AddLicenseForm';
export default class AddLicenseForm extends Component {

  constructor(props) {
    super(props)
  }

  formValidators = {
    licenseNo: {
      validate: [{
        validator: (...args) => {
          return !!args[0]
        },
        message: `${I18n.t(Strings.LICENSE_NUMBER_REQUIRED_MESSAGE)}`
      }]
    },

    pin: {
      validate: [{
        validator: (...args) => {
          return !!args[0]
        },
        message: `${I18n.t(Strings.PIN_REQUIRED_MESSAGE)}`
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
            name='licenseNo' // mandatory
            title= {`${I18n.t(Strings.LICENSE_NO)}*`}
            clearButtonMode='while-editing'
          />
          <GiftedForm.TextInputWidget
            widgetStyles={{
              rowContainer:[Styles.GiftedForm.TextInput.rowContainer],
              textInput: [Styles.GiftedForm.TextInput.textInput, fontFamily],
              textInputTitle: [ fontFamily, Styles.GiftedForm.TextInput.textInputTitle],

            }}
            placeholder={I18n.t(Strings.ENTER_PIN)}
            underlineColorAndroid={'transparent'}
            underlined={false}
            inline={false}
            showInlineErrorMessage={false}
            name='pin' // mandatory
            keyboardType="numeric"
            title= {`${I18n.t(Strings.PIN)}*`}
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
            <SubmitButton iconName='add' type='material-icon' title={I18n.t(Strings.ADD_NEW)}
                          color={ {backgroundColor: Colors.red1} }/>
          </GiftedForm.SubmitWidget>
        </GiftedForm>
      </View>
    )
  }

}
const styles = {
  container: {
    flex: 1
  }
};

