/**
 * Created by nois on 8/28/17.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReportEntryForm from '../components/report/ReportEntryForm';
import Styles from '../constants/Styles';
import Wrapper from '../components/wrapper/Wrapper';
import MenuHomeBottom from '../components/home/MenuHomeBottom';
class AddReportScreen extends Component {

  static navigatorStyle = Styles.navBar;

  constructor(props) {
    super(props);
    this.moveNext = this.moveNext.bind(this);
  }

  moveNext(values, postSubmit) {
    let data = { ...values };
    let { licenseId, callerName } = this.props.licenseInfo;
    data.licenseId = licenseId;
    data.callerName = callerName;
    postSubmit();
    this.props.navigator.push({
      screen: 'FillReportScreen',
      title: data.reportObj.title,
      passProps: { data },
      backButtonTitle: ''
    })
  }

  render() {
    return (
      <Wrapper ref={(ref)=> {this.utils = ref;}}>
        <ReportEntryForm moveNext={this.moveNext} {...this.props}/>
        <MenuHomeBottom  {...this.props}/>
      </Wrapper>
    )
  }

}

const styles = {
  container: {
    flex: 1,
  }
};

export default connect(null, null)(AddReportScreen)