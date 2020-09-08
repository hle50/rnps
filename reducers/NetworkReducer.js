import TYPES from '../constants/Types';
export const networkStatusReducer = (state = false, action) => {
  switch (action.type) {
    case TYPES.UPDATE_NETWORK_STATUS:
      return action.payload;
    default:
      return state;
  }
};
