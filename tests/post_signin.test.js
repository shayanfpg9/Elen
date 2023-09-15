const { test, beforeAll, afterAll } = require("@jest/globals");
const app = require("../app");
const { faker } = require("@faker-js/faker");
const UsersModel = require("../model/Users.model");
const request = require("supertest")(app);
const bcrypt = require("bcryptjs");
const password = faker.internet.password();
let user = {};

beforeAll(async () => {
  user = (
    await UsersModel.create({
      name: faker.person.firstName(),
      username: faker.internet.displayName(),
      password: bcrypt.hashSync(password),
      role: faker.helpers.arrayElement([
        "manager",
        "admin",
        "teacher",
        "student",
      ]),
    })
  ).toObject();
});

test("Missing fields /users/signin [POST]", async () => {
  await request
    .post("/users/signin")
    .send({})
    .expect(400)
    .expect("Content-Type", /json/);
});

test("Password is incorrect /users/signin [POST]", async () => {
  await request
    .post("/users/signin")
    .send({
      username: user.username,
      password: faker.internet.password(),
    })
    .expect(401)
    .expect("Content-Type", /json/);
});

test("Valid signin /users/signin [POST]", async () => {
  await request
    .post("/users/signin")
    .send({
      username: user.username,
      password,
    })
    .expect(200)
    .expect("Content-Type", /json/);
});

afterAll(async () => {
  await UsersModel.deleteOne({
    username: user.username,
  });
});
