/**
 * Created by nois on 8/30/17.
 */
import React, {Component} from 'react';
import {View, Text, WebView, ActivityIndicator} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default class AndroidWebViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  render() {
    const {isLoading} = this.state;
    let {url} = this.props;
    const {container} = styles;
    return (
      <View style={container}>
        <WebView
          onLoadEnd={() => this.setState({isLoading: false})}
          source={{uri: url}}
        />
        <Spinner visible={isLoading} />
      </View>
    );
  }
}
const styles = {
  container: {
    flex: 1,
  },
};
