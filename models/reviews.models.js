const db = require("../db/connection");

exports.selectReviews = () => {
  let queryStr = `
    SELECT
      owner,
      title,
      reviews.review_id,
      category,
      review_img_url,
      reviews.created_at,
      reviews.votes,
      designer, 
      COUNT(comment_id) AS comment_count
    FROM reviews LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
  `;

  return db.query(queryStr).then((result) => result.rows);
};

exports.selectReviewById = (review_id) => {
  let queryStr = `
    SELECT *
    FROM reviews
    WHERE review_id = $1;
  `;

  return db.query(queryStr, [review_id]).then((result) => {
    if (!result.rows[0]) {
      return Promise.reject({
        status: 404,
        msg: "review does not exist",
      });
    }
    return result.rows[0];
  });
};

exports.selectCommentsByReviewId = (review_id) => {
  let queryStr = `
    SELECT *
    FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;
  `;

  return db.query(queryStr, [review_id]).then((result) => {
    if (!result.rows[0]) {
      return Promise.reject({
        status: 404,
        msg: "review does not exist",
      });
    }
    return result.rows;
  });
};

exports.insertComment = ({ username, body }, review_id) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }

  let queryStr = `
    INSERT INTO comments (body, author, review_id) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;

  return db.query(queryStr, [body, username, review_id]).then((result) => {
    return result.rows[0];
  });
};
