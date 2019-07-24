let chai = require("chai");
let chaiHttp = require("chai-http");
let fs = require("fs");
let path = require("path");
let server = require("../../../../../src/api");
let should = chai.should();
const apiRoot = "/turrone/v1/server";

chai.use(require("chai-fs"));
chai.use(chaiHttp);

/**
 * Reloading the server for it to pick up any config file changes
 *
 * There isn't an easy way to reload the API endpoints or the config module,
 * as the server isn't really running for it to be restarted. The "best" way
 * to do it is to remove any modules from the cache and load them again.
 *
 * See: https://github.com/lorenwest/node-config/issues/224#issuecomment-111163692
 */
function reloadServer() {
  delete require.cache[require.resolve("config")];
  delete require.cache[require.resolve("../../../../../src/api")];
  delete require.cache[require.resolve("../../../../../src/turrone")];
  delete require.cache[require.resolve("../../../../../src/turrone/v1")];
  delete require.cache[require.resolve("../../../../../src/turrone/v1/server")];
  delete require.cache[
    require.resolve("../../../../../src/turrone/v1/server/config")
  ];
  delete require.cache[require.resolve("../../../../../src/utils/config")];

  server = require("../../../../../src/api");
}

/**
 * Generates the name of and path to the config file
 */
function generateConfigFilenamePath() {
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

describe(apiRoot, () => {
  /*
   * Test the /config [POST] route
   *
   * It should be noted that some tests have been ignored, such as validating
   * the hostname with numerous values, as these should be tested by the module
   * authors itself. Therefore, these types of tests would just be verifying
   * that their tests are working!
   */
  describe(`/config [POST]`, () => {
    before(() => {
      // Backup any existing local*.json files
      let files = fs.readdirSync("./config").filter(filename => {
        // Matches:
        //   local.json
        //   local-environment.json
        //   local-environment-instance.json
        if (filename.match(/local(-?[\w\d]+){0,2}\.json/i)) {
          fs.renameSync(
            "./config/" + filename,
            "./config/" + filename.replace("json", "bak")
          );
        }
      });

      // "Reload" the server so it reflects any deleted config files
      reloadServer();
    });

    afterEach(() => {
      // Clear up local*.json files
      let files = fs.readdirSync("./config").filter(filename => {
        // Matches:
        //   local.json
        //   local-environment.json
        //   local-environment-instance.json
        if (filename.match(/local(-?[\w\d]+){0,2}\.json/i)) {
          fs.unlinkSync("./config/" + filename);
        }
      });

      // "Reload" the server so it reflects any deleted config files
      reloadServer();
    });

    after(() => {
      // Restore existing local*.bak files
      let files = fs.readdirSync("./config").filter(filename => {
        // Matches:
        //   local.bak
        //   local-environment.bak
        //   local-environment-instance.bak
        if (filename.match(/local(-?[\w\d]+){0,2}\.bak/i)) {
          fs.renameSync(
            "./config/" + filename,
            "./config/" + filename.replace("bak", "json")
          );
        }
      });
    });

    it("should respond with HTTP status 400 if '/dbConfig' key is not included", done => {
      let postConfig = {};

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have.property("details").eql('"dbConfig" is required');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/host' key is not included", done => {
      let postConfig = {
        dbConfig: {}
      };

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have.property("details").eql('"host" is required');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/host");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/port' key is not included", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost"
        }
      };

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have.property("details").eql('"port" is required');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/port");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/database' key is not included", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017
        }
      };

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have.property("details").eql('"database" is required');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/database");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/host' is not a valid hostname", done => {
      let postConfig = {
        dbConfig: {
          host: "not_@_val1d-hostname."
        }
      };

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"host" must be a valid hostname');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/host");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/port' is 0", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 0
        }
      };

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"port" must be larger than or equal to 1');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/port");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/port' is above 65535", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 65536
        }
      };

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"port" must be a valid port');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/port");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/database' length is 0 characters", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database: ""
        }
      };

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"database" is not allowed to be empty');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/database");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/database' length is above 63 characters", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database:
            "1234567890123456789012345678901234567890123456789012345678901234"
        }
      };

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql(
              '"database" length must be less than or equal to 63 characters long'
            );
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/database");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/database' contains invalid characters", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database: 'invalid database\\/. "$*<>: | ?name/here'
        }
      };

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql(
              '"database" with value "invalid database\\/. "$*<>: | ?name/here" matches the inverted database pattern'
            );
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/database");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/username' contains invalid characters", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database: "turrone",
          username: "invalid-username here!"
        }
      };

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"username" must only contain alpha-numeric characters');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/username");

          done();
        });
    });

    it("should respond with HTTP status 201 if the config file has been created successfully", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database: "turrone"
        }
      };

      let configPath = generateConfigFilenamePath();

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(2);

          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("Config file created successfully");

          configPath.should.be.a.file().with.json;
          configPath.should.be.a
            .file()
            .with.content(JSON.stringify(postConfig));

          done();
        });
    });

    it("should respond with HTTP status 201 if the config file (with NODE_ENV set) has been created successfully", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database: "turrone"
        }
      };

      let ORIGINAL_NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = "testing";
      let configPath = generateConfigFilenamePath();

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(2);

          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("Config file created successfully");

          configPath.should.be.a.file().with.json;
          configPath.should.be.a
            .file()
            .with.content(JSON.stringify(postConfig));

          process.env.NODE_ENV = ORIGINAL_NODE_ENV;

          done();
        });
    });

    it("should respond with HTTP status 409 if the config file already exists", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database: "turrone"
        }
      };

      let configPath = generateConfigFilenamePath();

      // Create the file
      // The file is created **before** "resetting" the config and server
      // so that the check to `ConfigExists()` returns `true`, meaning that
      // it will not attempt to create the file
      fs.writeFileSync(configPath, JSON.stringify(postConfig));

      reloadServer();

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have
            .property("message")
            .eql("The config file already exists");
          res.body.should.have.property("see");

          done();
        });
    });

    it("should respond with HTTP status 409 if the config file (with NODE_ENV set) already exists", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database: "turrone"
        }
      };

      let ORIGINAL_NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = "testing";
      let configPath = generateConfigFilenamePath();

      // Create the file
      // The file is created **before** "resetting" the config and server
      // so that the check to `ConfigExists()` returns `true`, meaning that
      // it will not attempt to create the file
      fs.writeFileSync(configPath, JSON.stringify(postConfig));

      reloadServer();

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have
            .property("message")
            .eql("The config file already exists");
          res.body.should.have.property("see");

          process.env.NODE_ENV = ORIGINAL_NODE_ENV;

          done();
        });
    });

    it("should respond with HTTP status 500 if unable to create the config file", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database: "turrone"
        }
      };

      let configPath = generateConfigFilenamePath();
      let fullPath = path.resolve(configPath);

      reloadServer();

      // Create the file and make it read only
      // The file is created **after** "resetting" the config and server
      // so that the check to `ConfigExists()` returns `false`, meaning that
      // it will attempt to create the file. With the file being read only,
      // it is unable to overwrite the file, causing it to return an error.
      fs.writeFileSync(configPath, JSON.stringify(postConfig), { mode: 0o444 });

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have
            .property("message")
            .eql("Unable to create config file");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(4);

          error.should.have.property("details").satisfy(function(details) {
            // EPERM - Windows
            // EACCES - Ubuntu / MacOS
            if (
              details ===
                "EPERM: operation not permitted, open '" + fullPath + "'" ||
              details === "EACCES: permission denied, open '" + configPath + "'"
            ) {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("category").satisfy(function(category) {
            // EPERM - Windows
            // EACCES - Ubuntu / MacOS
            if (category === "EPERM" || category === "EACCES") {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("errno").satisfy(function(errno) {
            // -4048 - Windows
            // -13 - Ubuntu / MacOS
            if (errno === -4048 || errno === -13) {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("path").satisfy(function(path) {
            // Absolute path - Windows
            // Relative path - Ubuntu / MacOS
            if (path === fullPath || path === configPath) {
              return true;
            } else {
              return false;
            }
          });

          done();
        });
    });

    it("should respond with HTTP status 500 if unable to create the config file (with NODE_ENV set)", done => {
      let postConfig = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database: "turrone"
        }
      };

      let ORIGINAL_NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = "testing";
      let configPath = generateConfigFilenamePath();
      let fullPath = path.resolve(configPath);

      reloadServer();

      // Create the file and make it read only
      // The file is created **after** "resetting" the config and server
      // so that the check to `ConfigExists()` returns `false`, meaning that
      // it will attempt to create the file. With the file being read only,
      // it is unable to overwrite the file, causing it to return an error.
      fs.writeFileSync(configPath, JSON.stringify(postConfig), { mode: 0o444 });

      chai
        .request(server)
        .post(`${apiRoot}/config`)
        .send(postConfig)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have
            .property("message")
            .eql("Unable to create config file");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(4);

          error.should.have.property("details").satisfy(function(details) {
            // EPERM - Windows
            // EACCES - Ubuntu / MacOS
            if (
              details ===
                "EPERM: operation not permitted, open '" + fullPath + "'" ||
              details === "EACCES: permission denied, open '" + configPath + "'"
            ) {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("category").satisfy(function(category) {
            // EPERM - Windows
            // EACCES - Ubuntu / MacOS
            if (category === "EPERM" || category === "EACCES") {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("errno").satisfy(function(errno) {
            // -4048 - Windows
            // -13 - Ubuntu / MacOS
            if (errno === -4048 || errno === -13) {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("path").satisfy(function(path) {
            // Absolute path - Windows
            // Relative path - Ubuntu / MacOS
            if (path === fullPath || path === configPath) {
              return true;
            } else {
              return false;
            }
          });

          process.env.NODE_ENV = ORIGINAL_NODE_ENV;

          done();
        });
    });
  });

  /*
   * Test the /config [PATCH] route
   *
   * It should be noted that some tests have been ignored, such as validating
   * the hostname with numerous values, as these should be tested by the module
   * authors itself. Therefore, these types of tests would just be verifying
   * that their tests are working!
   *
   * Most of the tests that are similar to "should respond with HTTP status 400
   * if '{path}' is not a valid {value}" are copies of those that test the POST
   * request, as that PATCH request uses the same schema to validate the config
   * before it is saved. While it is not needed to repeat these tests, they're
   * included on the basis of should the code validating the schemas be updated,
   * it will break the tests if it's not been done correctly
   */
  describe(`/config [PATCH]`, () => {
    before(() => {
      // Backup any existing local*.json files
      let files = fs.readdirSync("./config").filter(filename => {
        // Matches:
        //   local.json
        //   local-environment.json
        //   local-environment-instance.json
        if (filename.match(/local(-?[\w\d]+){0,2}\.json/i)) {
          fs.renameSync(
            "./config/" + filename,
            "./config/" + filename.replace("json", "bak")
          );
        }
      });
    });

    beforeEach(() => {
      const config = {
        dbConfig: {
          host: "localhost",
          port: 27017,
          database: "turrone",
          username: "TurroneDatabaseUser",
          password: "My5up3rS3cur3P@ssw0rd!"
        }
      };

      let configPath = generateConfigFilenamePath();

      // Create the file
      // The file is created **before** "resetting" the config and server
      // so that the check to `ConfigExists()` returns `true`, meaning that
      // it will not attempt to create the file
      fs.writeFileSync(configPath, JSON.stringify(config));

      // "Reload" the server so it reflects any deleted config files
      reloadServer();
    });

    afterEach(() => {
      // Clear up local*.json files
      let files = fs.readdirSync("./config").filter(filename => {
        // Matches:
        //   local.json
        //   local-environment.json
        //   local-environment-instance.json
        if (filename.match(/local(-?[\w\d]+){0,2}\.json/i)) {
          fs.unlinkSync("./config/" + filename);
        }
      });

      // "Reload" the server so it reflects any deleted config files
      reloadServer();
    });

    after(() => {
      // Restore existing local*.bak files
      let files = fs.readdirSync("./config").filter(filename => {
        // Matches:
        //   local.bak
        //   local-environment.bak
        //   local-environment-instance.bak
        if (filename.match(/local(-?[\w\d]+){0,2}\.bak/i)) {
          fs.renameSync(
            "./config/" + filename,
            "./config/" + filename.replace("bak", "json")
          );
        }
      });
    });

    it("should respond with HTTP status 400 if the config file does not exist", done => {
      let patchConfig = [];

      // Removing any config files that have been created by `beforeEach()`
      let files = fs.readdirSync("./config").filter(filename => {
        // Matches:
        //   local.json
        //   local-environment.json
        //   local-environment-instance.json
        if (filename.match(/local(-?[\w\d]+){0,2}\.json/i)) {
          fs.unlinkSync("./config/" + filename);
        }
      });

      // "Reload" the server so it reflects any deleted config files
      reloadServer();

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have
            .property("message")
            .eql("The config file does not exist");
          res.body.should.have.property("see");

          done();
        });
    });

    it("should respond with HTTP status 400 if the PATCH data does not contain any items", done => {
      let patchConfig = [];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid PATCH data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"value" must contain at least 1 items');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("");

          done();
        });
    });

    it("should respond with HTTP status 400 if the PATCH data does not contain an 'op' field", done => {
      let patchConfig = [{}];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid PATCH data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have.property("details").eql('"op" is required');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/0/op");

          done();
        });
    });

    it("should respond with HTTP status 400 if the PATCH data does not contain a 'path' field", done => {
      let patchConfig = [
        {
          op: "replace"
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid PATCH data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have.property("details").eql('"path" is required');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/0/path");

          done();
        });
    });

    it("should respond with HTTP status 400 if the PATCH data does not contain a 'value' field", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/host"
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid PATCH data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have.property("details").eql('"value" is required');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/0/value");

          done();
        });
    });

    it("should respond with HTTP status 400 if the PATCH 'value' field is not an allowed operation", done => {
      let patchConfig = [
        {
          op: "foo",
          path: "/dbConfig/host",
          value: "localhost"
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid PATCH data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"op" must be one of [replace]');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/0/op");

          done();
        });
    });

    it("should respond with HTTP status 400 if the PATCH 'path' field is not an allowed path", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/foo/bar",
          value: "localhost"
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid PATCH data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql(
              '"path" must be one of [/dbConfig/host, /dbConfig/port, /dbConfig/database, /dbConfig/username, /dbConfig/password]'
            );
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/0/path");

          done();
        });
    });

    it("should respond with HTTP status 400 if the PATCH 'path' field is not a string or number", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/host",
          value: null
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid PATCH data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"value" must be a string or "value" must be a number');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/0/value");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/host' is not a valid hostname", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/host",
          value: "not_@_val1d-hostname."
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"host" must be a valid hostname');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/host");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/port' is 0", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/port",
          value: 0
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"port" must be larger than or equal to 1');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/port");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/port' is above 65535", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/port",
          value: 65536
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"port" must be a valid port');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/port");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/database' length is 0 characters", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/database",
          value: ""
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"database" is not allowed to be empty');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/database");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/database' length is above 63 characters", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/database",
          value:
            "1234567890123456789012345678901234567890123456789012345678901234"
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql(
              '"database" length must be less than or equal to 63 characters long'
            );
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/database");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/database' contains invalid characters", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/database",
          value: 'invalid database\\/. "$*<>: | ?name/here'
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql(
              '"database" with value "invalid database\\/. "$*<>: | ?name/here" matches the inverted database pattern'
            );
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/database");

          done();
        });
    });

    it("should respond with HTTP status 400 if '/dbConfig/username' contains invalid characters", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/username",
          value: "invalid-username here!"
        }
      ];

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid request data");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(3);

          error.should.have
            .property("details")
            .eql('"username" must only contain alpha-numeric characters');
          error.should.have.property("category").eql("ValidationError");
          error.should.have.property("path").eql("/dbConfig/username");

          done();
        });
    });

    it("should respond with HTTP status 200 if the config file has been updated successfully", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/host",
          value: "127.0.0.1"
        },
        {
          op: "replace",
          path: "/dbConfig/database",
          value: "NewDatabaseName"
        }
      ];

      const config = {
        dbConfig: {
          host: "127.0.0.1",
          port: 27017,
          database: "NewDatabaseName",
          username: "TurroneDatabaseUser",
          password: "My5up3rS3cur3P@ssw0rd!"
        }
      };

      let configPath = generateConfigFilenamePath();

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(2);

          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("Config file updated successfully");

          configPath.should.be.a.file().with.json;
          configPath.should.be.a.file().with.content(JSON.stringify(config));

          done();
        });
    });

    it("should respond with HTTP status 200 if the config file (with NODE_ENV set) has been updated successfully", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/host",
          value: "127.0.0.1"
        },
        {
          op: "replace",
          path: "/dbConfig/database",
          value: "NewDatabaseName"
        }
      ];

      const config = {
        dbConfig: {
          host: "127.0.0.1",
          port: 27017,
          database: "NewDatabaseName",
          username: "TurroneDatabaseUser",
          password: "My5up3rS3cur3P@ssw0rd!"
        }
      };

      let ORIGINAL_NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = "testing";
      let configPath = generateConfigFilenamePath();
      // Create the file, as it will have been removed between tests
      fs.writeFileSync(configPath, JSON.stringify(config));

      reloadServer();

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(2);

          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("Config file updated successfully");

          configPath.should.be.a.file().with.json;
          configPath.should.be.a.file().with.content(JSON.stringify(config));

          process.env.NODE_ENV = ORIGINAL_NODE_ENV;

          done();
        });
    });

    it("should respond with HTTP status 200 and merge multiple PATCH items into the updated config file successfully", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/host",
          value: "127.0.0.1"
        },
        {
          op: "replace",
          path: "/dbConfig/database",
          value: "NewDatabaseName"
        },
        {
          op: "replace",
          path: "/dbConfig/host",
          value: "localhost"
        },
        {
          op: "replace",
          path: "/dbConfig/username",
          value: "NewDatabaseUser"
        },
        {
          op: "replace",
          path: "/dbConfig/database",
          value: "EvenNewerDatabaseName"
        },
        {
          op: "replace",
          path: "/dbConfig/port",
          value: 54321
        }
      ];

      const config = {
        dbConfig: {
          host: "localhost",
          port: 54321,
          database: "EvenNewerDatabaseName",
          username: "NewDatabaseUser",
          password: "My5up3rS3cur3P@ssw0rd!"
        }
      };

      let configPath = generateConfigFilenamePath();

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(2);

          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("Config file updated successfully");

          configPath.should.be.a.file().with.json;
          configPath.should.be.a.file().with.content(JSON.stringify(config));

          done();
        });
    });

    it("should respond with HTTP status 500 if unable to update the config file", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/host",
          value: "127.0.0.1"
        },
        {
          op: "replace",
          path: "/dbConfig/database",
          value: "NewDatabaseName"
        }
      ];

      const config = {
        dbConfig: {
          host: "127.0.0.1",
          port: 27017,
          database: "NewDatabaseName",
          username: "TurroneDatabaseUser",
          password: "My5up3rS3cur3P@ssw0rd!"
        }
      };

      let configPath = generateConfigFilenamePath();
      let fullPath = path.resolve(configPath);

      // Create the file, as it will have been removed between tests, and
      // make it read only. With the file being read only, it is unable to
      // overwrite the file, causing it to return an error.
      fs.writeFileSync(configPath, JSON.stringify(config), { mode: 0o444 });

      reloadServer();

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have
            .property("message")
            .eql("Unable to update config file");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(4);

          error.should.have.property("details").satisfy(function(details) {
            // EPERM - Windows
            // EACCES - Ubuntu / MacOS
            if (
              details ===
                "EPERM: operation not permitted, open '" + fullPath + "'" ||
              details === "EACCES: permission denied, open '" + configPath + "'"
            ) {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("category").satisfy(function(category) {
            // EPERM - Windows
            // EACCES - Ubuntu / MacOS
            if (category === "EPERM" || category === "EACCES") {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("errno").satisfy(function(errno) {
            // -4048 - Windows
            // -13 - Ubuntu / MacOS
            if (errno === -4048 || errno === -13) {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("path").satisfy(function(path) {
            // Absolute path - Windows
            // Relative path - Ubuntu / MacOS
            if (path === fullPath || path === configPath) {
              return true;
            } else {
              return false;
            }
          });

          done();
        });
    });

    it("should respond with HTTP status 500 if unable to update the config file (with NODE_ENV set)", done => {
      let patchConfig = [
        {
          op: "replace",
          path: "/dbConfig/host",
          value: "127.0.0.1"
        },
        {
          op: "replace",
          path: "/dbConfig/database",
          value: "NewDatabaseName"
        }
      ];

      const config = {
        dbConfig: {
          host: "127.0.0.1",
          port: 27017,
          database: "NewDatabaseName",
          username: "TurroneDatabaseUser",
          password: "My5up3rS3cur3P@ssw0rd!"
        }
      };

      let ORIGINAL_NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = "testing";
      let configPath = generateConfigFilenamePath();
      let fullPath = path.resolve(configPath);

      // Create the file, as it will have been removed between tests, and
      // make it read only. With the file being read only, it is unable to
      // overwrite the file, causing it to return an error.
      fs.writeFileSync(configPath, JSON.stringify(config), { mode: 0o444 });

      reloadServer();

      chai
        .request(server)
        .patch(`${apiRoot}/config`)
        .send(patchConfig)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.an("object");
          Object.keys(res.body).should.have.a.lengthOf(3);

          res.body.should.have.property("status").eql("error");
          res.body.should.have
            .property("message")
            .eql("Unable to update config file");

          res.body.should.have.property("error");
          res.body.error.should.be.an("object");
          let error = res.body.error;
          Object.keys(error).should.have.a.lengthOf(4);

          error.should.have.property("details").satisfy(function(details) {
            // EPERM - Windows
            // EACCES - Ubuntu / MacOS
            if (
              details ===
                "EPERM: operation not permitted, open '" + fullPath + "'" ||
              details === "EACCES: permission denied, open '" + configPath + "'"
            ) {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("category").satisfy(function(category) {
            // EPERM - Windows
            // EACCES - Ubuntu / MacOS
            if (category === "EPERM" || category === "EACCES") {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("errno").satisfy(function(errno) {
            // -4048 - Windows
            // -13 - Ubuntu / MacOS
            if (errno === -4048 || errno === -13) {
              return true;
            } else {
              return false;
            }
          });
          error.should.have.property("path").satisfy(function(path) {
            // Absolute path - Windows
            // Relative path - Ubuntu / MacOS
            if (path === fullPath || path === configPath) {
              return true;
            } else {
              return false;
            }
          });

          process.env.NODE_ENV = ORIGINAL_NODE_ENV;

          done();
        });
    });
  });
});
