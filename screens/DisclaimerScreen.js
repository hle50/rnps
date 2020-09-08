/**
 * Created by nois on 8/30/17.
 */
import React, { Component } from 'react';
import {
  View,
  Platform,
  Alert
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { WebView } from 'react-native';
import { connect } from 'react-redux';
import ApiService from '../services/ApiService';
import Wrapper from '../components/wrapper/Wrapper';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import Utils from '../utils/Utils';
import { RealmService } from '../realm/Provider';
import I18n from 'react-native-i18n';
import Strings from '../components/I18n/Strings';

class DisclaimerScreen extends Component {
  static navigatorStyle = Styles.navBar;

  constructor(props) {
    super(props);
    this.apiService = new ApiService();
    this.state = {
      content: '',
      isLoading: false
    }
  }

  async componentDidMount() {
    let res = await RealmService.getAll('Disclaimer');
    if (this.props.netWorkStatus) {
      this.setState({ isLoading: true });
      let result = await this.apiService.get('phoneapp/getDisclaimers', { callback: 'callback' });
      let data = result.login;
      //replace <br\/> to <br/>
      let content = data.replace(/<br\\\/>/g, '<br/>');
      this.setState({ content, isLoading: false });
      if(res.length > 0){
        await RealmService.delete('Disclaimer', res[0].id);
      }
      let disclaimer = {
        id: (new Date().getTime()).toString() + (Utils.getRandomInt(0, 100)).toString(),
        content: content
      };
      await RealmService.insert('Disclaimer', disclaimer);
    }
    else {
      if(res.length > 0){
        this.setState({ content: res[0].content });
      }
      else {
        this.utils.Dialog.alertError(I18n.t(Strings.NO_NETWORK));
      }
    }
  }

  render() {
    const { content, isLoading } = this.state;
    const { container } = styles;
    return (
      <Wrapper ref={(ref) => {
        this.utils = ref;
      }}>
        <View style={container}>
          {content.length > 0 && <WebView
            source={{ html: `<div style="font-size:${Platform.OS === 'ios' ? '30pt' : '12pt'}">${content}</div> ` }} />}
        </View>
        <Spinner visible={isLoading} />
      </Wrapper>
    )
  }

}

const styles = {
  text: {
    fontSize: 15
  },
  container: {
    flex: 1
  }
};

const mapStateToProps = state => {
  let { netWorkStatus } = state;
  return { netWorkStatus }
};
export default connect(mapStateToProps, null)(DisclaimerScreen)