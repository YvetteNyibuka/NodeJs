const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const routes = require('./routes/users.routes')
const cloudinary = require("cloudinary").v2;


const app = express();
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.use(express.json());
app.use(routes)
app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
