const { test, describe, beforeAll, expect } = require("@jest/globals");
const app = require("../app");
const AtomsModel = require("../model/Atoms.model");
const { faker } = require("@faker-js/faker");
const request = require("supertest")(app);

let TestAtom = {};

beforeAll(async () => {
  TestAtom = await AtomsModel.findOne({
    number: faker.number.int({
      min: 1,
      max: 119,
    }),
  });
});

describe("Query types", () => {
  test("Search atoms /atoms/search [POST] -false-", async () => {
    await request
      .post("/atoms/search")
      .send({
        query: new Object(),
      })
      .expect(400)
      .expect("Content-Type", /json/);
  });

  test("Search atoms /atoms/search [POST] -number-", async () => {
    await request
      .post("/atoms/search")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        query: TestAtom.number,
      })
      .expect(200)
      .expect("Content-Type", /json/);
  });

  test("Search atoms /atoms/search [POST] -string-", async () => {
    await request
      .post("/atoms/search")
      .send({
        query: TestAtom.name,
      })
      .expect(200)
      .expect("Content-Type", /json/);
  });
});

test("Search atoms /atoms/search [POST] -undefined-", async () => {
  await request
    .post("/atoms/search")
    .send({
      query: 120,
    })
    .expect(404)
    .expect("Content-Type", /json/);
});

describe("Limit", () => {
  test("Search atoms /atoms/search [POST] -false-", async () => {
    await request
      .post("/atoms/search")
      .send({
        query: TestAtom.number,
        limit: faker.internet.domainName(),
      })
      .expect(400)
      .expect("Content-Type", /json/);
  });

  test("Search atoms /atoms/search [POST] -false-", async () => {
    const response = await request
      .post("/atoms/search")
      .send({
        query: TestAtom.phase,
        limit: 2,
      })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body.data.results.length).toBe(2);
    expect(response.body.data.limit).toBe(2);
  });
});