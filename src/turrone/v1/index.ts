import express from "express";
/** Creates an Express instance */
const app = express();

export = app;

// The server API endpoints for Turrone Server
app.use("/server", require("./server"));
