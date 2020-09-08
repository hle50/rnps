/**
 * Created by nois on 8/15/17.
 */
import TYPES from '../constants/Types';


export function initPending(data) {
  return {
    type: TYPES.INIT_PENDING,
    payload: data,
  }
}
export function updatePendingReport(data) {
  return {
    type: TYPES.UPDATE_PENDING,
    payload: data,
  }
}







