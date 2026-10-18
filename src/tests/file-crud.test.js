const request= require('supertest');
const app = require("../app")
const getAuthToken = require("./helpers/auth")
const connectDb = require("../db/db")
const mongoose = require("mongoose")

let token;

beforeAll(async()=>{
    await connectDb();
token = await getAuthToken();
})

afterAll(async()=>{
    await mongoose.connection.close();

})

test("get my files",async ()=>{
    const response = (await request(app).get("/api/v1/files").set("Authorization",`Bearer ${token}`));
    expect(response.status).toBe(200);
})

test("get files when list is empty",async()=>{
    const response = (await request(app).get("/api/v1/files").set("Authorization",`Bearer ${token}`));
    expect(response.status).toBe(200);
})