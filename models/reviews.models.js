const db = require("../db/connection");

const categoryWhitelist = {
  "euro game": "euro game",
  "social deduction": "social deduction",
  dexterity: "dexterity",
  "children's games": "children''s games",
};
const categoryWhitelistKeys = Object.keys(categoryWhitelist);
const reviewWhitelist = {
  owner: "reviews.owner",
  category: "reviews.category",
  title: "reviews.title",
  review_id: "reviews.review_id",
  category: "reviews.category",
  review_img_url: "reviews.review_img_url",
  created_at: "reviews.created_at",
  votes: "reviews.votes",
  designer: "reviews.designer",
  comment_count: "comment_count",
};
const reviewWhitelistKeys = Object.keys(reviewWhitelist);

exports.selectReviews = (query) => {
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
  `;

  if (query.category) {
    if (!categoryWhitelistKeys.includes(query.category)) {
      return Promise.reject({ status: 400, msg: "invalid category query" });
    }

    queryStr += `
      WHERE category = '${categoryWhitelist[query.category]}'
      GROUP BY reviews.review_id
    `;
  } else {
    queryStr += `GROUP BY reviews.review_id`;
  }

  if (query.sort_by) {
    if (!reviewWhitelistKeys.includes(query.sort_by)) {
      return Promise.reject({ status: 400, msg: "invalid sort query" });
    }

    if (query.order) {
      if (!["ASC", "DESC"].includes(query.order)) {
        return Promise.reject({ status: 400, msg: "invalid order query" });
      }

      queryStr += `ORDER BY ${reviewWhitelist[query.sort_by]} ${query.order};`;
    } else {
      queryStr += ` ORDER BY ${reviewWhitelist[query.sort_by]} ASC;`;
    }
  } else {
    if (query.order) {
      if (!["ASC", "DESC"].includes(query.order)) {
        return Promise.reject({ status: 400, msg: "invalid order query" });
      }

      queryStr += ` ORDER BY reviews.created_at ${query.order};`;
    } else {
      queryStr += ` ORDER BY reviews.created_at DESC;`;
    }
  }

  return db.query(queryStr).then((result) => result.rows);
};

exports.selectReviewById = (review_id) => {
  let queryStr = `
    SELECT reviews.*, COUNT(comment_id) AS comment_count
    FROM reviews LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;
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

exports.updateReviewById = ({ inc_votes }, review_id) => {
  if (!inc_votes || typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }

  let queryStr = `
    UPDATE reviews 
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;     
  `;

  return db.query(queryStr, [inc_votes, review_id]).then((result) => {
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

  return db
    .query(queryStr, [body, username, review_id])
    .then((result) => result.rows[0]);
};
