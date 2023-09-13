const { test, expect, describe, beforeAll } = require("@jest/globals");
const app = require("../app");
const AtomsModel = require("../model/Atoms.model");
const { faker } = require("@faker-js/faker");
const request = require("supertest")(app);

let AtomName = "";

beforeAll(async () => {
  AtomName = (
    await AtomsModel.findOne({
      number: faker.number.int({
        min: 1,
        max: 119,
      }),
    })
  ).name;
});

describe("Without translate", () => {
  test("Get single atom /atoms/%NAME% [GET] -undefined-", async () => {
    const response = await request
      .get(`/atoms/${faker.person.fullName()}`)
      .expect(404)
      .expect("Content-Type", /json/);

    expect(response.body.error).toBeTruthy();
    expect(response.body.data.message).toBe("name is undefined");
  });

  test("Get single atom /atoms/%NAME% [GET] -defined-", async () => {
    const response = await request
      .get(`/atoms/${AtomName}`)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body.error).toBeFalsy();
    expect(response.body.data.name).toBe(AtomName);
  });
});

describe("With translate", () => {
  test("Get single atom translate to en /atoms/%NAME%/?translate=en [GET]", async () => {
    const response = await request
      .get(`/atoms/${AtomName}/?translate=en`)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeTruthy();
  });

  test("Get single atom translate to fa /atoms/%NAME%/?translate=fa [GET]", async () => {
    const response = await request
      .get(`/atoms/${AtomName}?translate=fa`)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body.data.fa).toBeTruthy();
    expect(response.body.data.fa).not.toBeUndefined();
    expect(JSON.stringify(response.body.data.fa)).not.toBe("{}");
  });

  test("Get single atom translate to ja /atoms/%NAME%?translate=ja [GET]", async () => {
    const response = await request
      .get(`/atoms/${AtomName}?translate=ja`)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body.data.ja).toBeTruthy();
    expect(response.body.data.ja).not.toBeUndefined();
    expect(JSON.stringify(response.body.data.ja)).not.toBe("{}");
  });

  test("Get single atom translate to abcde /atoms/%NAME%/?translate=abcde [GET] -undefined-", async () => {
    const response = await request
      .get(`/atoms/${AtomName}/?translate=abcde`)
      .expect(400)
      .expect("Content-Type", /json/);

    expect(response.body.error).toBeTruthy();
  });
});
