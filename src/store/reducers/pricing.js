import {
  FETCH_SCHEDULED_PRICES_START,
  FETCH_SCHEDULED_PRICES_SUCCESS,
  FETCH_SCHEDULED_PRICES_FAILURE
} from "../actions/actionTypes";

const initialState = {
  pricingList: {
    data: {},
    error: null,
    loading: false
  }
};

const pricing = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SCHEDULED_PRICES_START:
      return {
        ...state,
        pricingList: {
          ...state.pricingList,
          loading: true
        }
      };
    case FETCH_SCHEDULED_PRICES_SUCCESS:
      return {
        ...state,
        pricingList: {
          ...state.pricingList,
          data: action.payload,
          loading: false
        }
      };
    case FETCH_SCHEDULED_PRICES_FAILURE:
      return {
        ...state,
        pricingList: {
          error: action.payload,
          loading: false
        }
      };
    default:
      return state;
  }
};
export default pricing;
