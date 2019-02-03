const app = (module.exports = require("express")());

/**
 * @api {get} /api/turrone/v1/server/ping Check server is running
 * @apiName GetPing
 * @apiGroup Server
 * @apiVersion 0.1.0
 *
 * @apiDescription Before attempting to connect to any API endpoint of Turrone Server,
 * it's best to make sure that the server is at least running.
 *
 * This simple ping test will make sure of that.
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:8080/api/turrone/v1/server/ping
 *
 * @apiSuccess {String}  message       The "pong" to your "ping"
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "pong"
 *     }
 */
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});
