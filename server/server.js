const express = require("express");
const path = require("path");
import logger from "../utils/logger";
import { getDateTime } from "../src/helpers";
const routes = require("./app/routes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
import {
  localApiUrl,
  HomeServiceApiUrl,
  NewruleServiceApiUrl,
  ReferralApiUrl,
  courierApiUrl,
  authApiBaseUrl
} from "../config";
var proxy = require("http-proxy-middleware");
var cors = require('cors');
const app = express();
app.get("/health-check", function(req, res) {
  res.status(200).send("Ok");
});
app.use(cors());
var myTenantId = function (req, res, next) {
  if(req.cookies["tenant"]){
    req.headers["x-mapped-tenants"]  = Buffer.from(req.cookies["tenant"], 'base64').toString('ascii');
  }
  else{
    req.headers["x-mapped-tenants"]  = "koovs";
  }
  next();
}
app.use(cookieParser());
app.use(myTenantId)
app.use(
  [
    "/brand/*",
    "/attributeType/*",
    "/attrValue/*",
    "/modelSize/*",
    "/category/*",
    "/product/*",
    "/productDigitalMedia/*",
    "/tag/*",
    "/batch/*",
    "/batchFileStatus/*",
    "/sizeguide/*",
    "/colorMapping/*",
    "/outfit/*",
    "/hsn*"
  ],
  proxy({ logLevel: "debug", target: localApiUrl, changeOrigin: true })
);

app.use(
  ["/jarvis-home-service/internal/v1/home/*"],
  proxy({ logLevel: "debug", target: HomeServiceApiUrl, changeOrigin: true })
);
app.use(
  ["/report/*"],
  proxy({ logLevel: "debug", target: localApiUrl, changeOrigin: true })
);
app.use(
  ["/referral/*"],
  proxy({ logLevel: "debug", target: ReferralApiUrl, changeOrigin: true })
);
app.use(
  ["/courier-service/internal/*"],
  proxy({ logLevel: "debug", target: courierApiUrl, changeOrigin: true })
);
app.use(
  ["/pincode-service/internal/*"],
  proxy({ logLevel: "debug", target: courierApiUrl, changeOrigin: true })
);
app.use(
  ["/rules/*"],
  proxy({ logLevel: "debug", target: NewruleServiceApiUrl, changeOrigin: true })
);
app.use(
  ["/koovs-auth-service/internal/v1/vendor/*"],
  proxy({ logLevel: "debug", target: authApiBaseUrl, changeOrigin: true })
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/dist", express.static("dist"));
app.use(express.static("public"));
app.use("/app", express.static("app"));
app.use((req, res, next) => {
  res.set({
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "content-security-policy": "frame-ancestors 'self'",
    "x-xss-protection": "1; mode=block",
    "X-Download-Options": "noopen"
    //"X-Content-Type-Options": "nosniff"
  });
  //res.cookie('sessionid', '1', { httpOnly: true });
  next();
});
app.use(routes);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"), function(err) {
    if (err) {
      logger.error(
        "error-2 for API At " +
          getDateTime() +
          " => " +
          req.originalUrl +
          " and status code is " +
          res.statusCode
      );
      res.status(500).send(err);
    }
  });
});

process.on("unhandledRejection", function(err) {
  logger.error("UnhandledRejection error" + err);
});
process.on("uncaughtException", function(error) {
  logger.error("uncaughtException" + error);
  logger.error("Error Stack", error.stack);
});

app.listen(4000, () => console.log(`Example app listening on port 4000!`));
console.log(`Worker ${process.pid} started`);
