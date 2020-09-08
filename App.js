import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Wrapper from './components/wrapper/Wrapper';
import Colors from './constants/Colors';
import HomeScreen from './screens/HomeScreen';

export default class rnpirsa extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      // this.utils.Dialog.alertSuccess('500 - Internal Server Error!', (result) => {
      //   console.log('Dialog confirm result', result);
      //   if(result){
      //     // YES
      //     this.utils.Dialog.alertSuccess('You clicked YES');
      //   } else {
      //     // NO
      //     this.utils.Dialog.alertSuccess('You clicked NO');
      //   }
      // });
      // this.utils.Dialog.confirm('500 - Internal Server Error!', (result) => {
      //   console.log('Dialog confirm result', result);
      //   if(result){
      //     // YES
      //     this.utils.Dialog.alertSuccess('You clicked YES');
      //   } else {
      //     // NO
      //     this.utils.Dialog.alertSuccess('You clicked NO');
      //   }
      // });
      // this.utils.Dialog.confirmCustomActions('500 - Internal Server Error!', (dismiss)=>{
      //   return [
      //     <Button text="BCS" onPress={()=>{
      //       dismiss(()=>{
      //         this.utils.Dialog.alertSuccess('Hello 123');
      //       });
      //     }}/>,
      //     <Button text="OK" onPress={()=>{
      //       dismiss(()=>{
      //         this.utils.Dialog.alertWarning('Hello 456');
      //       });
      //     }}/>,
      //     <Button text="!!!" onPress={()=>{
      //       dismiss(()=>{
      //         this.utils.Dialog.alertInfo('Hello 789');
      //       });
      //     }}/>
      //   ]
      // });
    }, 3000);
  }
  async realmCallback() {
    // Hide splash screen
    SplashScreen.hide();

    // Init first user
    // let users = RealmService.object('User');
    // if (users.length === 0) {
    //   try {
    //     const user = await RealmService.insert('User', {
    //       id: new Date().getTime().toString(),
    //       birthday: new Date(),
    //       firstName: 'Shawn',
    //       lastName: 'Dao',
    //       gender: 'male'
    //     });
    //   }
    //   catch (e) {
    //     console.log('Create User Error', e);
    //   }
    // }
  }

  render() {
    return (
      <Wrapper
        ref={(ref) => {
          this.utils = ref;
        }}
        realmCallback={this.realmCallback}>
        <HomeScreen {...this.props} />
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main,
  },
});
