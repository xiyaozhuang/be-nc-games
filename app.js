const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviews,
  getReviewById,
  patchReviewById,
  getCommentsByReviewId,
  postComment,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  handleInvalidEndpoint,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postComment);

app.get("/api/users", getUsers);

app.use(handleInvalidEndpoint);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
