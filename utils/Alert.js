import { Alert } from 'react-native';
export const Alerts = {
  alert: (timeout, title, message) => {
    setTimeout(() => {
      Alert.alert(title, message);
    }, timeout);
  },
  confirm: (title, message, callback) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
        { text: 'OK', onPress: () => callback() },
      ]
    )
  },
  success: (timeout, title, message, callback) => {
    setTimeout(() => {
      Alert.alert(
        title,
        message,
        [
          { text: 'OK', onPress: () => callback() }
        ]
      )
    }, timeout)

  }
};
