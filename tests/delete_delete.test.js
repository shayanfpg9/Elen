const { test, beforeAll, afterAll } = require("@jest/globals");
const app = require("../app");
const { faker } = require("@faker-js/faker");
const UsersModel = require("../model/Users.model");
const request = require("supertest")(app);
const bcrypt = require("bcryptjs");
const key = require("../functions/key");
const jwt = require("jsonwebtoken");
const password = faker.internet.password();
let user = {};

beforeAll(async () => {
  user = await UsersModel.create({
    name: faker.person.firstName(),
    username: faker.internet.displayName(),
    password: bcrypt.hashSync(password),
    role: faker.helpers.arrayElement([
      "manager",
      "admin",
      "teacher",
      "student",
    ]),
    api_key: faker.internet.password({ length: 5 }),
  });

  const token = jwt.sign(
    {
      username: user.username,
    },
    key("private"),
    {
      algorithm: "RS256",
      expiresIn: "1h",
    }
  );

  user.token = token;
});

test("Missing fields /users/delete [DELETE]", async () => {
  await request
    .delete(`/users/delete/${user.username}`)
    .send({})
    .expect(401)
    .expect("Content-Type", /json/);

  await request
    .delete(`/users/delete/${user.username}`)
    .set("Authorization", user.token)
    .send({})
    .expect(400)
    .expect("Content-Type", /json/);

  await request
    .delete(`/users/delete/${user.username}`)
    .set("Authorization", user.token)
    .send({ password: faker.internet.password() })
    .expect(403)
    .expect("Content-Type", /json/);

  await request
    .delete(`/users/delete/${user.username}`)
    .send({ password })
    .expect(401)
    .expect("Content-Type", /json/);

  await request
    .delete(`/users/delete/123`)
    .set("Authorization", user.token)
    .send({ password })
    .expect(404)
    .expect("Content-Type", /json/);
});

test("Delete user /users/delete [DELETE]", async () => {
  await request
    .delete(`/users/delete/${user.username}`)
    .set("Authorization", user.token)
    .send({
      password,
    })
    .expect(200)
    .expect("Content-Type", /json/);
});

test("User not found /users/delete [DELETE]", async () => {
  await request
    .delete(`/users/delete/${user.username}`)
    .set("Authorization", user.token)
    .send({
      password,
    })
    .expect(404)
    .expect("Content-Type", /json/);
});

afterAll(async () => {
  await UsersModel.deleteOne({
    username: user.username,
  });
});
