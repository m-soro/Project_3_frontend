/* eslint-disable jsx-a11y/no-redundant-roles */
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { resorts } from "../ulitities/data";
import styles from "./Edit.css";

export default function Edit() {
  const { state } = useLocation();
  const listId = state?.mountainList._id;
  const [listToEdit, setListToEdit] = useState();
  const [listName, setListName] = useState();
  const navigate = useNavigate();

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/mountain/update/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleEdit(listId).then((res) => {
      setListToEdit(res);
    });
  }, []);

  const handleListNameChange = (event) => {
    const { listName, value } = event.target;
    setListName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/mountain/update/${listToEdit.message?._id}`,
        {
          listName: listName,
        }
      );
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const myDetailedLists = resorts.filter((r) =>
    listToEdit?.message?.mountains?.includes(r.slug)
  );

  const populateList = () => {
    return myDetailedLists.map((listItem) => {
      return <li>{listItem.label}</li>;
    });
  };
  return (
    <div className="container styles">
      <h2>Rename your list</h2>

      {listToEdit !== undefined ? (
        <>
          <form onSubmit={onSubmit} className="edit-form">
            <div className="text-input">
              List Name:{" "}
              <input
                type="text"
                name="listName"
                onChange={handleListNameChange}
                defaultValue={listToEdit.message?.listName}
                required
              />
              <small>*editing specific list items is not allowed*</small>
            </div>
            <br />

            <button
              type="submit"
              role="button"
              className="outline edit-submit-button"
            >
              submit
            </button>
          </form>

          {myDetailedLists !== null && myDetailedLists !== undefined ? (
            <ul className="included-resorts">
              <p>This list includes:</p>
              {populateList()}
            </ul>
          ) : (
            <div>This list is empty.</div>
          )}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
