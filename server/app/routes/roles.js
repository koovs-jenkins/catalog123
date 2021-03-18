const app = (module.exports = require("express")());
import {
  getRoleList,
  getRole,
  createRole,
  updateRole,
  getUsers,
  getAllRoles,
  userAssignedRoles,
  getUserInfo,
  updateStatus,
  assignNewRole,
  removeRole,
  getAllTenants,
  updatetenant
} from "../controller/roles";

app.use("/getRoleList", getRoleList);

app.use("/getRole", getRole);

app.post("/createRole", createRole);

app.put("/updateRole", updateRole);

app.use("/getUsers", getUsers);

app.use("/getAllRoles", getAllRoles);

app.use("/tenants", getAllTenants);

app.use("/updatetenant", updatetenant);

app.use("/userAssignedRoles", userAssignedRoles);

app.use("/getUserInfo", getUserInfo);

app.put("/updateStatus", updateStatus);

app.post("/assignNewRole", assignNewRole);

app.post("/removeRole", removeRole);
