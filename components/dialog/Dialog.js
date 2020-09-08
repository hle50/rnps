import React from 'react';
import {View, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import MyText from '../myText/MyText';
import {fontMaker} from '../../utils/Fonts';

// const api = {};
// export const DialogApi = api;

const fontFamilySemiBold = fontMaker({
  weight: 'SemiBold',
  style: null
});

const COLORS = {
  warning: '#b05300',
  info: '#00afb0',
  danger: '#b00000',
  success: '#00b01e',
  border: '#DAD9DC'
};

export default class DialogComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: []
    };
    this.show = this.show.bind(this);
    this.alert = this.alert.bind(this);
    this.alertError = this.alertError.bind(this);
    this.alertSuccess = this.alertSuccess.bind(this);
    this.alertWarning = this.alertWarning.bind(this);
    this.alertInfo = this.alertInfo.bind(this);
    this.confirm = this.confirm.bind(this);
    this.dismiss = this.dismiss.bind(this);
  }

  _createModal(props, idx) {
    const toggleModal = () => {
      if (!props.dismissOnTouchOutside) {
        return;
      }
      let {modals} = this.state;
      if (modals[idx]) {
        modals[idx] = Object.assign(modals[idx], {visible: false});
      }
      this.setState({
        modals
      }, () => {
        if (props.onClose) {
          props.onClose();
        }
      });
    };

    let onClose = props.onClose || (() => {
    });

    return <Modal key={idx}
                  visible={props.visible}
                  transparent={true}
                  animationType={'fade'}
                  onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={toggleModal}
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <View style={[styles.title, props.titleStyle]}>
              <MyText style={[styles.titleText, props.titleTextStyle]}>
                {props.title}
              </MyText>
            </View>
            <View style={[styles.body, props.bodyStyle]}>{props.body}</View>
            {props.buttons && props.buttons.length > 0 && <View style={styles.footer}>
              {props.buttons}
            </View>}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  }

  _createButton(text, onPress, idx, buttonStyle, textStyle) {
    return <View style={[styles.button, buttonStyle]} key={idx}>
      <TouchableOpacity
        onPress={onPress}
      >
        <View style={[styles.buttonTextContainer]}>
          <MyText style={[styles.buttonText, textStyle]}>
            {text}
          </MyText>
        </View>
      </TouchableOpacity>
    </View>;
  }

  _addModal(options) {
    if (options.overlap) {

    }
    else {
      this.setState({
        modals: [
          {
            visible: true,
            dismissOnTouchOutside: true,
            bodyStyle: {
              paddingHorizontal: 20,
              paddingVertical: 30,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            },
            ...options
          }
        ]
      })
    }
  }

  show(options, cb = null) {
    this._addModal();
  }

  dismiss(cb) {
    let {modals} = this.state;
    const currentModalIndex = this.state.modals.length - 1;
    if (modals[currentModalIndex]) {
      modals[currentModalIndex] = Object.assign(modals[currentModalIndex], {visible: false});
    }
    this.setState({
      modals
    }, () => {
      if (cb) {
        setTimeout(() => {
          cb();
        }, 300);
      }
    });
  }

  alert(message, title = "", onCloseCb = null, overlap = false) {
    this._addModal({
      body: <MyText style={{fontSize: 18}}>{message}</MyText>,
      title: title,
      onClose: onCloseCb,
      overlap
    });
  }

  alertError(message, title = "Error", onCloseCb = null, overlap = false) {
    this._addModal({
      body: <MyText style={{fontSize: 18}}>{message}</MyText>,
      title: title,
      titleStyle: {backgroundColor: COLORS.danger},
      titleTextStyle: {color: '#ffffff'},
      onClose: onCloseCb,
      overlap
    });
  }

  alertSuccess(message, title = "Success", onCloseCb = null, overlap = false) {
    this._addModal({
      body: <MyText style={{fontSize: 18}}>{message}</MyText>,
      title: title,
      titleStyle: {backgroundColor: COLORS.success},
      titleTextStyle: {color: '#ffffff'},
      onClose: onCloseCb,
      overlap
    });
  }

  alertWarning(message, title = "Warning", onCloseCb = null, overlap = false) {
    this._addModal({
      body: <MyText style={{fontSize: 18}}>{message}</MyText>,
      title: title,
      titleStyle: {backgroundColor: COLORS.warning},
      titleTextStyle: {color: '#ffffff'},
      onClose: onCloseCb,
      overlap
    });
  }

  alertInfo(message, title = "Info", onCloseCb = null, overlap = false) {
    this._addModal({
      body: <MyText style={{fontSize: 18}}>{message}</MyText>,
      title: title,
      titleStyle: {backgroundColor: COLORS.info},
      titleTextStyle: {color: '#ffffff'},
      onClose: onCloseCb,
      overlap
    });
  }

  confirm(message, cb, title = "Confirmation", overlap = false) {
    this._addModal({
      body: <MyText style={{fontSize: 18}}>{message}</MyText>,
      title: title,
      dismissOnTouchOutside: false,
      buttons: [
        this._createButton('YES', () => {
          this.dismiss(() => {
            cb(true);
          });
        }, 0),
        this._createButton('NO', () => {
          this.dismiss(() => {
            cb(false);
          });
        }, 1, {borderLeftWidth: 1, borderLeftColor: COLORS.border})
      ],
      overlap
    });
  }

  confirmCustomActions(message, actions, title = "Confirmation", overlap = false) {
    let buttons = actions(this.dismiss);
    let newButtons = buttons.map((bt, idx) => {
      return this._createButton(bt.props.title, bt.props.onPress, idx, idx !== 0 ? {
        borderLeftWidth: 1,
        borderLeftColor: COLORS.border
      } : {}, {});
    });
    this._addModal({
      body: <MyText style={{fontSize: 18}}>{message}</MyText>,
      title: title,
      dismissOnTouchOutside: false,
      buttons: newButtons,
      overlap
    });
  }

  render() {
    const {modals} = this.state;
    return <View>
      {modals.map((modal, idx) => {
        return this._createModal(modal, idx);
      })}
    </View>
    // return <PopupDialog
    //   {...this.state}
    //   ref={(popupDialog) => {
    //     this.popupDialog = popupDialog;
    //     // this.initApi();
    //   }}
    // >
    //   <View style={[styles.contentContainer, contentContainerStyle]}>
    //     {content}
    //   </View>
    // </PopupDialog>
  }
}

const styles = StyleSheet.create({
  overlay: {flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)'},
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {backgroundColor: '#ffffff', borderRadius: 8, marginLeft: 15, marginRight: 15},
  title: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 14,
    borderBottomWidth: 0.5,
    backgroundColor: '#F9F9FB',
    borderColor: COLORS.border
  },
  titleText: {
    color: '#7F7D89',
    fontSize: 18,
    textAlign: 'center',
    ...fontFamilySemiBold
  },
  body: {},
  footer: {flexGrow: 0, flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border},
  button: {flex: 1},
  buttonText: {fontSize: 18},
  buttonTextContainer: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});