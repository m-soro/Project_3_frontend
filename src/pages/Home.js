import { useState, useEffect } from "react";
import { useGetUserID } from "../hooks/useGetUserID.js";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { resorts } from "../ulitities/data";
import axios from "axios";
import styles from "./Home.css";
import NotLoggedIn from "./NotLoggedIn.js";

export default function Home() {
  const [cookies, _] = useCookies(["access_token"]);
  const [mountains, setMountains] = useState([]);
  const [savedMountains, setSavedMountains] = useState([]);

  console.log("this is the mountains props ", mountains);
  console.log("this is the savedMountains props ", mountains);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchMountains = async () => {
      try {
        const response = await axios.get("http://localhost:3001/mountain");
        setMountains(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSavedMountains = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/mountain/savedMountains/ids/${userID}`
        );
        setSavedMountains(response.data.savedMountains);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMountains();
    fetchSavedMountains();
  }, []);

  const withResults = () => {
    const myList = mountains.filter((mountain) =>
      savedMountains.includes(mountain._id)
    );

    try {
      return (
        <div className="mountain-article-container">
          <ul>
            {myList.map((mountainList) => (
              <li key={mountainList._id}>
                <article className="mountain-list-article">
                  <header className="mountain-list-article-header">
                    <Link to={"/dashboard"} state={{ mountainList }}>
                      <h3>{`${mountainList.listName[0].toUpperCase()}${mountainList.listName.slice(
                        1
                      )}`}</h3>
                    </Link>
                  </header>
                  <body className="mountain-list-article-body">
                    <small>
                      Resorts in this list: {mountainList.mountains.length}
                    </small>
                    <div className="list-options">
                      <Link to="/edit-data">Edit</Link>
                      <Link to="/delete/:id">Delete</Link>
                    </div>
                  </body>
                </article>
              </li>
            ))}
          </ul>
        </div>
      );
    } catch (error) {
      console.log(error);
    }
  };

  const noResults = () => {
    return <div>No Lists</div>;
  };
  return (
    <div className="container home styles">
      {cookies.access_token ? (
        <>
          <h2>
            {savedMountains.length === 0
              ? "Your created list will appear here"
              : "Your created lists:"}
          </h2>
          {savedMountains !== undefined ? withResults() : noResults()}
        </>
      ) : (
        <div className="not-logged-in">
          <NotLoggedIn />
        </div>
      )}
    </div>
  );
}
