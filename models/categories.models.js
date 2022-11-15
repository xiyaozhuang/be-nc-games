const db = require("../db/connection");

exports.selectCategories = () => {
  let queryStr = `
    SELECT *
    FROM categories
  `;

  return db.query(queryStr).then((result) => result.rows);
};
