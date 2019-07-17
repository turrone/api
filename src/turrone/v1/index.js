const app = (module.exports = require("express")());

// The server API endpoints for Turrone Server
app.use("/server", require("./server"));
