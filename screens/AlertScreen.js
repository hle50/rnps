/**
 * Created by nois on 8/28/17.
 */
import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Platform
} from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Browser from 'react-native-browser';
import Styles from '../constants/Styles';
import Strings from '../components/I18n/Strings';
import {
  fontMaker
} from '../utils/Fonts';
import Colors from '../constants/Colors';
import Wrapper from '../components/wrapper/Wrapper';
import ApiService from '../services/ApiService';
import { RealmService } from '../realm/Provider';
import Utils from '../utils/Utils';

const fontFamilySemiBold = fontMaker({
  weight: 'SemiBold',
  style: null
});
const fontFamily = fontMaker({
  weight: null,
  style: null
});

class AlertScreen extends Component {

  static navigatorStyle = Styles.navBar;

  constructor(props) {
    super(props);
    this.open = this.open.bind(this);
    this.apiService = new ApiService();
    this.state = {
      data: [],
      isLoading: false,
    }
  }

  async componentDidMount() {
    let res = await RealmService.getAll('AlertData');
    if (this.props.netWorkStatus) {
      this.setState({ isLoading: true });
      let feedResult = await this.apiService.get('phoneapp/feeds', { callback: 'callback' });

      for (let i = 0; i < feedResult.length; i++) {
        //strip HTML
        feedResult[i].text = Utils.stripHtmlTags(feedResult[i].text);
        if (feedResult[i].url && feedResult[i].url.endsWith('.pdf')) {
          feedResult[i].url = `https://docs.google.com/gview?embedded=true&url=${feedResult[i].url}`
        }
      }
      if(res.length > 0){
        await RealmService.delete('AlertData', res[0].id);
      }
      let alertData = {
        id: (new Date().getTime()).toString() + (Utils.getRandomInt(0, 100)).toString(),
        data: JSON.stringify(feedResult)
      };
      await RealmService.insert('AlertData', alertData);
      this.setState({ isLoading: false, data: feedResult });
    }
    else {
      if(res.length > 0){
        this.setState({ data: JSON.parse(res[0].data) });
      }
      else {
        this.utils.Dialog.alertError(I18n.t(Strings.NO_NETWORK));
      }
    }
  }

  /**
   * open url in web browser
   * @param url
   */
  open({ url }) {
    let { netWorkStatus } = this.props;
    if (!netWorkStatus) {
      this.utils.Dialog.alertError(I18n.t(Strings.NO_NETWORK));
      return;
    }
    if (Platform.OS === 'ios') {
      Browser.open(url, {
        showPageTitles: false
      });
    }
    else {
      this.props.navigator.showModal({
        screen: 'AndroidWebViewScreen',
        passProps: { url: url }
      })
    }
  }

  render() {
    const { text, header, closeButton } = styles;
    const { data, isLoading } = this.state;
    return (
      <Wrapper ref={(ref) => {
        this.utils = ref;
      }}>
        <List containerStyle={{ marginTop: 0, backgroundColor: Colors.main, borderBottomColor: Colors.black }}>
          {
            data.map((item, i) => (
              <ListItem onPress={() => {
                this.open(item)
              }}
                        underlayColor={Colors.main1}
                        titleStyle={[text, fontFamily]}
                        key={i}
                        rightIcon={{ name: 'chevron-right', color: Colors.grey3, size: 12 }}
                        title={item.text}
              />
            ))
          }
        </List>
        <Spinner visible={isLoading} />
      </Wrapper>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.main
  },
  text: {
    fontSize: 14,
    color: Colors.grey3
  }
};
const mapStateToProps = state => {
  let { netWorkStatus } = state;
  return { netWorkStatus }
};
export default connect(mapStateToProps, null)(AlertScreen)
