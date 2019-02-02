const app = (module.exports = require("express")());

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});
