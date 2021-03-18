import { orderApiUrl } from "../config";
import logger from "../utils/logger";
import { getDateTime } from "../src/helpers";
const request = require("request");

export function handleProxy(req, res, baseUrl) {
  const headers = {
    ["Content-Type"]: req.headers["content-type"]
  };
  if (req.headers["x-api-client"]) {
    headers["x-api-client"] = req.headers["x-api-client"];
  }
  if (req.headers["x-user-id"]) {
    headers["x-user-id"] = req.headers["x-user-id"];
  }
  if (req.headers["accept"]) {
    headers["accept"] = req.headers["accept"];
  }
  if (req.headers["authorization"]) {
    headers["Authorization"] = req.headers["authorization"];
  }
  if (req.headers["auth-key"]) {
    headers["auth-key"] = req.headers["auth-key"];
  }
  if (req.headers["x-user-email"]) {
    headers["x-user-email"] = req.headers["x-user-email"];
  }
  if (req.headers["x-mapped-tenants"]) {
    headers["x-mapped-tenants"] = req.headers["x-mapped-tenants"];
  }
  logger.info(
    "Info for API At " +
      getDateTime() +
      " => " +
      baseUrl +
      req.originalUrl +
      " and body " +
      JSON.stringify(req.body)
  );
  logger.info(headers["x-mapped-tenants"])
  logger.info(JSON.stringify(headers))
  request(
    {
      url: baseUrl + req.originalUrl,
      method: req.method,
      headers: headers,
      body: req.body,
      json: true
    },
    function(error, response, body) {
      if (response && response.statusCode == 204) {
        const resBody = body ? body : {};
        resBody.message = resBody.message
          ? resBody.message
          : "No content found";
        res.status(200).send(resBody);
      } else if (response && response.statusCode < 350) {
        res.status(response.statusCode).send(body);
      } else {
        if (response && response.statusCode) {
          logger.error(
            "error-2 for API At " +
              getDateTime() +
              " => " +
              baseUrl +
              req.originalUrl +
              " and status code is " +
              response.statusCode
          );
          body.message = body.message ? body.message : "Something went wrong";
          res.status(response.statusCode).send(body);
        } else {
          logger.error(
            "error-2 for API At " +
              getDateTime() +
              " => " +
              baseUrl +
              req.originalUrl +
              " and status code is pending"
          );
          res.status(500).send({ message: "Getting no response from api" });
        }
      }
    }
  );
}

export function handleFileUpload(req, res, file, url, method, domain) {
  const form = {
    file: {
      value: file,
      options: {
        filename: "data.csv",
        contentType: "text/csv"
      }
    }
  };
  const headers = {
    ["Content-Type"]: "multipart/form-data"
  };
  if (req.headers["x-api-client"]) {
    headers["x-api-client"] = req.headers["x-api-client"];
  }
  if (req.headers["x-user-id"]) {
    headers["x-user-id"] = req.headers["x-user-id"];
  }
  if (req.headers["x-user-email"]) {
    headers["x-user-email"] = req.headers["x-user-email"];
  }
  logger.info(
    "Info for handleFileUpload API At " +
      getDateTime() +
      " => " +
      (domain || orderApiUrl) +
      url +
      " and header " +
      JSON.stringify(headers) +
      " and file " +
      JSON.stringify(form)
  );
  request(
    {
      url: (domain || orderApiUrl) + url,
      method: method,
      headers: headers,
      formData: form,
      json: true
    },
    function(error, response, body) {
      if (response && response.statusCode == 204) {
        body.message = body.message ? body.message : "No content found";
        res.status(response.statusCode).send(body);
      } else if (response && response.statusCode < 350) {
        res.status(response.statusCode).send(body);
      } else {
        if (response && response.statusCode && body) {
          logger.error(
            "error-2 for handleFileUpload API At " +
              getDateTime() +
              " => " +
              (domain || orderApiUrl) +
              url +
              " and status code is " +
              response.statusCode +
              " and error is " +
              error
          );
          body.message = body.message ? body.message : "Something went wrong";
          res.status(response.statusCode).send(body);
        } else {
          logger.error(
            "error-2 for API At " +
              getDateTime() +
              " => " +
              baseUrl +
              req.originalUrl +
              " and status code is pending"
          );
          res.status(500).send({ message: "Getting no response from api" });
        }
      }
    }
  );
}
