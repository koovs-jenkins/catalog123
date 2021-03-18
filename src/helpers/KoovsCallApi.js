import "isomorphic-fetch";
import { cookiePrefix, accessTokenCookie } from "../../config";
import {
  checkErrorCode,
  accessTokenRequired,
  accessTokenExpire,
  getAccessToken
} from "../api";
import { getCookie } from "../helpers/cookies";

export default function KoovsCallApi(reqObj) {
  let accessToken = getCookie(cookiePrefix + accessTokenCookie);
  let fetchHeaders,
    credentials = "include";
  /* If somehow Client(Browser) is not having access token, then push those requests into apiQueue,
   so that whenever access token is there they will be sent */
  if (
    (!accessToken && reqObj.isAccessTokenRequired) ||
    (accessToken && accessToken === "undefined")
  ) {
    accessTokenRequired(reqObj);
    if (accessTokenExpire === false) {
      let clientId = getCookie(cookiePrefix + "ClientId"),
        clientSecret = getCookie(cookiePrefix + "ClientSecret");
      if (clientId && clientSecret) {
        getAccessToken(clientId, clientSecret, "refresh_token");
      }
    }
    return false;
  }
  if (reqObj["noheaders"] == "true") {
    credentials = "omit";
    fetchHeaders = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
  } else {
    fetchHeaders = {
      "x-api-client": "OPS",
      "Content-Type": reqObj["Content-Type"]
        ? reqObj["Content-Type"]
        : "application/x-www-form-urlencoded",
      Authorization: accessToken != "" ? "Bearer " + accessToken : "",
      "CAN-FETCH-VALUE": "NO",
      "cache-control": "no-cache, no-store, must-revalidate"
    };
  }
  if (reqObj.timeout) {
    fetchHeaders.requestTimeout = reqObj.timeout;
  }
  fetch(reqObj.url, {
    method: reqObj.type,
    mode: "no-cors",
    credentials,
    headers: fetchHeaders,
    body: reqObj.body
  })
    .then(response => {
      if (response.status == 204) {
        return { status: 204, content: "" };
      } else {
        try {
          let responseContentType = response.headers.get("content-type");
          if (
            responseContentType &&
            responseContentType.indexOf("text/html") > -1
          ) {
            return response.text();
          } else {
            return response.json();
          }
        } catch (error) {
          console.log("CL API Error", error);
          if (reqObj.hasOwnProperty("error")) {
            reqObj.error(error);
          }
          return false;
        }
      }
    })
    .then(responseData => {
      let AccessTokenErrorCode = [56, 57, 58, 59, "56", "57", "58", "59"];
      if (
        responseData.hasOwnProperty("error_code") &&
        responseData.error_code !== null &&
        AccessTokenErrorCode.indexOf(responseData.error_code) > -1
      ) {
        checkErrorCode(responseData, reqObj);
      } else {
        reqObj.success(responseData);
      }
    })
    .catch(error => {
      console.log("Error in CL API", error);
      if (reqObj.hasOwnProperty("error")) {
        reqObj.error(error);
      }
    });
}
