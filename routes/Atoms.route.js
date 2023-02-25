const express = require("express"),
  fa = express.Router(),
  en = express.Router();

//--------------------------------------------------------> Export

//fa / export -- All
fa.get("/export", (req, res) => {
  res.json({
    lang: "fa",
    method: "GET",
    action: "Export all of the Atoms",
  });
});

//en / export -- All
en.get("/export", (req, res) => {
  res.json({
    lang: "en",
    method: "GET",
    action: "Export all of the Atoms",
  });
});

//fa / export -- Single
fa.get("/export/:id", (req, res) => {
  res.json({
    lang: "fa",
    method: "GET",
    action: "Export a single Atom",
    params: req.params,
  });
});

//en / export -- Single
en.get("/export/:id", (req, res) => {
  res.json({
    lang: "en",
    method: "GET",
    action: "Export a single Atom",
    params: req.params,
  });
});

//--------------------------------------------------------> Get

//fa / Get -- All
fa.get("/", (req, res) => {
  res.json({
    lang: "fa",
    method: "GET",
    action: "Get all of the Atoms",
  });
});

//en / Get -- All
en.get("/", (req, res) => {
  res.json({
    lang: "en",
    method: "GET",
    action: "Get all of the Atoms",
  });
});

//fa / GET -- Single
fa.get("/:id", (req, res) => {
  res.json({
    lang: "fa",
    method: "GET",
    action: "GET a single Atom",
    params: req.params,
  });
});

//en / GET -- Single
en.get("/:id", (req, res) => {
  res.json({
    lang: "en",
    method: "GET",
    action: "GET a single Atom",
    params: req.params,
  });
});

module.exports = {
  fa,
  en,
};
