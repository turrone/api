let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/turrone-server");
let should = chai.should();
const apiRoot = "/api";

chai.use(chaiHttp);

describe(apiRoot, () => {
  /**
   * Test the / [GET] route to display API endpoint documentation
   */
  describe(`/ [GET]`, () => {
    it("should display the API endpoint documentation", done => {
      chai
        .request(server)
        .get(`${apiRoot}/`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.have.header("content-type", /^text/);
          res.text.should.include("<p>Loading...</p>");
          done();
        });
    });
  });

  /**
   * Test the /* [GET] route to catch all unknown requests
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
