const { test } = require("@jest/globals");
const app = require("../app");
const request = require("supertest")(app);
const { faker } = require("@faker-js/faker");

test("Unknown gotways * [All]", async () => {
  await request.get(`/@${faker.string.alpha()}`).expect(404);
  await request.post(`/@${faker.string.alpha()}`).expect(404);
});
