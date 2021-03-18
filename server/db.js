var mysql = require("mysql");
import { env } from "../config";

export const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  port: 3306,
  user: "root",
  password: ""
});

export const poolRoles = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  port: 3306,
  user: "root",
  password: ""
});