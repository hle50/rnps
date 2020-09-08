import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import {
  CheckBox
} from 'react-native-elements';
import {
  GiftedFormManager
} from '@nois/react-native-gifted-form';

import Colors from '../../constants/Colors';
import {fontMaker} from '../../utils/Fonts';

const fontFamily = fontMaker({
  weight: null,
  style: null
});

export default class CheckboxWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      checked: false
    };

    this.onCheck = this.onCheck.bind(this);
  }

  getStyle(name) {
    return this.props.widgetStyles ? this.props.widgetStyles[name] : undefined;
  }

  getValue() {
    let value = GiftedFormManager.getValue(this.props.formName, this.props.name);
    let title = GiftedFormManager.getValidators(this.props.formName, this.props.name).title;
    this.setState({
      checked: value,
      title: title || this.props.title
    });
  }

  componentDidMount() {
    this.getValue();
  }

  componentWillReceiveProps(nextProps) {
    this.getValue();
  }

  onCheck(vl) {
    this.setState({checked: !this.state.checked}, () => {
      this.updateFormValue(this.state.checked);

      if (this.props.onChange) {
        this.props.onChange(this.state.checked);
      }
    });
  }

  updateFormValue(vl) {
    GiftedFormManager.updateValue(this.props.formName, this.props.name, vl);
  }

  render() {
    const {checked, title} = this.state;

    return (
      <CheckBox
        checkedIcon={<View style={{
          width: 20,
          height: 20,
          borderColor: '#dcdcdd',
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}><View
          style={{width: 11, height: 11, backgroundColor: '#69d2e7'}}/>
        </View>}
        uncheckedIcon={
          <View style={{
            width: 20,
            height: 20,
            borderColor: '#dcdcdd',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}/>
        }
        uncheckedColor={Colors.blacklight}
        checkedColor={Colors.bluelight2}
        checked={checked}
        containerStyle={[styles.checkboxContainer, this.getStyle('containerStyle')]}
        textStyle={[{color: Colors.grey3}, fontFamily, this.getStyle('textStyle')]}
        title={title}
        onPress={this.onCheck}
      />
    );
  }
};

const styles = StyleSheet.create({
  checkboxContainer: {
    borderRadius: 0,
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    backgroundColor: 'transparent',
    borderWidth: 0
  }
});
