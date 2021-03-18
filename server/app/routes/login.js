const app = (module.exports = require("express")());
import { handleAuthCalls } from "../helpers/auth";
import { handleLogin } from "../controller/login";


app.use("/koovs-auth-service/v1/auth/login", handleLogin);
app.use(
  [
    "/koovs-auth-service/v1/auth/logout",
    "/koovs-auth-service/v1/auth/validate-token",
    "/koovs-auth-service/v1/auth/update-password",
  ],
  function(req, res) {
    handleAuthCalls(req, res);
  }
);


