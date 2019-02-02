const app = (module.exports = require("express")());

// The root namespace for Turrone Server
app.use("/turrone", require("./turrone"));

// Any unknown API routes should respond with a 404 error
app.all("*", (req, res) => {
  res
    .status(404)
    .json({ message: "Unknown route. Please check the URI and try again." });
});
