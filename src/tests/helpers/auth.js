const request = require("supertest")
const app  = require("../../app")

async function getAuthToken() {
  const response = await request(app)
    .post("/api/v1/login")
    .send({
      email: process.env.TEST_EMAIL,
      password: process.env.TEST_PASSWORD,
    })
  return response.body.token;
}
module.exports = getAuthToken;