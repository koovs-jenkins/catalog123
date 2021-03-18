import {
  SIGNIN_USER_START,
  SIGNIN_USER_SUCCESS,
  SIGNIN_USER_FAILURE,
  SIGN_OUT_USER_START,
  SIGN_OUT_USER_SUCCESS,
  SIGN_OUT_USER_FAILURE
} from "../actions/actionTypes";
import {
  setLocalStorage,
  removeLocalStorage,
  setCookie,
  deleteCookie
} from "../../helpers/localstorage";
import { env } from "../../../config";

const initialState = { data: { roles: [] }, loading: false, error: null };
const signin = (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN_USER_START:
      return {
        ...state,
        loading: true
      };
    case SIGNIN_USER_SUCCESS:
      let message = "";
      let isAuthenticated = false;
      let result = {};
      if (action.payload.status == 200) {
        setCookie("_koovs_token", action.payload.data.body.data.token);
        setCookie("_koovs_userid", action.payload.data.body.data.user.id);
        setLocalStorage(
          env + "_koovs_userid",
          action.payload.data.body.data.user.id
        );
        action.payload.data.vendor &&
          setLocalStorage(
            env + "_koovs_vendorid",
            action.payload.data.vendor.navid_ref
          );
        isAuthenticated = true;
        result = { ...action.payload.data };
      } else {
        message = action.payload.data.errorMessage.replace(/[^a-zA-Z ]/g, " ");
      }
      return {
        ...state,
        data: result,
        isAuthenticated: isAuthenticated,
        loading: false,
        message: message
      };
    case SIGNIN_USER_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case SIGN_OUT_USER_START:
      return {
        ...state,
        loading: true
      };
    case SIGN_OUT_USER_SUCCESS:
      deleteCookie("_koovs_token");
      deleteCookie("_koovs_userid");
      removeLocalStorage(env + "_koovs_userid");
      removeLocalStorage(env + "_koovs_vendorid");
      return {
        _persist: state._persist
      };
    case SIGN_OUT_USER_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
export default signin;
