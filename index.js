const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cookieParser = require("cookie-parser");
const authRoute = require("./src/routes/auth");
const userRoute = require("./src/routes/user");
const jobRoute = require("./src/routes/job");
// const userJobRoutes = require("./src/routes/userJobRoute");
const { config } = require("dotenv");

const app = express();
app.use(express.json());
app.use(cookieParser());

const accessLogStream = fs.createWriteStream(
  path.join("./src/utils", "access.log"),
  { 
    flags: "a",
  }
);
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/job", jobRoute);
//app.use("/api/v1/user", userJobRoutes);


module.exports = app;
