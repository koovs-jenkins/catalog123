import logger from "../utils/logger";


export const assignedAccess = (available_roles) => {
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
      if (available_roles.includes("sizemapadmin")) {
        permission.sizemap.map(function(i) {
          permitted_url.push(i.url);
          return i;
        });
        data["sizemap"] = permission.sizemap;
      }

  var sub_module_permissions = {};
  available_roles.map(function(i, index) {
    if (permission.hasOwnProperty(i.split("_")[0])) {
      permission[i.split("_")[0]].map(function(j, jindex) {
        if (i == j.permission_name) {
          permitted_url.push(j.url);
          sub_module_permissions = j;
        }
      });
      if (!data.hasOwnProperty("" + i.split("_")[0])) {
        data["" + i.split("_")[0]] = [];
      }
      if (Object.keys(sub_module_permissions).length != 0) {
        data["" + i.split("_")[0]].push(sub_module_permissions);
      }
      sub_module_permissions = {};
    }
  });
};
