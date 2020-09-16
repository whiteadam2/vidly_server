const { Rental } = require("../../../models/rental");
const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../../models/user");
const { Movie } = require("../../../models/movie");
const moment = require("moment");

let server;

describe("POST /api/returns", () => {
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .send({ customerId, movieId })
      .set("x-auth-token", token);
  };

  beforeEach(() => (server = require("../../../index")));
  afterEach(async () => {
    await server.close();
    await Rental.collection.deleteMany({});
    await Movie.collection.deleteMany({});
  });

  beforeEach(async () => {
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().getAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });

    await rental.save();

    movie = new Movie({
      _id: movieId,
      title: "123",
      numberInStock: 10,
    });

    await movie.save();
  });

  it("shold find rental", async () => {
    const res = await Rental.findById(rental._id);
    expect(res).toBeDefined;
  });

  it("should return 401 error if client not log in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 error if customer is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 error if movie is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 error if customer/movie not found", async () => {
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 error if rental already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if request is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should be definded dateReturned property in rental object", async () => {
    const res = await exec();
    rental = await Rental.findById(rental._id);
    const diff = new Date() - rental.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should be return rentalFee if request is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const res = await exec();
    rental = await Rental.findById(rental._id);
    expect(rental.rentalFee).toBe(14);
  });

  it("should increase numberInStock of movie if request is valid", async () => {
    const res = await exec();
    movie = await Movie.findById(movieId);
    expect(movie.numberInStock).toBe(11);
  });

  it("should return rental if request is valid", async () => {
    const res = await exec();
    rental = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
