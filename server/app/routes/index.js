const app = (module.exports = require("express")());
const cmsConfig = require("../../../config/config.js");
import {
  orderApiUrl,
  courierApiUrl,
  pricingApiUrl,
  inventoryApiUrl,
  ruleServiceApiUrl,
} from "../../../config";
import { handleProxy } from "../../proxyHandler";
const asnRoute = require("./asn");
const loginRoute = require("./login");
const rolesRoute = require("./roles");
const cmsRoute = require("./cms");
const accessRoute = require("./access");
const uploadRoute = require("./upload");

app.use(asnRoute);
app.use(loginRoute);
app.use(rolesRoute);
app.use(cmsRoute);
app.use(accessRoute);
app.use(uploadRoute);

app.use(
  ["/jarvis-order-service/*", "/jarvis-service/*", "/jarvis-home-service/*"],
  function(req, res) {
    handleProxy(req, res, orderApiUrl);
  }
);

app.use(["/jarvis-rule-service/*"], function(req, res) {
  handleProxy(req, res, ruleServiceApiUrl);
});

app.use("/pricing/*", function(req, res) {
  req.connection.setTimeout(1800000);
  handleProxy(req, res, pricingApiUrl);
});

app.use(["/inventory/*", "/internal/*"], function(req, res) {
  handleProxy(req, res, inventoryApiUrl);
});

app.use(
  ["/api/courier-service/register-reverse-pickup*", "/pincode-service/*"],
  function(req, res) {
    handleProxy(req, res, courierApiUrl);
  }
);

app.use(cmsConfig.proxy_api_prefix, function(req, res) {
  let url = cmsConfig.base_url + req.originalUrl;
  // req.pipe(request(url)).pipe(res);
  handleProxy(req, res, cmsConfig.base_url);
});

app.use(cmsConfig.proxy_email_prefix, function(req, res) {
  handleProxy(req, res, cmsConfig.base_email_url);
});
