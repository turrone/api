const app = (module.exports = require("express")());
const port = 80;
const routes = require("./routes");

app.use(routes);

app.listen(port, () =>
  console.log(`Turrone Server listening on port ${port}!`)
);
