const app = (module.exports = require("express")());
const express = require("express");
const path = require("path");

// The root namespace for Turrone Server
app.use("/turrone", require("./turrone"));

// If the root of the API is browsed to directly, show the API endpoint documentation
app.use("/", express.static(path.join(__dirname, "/../../doc/api")));

// Any unknown API routes should respond with a 404 error
app.all("*", (req, res) => {
  res
    .status(404)
    .json({ message: "Unknown route. Please check the URI and try again." });
});