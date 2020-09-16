const authentication = require("../../../middleware/auth");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("UNIT test AUTH", () => {
  const user = {
    _id: new mongoose.Types.ObjectId().toHexString(),
    isAdmin: true,
  };

  const token = new User(user).getAuthToken();

  req = { header: jest.fn().mockReturnValue(token) };
  res = {};
  next = jest.fn();

  it("it should populate decoded token in req.user", () => {
    authentication(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
