const { test, expect } = require("@jest/globals");
const app = require("../app");
const AtomsModel = require("../model/Atoms.model");
const request = require("supertest")(app);

test("All atoms /atoms [GET]", async () => {
  const response = await request
    .get("/atoms")
    .expect(200)
    .expect("Content-Type", /json/);

  expect(response.body.action).toBe("GET-ALL-ATOMS");
  expect(response.body.data.length).toBe((await AtomsModel.find({})).length);
});
