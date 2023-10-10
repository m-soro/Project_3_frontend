import { useState, useEffect } from "react";
import { useGetUserID } from "../hooks/useGetUserID.js";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { resorts } from "../ulitities/data";
import axios from "axios";
import styles from "./Home.css";
import NotLoggedIn from "./NotLoggedIn.js";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

export default function Home({ userName }) {
  const [cookies, _] = useCookies(["access_token"]);
  const [mountains, setMountains] = useState([]);
  const [savedMountains, setSavedMountains] = useState([]);

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
  }, [savedMountains]);

  // IS THIS THE CORRECT WAY TO DO THIS????
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/mountain/delete/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const withResults = () => {
    const myList = mountains?.filter((mountain) =>
      savedMountains?.includes(mountain._id)
    );
    const detailedList = myList.map((list) => {
      return resorts.filter((r) => list.mountains.includes(r.slug));
    });

    try {
      return (
        <div className="mountain-article-container">
          <ul>
            {myList.map((mountainList, index) => (
              <li key={mountainList._id}>
                <article className="mountain-list-article">
                  <header className="mountain-list-article-header">
                    <Link to={"/dashboard"} state={{ mountainList }}>
                      <h3>{`${mountainList.listName[0].toUpperCase()}${mountainList.listName.slice(
                        1
                      )}`}</h3>
                    </Link>

                    <ImageList sx={{ width: "auto" }} cols={4} rowHeight={164}>
                      {detailedList[index].map((item) => (
                        <ImageListItem key={item.img}>
                          <img
                            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                            alt={item.title}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </header>
                  <body className="mountain-list-article-body">
                    <small>
                      Resorts in this list: {mountainList.mountains.length}
                    </small>

                    <div className="list-options">
                      <Link
                        to={`/update/${mountainList._id}`}
                        state={{ mountainList }}
                      >
                        Edit
                      </Link>
                      <Link onClick={() => handleDelete(mountainList._id)}>
                        Delete
                      </Link>
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
            {mountains?.length === 0
              ? `Hi ${userName}, your list is empty.`
              : `Hi ${userName}, your created lists:`}
          </h2>
          {mountains !== undefined || mountains?.length === 0
            ? withResults()
            : noResults()}
        </>
      ) : (
        <div className="not-logged-in">
          <NotLoggedIn />
        </div>
      )}
    </div>
  );
}
