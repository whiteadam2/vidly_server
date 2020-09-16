const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("getAuthToken", () => {
  it("should return valid token", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const decoded = jwt.verify(user.getAuthToken(), config.get("jwtPrivatKey"));
    expect(decoded).toMatchObject(payload);
  });
});
