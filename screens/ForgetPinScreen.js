/**
 * Created by nois on 8/28/17.
 */
import React, { Component } from 'react';
import {
  View,
  Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import ForgotPinForm from '../components/forgotPin/ForgotPinForm';
import ApiService from '../services/ApiService';
import Wrapper from '../components/wrapper/Wrapper';

export default class ForgetPinScreen extends Component {

  static navigatorStyle = Styles.navBar;

  constructor(props) {
    super(props);
    this.apiService = new ApiService();
    this.submit = this.submit.bind(this);
  }

  async submit(values, postSubmit) {

    try {
      let { email, licenseNumber } = values;

      let params = {
        licenseNumber,
        emailAddress: email,
        callback: 'callback'
      };
      let res = await this.apiService.get(`phoneapp/forgotPincode2`, params);
      postSubmit();
      if (res.messages) {
        this.utils.Dialog.alertError(res.messages);
      }
    }
    catch (e) {
      this.utils.Dialog.alertError(e.message);
    }
  }

  render() {
    const { container } = styles;
    return (
      <Wrapper ref={(ref) => {
        this.utils = ref;
      }}>
        <KeyboardAwareScrollView style={container}>
          <ForgotPinForm submit={this.submit}/>
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
