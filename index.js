const app = (module.exports = require("./dist/api.js"));
const port = process.env.port || 8080;

// The API is being run as a standalone server, and not included as a module
// in Turrone Server, so start it listening
if (require.main === module) {
  app.listen(port, () =>
    console.log(`Turrone Server REST API listening on port ${port}!`)
  );
}
