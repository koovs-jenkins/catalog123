import {
  FETCH_ASN_DETAILS_BYPO_START,
  FETCH_ASN_DETAILS_BYPO_SUCCESS,
  FETCH_ASN_DETAILS_BYPO_FAILURE,
} from "../actions/actionTypes";

const home = (
  state = { data: [], response: "", loading: false, error: null },
  action
) => {
  switch (action.type) {
    case FETCH_ASN_DETAILS_BYPO_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_ASN_DETAILS_BYPO_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false
      };
    case FETCH_ASN_DETAILS_BYPO_FAILURE:
      return {
        ...state,
        error: action.payload.error
      };
    default:
      return state;
  }
};
export default home;
