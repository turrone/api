import config from "config";
/** An instance of the config object */
export const Config: object = config;

/**
 * Checks to make sure that a config file exists and contains non-default values
 *
 * **This is not used to verify that the config is valid, only that there has
 *   been a file created**
 *
 * This check should be performed by any function that requires access to the
 * database, and should the check return `false`, then an error should be thrown
 * and caught by Express middleware.
 *
 * The values that are checked are:
 *  * `dbConfig.host`
 *  * `dbConfig.port`
 *  * `dbConfig.database`
 *
 * These values are checked as it is not possible to connect to a backing database
 * with them not set. The values for `dbConfig.username` and `dbConfig.password`
 * are not used, as it may be possible to connect to the database without these
 * (depending on the environment).
 *
 * @returns Does a config file exist and contain non-default values
 */
export function ConfigExists(): boolean {
  let valid = true;

  if (!config.has("dbConfig.host") || config.get("dbConfig.host") === "") {
    valid = false;
  }

  if (!config.has("dbConfig.port") || config.get("dbConfig.port") === 0) {
    valid = false;
  }

  if (
    !config.has("dbConfig.database") ||
    config.get("dbConfig.database") === ""
  ) {
    valid = false;
  }

  return valid;
}
