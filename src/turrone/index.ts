import express from "express";
const app = express();

export = app;

// The version 1 namespace for Turrone Server
app.use("/v1", require("./v1"));
