/**
 * Created by nois on 8/9/17.
 */
import {combineReducers} from 'redux';
import {networkStatusReducer} from '../reducers/NetworkReducer';
import {numberOfPendingReportReducer} from '../reducers/PendingReportReducer';
import {selectedLicenseReducer} from '../reducers/LicenseReducer';
export default combineReducers({
  netWorkStatus: networkStatusReducer,
  pendingReport: numberOfPendingReportReducer,
  // pendingReport: numberOfPendingReportReducer,
  selectedLicense: selectedLicenseReducer,
});
