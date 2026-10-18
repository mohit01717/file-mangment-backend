
const app = require("./src/app");
const connectDb = require("./src/db/DB.JS");

connectDb();
app.listen(3000, () => {
  console.log("server running");
});
