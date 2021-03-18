import {
  FETCH_PO_LIST_START,
  FETCH_PO_LIST_SUCCESS,
  FETCH_PO_LIST_FAILURE
} from "../actions/actionTypes";

const po = (state = { data: [], loading: false, error: null }, action) => {
  switch (action.type) {
    case FETCH_PO_LIST_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_PO_LIST_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false
      };
    case FETCH_PO_LIST_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
export default po;
