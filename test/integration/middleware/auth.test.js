const request = require("supertest");
const { User } = require("../../../models/user");
const { Genre } = require("../../../models/genre");

let server = require("../../../index");

describe("Middleware AUTH", () => {
  beforeEach(() => (server = require("../../../index")));
  afterEach(async () => {
    await server.close();
    await Genre.collection.deleteMany({});
  });

  let token;
  let title;

  beforeEach(() => {
    token = new User().getAuthToken();
    title = "genre1";
  });

  function exec() {
    return request(server)
      .post("/api/genres/")
      .set("x-auth-token", token)
      .send({ title });
  }

  it("Should return 401 error when auth token doesnt exist", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("Should return 400 error when auth token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("Should return 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
