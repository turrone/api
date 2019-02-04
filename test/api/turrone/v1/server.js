let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../../../src/turrone-server");
let should = chai.should();
const apiRoot = "/api/turrone/v1/server";

chai.use(chaiHttp);

describe(apiRoot, () => {
  /*
   * Test the /ping [GET] route
   */
  describe(`/ping [GET]`, () => {
    it("should pong the ping", done => {
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
});
