const app = module.exports = require('express')();
const ntlmClient = require("../../../utils/lib");
import { json2xml } from "../../../utils/jsonToXml";
import {
    poApiUrl,
    asnApiCredential,
    asnApiUrl
  } from "../../../config";
app.use("/Koovs11augUATtest/OData/*", function(req, res) {
    ntlmClient
      .request({
        uri: poApiUrl + req.baseUrl + req.url,
        method: "GET",
        username: asnApiCredential.username,
        password: asnApiCredential.password,
        request: {
          jar: true
        }
      })
      .then(resuslt => {
        res.status(200).send(resuslt);
      })
      .catch(err => {
        logger.error(
          "error-2 for API At " +
            getDateTime() +
            " => " +
            poApiUrl +
            req.baseUrl +
            req.url +
            " and status code is " +
            response.statusCode
        );
        res.status(500).send(err);
      });
  });
  
  app.use("/Koovs11augUATtest/WS/Koovs%20Live/Page/*", function(req, res) {
    var url = asnApiUrl + req.baseUrl;
    var body = json2xml(req.body, "");
    ntlmClient
      .request({
        uri: url,
        method: "POST",
        username: asnApiCredential.username,
        password: asnApiCredential.password,
        body: body,
        request: {
          jar: false
        }
      })
      .then(resuslt => {
        res.status(200).send(resuslt);
      })
      .catch(err => {
        logger.error(
          "error-2 for API At " +
            getDateTime() +
            " => " +
            url +
            " and status code is " +
            response.statusCode
        );
        res.status(500).send(err);
      });
  });
  
  app.use("/Koovs11augUATtest/WS/Koovs%20Live/Codeunit/*", function(req, res) {
    var url = asnApiUrl + req.baseUrl;
    var body = json2xml(req.body, "");
    ntlmClient
      .request({
        uri: url,
        method: "POST",
        username: asnApiCredential.username,
        password: asnApiCredential.password,
        body: body,
        request: {
          jar: false
        }
      })
      .then(resuslt => {
        res.status(200).send(resuslt);
      })
      .catch(err => {
        logger.error(
          "error-2 for API At " +
            getDateTime() +
            " => " +
            url +
            " and status code is " +
            response.statusCode
        );
        res.status(500).send(err);
      });
  });