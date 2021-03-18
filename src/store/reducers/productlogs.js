import {
    FETCH_PRODUCT_LOG_START,
    FETCH_PRODUCT_LOG_SUCCESS,
    FETCH_PRODUCT_LOG_FAILURE,
  } from "../actions/actionTypes";
  
  
  const logdata = (state = { data: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_PRODUCT_LOG_START:
        return {
          ...state,
          loading: true
        };
      case FETCH_PRODUCT_LOG_SUCCESS:
        return {
          ...state,
          data: action.payload.data,
          loading: false,
          error : null
        };
      case FETCH_PRODUCT_LOG_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      default:
        return state;
    }
  };
  export default logdata;
  