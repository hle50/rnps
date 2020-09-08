import TYPES from '../constants/Types';
export const numberOfPendingReportReducer = (state = [], action) => {
  switch (action.type) {
    case TYPES.INIT_PENDING:
      return action.payload;
    case TYPES.UPDATE_PENDING:
      return [...state, action.payload];
    default :
      return state;
  }
};

