import { ConfigExists } from "../../../utils/config";
import { eventEmitter, Event } from "../../../utils/events";
import express from "express";
/** Creates an Express instance */
const app = express();

export = app;

if (!ConfigExists()) {
  eventEmitter.emit(
    Event.ServerStatusAPIError,
    "There is no configuration file created to connect to the database",
    "setup.config"
  );
} else {
  eventEmitter.emit(Event.ServerStatusAPIOperational);
}
