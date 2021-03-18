const request = require("request");
import { authApiBaseUrl } from "../../../config";
import logger from "../../../utils/logger";
import { getDateTime } from "../../../src/helpers";

export const handleLogin = (req, res) => {
  var loginReq = req.baseUrl.indexOf("login") > -1;
  getUserLoggedIn(req, res, 0, loginReq);
};

function getUserLoggedIn(req, res, retryCount, loginReq) {
    if (retryCount > 2) {
      res.status(500).send({});
    }
    retryCount++;
    var headers = {
      "Content-type": "Application/json",
      "X-API-CLIENT": "OPS",
    };
    if (!loginReq) {
      headers["x-auth-token"] = req.headers["x-auth-token"].replace(/['"]+/g, "");
    }
    var data = {};
    logger.info(
      "Info for API At " + getDateTime() + " => " + authApiBaseUrl + req.baseUrl
    );
    request(
      {
        url: authApiBaseUrl + req.baseUrl,
        method: "POST",
        headers: headers,
        body: req.body,
        json: true
      },
      function(error, response, body) {
        if (loginReq) {
          if (response && response.statusCode === 401) {
            request(
              {
                url:
                  authApiBaseUrl + "/koovs-auth-service/v1/auth/register-client",
                method: "POST",
                headers: {
                  "Content-type": "Application/json",
                  "X-API-CLIENT": "WEB",
                  "User-Agent": req.headers["user-agent"]
                },
                json: true
              },
              function(error, response, body) {
                if (
                  response &&
                  response.statusCode === 200 &&
                  body &&
                  body.data
                ) {
                  req.headers["x-auth-token"] = body.data.token.replace(
                    /['"]+/g,
                    ""
                  );
                }
  
                data.guestToken = body.data.token;
                getUserLoggedIn(req, res, retryCount);
              }
            );
          } else {
            logger.error(
              "error-2 for API At " +
                getDateTime() +
                " => " +
                authApiBaseUrl +
                req.originalUrl +
                " and status code is " +
                response.statusCode
            );
            res.status(response.statusCode).send(body);
          }
        } else {
          if (response && response.statusCode === 200) {
            data.body = body;
            data.vendor = [];
            res.status(response.statusCode).send(data);
          } else {
            logger.error(
              "error-2 for API At " +
                getDateTime() +
                " => " +
                authApiBaseUrl +
                req.originalUrl +
                " and status code is " +
                response.statusCode
            );
            res.status(response.statusCode).send(body);
          }
        }
      }
    );
  }
  