import express from "express";
import path from "path";
const app = express();
const port: string | number = process.env.port || 8080;

export = app;

// The root namespace for Turrone Server
app.use("/turrone", require("./turrone"));

// If the root of the API is browsed to directly, show the API endpoint documentation
app.use("/", express.static(path.join(__dirname, "/../doc/api")));

// Any unknown API routes should respond with a 404 error
app.all("*", (req: express.Request, res: express.Response): void => {
  res
    .status(404)
    .json({ message: "Unknown route. Please check the URI and try again." });
});

app.listen(port, (): void =>
  console.log(`Turrone Server REST API listening on port ${port}!`)
);
