import express from "express";
const app = express();

export = app;

// The server API endpoints for Turrone Server
app.use("/server", require("./server"));
