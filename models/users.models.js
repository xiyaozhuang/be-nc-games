const db = require("../db/connection");

exports.selectUsers = () => {
  let queryStr = `
    SELECT *
    FROM users;
  `;

  return db.query(queryStr).then((result) => result.rows);
};
