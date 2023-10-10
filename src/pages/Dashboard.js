import axios from "axios";
import { resorts } from "../ulitities/data";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Dashboard.css";
import { useState } from "react";

export default function Dashboard() {
  const { state } = useLocation();
  const myList = state?.mountainList;
  const myListName = state?.mountainList.listName;
  const myListSlugs = myList.mountains;
  const [mountainData, setMountainData] = useState(null);

  // console.log("My List Slugs", myListSlugs);
  // console.log("MyList", myList);
  // console.log("The resorts array ", resorts[0]);

  const moreDetailedList = resorts.filter((resort) =>
    myListSlugs.includes(resort.slug)
  );

  const getStatistics = async (slug) => {
    const options = {
      method: "GET",
      url: `https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${slug}`,
      headers: {
        "X-RapidAPI-Key": "dfd428dbdcmshe06643051b38c0bp1a4bd8jsn59da54a4c468",
        "X-RapidAPI-Host": "ski-resorts-and-conditions.p.rapidapi.com",
      },
    };
    try {
      const response = await axios.request(options);
      // console.log(response.data.data.location); // to get the coordinates
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const makeCards = (list) => {
    return (
      <div className="mountain-card-container">
        <article className="mountain-card-article">
          <header className="mountain-card-article-header">
            <h3>{list.name}</h3>
            <img src={`${list.img}`} alt={`${list.slug}`} />
          </header>
          <article className="chair-stats-box">
            <div>Statistics Go Here</div>
          </article>
        </article>
      </div>
    );
  };

  return (
    <div className="styles dashboard container">
      <h1>Your Saved List</h1>
      <h2>{`${myListName[0].toUpperCase()}${myListName.slice(1)}`}</h2>
      <div className="cards-container">
        {moreDetailedList.map((list, index) => {
          return <div key={index}>{makeCards(list)}</div>;
        })}
      </div>
    </div>
  );
}
