import { useEffect, useState } from "react";
import "./App.css";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Place, Star } from "@mui/icons-material";
import axios from "axios";
import { format } from "timeago.js";
import { Login, Register } from "./components";

function App() {
  const myStorage = window.localStorage;
  // Dummy currentUser
  // const currentUser = "Jackie";
  // const [currentUser, setCurrentUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: -0.1072,
    latitude: 51.5045,
    zoom: 10,
  });
  // const [showPopup, setShowPopup] = useState(true);
  const [pins, setPins] = useState([]);
  console.log({ pins });

  const [currentPlaceId, setCurrentPlaceId] = useState(null);

  // Marker click
  const handleMarkerClick = (placeId, lat, long) => {
    setCurrentPlaceId(placeId);
    setViewState({ ...viewState, latitude: lat, longitude: long });
  };

  const [newPlace, setNewPlace] = useState(null);
  console.log({ newPlace });

  // Add Pin on double click
  const handleAddPinClick = (e) => {
    console.log(e);
    console.log(e.lngLat.lng);
    console.log(e.lngLat.lat);
    setNewPlace({ lat: e.lngLat.lat, long: e.lngLat.lng });
  };

  // State for adding new pins
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

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
      // The reason for this runtime error .map not a function  is that handleSubmit() is updating the pins state to a non-array type: setPins(...pins, res.data);
      //When handleSubmit() is called, the pins state value is no longer an array which in turn means that pins.map() is no longer defined, hence the error: ".map() is not a function". Change the code to  ensure that pins is updated as a new array []:
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Fetch all pins whenever page is refreshed
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins"); // since we have a proxy in place in package.json, we don't need to specify the complete url here.
        console.log("getPins", res.data);
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
        onDblClick={handleAddPinClick}
        transitionDuration="500"
      >
        {pins.map((pin) => (
          <div key={pin._id}>
            <Marker
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={-viewState.zoom * 3.5}
              offsetTop={-viewState.zoom * 7}
            >
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
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
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
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </Map>
    </div>
  );
}

export default App;
