import {
  NetInfo,
  Platform
} from 'react-native';

export default class NetworkService {
  constructor(props) {
  }
  
  async checkNetworkStatus() {
    return await NetInfo.isConnected.fetch();
  }
  
}
