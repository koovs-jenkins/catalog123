import {
  FETCH_ASN_DETAILS_START,
  FETCH_ASN_DETAILS_SUCCESS,
  FETCH_ASN_DETAILS_FAILURE,
  POST_ASN_DETAILS_START,
  POST_ASN_DETAILS_SUCCESS,
  POST_ASN_DETAILS_FAILURE
} from "../actions/actionTypes";
import { getDataFromResponse } from "../../helpers/asn";

const details = (
  state = { data: [], response: "", loading: false, error: null },
  action
) => {
  switch (action.type) {
    case FETCH_ASN_DETAILS_START:
      return {
        ...state,
        data: [],
        response: null,
        loading: true
      };
    case FETCH_ASN_DETAILS_SUCCESS:
      return {
        ...state,
        data: getDataFromResponse(action.payload.data),
        loading: false
      };
    case FETCH_ASN_DETAILS_FAILURE:
      return {
        ...state,
        data: [],
        response: null,
        error: action.payload.error,
        loading: false
      };
    case POST_ASN_DETAILS_START:
      return {
        ...state,
        response: null,
        loading: false
      };
    case POST_ASN_DETAILS_SUCCESS:
      return {
        ...state,
        response:
          action.payload.data["Soap:Envelope"]["Soap:Body"][
            "ImportASNInbound_Result"
          ]["return_value"],
        loading: false
      };
    case POST_ASN_DETAILS_FAILURE:
      return {
        ...state,
        response: null,
        error: action.payload.error,
        loading: false
      };
    default:
      return state;
  }
};
export default details;
