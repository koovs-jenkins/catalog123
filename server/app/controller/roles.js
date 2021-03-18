import { pool, poolRoles } from "../../db";
import { env } from "../../../config";
import logger from "../../../utils/logger";

export const getRoleList = (req, res) => {
  var data = {};
  data.body = req.body;
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query("SELECT * FROM role.roles_master", function(
        err,
        result,
        fields
      ) {
        if (err) throw err;
        data.response = result;
        data.errorExists = false;
        data.totalElement = result.length;
        data.totalPage = Math.floor(result.length / 10);
        if (result.length % 10 > 0) data.totalPage++;
        connection.release();
        res.status("200").send(data);
      });
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query("SELECT * FROM data.roles_master", function(
        err,
        result,
        fields
      ) {
        if (err) throw err;
        data.response = result;
        data.errorExists = false;
        data.totalElement = result.length;
        data.totalPage = Math.floor(result.length / 10);
        if (result.length % 10 > 0) data.totalPage++;
        connection.release();
        res.status("200").send(data);
      });
    });
  }
};

export const getRole = (req, res) => {
  let id = req.query.id;
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `SELECT * FROM role.roles_master where id=?`,
        [id],
        function(err, result, fields) {
          if (err) throw err;
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `SELECT * FROM data.roles_master where id=?`,
        [id],
        function(err, result, fields) {
          if (err) throw err;
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  }
};

export const createRole = (req, res) => {
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `INSERT INTO role.roles_master (name, descrition, datecreated, dateupdated, is_active, notification_email_list) VALUES (?,?,?,?,?,?)`,
        [
          req.body.name,
          req.body.descrition,
          req.body.datecreated,
          req.body.dateupdated,
          req.body.is_active,
          req.body.notification_email_list
        ],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `SELECT * FROM data.roles_master where name=?`,
        [req.body.name],
        function(err, result, fields) {
          if (err) {
            throw err;
          }
          let already_added_role = false;
          logger.info(result);
          if (result.length > 0) {
            already_added_role = true;
          }
          logger.info(typeof result);
          if (!already_added_role) {
            connection.query(
              `INSERT INTO data.roles_master (name, descrition, datecreated, dateupdated, is_active, notification_email_list) VALUES (?,?,?,?,?,?)`,
              [
                req.body.name,
                req.body.descrition,
                req.body.datecreated,
                req.body.dateupdated,
                req.body.is_active,
                req.body.notification_email_list
              ],
              function(err, result, fields) {
                if (err) {
                  throw err;
                }
                let data = {};
                data.errorExists = false;
                connection.release();
                res.status("200").send(data);
              }
            );
          } else {
            let error_data = {};
            error_data.errorExists = true;
            error_data.message = "This role has already been created.";
            connection.release();
            res.status("200").send(error_data);
          }
        }
      );
    });
  }
};

export const updateRole = (req, res) => {
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `UPDATE role.roles_master SET name = ?, descrition=?, dateupdated = ?,is_active=? WHERE id = ?`,
        [
          req.body.name,
          req.body.descrition,
          req.body.dateupdated,
          req.body.is_active,
          req.body.id
        ],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `UPDATE data.roles_master SET name = ?, descrition=?, dateupdated = ?,is_active= ? WHERE id = ?`,
        [
          req.body.name,
          req.body.descrition,
          req.body.dateupdated,
          req.body.is_active,
          req.body.id
        ],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  }
};

export const getUsers = (req, res) => {
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        "Select id,username,email  from lookup.lookup Where email like ?",
        req.query.text.trim(),
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        "Select id,username,email  from lookup.lookup Where email like ?",
        req.query.text.trim(),
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  }
};

export const getAllRoles = (req, res) => {
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `SELECT id,name from role.roles_master WHERE is_active=1 `,
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `SELECT id,name from data.roles_master WHERE is_active=1 `,
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  }
};


export const getAllTenants = (req, res) => {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      var query =  `SELECT * from wms1.tenants WHERE status=1 `;
      connection.query(query, function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
};

export const userAssignedRoles = (req, res) => {
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `SELECT roleid_ref from role.roles WHERE entityid_ref = ? AND is_active=1`,
        [req.query.id],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `SELECT roleid_ref,tenantid from wms1.roles WHERE entityid_ref = ? AND is_active=1`,
        [req.query.id],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  }
};

export const getUserInfo = (req, res) => {
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `SELECT * from role.lookup WHERE id = ?`,
        [req.query.id],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `SELECT * from lookup.lookup WHERE id = ?`,
        [req.query.id],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.response = result;
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  }
};

export const updateStatus = (req, res) => {
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `UPDATE role.roles_master SET is_active = ? WHERE id = ?`,
        [req.body.is_active, req.body.id],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `UPDATE data.roles_master SET is_active = ? WHERE id = ?`,
        [req.body.is_active, req.body.id],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  }
};

export const assignNewRole = (req, res) => {
  let count = 0;
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `INSERT INTO role.roles (entityid_ref, roleid_ref, role_name, value, is_active, datecreated, dateupdated) VALUES (?,?,?,?,?,?,?)`,
        [
          req.body.userId,
          req.body.id,
          req.body.name,
          req.body.name,
          req.body.is_active,
          req.body.datecreated,
          req.body.dateupdated
        ],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `SELECT * from wms1.roles WHERE entityid_ref = ? AND roleid_ref = ?`,
        [req.body.userId, req.body.id],
        function(err, result, fields) {
          if (err) {
            throw err;
          }
          let already_added = false;
          logger.info(result);
          if (result.length > 0) {
            already_added = true;
          }
          logger.info(typeof result);
          if (!already_added) {
            connection.query(
              `INSERT INTO wms1.roles (entityid_ref, roleid_ref, role_name, value, is_active, datecreated, dateupdated , tenantid) VALUES (?,?,?,?,?,?,?,?)`,
              [
                req.body.userId,
                req.body.id,
                req.body.name,
                req.body.name,
                req.body.is_active,
                req.body.datecreated,
                req.body.dateupdated,
                req.body.tenants
              ],
              function(err, result, fields) {
                if (err) {
                  throw err;
                }
                connection.query(
                  `UPDATE wms1.roles SET tenantid = ? WHERE entityid_ref = ?`,
                  [req.body.tenants ,req.body.userId],
                  function(err, result, fields) {
                    if (err) {
                      throw err;
                    }
                    let data = {};
                    data.errorExists = false;
                    connection.release();
                    res.status("200").send(data);
                  }
                )
              }
            );
          } else {
            connection.query(
              `UPDATE wms1.roles SET is_active=1 tenantid = ? WHERE entityid_ref = ? AND roleid_ref = ?`,
              [req.body.tenants ,req.body.userId, req.body.id],
              function(err, result, fields) {
                if (err) {
                  throw err;
                }
                let data = {};
                data.errorExists = false;
                connection.release();
                res.status("200").send(data);
              }
            );
          }
        }
      );
    });
  }
};

export const removeRole = (req, res) => {
  let count = 0;
  if (env == "local") {
    poolRoles.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `UPDATE wms1.roles SET is_active=0 WHERE entityid_ref = ? AND roleid_ref = ?`,
        [req.body.userId, req.body.id],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  } else {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `UPDATE wms1.roles SET is_active=0 WHERE entityid_ref = ? AND roleid_ref = ?`,
        [req.body.userId, req.body.id],
        function(err, result, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          let data = {};
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
  }
};

export const updatetenant = (req, res) => {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(
        `UPDATE wms1.roles SET tenantid = ? WHERE entityid_ref = ?`,
        [req.body.tenants ,req.body.userId],
        function(err, result, fields) {
          if (err) {
            throw err;
          }
          let data = {};
          data.errorExists = false;
          connection.release();
          res.status("200").send(data);
        }
      );
    });
};
