import {
  FETCH_TEMP_CART_START,
  FETCH_TEMP_CART_SUCCESS,
  FETCH_TEMP_CART_FAILURE,
  FETCH_USER_START,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_PINCODE_START,
  FETCH_PINCODE_SUCCESS,
  FETCH_PINCODE_FAILURE,
  FETCH_REASONS_START,
  FETCH_REASONS_SUCCESS,
  FETCH_REASONS_FAILURE
} from "../actions/actionTypes";

const initialState = {
  tempCartList: {
    data: {},
    error: null,
    loading: false
  },
  userList: {
    data: {},
    error: null,
    loading: false
  },
  pincode: {
    data: {},
    error: null,
    loading: false
  },
  reasons: {
    data: {},
    error: null,
    loading: false
  }
};

const callCenter = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TEMP_CART_START:
      return {
        ...state,
        tempCartList: {
          ...state.tempCartList,
          loading: true
        }
      };
    case FETCH_TEMP_CART_SUCCESS:
      return {
        ...state,
        tempCartList: {
          ...state.tempCartList,
          data: action.payload,
          loading: false
        }
      };
    case FETCH_TEMP_CART_FAILURE:
      return {
        ...state,
        tempCartList: {
          error: action.payload,
          loading: false
        }
      };
    case FETCH_USER_START:
      return {
        ...state,
        userList: {
          ...state.userList,
          loading: true
        }
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        userList: {
          ...state.userList,
          data: action.payload,
          loading: false
        }
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        userList: {
          error: action.payload,
          loading: false
        }
      };
    case FETCH_PINCODE_START:
      return {
        ...state,
        pincode: {
          ...state.pincode,
          loading: true
        }
      };
    case FETCH_PINCODE_SUCCESS:
      return {
        ...state,
        pincode: {
          ...state.pincode,
          data: action.payload,
          loading: false
        }
      };
    case FETCH_PINCODE_FAILURE:
      return {
        ...state,
        pincode: {
          error: action.payload,
          loading: false
        }
      };
    case FETCH_REASONS_START:
      return {
        ...state,
        reasons: {
          ...state.reasons,
          loading: true
        }
      };
    case FETCH_REASONS_SUCCESS:
      return {
        ...state,
        reasons: {
          ...state.reasons,
          data: action.payload,
          loading: false
        }
      };
    case FETCH_REASONS_FAILURE:
      return {
        ...state,
        reasons: {
          error: action.payload,
          loading: false
        }
      };
    default:
      return state;
  }
};
export default callCenter;
