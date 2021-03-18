const app = (module.exports = require("express")());
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
import { env, config, vmApiDomain, pricingApiUrl } from "../../../config";
import { handleFileUpload } from "../../proxyHandler";
import cmsImageUpload from "../../cms/cmsImageUpload";
import cmsJsonUpload from "../../cms/cmsJsonUpload";
import cmsExcelUpload from "../../cms/cmsExcelUpload";
import { uploadImageController } from "../controller/upload";
import { getReportsData , getReportsObject } from "../controller/gets3obj";
import { sanitizeFile } from "../helpers/upload";
var path = require("path");

var multer = require("multer");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, env == "local" ? "upload/" : "/tmp");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
  fileFilter: function(req, file, cb) {
    sanitizeFile(file, cb);
  }
});
var upload = multer({ storage: storage });
var fs = require("fs");

app.use("/vm-service/update-vm/file-upload", upload.single("file"), function(
  req,
  res,
  next
) {
  const filePath = req.file.path;
  handleFileUpload(
    req,
    res,
    fs.createReadStream(path.normalize(filePath)),
    req.originalUrl,
    "PUT",
    vmApiDomain
  );
});

app.post("/upload", upload.single("file"), function(req, res, next) {
  const urlToUpload = req.headers["x-api-url"];
  const method = req.headers["x-api-method"];
  const filePath = req.file.path;
  handleFileUpload(
    req,
    res,
    fs.createReadStream(path.normalize(filePath)),
    urlToUpload,
    method
  );
});

app.post("/pricing/upload", upload.single("file"), function(req, res, next) {
  const urlToUpload = req.headers["x-api-url"];
  const method = req.headers["x-api-method"];
  const filePath = req.file.path;
  handleFileUpload(
    req,
    res,
    fs.createReadStream(path.normalize(filePath)),
    urlToUpload,
    method,
    pricingApiUrl
  );
});


var cpUpload = upload.fields([
  { name: "default_upload", maxCount: 1 },
  { name: "template_upload", maxCount: 1 },
  { name: "front_upload", maxCount: 1 },
  { name: "back_upload", maxCount: 1 },
  { name: "left_upload", maxCount: 1 },
  { name: "right_upload", maxCount: 1 },
  { name: "video_upload", maxCount: 1 },
  { name: "promotionImage", maxCount: 1 }
]);

app.post("/upload-image", cpUpload, uploadImageController);


app.get("/get-reports-data", getReportsData);
app.get("/get-reports-object", getReportsObject);

app.post(
  "/jarvis-home-service/internal/v1/home/upload/image",
  upload.single("file"),
  function(req, res, next) {
    const filePath = req.file.path;
    cmsImageUpload(req, res, fs.createReadStream(path.normalize(filePath)));
  }
);

app.use(fileupload());
app.post("/api/upload-file", bodyParser.json({ limit: "5mb" }), cmsJsonUpload);

app.post("/api/upload-file-exl", cmsExcelUpload);
