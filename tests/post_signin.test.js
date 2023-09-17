const { test, beforeAll, afterAll, expect } = require("@jest/globals");
const app = require("../app");
const { faker } = require("@faker-js/faker");
const UsersModel = require("../model/Users.model");
const request = require("supertest")(app);
const bcrypt = require("bcryptjs");
const { encrypt, decrypt } = require("../encryption/aes");
const password = faker.internet.password();
const AESKey = require("crypto").randomBytes(32);
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
      api_key: faker.internet.password({ length: 5 }),
    })
  ).toObject();
});

test("Missing fields /users/signin [POST]", async () => {
  await request
    .post("/users/signin")
    .send({
      data_enc: encrypt({}, AESKey) + "%" + AESKey.toString("base64"),
    })
    .expect(400)
    .expect("Content-Type", /json/);
});

test("Password is incorrect /users/signin [POST]", async () => {
  await request
    .post("/users/signin")
    .send({
      data_enc:
        encrypt(
          {
            username: user.username,
            password: faker.internet.password() + faker.number.int(),
          },
          AESKey
        ) +
        "%" +
        AESKey.toString("base64"),
    })
    .expect(401)
    .expect("Content-Type", /json/);
});

test("Valid signin /users/signin [POST]", async () => {
  const response = await request
    .post("/users/signin")
    .send({
      data_enc:
        encrypt(
          {
            username: user.username,
            password,
          },
          AESKey
        ) +
        "%" +
        AESKey.toString("base64"),
    })
    .expect(200)
    .expect("Content-Type", /json/);

  const [data, key] = response.body.data.split("%");
  const result = decrypt(data, key);

  expect(result.username).toBe(user.username);
});

test("Undefined user signin /users/signin [POST]", async () => {
  await request
    .post("/users/signin")
    .send({
      data_enc:
        encrypt(
          {
            username: (
              faker.internet.displayName() +
              faker.number.int() +
              faker.person.jobArea()
            ).replaceAll(" ", "-"),
            password,
          },
          AESKey
        ) +
        "%" +
        AESKey.toString("base64"),
    })
    .expect(400)
    .expect("Content-Type", /json/);
});

afterAll(async () => {
  await UsersModel.deleteOne({
    username: user.username,
  });
});
