const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const { handleInvalidEndpoint } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use(handleInvalidEndpoint);

module.exports = app;
