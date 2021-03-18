import AWS from "aws-sdk";
import { S3 } from "aws-sdk";
import { config } from "../../config";
const uuidv1 = require("uuid/v1");

export const awsrequest = file =>
  new Promise((resolve, reject) => {
    AWS.config.update({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region
    });

    var s3 = new S3();
    var params = {
      Bucket: config.bucketName,
      Key: uuidv1() + file.name,
      Body: file
    };
    s3.upload(params, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
