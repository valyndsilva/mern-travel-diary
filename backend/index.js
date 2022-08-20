// Import express and mongoose
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");

// Create express app
const app = express();

// Configure dotenv
dotenv.config();

// The app.use() function adds a new middleware to the app. 
// Essentially, whenever a request hits your backend, Express will execute the functions you passed to app.use() in order.
// express.json() is a built in middleware function in Express starting from v4.16.0. It parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json());

// Connect to mongoose
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

// Use routes
app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
