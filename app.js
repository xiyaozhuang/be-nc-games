const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
