import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PixelRatio
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {
  Icon
} from 'react-native-elements';
import {
  GiftedFormManager
} from '@nois/react-native-gifted-form';
import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

export default class OptionWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: false
    };

    this._onClose = this._onClose.bind(this);
  }

  componentWillMount(){
    let controlName = this.props.name.replace(/{.*}$/g, '');
    let formState = GiftedFormManager.stores[this.props.formName];
    if (typeof formState !== 'undefined') {
      if (typeof formState.values[controlName] !== 'undefined') {
        this.setState({value: formState.values[controlName] === this.props.value});
      }
    }
  }

  getStyle(name) {
    let style = {};
    if (this.props.widgetStyles) {
      style = this.props.widgetStyles[name] || {};
    }
    return {...styles[name], ...style};
  }

  _renderCheckmark() {
    if (this.state.value === true) {
      return (
        <Icon
          style={{paddingHorizontal: 15}}
          name={'check'}
          size={20}
          color={this.props.iconColor}
        />
      );
    }
    return null;
  }

  _onChange(value) {
    this.setState({value: value});
  }

  _onClose() {
    if (this.props.multiple === false) {
      this.props.unSelectAll();
      this._onChange(true);

      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(this.props.value);
      }

      if (typeof this.props.onClose === 'function') {
        this.props.onClose(this.props.title, this.props.value);
      }
    } else {
      this._onChange(!this.state.value);
    }
  }

  render() {
    return (
      <View style={this.getStyle('rowContainer')}>
        <TouchableOpacity
          onPress={this._onClose}
          underlayColor={'#c7c7cc'}
          {...this.props} // mainly for underlayColor
        >
          <View style={this.getStyle('row')}>
            <Text numberOfLines={1} style={[this.getStyle('switchTitle'), this.state.value ? this.getStyle('selectedTextStyle') : {}]}>
              {this.props.title}
            </Text>
            {this._renderCheckmark()}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = {
  rowImage: {
    height: 20,
    width: 20,
    marginLeft: 10,
  },
  checkmark: {
    width: 23,
    marginRight: 10,
    marginLeft: 10,
  },
  rowContainer: {
    backgroundColor: Colors.wt,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#c8c7cc',
  },
  row: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
  },
  switchTitle: {
    fontSize: 15,
    flex: 1,
    paddingLeft: 10,
  }
};
