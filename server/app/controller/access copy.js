import { pool } from "../../db";
const request = require("request");
import { authApiBaseUrl, env} from "../../../config";
import { all_roles } from "../../roles";
import logger from "../../../utils/logger";


/* This function Creates an Object of all the roles and there routes based on given permission */
function ComputeRoles(result, permission,module_roles){
  var data = {};
  var permitted_url = [];
  var available_roles = result;
  for(var i=0; i <= module_roles.length-1 ; i++){
    if (available_roles.includes(module_roles[i])){
      if(module_roles[i] == "superadmin"){
        data = permission
      }
      else{
        let call_origin = module_roles[i].split("admin")[0].toLowerCase();
        if(permission[(call_origin == "catalogue" ?  "cat" : call_origin)] && permission[(call_origin == "catalogue" ?  "cat" : call_origin)].length > 0){
          permission[(call_origin == "catalogue" ?  "cat" : call_origin)].map(function(i) {
            permitted_url.push(i.url);
            return i;
          });
          data[(call_origin == "catalogue" ?  "cat" : call_origin)] = permission[(call_origin == "catalogue" ?  "cat" : call_origin)];
        }
      }
    }
  }

  var sub_module_permissions = {};
  available_roles.map(function(i) {
    if (permission.hasOwnProperty((i.split("_")[0] != "tag" ? i.split("_")[0] : "tagging"))) {
      permission[(i.split("_")[0] != "tag" ? i.split("_")[0] : "tagging")].map(function(j) {
        if (i == j.permission_name) {
          permitted_url.push(j.url);
          sub_module_permissions = (j);
        }
      });
      if (!data.hasOwnProperty("" + (i.split("_")[0] != "tag" ? i.split("_")[0] : "tagging"))) {
        data["" + (i.split("_")[0] != "tag" ? i.split("_")[0] : "tagging")] = [];
      }
      data["" + (i.split("_")[0] != "tag" ? i.split("_")[0] : "tagging")].push(sub_module_permissions);
    }
  });

  function uniqueArray(a){ return [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))}
    var unique_data = {}
    Object.keys(data).map(function(i){
        unique_data[i] = uniqueArray(data[i])
    })
  return ({unique_data, available_roles, permitted_url})
}


/* This function checks whether the route has permission to be opened. */
function RoleResponse(given_roles,headers,module_roles){
  var is_request_valid = false;
  for(var i=0; i <= module_roles.length-1 ; i++){
    let call_origin = module_roles[i].split("admin")[0].toLowerCase();
    if(call_origin == "customer"){
       call_origin = "call_center"
    }
    if(call_origin == "vm"){
       call_origin = "virtual-merchandise"
    }
    if (given_roles.includes(module_roles[i]) && headers["api-call-from"].includes(call_origin)){
      is_request_valid =  true;
      break;
    }
  }
  return is_request_valid
}

export const asssignedAccess = (req, res,next) => {
  const module_roles = ["superadmin","cmsadmin","headermenuadmin","catalogueadmin","taggingadmin","orderadmin","customeradmin","priceadmin","promoadmin","asnadmin","vmadmin","sapadmin","sizemapadmin","roleadmin","auditlogsadmin","navsyncadmin"];
  var permission = Object.assign({}, all_roles);
  if ( req.headers["x-api-client"] && req.headers["x-auth-token"] && req.headers["x-user"]  && req.headers["x-user"] != undefined ) {
    pool.getConnection(function(err, connection) {
      if (err) {
        logger.error("Error in Making Database Connection", err);
        throw err;
      }
      var query = "SELECT role_name FROM wms1.roles WHERE is_active=1 and entityid_ref=" + req.headers["x-user"];
      if(env == "local"){
        query = "SELECT role_name FROM role.roles WHERE is_active=1 and entityid_ref=" + 1 ;
      }
      logger.info(`Assigned Roles Started : ${req.headers["x-user"]}`);
      connection.query(query,
        function(err, result, fields) {
          if (err){
            logger.error(`Assigned Roles Error : ${err}`);
            throw err;
          }
          var roles = [];
          var results = result;
          if(results && results.length > 0){
            results.map((obj) => roles.push(obj.role_name))
          }
          if(roles.length > 0){
            logger.info(`Assigned Roles Executed : ${roles.join(",")}`);
            var final_data = ComputeRoles(roles,permission,module_roles).unique_data
            var available_roles = ComputeRoles(roles,permission,module_roles).available_roles
            connection.release();
            if(RoleResponse(available_roles,req.headers,module_roles)){
              logger.info(`Assigned Roles Response Send : ${req.headers["x-user"]}`);
              res.status(200).send(final_data)
            }
            else if (req.headers["api-call-from"] || req.headers["api-call-from"] == "/" ||req.headers["api-call-from"] == "/not-authorized" ||req.headers["api-call-from"] == "/change_password"){
              logger.info(`Assigned Roles Response Send : ${req.headers["x-user"]}`);
              res.status(200).send(final_data);
            }
            else{
              var errorobj = {
                statusCode: "404",
                message: "You are not authorized to view this page. Please contact admin."
              };
              res.status(200).send(errorobj);
            }
          }
          else{
            res.status(200).send({});
          }
        }
      );
    });
  } 
  else {
    var errorobj = {
      statusCode: "403",
      message: "Not able to validate your credentials."
    };
    res.status(200).send(errorobj);
  }
};
