// Import express and mongoose
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Create express app
const app = express();

// Configure dotenv
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to mongoDB!");
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log("Connected to mongoDB!");
  });

app.listen(8800, () => {
  console.log("Backend server is running!");
});
