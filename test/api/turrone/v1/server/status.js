let chai = require("chai");
let chaiHttp = require("chai-http");
let { eventEmitter, Event } = require("../../../../../src/utils/events");
let mongoose = require("mongoose");
let server = require("../../../../../src/api");
let should = chai.should();
const apiRoot = "/turrone/v1/server";

chai.use(chaiHttp);

describe(apiRoot, () => {
  /*
   * Test the /status [GET] route
   */
  describe(`/status [GET]`, () => {
    it("should have a components object", done => {
      chai
        .request(server)
        .get(`${apiRoot}/status`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("components");
          done();
        });
    });

    it("should have component statuses", done => {
      chai
        .request(server)
        .get(`${apiRoot}/status`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.components.should.be.an("object");

          let components = res.body.components;
          Object.keys(components).should.have.a.lengthOf(2);

          components.should.have.property("api");
          components.should.have.property("database");
          done();
        });
    });

    it("should have an API status", done => {
      chai
        .request(server)
        .get(`${apiRoot}/status`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.components.api.should.be.an("object");

          let api = res.body.components.api;
          Object.keys(api).should.have.a.lengthOf(4);

          api.should.have.property("status");
          api.status.should.be.a("string");

          api.should.have.property("message");
          api.message.should.be.a("string");

          api.should.have.property("category");
          api.category.should.be.a("string");

          api.should.have.property("updated");
          api.updated.should.be.a("number");

          done();
        });
    });

    it("should have an API status of initializing", done => {
      chai
        .request(server)
        .get(`${apiRoot}/status`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.components.api.should.be.an("object");

          let api = res.body.components.api;

          api.should.have.property("status").eql("initializing");
          api.should.have.property("message").eql("");
          api.should.have.property("category").eql("");

          done();
        });
    });

    it("should have an API status of operational", done => {
      eventEmitter.emit(Event.ServerStatusAPIOperational);

      chai
        .request(server)
        .get(`${apiRoot}/status`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.components.api.should.be.an("object");

          let api = res.body.components.api;

          api.should.have.property("status").eql("operational");
          api.should.have.property("message").eql("");
          api.should.have.property("category").eql("");

          done();
        });
    });

    it("should have an API status of error", done => {
      let errorMessage = "error message";
      let errorCategory = "error category";
      eventEmitter.emit(
        Event.ServerStatusAPIError,
        errorMessage,
        errorCategory
      );

      chai
        .request(server)
        .get(`${apiRoot}/status`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.components.api.should.be.an("object");

          let api = res.body.components.api;

          api.should.have.property("status").eql("error");
          api.should.have.property("message").eql(errorMessage);
          api.should.have.property("category").eql(errorCategory);

          done();
        });
    });

    it("should have a database status", done => {
      chai
        .request(server)
        .get(`${apiRoot}/status`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.components.api.should.be.an("object");

          let database = res.body.components.database;
          Object.keys(database).should.have.a.lengthOf(4);

          database.should.have.property("status");
          database.status.should.be.a("string");

          database.should.have.property("message");
          database.message.should.be.a("string");

          database.should.have.property("category");
          database.category.should.be.a("string");

          database.should.have.property("updated");
          database.updated.should.be.a("number");

          done();
        });
    });

    it("should have a database status of initializing", done => {
      chai
        .request(server)
        .get(`${apiRoot}/status`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.components.database.should.be.an("object");

          let database = res.body.components.database;

          database.should.have.property("status").eql("initializing");
          database.should.have.property("message").eql("");
          database.should.have.property("category").eql("");

          done();
        });
    });

    it("should have a database status of operational", done => {
      eventEmitter.emit(Event.ServerStatusDatabaseOperational);

      chai
        .request(server)
        .get(`${apiRoot}/status`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.components.database.should.be.an("object");

          let database = res.body.components.database;

          database.should.have.property("status").eql("operational");
          database.should.have.property("message").eql("");
          database.should.have.property("category").eql("");

          done();
        });
    });

    it("should have a database status of error", done => {
      let errorMessage = "error message";
      let errorCategory = "MongooseError";
      eventEmitter.emit(
        Event.ServerStatusDatabaseError,
        new mongoose.Error(errorMessage)
      );

      chai
        .request(server)
        .get(`${apiRoot}/status`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.components.database.should.be.an("object");

          let database = res.body.components.database;

          database.should.have.property("status").eql("error");
          database.should.have.property("message").eql(errorMessage);
          database.should.have.property("category").eql(errorCategory);

          done();
        });
    });
  });
});
