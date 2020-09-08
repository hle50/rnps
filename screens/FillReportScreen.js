/**
 * Created by nois on 8/28/17.
 */
import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import I18n from 'react-native-i18n'
import * as _ from 'lodash';
import moment  from 'moment';
import FillReportForm from '../components/report/FillReportForm';
import Styles from '../constants/Styles';
import Config from '../constants/Config';
import { RealmService } from '../realm/Provider';
import Wrapper from '../components/wrapper/Wrapper';
import Strings from '../components/I18n/Strings';
import MenuHomeBottom from '../components/home/MenuHomeBottom';
export default class FillReportScreen extends Component {

  static navigatorStyle = Styles.navBar;

  constructor(props) {
    super(props);
    this.moveNext = this.moveNext.bind(this);
    this.state = {
      options: null
    };
  }

  /**
   * move to summary screen
   * @param data
   * @param postSubmit
   */
  moveNext(values) {
    console.log('DATA', values);
    // add values from form to collections then move next

    let propData = { ...this.props };
    let collection = propData.data.reportObj.collections[0];
    //
    let collectionResult = [];
    let temp = {};
    Object.keys(values).forEach((k) => {
      let idx = _.findIndex(collection, (c) => c.collectionId == k);
      if (idx > -1) {
        temp = { ...collection[idx] };
        if (typeof values[k] == "object") {
          if (values[k] instanceof Date) {
            temp.selectedValue = moment(values[k]).format(Config.format.moment.datePicker);
          }
          else {
            temp.selectedId = values[k].id;
            temp.selectedValue = values[k].name;
          }
        }
        else {
          temp.selectedValue = values[k];
        }
        collectionResult.push(temp);
      }
    });
    console.log(collectionResult);

    let dataForSummary = {
      collectionResult,
      data: propData.data
    };
    this.props.navigator.push({
      screen: 'SummaryScreen',
      title: `${I18n.t(Strings.SUMMARY)}`,
      passProps: dataForSummary,
      backButtonTitle: ''
    })
  }

  async componentDidMount() {
    //get options from realm
    let options = await RealmService.getAll('OptionData');
    options = JSON.parse(options[0].data);
    this.setState({ options })

  }

  render() {
    const { container } = styles;
    const { options } = this.state;
    if (options) {
      return <Wrapper ref={(ref)=> {this.utils = ref;}}>
        <FillReportForm options={options} moveNext={this.moveNext} {...this.props}/>
        <MenuHomeBottom  {...this.props}/>
      </Wrapper>
    }
    return null
  }

}

const styles = {
  container: {
    flex: 1,
  }
};
