let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../src/turrone-server");
let should = chai.should();
const apiRoot = "/api/turrone/v1/server";

chai.use(chaiHttp);

describe(apiRoot, () => {
  /*
   * Test the /ping [GET] route
   */
  describe(`/ping [GET]`, () => {
    it("it should be alive", done => {
      chai
        .request(server)
        .get(`${apiRoot}/ping`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("message").eql("pong");
          done();
        });
    });
  });

  /*
   * Test the /* [GET] route
   */
  describe(`/* [GET]`, () => {
    it("should return 404 if no API route is known", done => {
      chai
        .request(server)
        .get(`${apiRoot}/not-here`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("object");
          res.body.should.have
            .property("message")
            .eql("Unknown route. Please check the URI and try again.");
          done();
        });
    });
  });
});
