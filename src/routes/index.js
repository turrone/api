const app = (module.exports = require("express")());
const apiRoot = "/api/turrone/v1";

app.use(apiRoot + "/server", require("./server"));

app.all("*", (req, res) => {
  res
    .status(404)
    .json({ message: "Unknown route. Please check the URI and try again." });
});
