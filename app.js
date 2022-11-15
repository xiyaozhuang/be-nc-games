const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviews,
  getReviewById,
} = require("./controllers/reviews.controllers");
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

app.use(handleInvalidEndpoint);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
