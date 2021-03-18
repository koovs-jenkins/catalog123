import { pool, poolRoles } from "../../db";
const request = require("request");
import { authApiBaseUrl, baseUrl, env } from "../../../config";
import { all_roles } from "../../roles";
import { getCookie } from "../../../src/helpers/cookies";

export const cmsRoleHandler = (req, res) => {
  var data = {};
  var permitted_url = [];
  var sub_module_permission = [];
  var permission = Object.assign({}, all_roles);
  const headers = {
    ["Content-Type"]: "application/json",
    ["x-api-client"]: "web",
    ["x-auth-token"]: req.headers["cookie"]
      ? getCookie("_koovs_token", req.headers["cookie"])
      : ""
  };
  request(
    {
      url: `${authApiBaseUrl}/koovs-auth-service/v1/auth/validate-token`,
      method: "GET",
      headers: headers,
      json: true
    },
    function(err, response, body) {
      if (response.statusCode == 200 || response.statusCode == "304") {
        if (env == "local") {
          poolRoles.getConnection(function(err, connection) {
            if (err) {
              throw err;
            }
            connection.query(
              "SELECT GROUP_CONCAT(role_name) as role_name FROM role.roles WHERE is_active =1 and entityid_ref = " +
                1,
              function(err, result, fields) {
                if (err) throw err;
                var available_roles = result[0]
                  ? result[0].role_name
                    ? result[0].role_name.split(",")
                    : []
                  : [];
                if (available_roles.includes("superadmin")) {
                  data = permission;
                }
                if (available_roles.includes("cmsadmin")) {
                  permission.cms.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["cms"] = permission.cms;
                }
                if (available_roles.includes("headermenu")) {
                  permission.headermenu.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["headermenu"] = permission.headermenu;
                }
                if (available_roles.includes("catalogueadmin")) {
                  permission.cat.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["cat"] = permission.cat;
                }
                if (available_roles.includes("taggingadmin")) {
                  permission.tagging.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["tagging"] = permission.tagging;
                }
                if (available_roles.includes("orderadmin")) {
                  permission.order.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["order"] = permission.order;
                }
                if (available_roles.includes("customeradmin")) {
                  permission.customer.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["customer"] = permission.customer;
                }
                if (available_roles.includes("priceadmin")) {
                  permission.price.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["price"] = permission.price;
                }
                if (available_roles.includes("promoadmin")) {
                  permission.promo.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["promo"] = permission.promo;
                }
                if (available_roles.includes("asnadmin")) {
                  permission.asn.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["asn"] = permission.asn;
                }
                if (available_roles.includes("vmadmin")) {
                  permission.vm.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["vm"] = permission.vm;
                }
                // if (available_roles.includes("sapadmin")) {
                //   permission.sap.map(function(i) {
                //     permitted_url.push(i.url);
                //     return i;
                //   });
                //   data["sap"] = permission.sap;
                // }
                if (available_roles.includes("sizemapadmin")) {
                  permission.sizemap.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["sizemap"] = permission.sizemap;
                }

                available_roles.map(function(i, index) {
                  if (permission.hasOwnProperty(i.split("_")[0])) {
                    permission[i.split("_")[0]].map(function(j, jindex) {
                      if (i == j.permission_name) {
                        permitted_url.push(j.url);
                        sub_module_permission.push(j);
                      }
                    });
                    if (!data.hasOwnProperty("" + i.split("_")[0])) {
                      data["" + i.split("_")[0]] = sub_module_permission;
                    }
                  }
                });
                connection.release();
                if (
                  available_roles.includes("superadmin") ||
                  available_roles.includes("cmsadmin")
                ) {
                  res.status(200).send(`<html data-ng-app="app">
                    <head>
                      <base href="/">
                      <link rel="stylesheet" type="text/css" href="app/app.min.css">
                      <title>KOOVS.COM</title>
                      <script type="text/javascript">
                        var user = { name: "${
                          response.body.data.name
                        }", email: "${response.body.data.email}" };
                        var base_url = "${baseUrl}/";
                      </script>
                    </head>
                  
                    <body>
                      <section>
                        <div class="fixedHeader">
                          <h4><a href="/">KOOVS.COM</a></h4>
                        </div>
                      </section>
                      <div ui-view>
                      </div>
                      <script type="text/javascript" src= "app/app.min.js"></script>
                      <script type="text/javascript" src= "app/constant/constant.js"></script>
                    </body>
                    </html>`);
                } else {
                  res.status(200).send(`<html data-ng-app="app">
                    <head>
                      <base href="/">
                    </head>
                    <body>
                    <div style="text-align:center; font-size :20px;">
                        <p>You are not authorized to view this page. Please contact admin.</p>
                        <a onclick="delete localStorage['modules'];"   href="/">Click here to go to Dashboard.</a>
                    </div>
                    </body>
                    </html>`);
                }
              }
            );
          });
        } else {
          pool.getConnection(function(err, connection) {
            if (err) {
              throw err;
            }
            connection.query(
              "SELECT role_name FROM wms1.roles WHERE is_active =1 and entityid_ref = " +
                response.body.data.id,
              function(err, result, fields) {
                if (err) throw err;
                var available_roles = [];
                if(result && result.length > 0){
                  result.map((obj) => available_roles.push(obj.role_name)  )
                }
                if (available_roles.includes("superadmin")) {
                  data = permission;
                }
                if (available_roles.includes("cmsadmin")) {
                  permission.cms.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["cms"] = permission.cms;
                }
                if (available_roles.includes("headermenu")) {
                  permission.headermenu.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["headermenu"] = permission.headermenu;
                }
                if (available_roles.includes("catalogueadmin")) {
                  permission.cat.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["cat"] = permission.cat;
                }
                if (available_roles.includes("taggingadmin")) {
                  permission.tagging.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["tagging"] = permission.tagging;
                }
                if (available_roles.includes("orderadmin")) {
                  permission.order.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["order"] = permission.order;
                }
                if (available_roles.includes("customeradmin")) {
                  permission.customer.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["customer"] = permission.customer;
                }
                if (available_roles.includes("priceadmin")) {
                  permission.price.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["price"] = permission.price;
                }
                if (available_roles.includes("promoadmin")) {
                  permission.promo.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["promo"] = permission.promo;
                }
                if (available_roles.includes("asnadmin")) {
                  permission.asn.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["asn"] = permission.asn;
                }
                if (available_roles.includes("vmadmin")) {
                  permission.vm.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["vm"] = permission.vm;
                }
                // if (available_roles.includes("sapadmin")) {
                //   permission.sap.map(function(i) {
                //     permitted_url.push(i.url);
                //     return i;
                //   });
                //   data["sap"] = permission.sap;
                // }
                if (available_roles.includes("sizemapadmin")) {
                  permission.sizemap.map(function(i) {
                    permitted_url.push(i.url);
                    return i;
                  });
                  data["sizemap"] = permission.sizemap;
                }
                available_roles.map(function(i, index) {
                  if (permission.hasOwnProperty(i.split("_")[0])) {
                    permission[i.split("_")[0]].map(function(j, jindex) {
                      if (i == j.permission_name) {
                        permitted_url.push(j.url);
                        sub_module_permission.push(j);
                      }
                    });
                    if (!data.hasOwnProperty("" + i.split("_")[0])) {
                      data["" + i.split("_")[0]] = sub_module_permission;
                    }
                  }
                });

                connection.release();
                if (
                  available_roles.includes("superadmin") ||
                  available_roles.includes("cmsadmin")
                ) {
                  res.status(200).send(`<html data-ng-app="app">
                    <head>
                      <base href="/">
                      <link rel="stylesheet" type="text/css" href="app/app.min.css">
                      <title>KOOVS.COM</title>
                      <script type="text/javascript">
                        var user = { name: "${
                          response.body.data.name
                        }", email: "${response.body.data.email}" };
                        var base_url = "${baseUrl}/";
                      </script>
                    </head>
                  
                    <body>
                      <section>
                        <div class="fixedHeader">
                          <h4><a href="/">KOOVS.COM</a></h4>
                        </div>
                      </section>
                      <div ui-view>
                      </div>
                      <script type="text/javascript" src= "app/app.min.js"></script>
                      <script type="text/javascript" src= "app/constant/constant.js"></script>
                    </body>
                    </html>`);
                } else {
                  res.status(200).send(`<html data-ng-app="app">
                    <head>
                      <base href="/">
                    </head>
                    <body>
                    <div style="text-align:center; font-size :20px;">
                        <p>You are not authorized to view this page. Please contact admin.</p>
                        <a onclick="delete localStorage['modules'];"   href="/">Click here to go to Dashboard.</a>
                    </div>
                    </body>
                    </html>`);
                }
              }
            );
          });
        }
      } else {
        res.status(200).send(`<html data-ng-app="app">
          <head>
            <base href="/">
          </head>
          <body>
          <div style="text-align:center; font-size :20px;">
              <p>You are not authorized to view this page. Please contact admin.</p>
              <a onclick="delete localStorage['modules'];"   href="/">Click here to go to Dashboard.</a>
          </div>
          </body>
          </html>`);
      }
    }
  );
};
