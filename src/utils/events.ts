// Allowing a shared events emitter across the whole API
// See: https://stackoverflow.com/a/51958272
// See: https://stackoverflow.com/a/39689685

import events from "events";
/** Creates an event emitter instance */
export const eventEmitter = new events.EventEmitter();

/** The events that can be emitted and received from any module */
export enum Event {
  /** There has been an error with the API endpoints */
  ServerStatusAPIError = "server.status.api.error",
  /** The connection to the API endpoints is operational */
  ServerStatusAPIOperational = "server.status.api.operational",
  /** There has been an error with the database */
  ServerStatusDatabaseError = "server.status.database.error",
  /** The connection to the database is operational */
  ServerStatusDatabaseOperational = "server.status.database.operational"
}
