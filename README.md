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
npm install bcrypt

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

// The app.use() function adds a new middleware to the app.
// Essentially, whenever a request hits your backend, Express will execute the functions you passed to app.use() in order.
// express.json() is a built in middleware function in Express starting from v4.16.0. It parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json());

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

https://www.npmjs.com/package/bcrypt
npm install bcrypt

In users.js:

```
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {
  try {
    // Generate new password
    const salt = await bcrypt.genSalt(10); // create salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt); // hash password

    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    // Save user and send response
    const saveUser = await newUser.save();
    res.status(200).json(saveUser);
    // res.status(200).json(user._id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.body.username });
    // Check if user exists
    !user && res.status(400).json("Wrong username or password!");
    // Validate password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !isPasswordValid && res.status(400).json("Wrong username or password!");
    // Send response
    res.status(200).json({_id:user._id, username: user.username});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;


```

In pins.js:

```

const router = require("express").Router();
const Pin = require("../models/Pin");

// Create a Pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all Pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


```

### Add pinRoute, userRoute and use routes in index.js:

```
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


```

### Open Postman or Rapid Api Client in VSCode and test users:

Create a POST request: ​http://localhost:8800/api/users/register
In Body, choose JSON and add some sample data and click on Send:

```
{
  "username": "wendy",
  "email":"wendy@gmail.com",
  "password": "12345"
}

```

You should get a 200 response with the following JSON response:

```
{
  "username": "wendy",
  "email": "wendy@gmail.com",
  "password": "$2b$10$v3Qkqi.7K1M3Bpj08TWPCOh3nApY8P3u9jBtLHkDdejbVef71oDdW",
  "_id": "63005c93335664514a16648f",
  "createdAt": "2022-08-20T04:01:23.828Z",
  "updatedAt": "2022-08-20T04:01:23.828Z",
  "__v": 0
}
```


Next, create a POST request: ​http://localhost:8800/api/users/login
In Body, choose JSON and add some sample data and click on Send:

```
{
  "username": "wendy",
  "password": "12345"
}

```

You should get a 200 response with the following JSON response:

```
{
  "_id": "63005806a956475aec9b2e81",
  "username": "wendy"
}
```

If the username or password is incorrect for example:

In Body, choose JSON and add wrong username or password data and click on Send:


```
{
"username": "wen",
"password": "12345"
}

```

You should get a 400 bad response with the following JSON response:

```

"Wrong username or password!"

```

### Next open your mongodb:

https://cloud.mongodb.com

Click on Collections in your cluster. You should be able to see the users query results.



### Open Postman or Rapid Api Client in VSCode and test pins:

Create a POST request: ​http://localhost:8800/api/pins
In Body, choose JSON and add some sample data and click on Send:

```

{
"username":"jacob",
"title":"Eiffel tower",
"desc":"It was an amazing place!",
"rating":5,
"lat":1234567,
"long":12345

}

```

You should get a 200 response with the following JSON response:

```

{
"username": "jacob",
"title": "Eiffel tower",
"desc": "It was an amazing place!",
"rating": 5,
"lat": 1234567,
"long": 12345,
"\_id": "62ffaa416d2ff0937510630b",
"createdAt": "2022-08-19T15:20:33.607Z",
"updatedAt": "2022-08-19T15:20:33.607Z",
"\_\_v": 0
}

```

Add a few more sample data.

Next, create a GET request: ​http://localhost:8800/api/pins
You should get a 200 response with the following JSON response:

```

[
{
"_id": "62ffc3c3e6833701dd104f07",
"username": "jacob",
"title": "Eiffel tower",
"desc": "It was an amazing place!",
"rating": 5,
"lat": 1234567,
"long": 12345,
"createdAt": "2022-08-19T17:09:23.737Z",
"updatedAt": "2022-08-19T17:09:23.737Z",
"__v": 0
},
{
"_id": "62ffc3d1e6833701dd104f09",
"username": "janet",
"title": "Brazil",
"desc": "It was an amazing place!",
"rating": 5,
"lat": 1234567,
"long": 12345,
"createdAt": "2022-08-19T17:09:37.265Z",
"updatedAt": "2022-08-19T17:09:37.265Z",
"__v": 0
},
{
"_id": "62ffc3dae6833701dd104f0b",
"username": "wendy",
"title": "Braga",
"desc": "It was an amazing place!",
"rating": 5,
"lat": 1234567,
"long": 12345,
"createdAt": "2022-08-19T17:09:46.751Z",
"updatedAt": "2022-08-19T17:09:46.751Z",
"__v": 0
}
]

```

### Next open your mongodb:

https://cloud.mongodb.com

Click on Collections in your cluster. You should be able to see the pins query results.
```
