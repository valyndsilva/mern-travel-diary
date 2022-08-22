import { Cancel, Place } from "@mui/icons-material";
import axios from "axios";
import React, { useRef, useState } from "react";
import styled from "styled-components";

function Register({ setShowRegister }) {
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
  width: 280px;
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

margin-top:15px;

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
