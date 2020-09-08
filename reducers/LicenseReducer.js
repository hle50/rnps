import TYPES from '../constants/Types';
export const selectedLicenseReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.SET_LICENSE:
      return action.payload;
    default :
      return state;
  }
};

