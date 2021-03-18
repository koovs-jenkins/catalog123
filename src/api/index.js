import { makeid } from "../helpers";
import { setCookie, getCookie } from "../helpers/cookies";
import {
  cookiePrefix,
  accessTokenCookie,
  refreshTokenCookie,
  cookieExpiryDays,
  requestTimeoutKey
} from "../../config";
import KoovsClApi from "../helpers/KoovsCallApi";

export let accessTokenExpire = false;

let apiQueue = [],
  clientRegistrationExpiry = false;
let registerClientCallCounter = 0,
  registerClientMaxCallCounter = 1;
let accessTokenCallCounter = 0,
  accessTokenMaxCallCounter = 1;
let apiQueueCallCounter = 0,
  apiQueueMaxCallCounter = 1;

export function registerClient() {
  if (registerClientCallCounter <= registerClientMaxCallCounter) {
    let url = "/index.php/client/api/registerclient",
      client_id = makeid(),
      client_secret = makeid(),
      client_source = "web" /* for web param client_source is send */,
      grant_type = "client_credentials";
    if (
      client_id !== "" &&
      client_secret !== "" &&
      client_source !== "" &&
      clientRegistrationExpiry == false
    ) {
      clientRegistrationExpiry = true;
      let body =
        "client_id=" +
        client_id +
        "&client_secret=" +
        client_secret +
        "&client_source=" +
        client_source;
      KoovsClApi({
        url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        body,
        success(responseData) {
          registerClientCallCounter++;
          clientRegistrationExpiry = false;
          try {
            if (
              responseData.hasOwnProperty("success") &&
              responseData.success == "Client registered"
            ) {
              setCookie(cookiePrefix + "ClientId", client_id, cookieExpiryDays);
              setCookie(
                cookiePrefix + "ClientSecret",
                client_secret,
                cookieExpiryDays
              );

              let clientCookie = getCookie(cookiePrefix + "ClientId");
              let clientSecret = getCookie(cookiePrefix + "ClientSecret");

              if (clientCookie && clientSecret) {
                getAccessToken(clientCookie, clientSecret, grant_type);
              }
            } else if (
              responseData.hasOwnProperty("error") &&
              responseData.error === "Exists"
            ) {
              setCookie(cookiePrefix + "ClientId", client_id, cookieExpiryDays);
              setCookie(
                cookiePrefix + "ClientSecret",
                client_secret,
                cookieExpiryDays
              );

              let clientCookie = getCookie(cookiePrefix + "ClientId");
              let clientSecret = getCookie(cookiePrefix + "ClientSecret");
              if (clientCookie && clientSecret) {
                getAccessToken(clientCookie, clientSecret, grant_type);
              }
            } else if (
              responseData.hasOwnProperty("error") &&
              responseData.error === "Bad request"
            ) {
              registerClient();
            }
          } catch (error) {
            console.log("Error in Success Method of Register Client", error);
          }
        },
        error(errMsg) {
          registerClientCallCounter++; // increment the counter
          clientRegistrationExpiry = false;
          if (registerClientCallCounter <= registerClientMaxCallCounter) {
            //call next call exponentially
            let timeInMs = 2000;
            let timeout = timeInMs * registerClientCallCounter;
            setTimeout(() => {
              registerClient();
            }, timeout);
          }
        }
      });
    }
  }
}

export function getAccessToken(
  client_id,
  client_secret,
  grant_type = "refresh_token"
) {
  if (
    accessTokenExpire === true ||
    accessTokenCallCounter > accessTokenMaxCallCounter
  ) {
    return false;
  }

  if (client_id && client_secret) {
    let url = "/index.php/auth/oauth/access_token",
      accessToken,
      refreshToken,
      refreshTokenCookieName = cookiePrefix + refreshTokenCookie;
    let body =
      "client_id=" +
      client_id +
      "&client_secret=" +
      client_secret +
      "&grant_type=" +
      grant_type;

    if (grant_type === "refresh_token") {
      refreshToken = window.atob(getCookie(refreshTokenCookieName));
      body += "&refresh_token=" + refreshToken;
    }
    accessTokenExpire = true;
    KoovsClApi({
      url,
      type: "POST",
      contentType: "application/x-www-form-urlencoded",
      body,
      timeout: requestTimeoutKey.ACCESSTOKEN,
      success(responseData) {
        accessTokenExpire = false;
        accessTokenCallCounter++;
        if (!responseData.hasOwnProperty("error_code")) {
          /* HANDLING WHEN access token api returns 204 */
          if (responseData.status === 204) {
            if (accessTokenCallCounter <= accessTokenMaxCallCounter) {
              //call next call exponentially
              let timeInMs = 2000;
              let timeout = timeInMs * accessTokenCallCounter;
              let clientCookie = getCookie(cookiePrefix + "ClientId");
              let clientSecret = getCookie(cookiePrefix + "ClientSecret");
              let grant_type = "client_credentials";
              setTimeout(() => {
                getAccessToken(clientCookie, clientSecret, grant_type);
              }, timeout);
            }
            return;
          }
          /* set cookie for access_token, refresh_token */
          if (
            responseData.access_token !== undefined &&
            responseData.access_token !== ""
          ) {
            accessToken = window.btoa(responseData.access_token);
            setCookie(
              cookiePrefix + accessTokenCookie,
              accessToken,
              cookieExpiryDays
            );
          }

          if (
            responseData.refresh_token !== undefined &&
            responseData.refresh_token !== ""
          ) {
            refreshToken = window.btoa(responseData.refresh_token);
            setCookie(
              cookiePrefix + refreshTokenCookie,
              refreshToken,
              cookieExpiryDays
            );
          }
          if (
            apiQueue.length > 0 &&
            apiQueueCallCounter <= apiQueueMaxCallCounter
          ) {
            if (
              window.location.pathname == "/checkout/address" ||
              window.location.pathname == "/checkout/payment"
            ) {
              if (responseData.is_logged_in === false) {
                // FYI, redirect user to homepage, if access token loggedin status is false for checkout pages after cart
                window.location.href = "/";
                // clear the API QUEUE
                apiQueue = [];
              } else {
                for (let i = 0; i < apiQueue.length; i++) {
                  KoovsClApi(apiQueue[i]);
                }
                apiQueue = [];
                // Increment the APIQUEUE COUNTER
                apiQueueCallCounter++;
              }
            } else {
              for (let i = 0; i < apiQueue.length; i++) {
                KoovsClApi(apiQueue[i]);
              }
              apiQueue = [];
              // Increment the APIQUEUE COUNTER
              apiQueueCallCounter++;
            }
          } else {
            console.log("Server has encountered some problem");
            return false;
          }
        } else {
          checkErrorCode(responseData);
        }
      },
      error(error) {
        accessTokenCallCounter++; // increment the counter
        accessTokenExpire = false;
        if (accessTokenCallCounter <= accessTokenMaxCallCounter) {
          //call next call exponentially
          let timeInMs = 2000;
          let timeout = timeInMs * accessTokenCallCounter;
          let clientCookie = getCookie(cookiePrefix + "ClientId");
          let clientSecret = getCookie(cookiePrefix + "ClientSecret");
          let grant_type = "client_credentials";
          setTimeout(() => {
            getAccessToken(clientCookie, clientSecret, grant_type);
          }, timeout);
        }
      }
    });
  }
}

export function checkErrorCode(responseData, reqObj) {
  let clientId = getCookie(cookiePrefix + "ClientId"),
    clientSecret = getCookie(cookiePrefix + "ClientSecret"),
    refreshToken = getCookie(cookiePrefix + refreshTokenCookie);

  if (responseData.error_code == 56) {
    // error code for invalid request
    accessTokenCallCounter++; // increment the counter,so that max 2 calls should be sent, in case of any failure
    accessTokenExpire = false; // reset flag, so that next request should be made
    registerClient(); // again register client & get new access token
  } else if (responseData.error_code == 57) {
    let grantType = "refresh_token";
    if (reqObj != undefined) {
      apiQueue.push(reqObj);
    }
    if (clientId && clientSecret) {
      getAccessToken(clientId, clientSecret, grantType);
    } else {
      registerClient(); // again register client & get new access token
    }
  } else if (responseData.error_code == 58) {
    let grantType = "client_credentials";
    // as access token API will only return error codes 56 & 58 ,
    // increment the counter,so that max 2 calls should be sent, in case of any failure
    accessTokenCallCounter++;
    accessTokenExpire = false; // reset flag, so that next request should be made
    if (clientId && clientSecret) {
      getAccessToken(clientId, clientSecret, grantType);
    } else {
      registerClient(); // again register client & get new access token
    }
  } else if (responseData.error_code == 59) {
    window.location.href = "/signup/logout";
  }
}

/*
 * @description Mandatory Calls to be sent after Access Token, for users coming first time on site
 */

export function accessTokenRequired(reqObj) {
  if (reqObj != undefined) {
    apiQueue.push(reqObj);
  }
}
