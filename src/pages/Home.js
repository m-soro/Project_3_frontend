import { useState, useEffect } from "react";
import { useGetUserID } from "../hooks/useGetUserID.js";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function Home() {
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
  }, []);

  const withResults = () => {
    const myList = mountains.filter((mountain) =>
      savedMountains.includes(mountain._id)
    );
    try {
      return (
        <ul>
          {myList.map((mountainList) => (
            <li key={mountainList._id}>
              <div>
                <h3>{mountainList.listName}</h3>
              </div>
            </li>
          ))}
        </ul>
      );
    } catch (error) {
      console.log(error);
    }
  };

  const noResults = () => {
    return <div>No Lists</div>;
  };
  return (
    <div>
      {cookies.access_token ? (
        <>
          <h2>Mountains</h2>
          {savedMountains !== undefined ? withResults() : noResults()}
        </>
      ) : (
        <div>You are not logged in</div>
      )}
    </div>
  );
}
