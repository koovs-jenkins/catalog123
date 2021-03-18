import axios from "axios";
import { getLocalStorage, getCookie } from "../helpers/localstorage";
import { env } from "../../config";

export function signInUserApi(credentials) {
  return axios({
    url: "/koovs-auth-service/v1/auth/login",
    data: credentials,
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      "x-api-client": "OPS",
      "X-AUTH-TOKEN": getCookie("_koovs_token")
    }
  })
  .then(res => res)
  .catch(err => err.response);
}

export function signOutUserApi() {
  return axios({
    url: "/koovs-auth-service/v1/auth/logout",
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      "x-api-client": "OPS",
      "X-AUTH-TOKEN": getCookie("_koovs_token")
    }
  })
    .then(res => res.data)
    .catch(err => err);
}

export function validateTokenApi(cb) {
  return axios({
    url: "/koovs-auth-service/v1/auth/validate-token",
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      "x-api-client": "ops",
      "X-AUTH-TOKEN": getCookie("_koovs_token")
    }
  })
    .then(res => res.data.data == null && cb())
    .catch(err => cb());
}

export function changePasswordApi(body) {
  return axios
    .put(`koovs-auth-service/v1/auth/update-password`, body, {
      headers: {
        "Content-Type": "Application/json",
        "x-api-client": "OPS",
        "X-AUTH-TOKEN": getCookie("_koovs_token")
      }
    })
    .then(res => res.data)
    .catch(err => err.response);
}
