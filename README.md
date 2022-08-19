# Travel Diary App

A travel diary application built using MERN stack, Mapbox, React Hooks, React Icons and Tailwind CSS that lets you pin the places you have visited and keep track of your travels.

## Commands used in terminal:

### In mern-travel-diary folder:

touch README.md
mkdir backend && mkdir frontend

### In backend folder:

cd backend
npm install express mongoose
npm install nodemon
npm install dotenv (to protect your environment variables)
npm init
npm start

### In frontend folder:

cd frontend

## Backend:

Create a index.js in backend root folder.

Update package.json:
"scripts": {
"start": "nodemon index.js"
},

### Create a MondoDb Cluster:

- Create a mongodb account at https://www.mongodb.com/
- Create a free shared cluster
- Connect -> Connect your application -> Copy the connection string into your application.

### Create a .env file in backend folder:

```
MONGO_URL= "paste the mongodb connection string"

```

### Connecting to MongoDB with Mongoose

https://mongoosejs.com/docs/connections.html

In index.js:

```
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


```

### Create mongodb models and routes:

In the backend folder, create 2 folders models and routes.

#### In models create 2 files: User.js and Pin.js

In User.js:

```
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

```

In Pin.js:

```
const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
      min: 3,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pin", PinSchema);

```

#### In routes create 2 files: users.js and pins.js:
