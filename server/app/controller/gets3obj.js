import logger from "../../../utils/logger";
import {  reportconfig } from "../../../config";
const AWS = require("aws-sdk");
const prods3 = new AWS.S3({
  accessKeyId: reportconfig.accessKeyId,
  secretAccessKey: reportconfig.secretAccessKey
});
var stream = require('stream');

export const getReportsData = (req, res) => {
  var params = {
      Bucket: reportconfig.bucketName,
      Delimiter : "/"
    };
  if(req.headers["x-s3-prefix"] != "/"){
    params["Prefix"] = req.headers["x-s3-prefix"]
  }
  prods3.listObjectsV2(params, function(s3Err, data) {
    if (s3Err) {
      res.status(202).send(s3Err);
      logger.info("s3 error" + JSON.stringify(s3Err));
    }
    res.status(200).send(data);
  });
};
export const getReportsObject = (req, res) => {
  var params = {
      Bucket: reportconfig.bucketName,
      Key : req.headers["x-s3-path"]
    };
    logger.info("s3 details" + JSON.stringify(params));
    prods3.getObject(params, function(err, data) {
      // Handle any error and exit
      if (err){
        res.status(202).send(err);
        logger.info("s3 error" + JSON.stringify(err));
        return err;
      }
      var fileContents = Buffer.from(data.Body, "base64");
      var fileName = req.headers["x-s3-path"].split("/")[req.headers["x-s3-path"].split("/").length - 1]
      var readStream = new stream.PassThrough();
      readStream.end(fileContents);
      res.set('Content-disposition', 'attachment; filename=' + fileName);
      res.set('Content-Type', data.ContentType);
      readStream.pipe(res);
  });
};
