const app = (module.exports = require("express")());
const port = 8080;

app.use("/api", require("./api"));

app.listen(port, () =>
  console.log(`Turrone Server listening on port ${port}!`)
);
