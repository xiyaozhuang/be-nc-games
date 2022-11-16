const {
  selectReviews,
  selectReviewById,
  selectCommentsByReviewId,
  insertComment,
} = require("../models/reviews.models");

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  selectReviewById(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review: review });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  selectCommentsByReviewId(req.params.review_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  insertComment(req.body, req.params.review_id)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
};
