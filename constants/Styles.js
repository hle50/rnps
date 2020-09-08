import Colors from './Colors';
import { PixelRatio, Platform } from 'react-native';
import Layout from './Layout';
import Config from "./Config";

export default {
  GiftedForm: {
    TextInput: {
      rowContainer: {
        borderBottomWidth: 0,
        backgroundColor: Colors.main
      },
      // titleContainer: {flex: 1},
      textInput: {
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.grey1,
        marginLeft: 10,
        paddingLeft: 5,
        backgroundColor: Colors.wt,
        fontSize:18,
        paddingTop: 0,
        paddingBottom:0
      },
      textInputTitle: {
        color: Colors.green1,
        fontSize: 15,
        paddingBottom: 5
      },
      underlineIdle: {
        borderBottomWidth: 0
      }
    },
    ModalWidget: {
      modalWidgetTitle: {
        width: Layout.window.width,
        color: Colors.green1

      },
      rowContainer: {
        borderBottomWidth: 0
      },
      valueContainer: {
        color: Colors.green1
      },
      row: {
        height: 74,
        backgroundColor: Colors.main,
        flexDirection: 'column'
      },
      valueContainer: {
        flex: 1,
        justifyContent: 'space-between',
        borderRadius: 5,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: Colors.grey1,
        backgroundColor: Colors.wt,
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 10,
      }
    },
    ErrorWidget: {
      errorContainer: { backgroundColor: '#ffc9c9', padding: 10 },
      errorText: { lineHeight: 20 }
    },
    formStyles: {
      backgroundColor: Colors.bg,
      paddingHorizontal: 20,
      flexDirection: 'column',
      justifyContent: 'center',
      flex: 1
    },
    SubmitWidget: {
      submitButton: {
        marginHorizontal: 0,
        backgroundColor: Colors.red1,
        height: 40,
        width: 230,
        justifyContent: 'center',
        borderRadius: 8
      },
      submitButtonWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
      },
    },
    submitButton: {
      marginHorizontal: 0,
      backgroundColor: Colors.mainButton,
      height: 40,
      width: 230,
      justifyContent: 'center'
    },
    submitButtonWrapper: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    // SubmitButtonStyle : {
    //   backgroundColor: Colors.bluelight2,
    //   marginTop: 15,
    //   marginLeft: 60,
    //   marginRight: 60
    // }

    textInput: {
      // textAlign: 'right',
      // paddingRight: 120

    },
    textInputTitle: {
      width: 120
    },
    optionRight: {
      justifyContent: 'flex-end'
    },
    modalWidgetTitle: {
      width: Layout.window.width,

    }
  },
  navBar: {
    navBarTextColor: Colors.wt,
    navBarBackgroundColor: Colors.green,
    navBarButtonColor: Colors.wt
  },
  datePicker: {
    backgroundColor:Colors.wt,
    borderRadius: 8,
    borderWidth:1,
    borderColor: Colors.grey1,
    alignItems: 'flex-start',
    marginLeft: 0,
  },
  datePickerWrapper: {
    flex: 1,
    width:Layout.window.width - 20,
    marginLeft: 10,
    marginRight:10,
    marginTop: 5
  },
  dateIcon:{
    position: 'absolute',
    right: 10
  },
  navBarModal: {
    backgroundColor: Colors.green
  },
  NavBarText: {
    color: Colors.wt,

  },
  commonText: {
    color: Colors.green1
  }
}
