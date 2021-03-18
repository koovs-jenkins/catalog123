const app = (module.exports = require("express")());
import { asssignedAccess } from "../controller/access";

// Get User Roles and Permitted URL's
app.get("/assigned-access", asssignedAccess);
