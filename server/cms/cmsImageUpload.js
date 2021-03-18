var request = require('request');
const config = require("../../config/config.js");

module.exports = function cmsImageUpload(req, res, file) {
  const headers = {
    ["Content-Type"]: "multipart/form-data"
  };
  request(
    {
      url: config.base_url + req.originalUrl,
      method: req.method,
      headers: headers,
      formData: { file },
      json: true
    },
    function(error, response, body) {
      res.status(response.statusCode).send(body);
    }
  );
}
