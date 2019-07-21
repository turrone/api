import { eventEmitter, Event } from "../../../utils/events";
import express from "express";
import mongoose from "mongoose";
/** Creates an Express instance */
const app = express();

export = app;

/** The different states that a component can be in */
enum Status {
  /** There is currently an issue with this component */
  Error = "error",
  /** This component is currently starting */
  Initializing = "initializing",
  /** The component is ready so serve requests */
  Operational = "operational"
}

interface ComponentStatus {
  /** The current status of the component */
  status: Status;
  /** A message describing the reason for the current component status  */
  message: string;
  /** The category of the message */
  category: string;
  /** A UNIX timestamp of when this component status was updated */
  updated: number;
}

/**
 * The current status of the API endpoint component
 *
 * @see [[ComponentStatus]] interface for more details
 */
let apiStatus: ComponentStatus = {
  status: Status.Initializing,
  message: "",
  category: "",
  updated: Date.now()
};

/**
 * The current status of the database component
 *
 * @see [[ComponentStatus]] interface for more details
 */
let databaseStatus: ComponentStatus = {
  status: Status.Initializing,
  message: "",
  category: "",
  updated: Date.now()
};

/**
 * Update the status of the API that is displayed via the `/server/status`
 * API endpoint
 *
 * @param status The current status of the component
 * @param message A message describing the reason for the current component status
 * @param category The category of the message
 */
function updateAPIStatus(
  status: Status,
  message: string = "",
  category: string = ""
): void {
  apiStatus.status = status;
  apiStatus.message = message;
  apiStatus.category = category;
  apiStatus.updated = Date.now();
}

/**
 * Updates the API status to indicate that there has been an error
 *
 * @param message The error that has caused a problem with the API endpoints
 * @param category The category of the message
 */
function apiStatusError(message: string, category: string): void {
  updateAPIStatus(Status.Error, message, category);
}

/** Updates the API status to indicate that it is operational */
function apiStatusOperational(): void {
  updateAPIStatus(Status.Operational);
}

eventEmitter.on(Event.ServerStatusAPIError, apiStatusError);
eventEmitter.on(Event.ServerStatusAPIOperational, apiStatusOperational);

/**
 * Update the status of the database that is displayed via the `/server/status`
 * API endpoint
 *
 * @param status The current status of the component
 * @param message A message describing the reason for the current component status
 * @param category The category of the message
 */
function updateDatabaseStatus(
  status: Status,
  message: string = "",
  category: string = ""
): void {
  databaseStatus.status = status;
  databaseStatus.message = message;
  databaseStatus.category = category;
  databaseStatus.updated = Date.now();
}

/**
 * Updates the database status to indicate that there has been an error
 *
 * @param message The error that is generated from the database adapter
 */
function databaseStatusError(message: mongoose.Error): void {
  updateDatabaseStatus(Status.Error, message.message, message.name);
}

/** Updates the database status to indicate that it is operational */
function databaseStatusOperational(): void {
  updateDatabaseStatus(Status.Operational);
}

eventEmitter.on(Event.ServerStatusDatabaseError, databaseStatusError);
eventEmitter.on(
  Event.ServerStatusDatabaseOperational,
  databaseStatusOperational
);

/**
 * @api {get} /api/turrone/v1/server/status Check server status
 * @apiName GetStatus
 * @apiGroup Server
 * @apiVersion 0.1.0
 * @ignore // Ignore API endpoint in developer documentation
 *
 * @apiDescription The server and its componenets can be in one of many states,
 * depending on what has already happened.
 *
 * These states, along with what they represent, are:
 * * __error__: There is currently an issue with this component
 * * __initializing__: This component is currently starting
 * * __operational__: The component is ready so serve requests
 *
 * The categories that are returned by each component are:
 * * __api__:
 *   * __setup.config__: There is no configuration file created to connect to the database
 *   * __setup.user__: There is no initial user created to log in and administer the server
 * * __database__:
 *   * __MongoNetworkError__: There was an issue connecting to the database
 *   * __MongoParseError__: No hostname has been provided in the connection string
 *
 * @apiExample {curl} Example usage:
 *  curl -i http://localhost:8080/api/turrone/v1/server/status
 *
 * @apiSuccess {Object}   components                 The components making up the server
 * @apiSuccess {Object}   components.api             The API endpoint component
 * @apiSuccess {String}   components.api.status      The current status of the component
 * @apiSuccess {String}   components.api.message     A message describing the reason for the current component status
 * @apiSuccess {String}   components.api.category    The category of the message
 * @apiSuccess {Number}   components.api.updated     A UNIX timestamp of when this component status was updated
 * @apiSuccess {Object}   components.database             The database component
 * @apiSuccess {String}   components.database.status      The current status of the component
 * @apiSuccess {String}   components.database.message     A message describing the reason for the current component status
 * @apiSuccess {String}   components.database.category    The category of the message
 * @apiSuccess {Number}   components.database.updated     A UNIX timestamp of when this component status was updated
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "components": {
 *         "api": {
 *           "status": "operational",
 *           "message": "",
 *           "category": "",
 *           "updated": 1563624937
 *         },
 *         "database": {
 *           "status": "error",
 *           "message": "failed to connect to server [127.0.0.1:27017] on first connect",
 *           "category": "MongoNetworkError",
 *           "updated": 1565690565
 *         }
 *       }
 *     }
 */
app.get("/", (req: express.Request, res: express.Response): void => {
  res.status(200).json({
    components: {
      api: apiStatus,
      database: databaseStatus
    }
  });
});
