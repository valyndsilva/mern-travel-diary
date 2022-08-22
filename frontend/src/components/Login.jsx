import { Cancel, Place } from "@mui/icons-material";
import axios from "axios";
import React, { useRef, useState } from "react";
import styled from "styled-components";

function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [error, setError] = useState(false);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user", res.data.username); // set user in local storage
      setCurrentUser(res.data.username); // set user in state
      setShowLogin(false); // close login modal
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
  width: 280px;
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

margin-top:15px;

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
