import * as _ from 'lodash';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
  Platform,
  FlatList
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Search from 'react-native-search-box';
import {
  Icon,
  SearchBar
} from 'react-native-elements';
import {
  GiftedFormManager
} from '@nois/react-native-gifted-form';
import I18n from "react-native-i18n";

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Strings from '../../components/I18n/Strings';

export default class ModalWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      title: props.title,
      text: props.displayValue || '',
      value: null,
      search: props.search || false,
      searchDelay: props.searchDelay || 500,
    };

    this.updateSearchValue = _.debounce((keywords) => {
      this.setState({ keywords });
    }, this.state.searchDelay);
    this.toggleModal = this.toggleModal.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.onClose = this.onClose.bind(this);
    this.updateFormValue = this.updateFormValue.bind(this);
    this.unSelectAll = this.unSelectAll.bind(this);
    this.updateFormValue = this.updateFormValue.bind(this);
    this.renderRightIcon = this.renderRightIcon.bind(this);

  }


  onPress() {
    this.toggleModal();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.displayValue) {
      this.setState({ text: nextProps.displayValue });
    }
  }

  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen,
      keywords: ''
    });
  }

  getStyle(name) {
    return this.props.widgetStyles[name];
  }

  onClose(ti, vl) {
    this.setState({ text: ti });
  }

  onSelect(vl) {
    this.toggleModal();
    this.updateFormValue(vl);

    if (this.props.onSelected) {
      this.props.onSelected(vl);
    }
    this.setState({ value: vl });
  }

  updateFormValue(vl) {
    GiftedFormManager.updateValue(this.props.formName, this.props.name, vl);
  }

  unSelectAll() {
    // React.Children.forEach(this._childrenWithProps, (child, idx) => {
    //   this.refs[child.ref]._onChange(false);
    // });
  }

  renderRightIcon() {
    return !!this.props.rightIcon ? this.props.rightIcon :
      <Icon name='keyboard-arrow-down' size={25} color={Colors.grey4}/>;
  }

  renderSearchBar() {
    if (this.state.search) {
      return <Search
        ref="search_box"
        onChangeText={(keywords) => {
          this.updateSearchValue(keywords);
        }
        }
        afterDelete={() => {
          this.updateSearchValue('');
        }}

        afterCancel={() => {
          this.updateSearchValue('');
        }}

        backgroundColor={Colors.grey5}

      />
    }
  }


  render() {
    const { isOpen, keywords } = this.state;
    let childrenElement = this.props.children.props.children;
    let list = [];
    if (keywords) {
      list = _.filter(childrenElement, (i) => i.props.title.toLowerCase().indexOf(keywords.toLowerCase()) > -1);

    }
    else {
      list = childrenElement;
    }
    const renderElement = (child) => {
      return React.cloneElement(child, {
        formStyles: this.props.formStyles,
        formName: this.props.formName,
        name: this.props.name,
        multiple: this.props.multiple || false,
        onFocus: this.props.onFocus,
        onBlur: this.props.onBlur,
        onValidation: this.props.onValidation,
        onValueChange: this.props.onValueChange,
        onSelect: this.onSelect.bind(this),
        unSelectAll: this.unSelectAll.bind(this),
        onClose: this.onClose.bind(this),
        keywords: this.state.keywords
      })
    };
    return (
      <TouchableOpacity
        onPress={() => {
          this.onPress();
        }} style={[styles.rowContainer, this.getStyle('rowContainer')]}>
        <View style={[styles.row, this.getStyle('row')]}>
          {
            !!this.state.title && this.state.title.length > 0 &&
            <Text numberOfLines={1} style={[styles.title, this.getStyle('title')]}>{this.state.title}</Text>
          }

          <View style={[styles.valueContainer, this.getStyle('valueContainer')]}>
            <View style={[styles.alignRight, this.getStyle('textContainer')]}>
              <Text numberOfLines={1}
                    style={[styles.value, this.getStyle('text'),
                      { color: !this.state.text ? (Platform.OS === 'android' ? Colors.grey4 : Colors.grey5) : Colors.black }]}>{this.state.text || this.props.placeholder}</Text>
            </View>

            <View style={{ flex: 0.1 }}>
              {this.renderRightIcon()}
            </View>

          </View>
        </View>
        <Modal visible={isOpen} presentationStyle="fullScreen" transparent={false} animationType={'slide'}
               onRequestClose={() => {
               }}>
          <NavigationBar
            statusBar={{ tintColor: Colors.green }}
            leftButton={<TouchableOpacity style={styles.closeButton} onPress={() => {
              this.toggleModal();
            }}><Icon name={'close'} size={23} color={Colors.wt}/></TouchableOpacity>}
            title={{
              title: I18n.t('SELECT_ONE'),
              style: {
                ...Object.assign({}, Styles.NavBarText)
              }
            }} style={[styles.navBar]}/>
          {this.renderSearchBar()}
          <FlatList
            keyExtractor={(item, index) => index}
            data={list} renderItem={({ item }) =>
            renderElement(item)
          }>
          </FlatList>
        </Modal>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  navBar: {
    ...Styles.navBarModal,
    alignItems: 'center',
    borderBottomColor: Colors.green,
    borderBottomWidth: 1,

  },
  rowContainer: {
    flex: 1,
    backgroundColor: Colors.wt,
    borderBottomWidth: 1,
    borderColor: '#c8c7cc',
  },
  row: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center'
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    paddingLeft: 10,
    paddingBottom: 5
  },
  alignRight: {
    flex: 0.9,
    alignItems: 'flex-start',
    justifyContent: 'center'
    // width: 110,
  },
  text: {
    fontSize: 15,
    color: '#c7c7cc',
  },
  closeButton: {
    paddingHorizontal: 10
  },
  valueContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  value: {
    fontSize: 18
  },
  searchContainer: {
    backgroundColor: Colors.grey5,
    borderTopWidth: 0,
    borderBottomWidth: 0,

  },
  searchInput: {
    backgroundColor: '#fff',
    // height: 40,
    // fontSize: 16,
    // paddingLeft: 59,
    // margin: 10,
    // borderWidth: 1,
    // borderColor: Colors.grey,
    // borderRadius: 2,
    // marginLeft: 0,
    // marginRight: 0
  }
});
