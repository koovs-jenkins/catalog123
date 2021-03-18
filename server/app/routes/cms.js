const app = (module.exports = require("express")());
import { cmsRoleHandler } from "../controller/cms";

app.get("/cms*", cmsRoleHandler);
