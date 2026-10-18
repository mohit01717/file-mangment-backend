const request = require("supertest")
const app = require("../app")
const getAuthToken = require("./helpers/auth");
const connectDb = require("../db/db");
const mongoose = require("mongoose")
let token;
beforeAll(async()=>{
    await connectDb();
    token = await  getAuthToken();
})
afterAll(async ()=>{
   await  mongoose.connection.close();
})
test("file upload test", async () => {
  const response = await request(app)
    .post("/api/v1/files/upload")
    .set("Authorization", `Bearer ${token}`)
    .attach("image", "src/tests/fixtures/images.png");
expect(response.status).toBe(201);
});


test("file upload without token",async ()=>{
    const response = await request(app).post("/api/v1/files/upload")
    .attach("image", "src/tests/fixtures/images.png");
    expect(response.status).toBe(401);
})

test("Invalid file type upload", async () => {
  const response = await request(app)
    .post("/api/v1/files/upload")
    .set("Authorization", `Bearer ${token}`)
    .attach("image", "src/tests/fixtures/sample.pdf");
  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Only JPEG and PNG files are allowed");
})
test("Upload file larger than 2 MB",async ()=>{
    const response = await request(app)
    .post("/api/v1/files/upload")
    .set("Authorization",`Bearer ${token}`)
    .attach("image","src/tests/fixtures/large.jpg")
    expect (response.status).toBe(413);
    expect(response.body.message).toBe("File size must not exceed 2 MB")
})

test("Upload multiple valid files",async ()=>{
    const response = await request(app)
    .post("/api/v1/files/upload-multiple")
    .set("Authorization",`Bearer ${token}`)
    .attach("files","src/tests/fixtures/images.png")
    .attach("files","src/tests/fixtures/duck.jpg")
    expect(response.status).toBe(201)

})