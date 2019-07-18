import express from "express";
/** Creates an Express instance */
const app = express();

export = app;

// The version 1 namespace for Turrone Server
app.use("/v1", require("./v1"));
