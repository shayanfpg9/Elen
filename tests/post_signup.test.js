const { test, afterAll } = require("@jest/globals");
const app = require("../app");
const { faker } = require("@faker-js/faker");
const UsersModel = require("../model/Users.model");
const { encrypt, decrypt } = require("../encryption/aes");
const request = require("supertest")(app);
const AESKey = require("crypto").randomBytes(32);
let username = "";

test("Missing fields /users/signup [POST]", async () => {
  await request
    .post("/users/signup")
    .send({
      data_enc:
        encrypt(
          {
            username: faker.person.fullName(),
            password: faker.internet.password({ length: 5 }),
            role: faker.person.jobTitle(),
          },
          AESKey
        ) +
        "%" +
        AESKey.toString("base64"),
    })
    .expect(400)
    .expect("Content-Type", /json/);
});

test("Create new user /users/signup [POST]", async () => {
  const response = await request
    .post("/users/signup")
    .send({
      data_enc:
        encrypt(
          {
            name: faker.person.firstName(),
            username: faker.internet.displayName(),
            password: faker.internet.password({ length: 10, prefix: "Ae1@" }),
            role: faker.helpers.arrayElement([
              "manager",
              "admin",
              "teacher",
              "student",
            ]),
          },
          AESKey
        ) +
        "%" +
        AESKey.toString("base64"),
    })
    .expect(201)
    .expect("Content-Type", /json/);

  const [data, key] = response.body.data.split("%");

  username = decrypt(data, key).username;
});

test("Duplicate users /users/signup [POST]", async () => {
  await request
    .post("/users/signup")
    .send({
      data_enc:
        encrypt(
          {
            name: faker.person.firstName(),
            username: username,
            password: faker.internet.password({ length: 10, prefix: "Ae1@" }),
            role: faker.helpers.arrayElement([
              "manager",
              "admin",
              "teacher",
              "student",
            ]),
          },
          AESKey
        ) +
        "%" +
        AESKey.toString("base64"),
    })
    .expect(409)
    .expect("Content-Type", /json/);
});

afterAll(async () => {
  await UsersModel.deleteOne({
    username,
  });
});
