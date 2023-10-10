import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  return (
    <div className="auth-page">
      <Login />
      <Register />
    </div>
  );
}

// LOGIN COMPONENT
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // set the jwt token to cookie using the useCookies hook
  // the cookie is not needed, only need the function that sets the cookie
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      // make a post request, but this time we are going to use the authenticated token
      // get the received response from the api - the jwt token from the backend
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });
      // console.log(response.data.message);
      if (response.data.message) alert(response.data.message);
      if (response.data.token) {
        // set the response to cookie
        setCookies("access_token", response.data.token);
        window.localStorage.setItem("userID", response.data.userID);
        // after successful login - redirect to homepage using useNavigate hook
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="log-in-page">
      <div className="log-in-form">
        <Form
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          label="Log In"
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};
// REGISTER COMPONENT
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [_, setCookies] = useCookies(["access_token"]);

  const onSubmit = async (event) => {
    event.preventDefault();
    // using axios to make a post request to auth/register api
    // first argument is url, then object for the body of the request
    try {
      const response = await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });
      alert(response.data.message);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form
      onSubmit={onSubmit}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Register"
    />
  );
};

// Make form generic, it is used for signing up and signing in
// the onSubmit props will be called whenever a user submits a form
// Each component that uses the form, will have a specific onSubmit function
// which do different things
const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  label,
  onSubmit,
}) => {
  return (
    <div className="auth-container container">
      <form onSubmit={onSubmit}>
        <h2>{label}</h2>
        <div className="form-group">
          <label htmlFor="username">username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">{label}</button>
      </form>
    </div>
  );
};
