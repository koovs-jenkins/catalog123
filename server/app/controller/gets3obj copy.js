import logger from "../../../utils/logger";
import {  reportconfig } from "../../../config";

const AWS = require("aws-sdk");
const prods3 = new AWS.S3({
  accessKeyId: reportconfig.accessKeyId,
  secretAccessKey: reportconfig.secretAccessKey
});

console.log("reportconfig",reportconfig)
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
    prods3.getObject(getParams, function(err, data) {
      // Handle any error and exit
      if (err){
        res.status(202).send(err);
        logger.info("s3 error" + JSON.stringify(err));
        return err;
      }
    res.status(200).send(res);
  });
};
