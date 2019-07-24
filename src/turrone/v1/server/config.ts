import { ConfigExists } from "../../../utils/config";
import { eventEmitter, Event } from "../../../utils/events";
import express from "express";
import fs from "fs";
import Joi from "@hapi/joi";
import JSONPointer from "json-ptr";
/** Creates an Express instance */
const app = express();

export = app;

// Allowing the POSTed JSON content to be accessable in the Express instance
// See: https://stackoverflow.com/a/10007542
app.use(express.json());

/**
 * The schema for the POST HTTP verb
 *
 * The values provided here are those that are going to be saved into the config
 * file, so this schema provides validation checks.
 *
 * It should be noted that the following rules are in place:
 * * __dbConfig.port__: The minimum value for this is 1, rather than 0
 * * __dbConfig.database__: Database names cannot contain [`\/. "$*<>:|?`](https://docs.mongodb.com/manual/reference/limits/#Restrictions-on-Database-Names-for-Windows) and have to be [less that 64 characters](https://docs.mongodb.com/manual/reference/limits/#Length-of-Database-Names)
 *
 * @see [requiredSchemaPost](#requiredschemapost)
 */
const schemaPost: Joi.ObjectSchema = Joi.object().keys({
  dbConfig: {
    host: Joi.string()
      .hostname()
      .required(),
    port: Joi.number()
      .port()
      .min(1)
      .required(),
    database: Joi.string()
      .regex(/[\\/. "$*<>:|?]/, { name: "database", invert: true })
      .min(1)
      .max(63)
      .required(),
    username: Joi.string().alphanum(),
    password: Joi.string()
  }
});

/**
 * Required keys that need to be included with the POST request
 *
 * @see https://github.com/hapijs/joi/tree/master/API.md#objectrequiredkeyschildren
 * @see [schemaPost](#schemapost)
 */
const requiredSchemaPost: Joi.ObjectSchema = schemaPost.requiredKeys(
  "dbConfig"
);

/**
 * The schema for the PATCH HTTP verb
 *
 * The values that are checked here are to make sure that it is a valid document
 * structure that has been sent, according to [RFC 6902](https://tools.ietf.org/html/rfc6902),
 * rather that the values being valid for saving into the config file. Those
 * checks are still provided by the [`schemaPost`](#schemapost) schema
 *
 * @see [schemaPost](#schemapost)
 * @see [requiredSchemaPatch](#requiredschemapatch)
 */
const schemaPatch: Joi.ObjectSchema = Joi.object().keys({
  op: Joi.string()
    .valid("replace")
    .required(),
  path: Joi.string()
    .valid(
      "/dbConfig/host",
      "/dbConfig/port",
      "/dbConfig/database",
      "/dbConfig/username",
      "/dbConfig/password"
    )
    .required(),
  value: Joi.alternatives()
    .try(Joi.string().allow(""), Joi.number())
    .required()
});

/**
 * Required schema format for the PATCH HTTP verb
 *
 * The JSON PATCH request needs to be contained inside an array, and contain
 * at least one item, which this schema checks and verfies
 *
 * @see [schemaPatch](#schemapatch)
 */
const requiredSchemaPatch: Joi.ArraySchema = Joi.array()
  .items(schemaPatch)
  .min(1);

/**
 * Generates the name of and path to the config file
 *
 * @returns The relative path to the config file
 */
function generateConfigFilenamePath(): string {
  // Holds the filename for the config file `local-{NODE_ENV}.json`
  let filename = "local";
  if (typeof process.env.NODE_ENV !== "undefined") {
    filename += "-" + process.env.NODE_ENV;
  }

  // The config files are stored under `./config/`, relative to
  // the application root
  // See: https://github.com/lorenwest/node-config/wiki/Configuration-Files
  return "./config/" + filename + ".json";
}

// Updating the status API endpoint
if (!ConfigExists()) {
  eventEmitter.emit(
    Event.ServerStatusAPIError,
    "There is no configuration file created to connect to the database",
    "setup.config"
  );
} else {
  eventEmitter.emit(Event.ServerStatusAPIOperational);
}

/**
 * @api {post} /api/turrone/v1/server/config Create the server configuration
 * @apiName PostConfig
 * @apiGroup Server
 * @apiVersion 0.1.0
 * @ignore // Ignore API endpoint in developer documentation
 *
 * @apiDescription Creates the initial config file for the API to access the
 * database, along with additional settings that should not be stored in the
 * database (e.g. those that need to be available before the database has been
 * connected to, or in case of database connection errors).
 *
 * **Once an initial config file has been created, this API endpoint route cannot
 * be used again. See [PATCH](#api-Server-PatchConfig)**
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:8080/api/turrone/v1/server/config -X POST -H "Content-Type: application/json" -d '{"dbConfig": {"host": "127.0.0.1", "port": 27017, "database": "turrone"}}'
 *
 * @apiHeader {String} Content-Type=application/json Used to detect that the received data is JSON
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json"
 *     }
 *
 * @apiParam {Object} dbConfig The container for database settings
 * @apiParam (dbConfig) {String} host The hostname for the database server
 * @apiParam (dbConfig) {Number{1-65535}} port The port that the database server is listening on
 * @apiParam (dbConfig) {String{1..63}} database The database to connect to. Cannot contain [`\/. "$*<>:|?`](https://docs.mongodb.com/manual/reference/limits/#Restrictions-on-Database-Names-for-Windows)
 * @apiParam (dbConfig) {String} [username] The user account to use to connect to the database
 * @apiParam (dbConfig) {String} [password] The password for the user account
 * @apiParamExample {json} Request-Example:
 *     {
 *       "dbConfig": {
 *         "host": "127.0.0.1",
 *         "port": 27017,
 *         "database": "turrone",
 *         "username": "TurroneDatabaseUser",
 *         "password": "My5up3rS3cur3P@ssw0rd!"
 *       }
 *     }
 *
 * @apiSuccess (Success 201 - Created) {String} status   The status of the request to create the server config
 * @apiSuccess (Success 201 - Created) {String} message  The message returned from creating the server config
 * @apiSuccessExample {json} Response: Success 201 - Created
 *     HTTP/1.1 201 Created
 *     {
 *       "status": "success",
 *       "message": "Config file created successfully"
 *     }
 *
 * @apiError (Error 400 - Bad Request) {String} status          The status of the request to create the server config
 * @apiError (Error 400 - Bad Request) {String} message         The message returned from creating the server config
 * @apiError (Error 400 - Bad Request) {Object} error           The container for the error details
 * @apiError (Error 400 - Bad Request) {String} error.details   The details of the error, which need to be corrected
 * @apiError (Error 400 - Bad Request) {String} error.category  The category of the error
 * @apiError (Error 400 - Bad Request) {String} error.path      The [path](https://tools.ietf.org/html/rfc6901) to the value that has the error
 * @apiErrorExample {json} Response: Error 400 - Bad Request
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": "error",
 *       "message": "Invalid request data",
 *       "error": {
 *         "details": "\"host\" must be a valid hostname",
 *         "category": "ValidationError"
 *       }
 *     }
 *
 * @apiError (Error 409 - Conflict) {String} status   The status of the request to create the server config
 * @apiError (Error 409 - Conflict) {String} message  The message returned from attempting to create the server config
 * @apiError (Error 409 - Conflict) {String} see      The alternative API endpoint to use to update the config file. See [PATCH](#api-Server-PatchConfig)
 * @apiErrorExample {json} Response: Error 409 - Conflict
 *     HTTP/1.1 409 Conflict
 *     {
 *       "status": "error",
 *       "message": "The config file already exists",
 *       "see": "PATCH http://localhost:8080/api/turrone/v1/server/config"
 *     }
 *
 * @apiError (Error 500 - Internal Server Error) {String} status          The status of the request to create the server config
 * @apiError (Error 500 - Internal Server Error) {String} message         The message returned from attempting to create the server config
 * @apiError (Error 500 - Internal Server Error) {Object} error           The container for the error details
 * @apiError (Error 500 - Internal Server Error) {String} error.details   The details of the error, which need to be corrected
 * @apiError (Error 500 - Internal Server Error) {String} error.category  The category of the error
 * @apiError (Error 500 - Internal Server Error) {Number} error.errno     The number of the error category
 * @apiError (Error 500 - Internal Server Error) {String} error.path      The attempted path to the config file
 * @apiErrorExample {json} Response: Error 500 - Internal Server Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "status": "error",
 *       "message": "Unable to create config file",
 *       "error": {
 *         "details": "EPERM: operation not permitted, open '/path/to/config/file/local{-NODE_ENV}.json'",
 *         "category": "EPERM",
 *         "errno": -4048,
 *         "path": "/path/to/config/file/local{-NODE_ENV}.json"
 *       }
 *     }
 */
app.post("/", (req: express.Request, res: express.Response): void => {
  if (ConfigExists()) {
    // The config file can only be created once, afterwards it needs to be PATCHed
    res.status(409).json({
      status: "error",
      message: "The config file already exists",
      see: "PATCH " + req.headers.host + req.baseUrl
    });
  } else {
    const data: object = req.body;

    // Validating the request data against the schema
    requiredSchemaPost.validate(data, (err: Joi.ValidationError): void => {
      if (err) {
        // Send a 400 Bad Request error response if validation fails
        res.status(400).json({
          status: "error",
          message: "Invalid request data",
          error: {
            details: err.details[0].message,
            category: err.name,
            path: JSONPointer.encodePointer(err.details[0].path)
          }
        });
      } else {
        let path: string = generateConfigFilenamePath();

        // Attempt to save the config file
        fs.writeFile(
          path,
          JSON.stringify(data),
          (err: NodeJS.ErrnoException | null): void => {
            if (err) {
              // Send a 500 Internal Server Error response if the config
              // file cannot be created
              res.status(500).json({
                status: "error",
                message: "Unable to create config file",
                error: {
                  details: err.message,
                  category: err.code,
                  errno: err.errno,
                  path: err.path
                }
              });
            } else {
              // Send a success response if validation passes and the file has
              // successfully been created
              res.status(201).json({
                status: "success",
                message: "Config file created successfully"
              });
            }
          }
        );
      }
    });
  }
});

/**
 * @api {patch} /api/turrone/v1/server/config Update the server configuration
 * @apiName PatchConfig
 * @apiGroup Server
 * @apiVersion 0.1.0
 * @ignore // Ignore API endpoint in developer documentation
 *
 * @apiDescription Updates the config file for the API to access the database,
 * along with additional settings that should not be stored in the database (e.g.
 * those that need to be available before the database has been connected
 * to, or in case of database connection errors).
 *
 * **If an initial config file has not been created, this API endpoint route cannot
 * be used. See [POST](#api-Server-PostConfig)**
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:8080/api/turrone/v1/server/config -X PATCH -H "Content-Type: application/json-patch+json" -d '[{"op": "replace", "path": "/dbConfig/host", "value": "NewDatabaseHost"}]'
 *
 * @apiHeader {String} Content-Type=application/json-patch+json Used to detect that the received data is a JSON PATCH object
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json-patch+json"
 *     }
 *
 * @apiParam {Array} . The container for one or more PATCH operations
 * @apiParam {String} .op The operation to perform. **Currently only `replace` is supported**
 * @apiParam {String} .path A [JSON pointer](https://tools.ietf.org/html/rfc6901) to the value that is being modified
 * @apiParam {String} .value The updated value to use. The values submitted must meet the requirements that are in the [POST](#api-Server-PostConfig) parameters, otherwise the request will be rejected
 * @apiParamExample {json} Request-Example:
 *     [
 *       {
 *         "op": "replace",
 *         "path": "/dbConfig/host",
 *         "value": "NewDatabaseHost"
 *       },
 *       {
 *         "op": "replace",
 *         "path": "/dbConfig/port",
 *         "value": 27017
 *       }
 *     ]
 *
 * @apiSuccess (Success 200 - OK) {String} status   The status of the request to update the server config
 * @apiSuccess (Success 200 - OK) {String} message  The message returned from updating the server config
 * @apiSuccessExample {json} Response: Success 200 - OK
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "success",
 *       "message": "Config file updated successfully"
 *     }
 *
 * @apiError (Error 400 - Bad Request: Config exists) {String} status   The status of the request to update the server config
 * @apiError (Error 400 - Bad Request: Config exists) {String} message  The message returned from attempting to update the server config
 * @apiError (Error 400 - Bad Request: Config exists) {String} see      The alternative API endpoint to use to create the config file. See [POST](#api-Server-PostConfig)
 * @apiErrorExample {json} Response: Error 400 - Bad Request: Config exists
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": "error",
 *       "message": "The config file does not exist",
 *       "see": "POST http://localhost:8080/api/turrone/v1/server/config"
 *     }
 *
 * @apiError (Error 400 - Bad Request: Invalid PATCH data) {String} status          The status of the request to update the server config
 * @apiError (Error 400 - Bad Request: Invalid PATCH data) {String} message         The message returned from attempting to update the server config
 * @apiError (Error 400 - Bad Request: Invalid PATCH data) {Object} error           The container for the error details
 * @apiError (Error 400 - Bad Request: Invalid PATCH data) {String} error.details   The details of the error, which needs to be corrected
 * @apiError (Error 400 - Bad Request: Invalid PATCH data) {String} error.category  The category of the error
 * @apiError (Error 400 - Bad Request: Invalid PATCH data) {String} error.path      The [path](https://tools.ietf.org/html/rfc6901) to the value that has the error
 * @apiErrorExample {json} Response: Error 400 - Bad Request: Invalid PATCH data
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": "error",
 *       "message": "Invalid PATCH data",
 *       "error": {
 *         "details": "\"value\" must be a string or \"value\" must be a number",
 *         "category": "ValidationError",
 *         "path": "/dbConfig/host"
 *       }
 *     }
 *
 * @apiError (Error 400 - Bad Request: Invalid request data) {String} status          The status of the request to update the server config
 * @apiError (Error 400 - Bad Request: Invalid request data) {String} message         The message returned from attempting to update the server config
 * @apiError (Error 400 - Bad Request: Invalid request data) {Object} error           The container for the error details
 * @apiError (Error 400 - Bad Request: Invalid request data) {String} error.details   The details of the error, which needs to be corrected
 * @apiError (Error 400 - Bad Request: Invalid request data) {String} error.category  The category of the error
 * @apiError (Error 400 - Bad Request: Invalid request data) {String} error.path      The [path](https://tools.ietf.org/html/rfc6901) to the value that has the error
 * @apiErrorExample {json} Response: Error 400 - Bad Request: Invalid request data
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": "error",
 *       "message": "Invalid request data",
 *       "error": {
 *         "details": "\"host\" must be a valid hostname",
 *         "category": "ValidationError",
 *         "path": "/dbConfig/host"
 *       }
 *     }
 *
 * @apiError (Error 500 - Internal Server Error) {String} status          The status of the request to update the server config
 * @apiError (Error 500 - Internal Server Error) {String} message         The message returned from attempting to update the server config
 * @apiError (Error 500 - Internal Server Error) {Object} error           The container for the error details
 * @apiError (Error 500 - Internal Server Error) {String} error.details   The details of the error, which need to be corrected
 * @apiError (Error 500 - Internal Server Error) {String} error.category  The category of the error
 * @apiError (Error 500 - Internal Server Error) {Number} error.errno     The number of the error category
 * @apiError (Error 500 - Internal Server Error) {String} error.path      The attempted path to the config file
 * @apiErrorExample {json} Response: Error 500 - Internal Server Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "status": "error",
 *       "message": "Unable to update config file",
 *       "error": {
 *         "details": "EPERM: operation not permitted, open '/path/to/config/file/local{-NODE_ENV}.json'",
 *         "category": "EPERM",
 *         "errno": -4048,
 *         "path": "/path/to/config/file/local{-NODE_ENV}.json"
 *       }
 *     }
 */
app.patch("/", (req: express.Request, res: express.Response): void => {
  if (!ConfigExists()) {
    // The config file has not been created yet, so it first needs to be POSTed
    res.status(400).json({
      status: "error",
      message: "The config file does not exist",
      see: "POST " + req.headers.host + req.baseUrl
    });
  } else {
    /** The PATCH object and the keys available */
    interface PatchData {
      op: string;
      path: string;
      value: string | number;
    }

    const data: PatchData[] = req.body;

    requiredSchemaPatch.validate(data, (err: Joi.ValidationError): void => {
      if (err) {
        // The `value` value can either be a string or a number, and if it
        // is missing then multiple errors are created. This combines them
        // into just one message to send back to the client
        let errorDetails: string[] = [];
        for (let detail of err.details) {
          errorDetails.push(detail.message);
        }

        // Send a 400 Bad Request error response if validation fails
        res.status(400).json({
          status: "error",
          message: "Invalid PATCH data",
          error: {
            details: errorDetails.join(" or "),
            category: err.name,
            path: JSONPointer.encodePointer(err.details[0].path)
          }
        });
      } else {
        let config: JSON = JSON.parse(
          fs.readFileSync(generateConfigFilenamePath(), "utf8")
        );

        // Merge current config with the PATCH data
        data.forEach(function(patch: PatchData): void {
          JSONPointer.set(config, patch.path, patch.value, true);
        });

        // Validate the JSON with the post schema
        requiredSchemaPost.validate(
          config,
          (err: Joi.ValidationError): void => {
            if (err) {
              // Send a 400 Bad Request error response if validation fails
              res.status(400).json({
                status: "error",
                message: "Invalid request data",
                error: {
                  details: err.details[0].message,
                  category: err.name,
                  path: JSONPointer.encodePointer(err.details[0].path)
                }
              });
            } else {
              let path: string = generateConfigFilenamePath();

              // Attempt to save the config file
              fs.writeFile(
                path,
                JSON.stringify(config),
                (err: NodeJS.ErrnoException | null): void => {
                  if (err) {
                    // Send a 500 Internal Server Error response if the config
                    // file cannot be updated
                    res.status(500).json({
                      status: "error",
                      message: "Unable to update config file",
                      error: {
                        details: err.message,
                        category: err.code,
                        errno: err.errno,
                        path: err.path
                      }
                    });
                  } else {
                    // Send a success response if validation passes and the file has
                    // successfully been updated
                    res.status(200).json({
                      status: "success",
                      message: "Config file updated successfully"
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
  }
});
