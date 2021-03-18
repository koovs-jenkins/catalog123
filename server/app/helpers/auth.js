import { authApiBaseUrl } from "../../../config";
import logger from "../../../utils/logger";
import { getDateTime } from "../../../src/helpers";
const request = require("request");

export const handleAuthCalls = (req, res) => {
  const headers = {
    ["Content-Type"]: req.headers["content-type"]
  };
  if (req.headers["x-api-client"]) {
    headers["x-api-client"] = req.headers["x-api-client"];
  }
  if (req.headers["x-auth-token"]) {
    headers["x-auth-token"] = req.headers["x-auth-token"].replace(/['"]+/g, "");
  }
  logger.info(
    "Info for API At " +
      getDateTime() +
      " => " +
      authApiBaseUrl +
      req.originalUrl
  );
  request(
    {
      url: authApiBaseUrl + req.originalUrl,
      method: req.method,
      headers: headers,
      body: req.body,
      json: true
    },
    function(error, response, body) {
      logger.info("In Validate", body, authApiBaseUrl + req.originalUrl);
      if (response.statusCode === 200) {
        res.status(response.statusCode).send(body);
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
  );
};
