import React from 'react';
import {View, StyleSheet} from 'react-native';
import Languages from '../I18n/Languages';
import DialogComponent from '../dialog/Dialog';
import NotificationBarComponent from '../notificationBar/NotificationBar';
import NetworkStatus from '../NetInfo/NetworkStatus';
import RealmProvider, {RealmService} from '../../realm/Provider';
import Colors from '../../constants/Colors';
export default class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.realmCallback = this.realmCallback.bind(this);
  }

  realmCallback() {
    if (this.props.realmCallback) {
      this.props.realmCallback();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Languages />

        <DialogComponent
          ref={(ref) => {
            this.Dialog = ref;
          }}
        />
        <NotificationBarComponent
          ref={(ref) => {
            this.NotificationBar = ref;
          }}
        />
        <NetworkStatus
          ref={(ref) => {
            this.NetworkStatus = ref;
          }}
        />
        <RealmProvider callback={this.realmCallback} style={styles.container}>
          <View style={styles.contentContainer}>{this.props.children}</View>
        </RealmProvider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.main,
  },
});
