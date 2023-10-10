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
  const myListSlugs = myList?.mountains;
  const [mountainData, setMountainData] = useState([]);

  const moreDetailedList = resorts.filter((resort) =>
    myListSlugs?.includes(resort.slug)
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
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    myListSlugs.forEach((slug) => {
      getStatistics(slug).then((res) => {
        setMountainData((mountainData) => [...mountainData, res]);
      });
    });
  }, []);

  const makeCards = (list) => {
    const filtered = mountainData.filter((md) =>
      list.slug.includes(md?.data?.slug)
    );

    if (filtered) {
      try {
        const selected = filtered.slice(0, 1);
        const { data } = selected[0];
        const { lifts } = data;
        const { status: chairStatus } = lifts; // key value pairs of chair names and status
        const { stats: openClosedSched } = lifts; // how many chairs are open/closed/onhold
        const { percentage } = openClosedSched; // ratio of chairs open/closed/scheduled
        const { href } = data; // hyperlink of the mountain
        const { location } = data; // longitude and latitude of the mountain

        delete openClosedSched.percentage;
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("There is something wrong.");
    }

    return (
      <div className="mountain-card-container">
        <article className="mountain-card-article">
          <header className="mountain-card-article-header">
            <h4>{list.name}</h4>
            <img src={`${list.img}`} alt={`${list.slug}`} />
          </header>
          <article className="chair-stats-box">
            <ul></ul>
          </article>
        </article>
      </div>
    );
  };

  return (
    <div className="styles dashboard container-fluid">
      <h1>Your Saved List</h1>
      <h2>{myListName?.toUpperCase()}</h2>
      <div className="cards-container">
        {moreDetailedList?.map((list, index) => {
          return <div key={index}>{makeCards(list, index)}</div>;
        })}
      </div>
    </div>
  );
}
