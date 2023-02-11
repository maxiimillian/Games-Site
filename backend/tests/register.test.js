const app = require("../app.js");

const UserModel = require("../models/User");
const TokenModel = require("../models/Token");

const createUser = require("../database/createUser");
const refreshToken = require("../database/refreshToken");
const loginUser = require("../database/loginUser");
const getProfile = require("../database/getProfile");
const mongoose = require("mongoose");
const request = require("supertest");

describe("When creating an account", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/JestDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(async () => {
      await mongoose.connection.close();
    });
  });

  it("All information is sent", (done) => {
    let username = "TestUser123";
    let email = "testemail@mail.com";
    let password = "TestPassword123";

    request(app)
      .post("/auth/register")
      .send({ username: username, email: email, password: password })
      .end((err, res) => {
        let data = JSON.parse(res.text);

        expect(err).toBeNull();
        expect(res.status).toEqual(200);

        UserModel.findOne({ username: username }, (err, user) => {
          expect(err).toBeNull();
          expect(user.user_id).toEqual(data.user_id);

          TokenModel.findOne({ user_id: data.user_id }, (err, tokenObj) => {
            expect(err).toBeNull();
            expect(tokenObj.token).toEqual(data.token);

            done();
          });
        });
      });
  });

  it("Some information is missing", (done) => {
    let username = "TestUser12345";
    let email = null;
    let password = "TestPassword12345";

    request(app)
      .post("/auth/register")
      .send({ username: username, email: email, password: password })
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.status).toEqual(400);

        UserModel.findOne({ username: username }, (err, user) => {
          expect(err).toBeNull();
          expect(user).toBeNull();

          done();
        });
      });
  });

  it("Info is taken", (done) => {
    let username = "TestUser1234";
    let email = "testemail4@mail.com";
    let password = "TestPassword123";

    request(app)
      .post("/auth/register")
      .send({ username: username, email: email, password: password })
      .end((err, res) => {
        request(app)
          .post("/auth/register")
          .send({ username: username, email: email, password: password })
          .end((err, res_other) => {
            expect(res_other.status).toEqual(400);
            expect(JSON.parse(res_other.text)).toEqual({
              error: "400 <Missing Information>",
            });
            done();

            UserModel.find({ username: username }, (err, docs) => {
              expect(docs.length).toEqual(1);
              done();
            });
          });
      });
  });
});
