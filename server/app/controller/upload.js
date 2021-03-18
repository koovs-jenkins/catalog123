import logger from "../../../utils/logger";
import { config } from "../../../config";
const fs = require("fs");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});
const uuidv1 = require("uuid/v1");

export const uploadImageController = (req, res) => {
  var data = "";
  var filename = "";
  var contentType = "";
  // console.log(req)

  if (req.files) {
    // console.log(req.files)
    if (req.files.default_upload) {
      data = req.files.default_upload[0].path;
      filename = uuidv1() + req.files.default_upload[0].filename;
      contentType = "image/jpg";
    }
    if (req.files.front_upload) {
      data = req.files.front_upload[0].path;
      filename = uuidv1() + req.files.front_upload[0].filename;
      contentType = "image/jpg";
    }
    if (req.files.back_upload) {
      data = req.files.back_upload[0].path;
      filename = uuidv1() + req.files.back_upload[0].filename;
      contentType = "image/jpg";
    }
    if (req.files.left_upload) {
      data = req.files.left_upload[0].path;
      filename = uuidv1() + req.files.left_upload[0].filename;
      contentType = "image/jpg";
    }
    if (req.files.right_upload) {
      data = req.files.right_upload[0].path;
      filename = uuidv1() + req.files.right_upload[0].filename;
      contentType = "image/jpg";
    }
    if (req.files.video_upload) {
      data = req.files.video_upload[0].path;
      filename = uuidv1() + req.files.video_upload[0].filename;
      contentType = "video/mp4";
    }
    if (req.files.template_upload) {
      data = req.files.template_upload[0].path;
      var date = new Date();
      filename =
        "size_guide_" +
        date.getTime() +
        "_" +
        req.files.template_upload[0].filename
          .trim()
          .split(" ")
          .join("_");
      contentType = "image/jpg";
    }
    if (req.files.promotionImage) {
      data = req.files.promotionImage[0].path;
      filename = req.files.promotionImage[0].filename;
      contentType = "image/png";
    }
  }

  fs.readFile(data, (err, data) => {
    if (err) throw err;
    var params = {};
    params = {
      Bucket: config.bucketName,
      Key: filename,
      Body: data,
      ContentType: contentType,
      ACL: "public-read"
    };
    if (req.files.template_upload) {
      params.Bucket = config.sizeMapBucketName;
    }
    if (req.files.video_upload) {
      params.Bucket = config.videoBucketName;
    }
    s3.upload(params, function(s3Err, data) {
      if (s3Err) {
        console.log(s3Err);
        logger.info("s3 error" + JSON.stringify(s3Err));
      }
      console.log(data);
      res.status(200).send(data);
    });
  });
};
