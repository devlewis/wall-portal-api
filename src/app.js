require("dotenv").config();
const btoa = require("btoa");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const fetch = require("node-fetch");
const user = process.env.API_KEY;
const pw = process.env.PW;
const app = express();
const { CLIENT_ORIGIN } = require("./config");

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN }));

app.get("/api", (req, res) => {
  const url = process.env.URL;
  const options = {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(`${user}:${pw}`),
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((responseJson) => res.status(200).json(responseJson));
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
