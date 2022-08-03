import request from "supertest";
import { Bihongo } from "../../system/src/core/Bihongo";

const app = Bihongo.app();

describe("GET /exmaple", function () {
  it("responds with html", function (done) {
    request(app)
      .get("/example")
      .set("Accept", "application/html")
      .expect("Content-Type", /html/)
      .expect(200, done);
  });
});
