import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function NavBar({ userID }) {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  // reset the cookie
  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  const userLoggedIn = () => {
    return (
      <div className="navbar">
        <Link to="/">Home</Link>

        {!cookies.access_token ? (
          <>
            <Link to="/auth">Log in or Register</Link>
          </>
        ) : (
          <>
            <Link to="/create-data">Add Resort</Link>
            <button onClick={logout}>Log out</button>
          </>
        )}
      </div>
    );
  };

  const userNotLoggedIn = () => {
    return (
      <div className="navbar">
        <Link to="/auth">Log in or Register</Link>
      </div>
    );
  };

  return <>{userID !== null ? userLoggedIn() : userNotLoggedIn()}</>;
}
