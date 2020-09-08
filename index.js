/**
 * @format
 */

import AddLicenceScreen from './screens/AddLicenceScreen';
import AddReportScreen from './screens/AddReportScreen';
import ForgetPinScreen from './screens/ForgetPinScreen';
import PendingReportScreen from './screens/PendingReportScreen';
import HomeScreen from './screens/HomeScreen';
import AlertScreen from './screens/AlertScreen';
import DisclaimerScreen from './screens/DisclaimerScreen';
import AndroidWebViewScreen from './screens/AndroidWebViewScreen';
import FillReportScreen from './screens/FillReportScreen';
import ReportSentScreen from './screens/ReportSentScreen';
import SummaryScreen from './screens/SummaryScreen';
import ReportDetailScreen from './screens/ReportDetailScreen';
import rnpirsa from './App';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import reducers from './reducers';
import {createStore} from 'redux';
import React from 'react';
const store = createStore(reducers);

Navigation.registerComponent('rnpirsa', () => rnpirsa);
Navigation.registerComponent(
  'AddLicenceScreen',
  () => AddLicenceScreen,
  store,
  Provider,
);
Navigation.registerComponent(
  'AddReportScreen',
  () => AddReportScreen,
  store,
  Provider,
);
Navigation.registerComponent('ForgetPinScreen', () => ForgetPinScreen);
Navigation.registerComponent(
  'PendingReportScreen',
  () => PendingReportScreen,
  store,
  Provider,
);
Navigation.registerComponent(
  'HomeScreen',
  () => (props) => (
    <Provider store={store}>
      <HomeScreen {...props} />
    </Provider>
  ),
  () => HomeScreen,
);
// Navigation.registerComponentWithRedux(
//   'HomeScreen',
//   () => HomeScreen,
//   Provider,
//   store,
// );
Navigation.registerComponent('AlertScreen', () => AlertScreen, store, Provider);
Navigation.registerComponent(
  'DisclaimerScreen',
  () => DisclaimerScreen,
  store,
  Provider,
);
Navigation.registerComponent(
  'AndroidWebViewScreen',
  () => AndroidWebViewScreen,
);
Navigation.registerComponent(
  'FillReportScreen',
  () => FillReportScreen,
  store,
  Provider,
);
Navigation.registerComponent(
  'SummaryScreen',
  () => SummaryScreen,
  store,
  Provider,
);
Navigation.registerComponent(
  'ReportSentScreen',
  () => ReportSentScreen,
  store,
  Provider,
);
Navigation.registerComponent('rnpirsa', () => rnpirsa);
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'rnpirsa',
            },
          },
        ],
      },
    },
  });
});
