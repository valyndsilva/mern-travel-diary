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

## Frontend

```
cd frontend
npx create-react-app .

```

### Install Google Fonts and clean up folder structure:

Ex: Poppins choose the different font weights and copy link embed and styled. Paste them in public/index.html in the head tag:

```
  <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        font-family: "Poppins", sans-serif;
        margin:0;
      }
    </style>

```

Delete all the unnecessary files from public and src folder and clean up App.js and index.js.

```
npm start
```

### Setup Mapbox and Get Access Token:

Create an account with mapbox and login. Copy default public token and paste it into your .env file in the frontend root folder. Make sure you start the env variable with REACT*APP*....
Ex: REACT_APP_MAPBOX_ACCESS_TOKEN=......

Next, In frontend folder:

```
npm install --save react-map-gl mapbox-gl

```

https://visgl.github.io/react-map-gl/docs/get-started/get-started
https://visgl.github.io/react-map-gl/docs/get-started/mapbox-tokens

Open App.js:

```
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";

function App() {
  const [viewState, setViewState] = useState({
    longitude: 46,
    latitude: 17,
    zoom: 4,
  });
  return (
    <div className="App">
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </div>
  );
}

export default App;

```

#### Setup Mapbox styles:

Open Mapbox Gallery to create your own styles or choose an existing style. https://www.mapbox.com/gallery/

Go to account -> Create a map in studio -> New style -> Basic -> Click on the 3 dots icon and copy Style URL.
Update the Map component mapStyle attribute.
Ex: mapStyle="mapbox://styles/valyndsilva/cl71frpq4000414qpmrgkmaug"

#### Setup Markers and Icon:

##### Install Material UI Icons:

```
npm install @mui/icons-material @mui/material @emotion/styled @emotion/react

```

##### Add the Marker component between the Map component in App.js:

https://visgl.github.io/react-map-gl/docs/api-reference/marker

```
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import { Place } from "@mui/icons-material";
function App() {
  const [viewState, setViewState] = useState({
    longitude: 46,
    latitude: 17,
    zoom: 4,
  });
  return (
    <div className="App">
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/valyndsilva/cl71frpq4000414qpmrgkmaug"
      >
        <Marker
          latitude={48.858093}
          longitude={2.294694}
          offsetLeft={-20}
          offsetTop={-10}
          anchor="bottom"
        >
         <Place style={{fontSize:viewState.zoom * 7, color:"slateblue"}}/>
        </Marker>
      </Map>
      ;
    </div>
  );
}

export default App;


```

#### Add Popup Component into the Mapbox Component:

https://visgl.github.io/react-map-gl/docs/api-reference/popup

```
import { useState } from "react";
import "./App.css";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Place, Star } from "@mui/icons-material";
function App() {
  const [viewState, setViewState] = useState({
    longitude: 51.509865,
    latitude: -0.118092,
    zoom: 12,
  });
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="App">
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/valyndsilva/cl71frpq4000414qpmrgkmaug"
      >
        <Marker latitude={51.50853} longitude={-0.076132} anchor="bottom">
          <Place style={{ fontSize: viewState.zoom * 7, color: "slateblue" }} />
        </Marker>
          <Popup
            latitude={51.50853}
            longitude={-0.076132}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
          >
            <div className="card">
              <label>Place</label>
              <h4 className="place">Eiffel Tower</h4>
              <label>Review</label>
              <p className="desc">Beautiful place to visit.</p>
              <label>Rating</label>
              <div className="stars">
                <Star className="star"/>
                <Star className="star"/>
                <Star className="star"/>
                <Star className="star"/>
                <Star className="star"/>
              </div>
              <label>Information</label>
              <span className="username">
                Created by <b>valyn</b>
              </span>
              <span className="date">1 hour ago</span>
            </div>
          </Popup>
      </Map>
      ;
    </div>
  );
}

export default App;

```

### Call Backend Server:

Open package.json and add:
"proxy":"http://localhost:8800/api"

#### Install axios and timeago.js in frontend folder:

npm install axios
npm install timeago.js
Helps to send requests to the backend server.

#### Start backend server:

cd backend
npm start

Update App.js to fetch all pins from the backend server when page is refreshed:

```
import { useEffect, useState } from "react";
import "./App.css";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Place, Star } from "@mui/icons-material";
import axios from "axios";
import { format } from "timeago.js";

function App() {
  const [viewState, setViewState] = useState({
    longitude: 51.509865,
    latitude: -0.118092,
    zoom: 12,
  });
  // const [showPopup, setShowPopup] = useState(true);
  const [pins, setPins] = useState([]);
  console.log(pins);

  // Fetch all pins whenever page is refreshed
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins"); // since we have a proxy in place in package.json, we don't need to specify the complete url here.
        console.log(res.data);
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  return (
    <div className="App">
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/valyndsilva/cl71frpq4000414qpmrgkmaug"
      >
        {pins.map((pin) => (
          <div key={pin._id}>
            <Marker latitude={pin.lat} longitude={pin.long} anchor="bottom">
              <Place
                style={{ fontSize: viewState.zoom * 7, color: "slateblue" }}
              />
            </Marker>
            <Popup
              latitude={pin.lat}
              longitude={pin.long}
              anchor="left"
              closeButton={true}
              closeOnClick={false}
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{pin.title}</h4>
                <label>Review</label>
                <p className="desc">{pin.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <b>{pin.user}</b>
                </span>
                <span className="date">{format(pin.createdAt)}</span>
              </div>
            </Popup>
          </div>
        ))}
      </Map>
      ;
    </div>
  );
}

export default App;



```

#### Add a dummy currentUser with a different colour Marker Pin from other users Marker pins:

```
  // Dummy currentUser
  const currentUser = "Jackie";

...

 <Marker latitude={pin.lat} longitude={pin.long} anchor="bottom">
              <Place
                style={{
                  fontSize: viewState.zoom * 7,
                  color: pin.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(pin._id)}
              />
 </Marker>
```

#### Open Popup when Marker is clicked:

```

  const [currentPlaceId, setCurrentPlaceId] = useState(null);

  // Marker click
  const handleMarkerClick = (placeId) => {
    setCurrentPlaceId(placeId);
  };

  ....

   <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/valyndsilva/cl71frpq4000414qpmrgkmaug"
      >
        {pins.map((pin) => (
          <div key={pin._id}>
         <Marker latitude={pin.lat} longitude={pin.long} anchor="bottom">
              <Place
                style={{
                  fontSize: viewState.zoom * 7,
                  color: pin.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(pin._id)}
              />
        </Marker>
            {pin._id === currentPlaceId && (
              <Popup
                latitude={pin.lat}
                longitude={pin.long}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
                closeButton={true}
                closeOnClick={false}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.user}</b>
                  </span>
                  {/* <span className="date">{format(pin.createdAt)}</span> */}
                </div>
              </Popup>
            )}
          </div>
        ))}
      </Map>

```

#### Add Pin when double clicked on a Map:

```

  const [newPlace, setNewPlace] = useState(null);
  console.log(newPlace);

  // Add Pin on double click
  const handleAddPinClick = (e) => {
    console.log(e);
    console.log(e.lngLat.lng);
    console.log(e.lngLat.lat);
    setNewPlace({ lat: e.lngLat.lat, long: e.lngLat.lng });
  };

  ....

        <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/valyndsilva/cl71frpq4000414qpmrgkmaug"
        onDblClick={handleAddPinClick}
      >
        {pins.map((pin) => (
          <div key={pin._id}>
            <Marker latitude={pin.lat} longitude={pin.long} anchor="bottom">
              <Place
                style={{
                  fontSize: viewState.zoom * 7,
                  color: pin.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(pin._id)}
              />
            </Marker>
            {pin._id === currentPlaceId && (
              <Popup
                latitude={pin.lat}
                longitude={pin.long}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
                closeButton={true}
                closeOnClick={false}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
          </div>
        ))}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            anchor="left"
            onClose={() => setNewPlace(null)}
            closeButton={true}
            closeOnClick={false}
          >
            New Pin
          </Popup>
        )}
      </Map>

```

#### Update handleMarkerClick to center on click:

```
    // Marker click
  const handleMarkerClick = (placeId, lat,long) => {
    setCurrentPlaceId(placeId);
    setViewState({...viewState, latitude: lat, longitude: long});
  };

  ...

        <Marker latitude={pin.lat} longitude={pin.long} anchor="bottom">
              <Place
                style={{
                  fontSize: viewState.zoom * 7,
                  color: pin.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
              />
        </Marker>

```

#### Add a smooth transition while centering the map on click:

```
    <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/valyndsilva/cl71frpq4000414qpmrgkmaug"
        onDblClick={handleAddPinClick}
        transitionDuration="500"
      >
      ...

      </Map>
```

#### Update the new pin Popup:

State for adding a new pin:

```

  // State for adding new pins
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

```

#### Update both Popup in the component:

```
        <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/valyndsilva/cl71frpq4000414qpmrgkmaug"
        onDblClick={handleAddPinClick}
        transitionDuration="500"
      >
        {pins.map((pin) => (
          <div key={pin._id}>
            <Marker latitude={pin.lat} longitude={pin.long} anchor="bottom">
              <Place
                style={{
                  fontSize: viewState.zoom * 7,
                  color: pin.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
              />
            </Marker>
            {pin._id === currentPlaceId && (
              <Popup
                latitude={pin.lat}
                longitude={pin.long}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
                closeButton={true}
                closeOnClick={false}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(pin.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
          </div>
        ))}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            anchor="left"
            onClose={() => setNewPlace(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Leave a review"
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
      </Map>
```

#### Add the handleSubmit method:

```

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };
```

CSS:

```

input,textarea,select {
  border: none;
  border-bottom: 1px solid gray;
}

input::placeholder,
textarea::placeholder {
  font-size: 12px;
  color: rgb(172, 169, 169);
}

.submitButton {
  border: none;
  border-radius: 5px;
  padding: 5px;
  background-color: tomato;
  color: white;
  font-size: 12px;
  cursor: pointer;
}

```

#### Add currentUser state hoooks in App.js:

```
  const [currentUser, setCurrentUser] = useState(null);
```

#### Add the Login, Logout, Register buttons logic below add new place popup in App.js:

```
     {currentUser ? (
          <button className="button logout">Log out</button>
        ) : (
          <div className="buttons">
            <button className="button login">Login</button>
            <button className="button register ">Register</button>
          </div>
        )}

```

CSS:

```

.button {
  border: none;
  padding: 5px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}
.buttons,
.logout {
  position: absolute;
  top: 10px;
  right: 10px;
}

.logout {
  background-color: tomato;
}

.login {
  background-color: teal;
  margin-right:10px;
}

.register {
  background-color: slateblue;
}

```

### React Login and Register Page:

Next create components folder and files Login.jsx, Register.jsx.

```
npm install styled-components
```

In App.js:

```
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  ....

  {currentUser ? (
          <button className="button logout">Log out</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && <Login setShowLogin={setShowLogin} />}
```

So now when you click o Register button it show open the Register form.

#### Register.jsx:

```
import { Cancel, Place } from "@mui/icons-material";
import axios from "axios";
import React, { useRef, useState } from "react";
import styled from "styled-components";

function Register({setShowRegister}) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <Container>
      <Logo>
        <Place /> Travel Diary
      </Logo>
      <Form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="email" placeholder="Email" ref={emailRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button>Register</button>
        {success && (
          <span className="success">
            Registered successfully! Please Login.
          </span>
        )}
        {error && (
          <span className="error">Something went wrong! Please try again.</span>
        )}
      </Form>
         <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </Container>
  );
}

export default Register;

const Container = styled.div`
  position: absolute;
  width: 300px;
  height: 250px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .registerCancel {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  color: slateblue;
  font-size: 1.2rem;
  font-weight: bold;
`;

const Form = styled.form`
  button {
    border: none;
    padding: 5px;
    border-radius: 5px;
    color: white;
    background-color: slateblue;
    cursor: pointer;
  }
  .success {
    color: green;
    font-size: 12px;
    text-align: center;
  }
  .error {
    color: red;
    font-size: 12px;
    text-align: center;
  }
`;


```

#### Login.jsx:

```

import { Cancel, Place } from "@mui/icons-material";
import axios from "axios";
import React, { useRef, useState } from "react";
import styled from "styled-components";

function Login({ setShowLogin }) {
  const [error, setError] = useState(false);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const existingUser = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/login", existingUser);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <Container>
      <Logo>
        <Place /> Travel Diary
      </Logo>
      <Form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button>Login</button>

        {error && (
          <span className="error">Something went wrong! Please try again.</span>
        )}
      </Form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </Container>
  );
}

export default Login;

const Container = styled.div`
  position: absolute;
  width: 300px;
  height: 200px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .loginCancel {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  color: teal;
  font-size: 1.2rem;
  font-weight: bold;
`;

const Form = styled.form`
  button {
    border: none;
    padding: 5px;
    border-radius: 5px;
    color: white;
    background-color: teal;
    cursor: pointer;
  }
  .error {
    color: red;
    font-size: 12px;
    text-align: center;
  }
`;


```

### Using React Local Storage:

Open Developer Tools -> Application -> Storage -> Local Storage -> localhost. Here we have access to the key and value pair in the local storage.

We will store the username in localstorage to implement the logout system.

In App.js:

```
  const myStorage = window.localStorage;
  ...

     {showRegister && <Register setShowRegister={setShowRegister} />}
     {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
```

Next, in Login.jsx:

```
function Login({ setShowLogin, myStorage, setCurrentUser }) {
    ...


const handleSubmit = async (e) => {
    e.preventDefault();
    const existingUser = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", existingUser);
      myStorage.setItem("user", res.data.username); // set user in local storage
      setCurrentUser(res.data.username); // set user in state
      setShowLogin(false); // close login modal
      setError(false);
    } catch (err) {
      setError(true);
    }
  };
```

Now when you try to login you can see the user details in the console under local storage.

### React Logout System using localStorage:

In App.js:

```
  const myStorage = window.localStorage;
  // const [currentUser, setCurrentUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };
....

    {currentUser ? (
          <button className="button logout" onClick={handleLogout}>Log out</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
```
