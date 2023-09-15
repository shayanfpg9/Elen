const { test, afterAll } = require("@jest/globals");
const app = require("../app");
const { faker } = require("@faker-js/faker");
const UsersModel = require("../model/Users.model");
const request = require("supertest")(app);
let username = "";

test("Missing fields /users/signup [POST]", async () => {
  await request
    .post("/users/signup")
    .send({
      name: faker.person.firstName(),
      username: faker.internet.displayName(),
      role: faker.helpers.arrayElement([
        "manager",
        "admin",
        "teacher",
        "student",
      ]),
    })
    .expect(400)
    .expect("Content-Type", /json/);
});

test("Create new user /users/signup [POST]", async () => {
  const response = await request
    .post("/users/signup")
    .send({
      name: faker.person.firstName(),
      username: faker.internet.displayName(),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement([
        "manager",
        "admin",
        "teacher",
        "student",
      ]),
    })
    .expect(201)
    .expect("Content-Type", /json/);

  username = response.body.data.username;
});

test("Duplicate users /users/signup [POST]", async () => {
  await request
    .post("/users/signup")
    .send({
      name: faker.person.firstName(),
      username,
      password: faker.internet.password(),
      role: faker.helpers.arrayElement([
        "manager",
        "admin",
        "teacher",
        "student",
      ]),
    })
    .expect(409)
    .expect("Content-Type", /json/);
});

afterAll(async () => {
  await UsersModel.deleteOne({
    username,
  });
});
