import React from 'react';
// import NetInfo from '@react-native-community/netinfo';

// const api = {};
// export const NetworkStatusApi = api;

export default class NetworkStatus extends React.Component {
  constructor(props) {
    super(props);
    // this.check = this.check.bind(this);

    this.state = {
      isConnected: false,
    };
  }
  // // Subscribe
  // unsubscribe = NetInfo.addEventListener((state) => {
  //   console.log('Connection type', state.type);
  //   console.log('Is connected?', state.isConnected);
  // });
  // handleFirstConnectivityChange = (isConnected) => {
  //   console.log('network status', isConnected);
  //   this.setState({isConnected: true});
  // };
  //
  // componentDidMount() {
  //   // let self = this;
  //
  //   NetInfo.isConnected.addEventListener(
  //     'change',
  //     this.handleFirstConnectivityChange,
  //   );
  //
  //   // api.check = this.check;
  // }
  //
  // componentWillUnmount() {
  //   // NetInfo.isConnected.removeEventListener(
  //   //   'change',
  //   //   this.handleFirstConnectivityChange,
  //   // );
  //   this.unsubscribe();
  // }
  //
  // check() {
  //   return this.state.isConnected;
  // }
  //
  // toggleModal() {
  //   this.setState({
  //     show: !this.state.show,
  //   });
  // }

  render() {
    return null;
  }
}
