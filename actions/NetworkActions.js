/**
 * Created by nois on 8/15/17.
 */
import TYPES from '../constants/Types';

export function updateNetwork(data) {
  return {
    type: TYPES.UPDATE_NETWORK_STATUS,
    payload: data,
  };
}
