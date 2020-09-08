/**
 * Created by nois on 8/28/17.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import * as _ from 'lodash';
import Styles from '../constants/Styles';
import MyText from '../components/myText/MyText';
import Colors from '../constants/Colors';
import Strings from '../components/I18n/Strings';
import Wrapper from '../components/wrapper/Wrapper';
import { RealmService } from '../realm/Provider';
class PendingReportScreen extends Component {


  static navigatorStyle = Styles.navBar;

  constructor(props) {
    super(props);
    this.getStatusName = this.getStatusName.bind(this);
    this.goToDetail = this.goToDetail.bind(this);
  }

  /**
   *
   * @param statusId
   */
  getStatusName(statusId) {
    switch (statusId) {
      case 1:
        return 'Pending';
        break;
      case 2:
        return 'Resending...';
        break;
      case 3:
        return 'Sent';
        break;
    }
  }

  /**
   * go to detail screen
   * @param id
   */
  async goToDetail(id){
    //get data from realm
    let data = await RealmService.getById('PendingReport', id);
    //navigate to detail screen
    let dataForSummary = {
      collectionResult: JSON.parse(data.displayFields),
      data: JSON.parse(data.data),
      submitDate: data.submitDate
    };
    this.props.navigator.push({
      title: `${I18n.t(Strings.REPORT_DETAIL)}`,
      screen: 'ReportDetailScreen',
      passProps: dataForSummary
    })

  }
  render() {
    const { container, item, title, empty, status } = styles;
    const { pendingReport } = this.props;
    let orderedPendingReport = _.orderBy(pendingReport, ['status'], ['asc']);
    return (
      <Wrapper ref={(ref) => {
        this.utils = ref;
      }}>
        <ScrollView style={container}>
          {orderedPendingReport.map((d, i) =>
            <TouchableOpacity onPress={this.goToDetail.bind(this, d.id)} style={item} key={d.id}>
              <View style={{ flex: 0.8, justifyContent: 'center' }}>
                <MyText style={title}>{decodeURI(d.data.report_title)}</MyText>
                <MyText style={status}>{this.getStatusName(d.status)}</MyText>
              </View>
              <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'flex-end' }}>
                <Icon name="keyboard-arrow-right"/>
              </View>
            </TouchableOpacity>)
          }
          {orderedPendingReport.length === 0 && <View style={empty}>
            <MyText>{I18n.t(Strings.QUEUE_EMPTY)}</MyText>
          </View> }
        </ScrollView>
      </Wrapper>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.main,

  },
  item: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: 10,
    marginBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey4,
    flexDirection: 'row'
  },
  title: {
    fontSize: 14,

  },
  status: {
    fontSize: 12,
    color: Colors.green1
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }

};
const mapStateToProps = state => {
  let { pendingReport } = state;
  console.log('pendingReport', pendingReport);
  return { pendingReport }
};
export default connect(mapStateToProps, null)(PendingReportScreen)
