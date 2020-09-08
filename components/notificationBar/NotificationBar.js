import React from 'react';
import DropdownAlert from 'react-native-dropdownalert'

// const api = {};
// export const NotificationBar = api;

export default class NotificationBarComponent extends React.Component {
  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
  }

  // initApi() {
  //   api.show = this.show;
  // }

  show(type, title, message) {
    this.dropdown.alertWithType(type, title, message);
  }

  render() {
    return <DropdownAlert
      ref={(ref) => {
        this.dropdown = ref;
        // this.initApi();
      }}/>;
  }
}