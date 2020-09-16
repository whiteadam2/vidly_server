const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
let server = require("../../../index");

describe("/genres/api/", () => {
  beforeEach(() => (server = require("../../../index")));
  afterEach(async () => {
    await server.close();
    await Genre.collection.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { title: "genre1" },
        { title: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((genre) => genre.title === "genre1")).toBeTruthy();
      expect(res.body.some((genre) => genre.title === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("sould return genre with given ID", async () => {
      const genre = new Genre({ title: "genre1" });
      genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", genre.title);
    });

    it("sould return 404 if genre with given ID doesnt exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });

    it("should return 400 if ID is not valid Object ID", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    let token;
    let title;

    function exec() {
      return request(server)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({ title });
    }

    beforeEach(() => {
      token = new User().getAuthToken();
      title = "genre1";
    });

    it("should return 401 when user is not authorized", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    describe("validation", () => {
      it("should return 400 when title less then 3 symbols", async () => {
        title = "11";
        const res = await exec();
        expect(res.status).toBe(400);
      });

      it("should return 400 when title more then 50 symbols", async () => {
        title = Array(52).join("a");
        const res = await exec();
        expect(res.status).toBe(400);
      });
    });

    it("should return new genre object when send valid genre with auth", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("title", "genre1");
    });

    it("should save new genre object when send valid genre with auth", async () => {
      await exec();
      const genre = Genre.find({ title });
      expect(genre).not.toBeNull();
    });
  });

  describe("PUT /:id", () => {
    function exec(token, title, id) {
      return request(server)
        .put("/api/genres/" + id)
        .send({ title })
        .set("x-auth-token", token);
    }

    async function getId() {
      await request(server)
        .post("/api/genres/")
        .send({ title: "genre_old" })
        .set("x-auth-token", new User().getAuthToken());

      const genre = await Genre.findOne({ title: "genre_old" });
      return genre._id;
    }

    it("should return 400 error if id is Invalid", async () => {
      const id = "1";
      const res = await exec(new User().getAuthToken(), "genre1", id);
      expect(res.status).toBe(400);
    });

    it("should return 400 error if genres title less then 5 charecters", async () => {
      const title = "gn";
      const res = await exec(new User().getAuthToken(), title, await getId());
      expect(res.status).toBe(400);
    });

    it("should return 400 error if genres title more then 50 charecters", async () => {
      const title = new Array(52).join("a");
      const res = await exec(new User().getAuthToken(), title, await getId());
      expect(res.status).toBe(400);
    });

    it("should return 401 error if access token not found", async () => {
      const token = "";
      const res = await exec(token, "genre1", await getId());
      expect(res.status).toBe(401);
    });

    it("should return new genre object", async () => {
      const res = await exec(
        new User().getAuthToken(),
        "genre1",
        await getId()
      );
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("genre1");
    });
  });

  describe("DELETE /:id", () => {
    const tokenWithAccess = new User({ isAdmin: true }).getAuthToken();
    const tokenWithoutAccess = new User({ isAdmin: false }).getAuthToken();

    async function getId() {
      await request(server)
        .post("/api/genres/")
        .send({ title: "genre_old" })
        .set("x-auth-token", new User().getAuthToken());

      const genre = await Genre.findOne({ title: "genre_old" });
      return genre._id;
    }

    it("should return 401 error if token doesnt exist", async () => {
      const res = await request(server)
        .delete("/api/genres/" + (await getId()))
        .set("x-auth-token", "");

      expect(res.status).toBe(401);
    });

    it("should return 403 error if user dosnt have permissions", async () => {
      const res = await request(server)
        .delete("/api/genres/" + (await getId()))
        .set("x-auth-token", tokenWithoutAccess);

      expect(res.status).toBe(403);
    });

    it("should return 400 error if ID is not valid ObjectId", async () => {
      const res = await request(server)
        .delete("/api/genres/1")
        .set("x-auth-token", tokenWithAccess);

      expect(res.status).toBe(400);
    });

    it("should return 404 error if ID is not found", async () => {
      const res = await request(server)
        .delete("/api/genres/" + new mongoose.Types.ObjectId())
        .set("x-auth-token", tokenWithAccess);

      expect(res.status).toBe(404);
    });

    it("should return genre that was deleted", async () => {
      const id = await getId();
      const res = await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", tokenWithAccess);

      expect(res.status).toBe(200);
      expect(res.body._id).toMatch(mongoose.Types.ObjectId(id).toHexString());
    });
  });
});
