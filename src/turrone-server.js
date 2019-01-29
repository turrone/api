const app = (module.exports = require("express")());
const port = 8080;
const routes = require("./routes");

app.use(routes);

app.listen(port, () =>
  console.log(`Turrone Server listening on port ${port}!`)
);
