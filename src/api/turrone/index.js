const app = (module.exports = require("express")());

// The version 1 namespace for Turrone Server
app.use("/v1", require("./v1"));
