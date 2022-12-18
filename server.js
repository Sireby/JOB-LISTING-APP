
const app = require("./index");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT;

mongoose.connect(process.env.DB_URL);

mongoose.connection.once("open", () => {
  console.log("Connected to Database!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
