import { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { resorts } from "../ulitities/data.js";
import Button from "@mui/material/Button";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID.js";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useCookies } from "react-cookie";

const ITEM_HEIGHT = 100;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = resorts.map((resort) => resort.label);

export default function CreateData() {
  const [cookies, _] = useCookies();
  const navigate = useNavigate();
  const userID = useGetUserID();
  const [resortName, setResortName] = useState([]);
  const [mountain, setMountain] = useState({
    listName: "",
    mountains: [],
    userOwner: userID,
  });

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setResortName(value);
  };

  const slugs = [];
  resorts.forEach((resort) => {
    resortName.forEach((selected) => {
      if (resort.label === selected) {
        slugs.push(resort.slug);
      }
    });
  });

  const handleNameChange = (event) => {
    const { name, value } = event.target;
    setMountain({ ...mountain, [name]: value });
  };

  useEffect(() => {
    setMountain({ ...mountain, mountains: slugs });
  }, [resortName]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/mountain", mountain, {
        headers: { authorization: cookies.access_token },
      });
      try {
        const response = await axios.get("http://localhost:3001/mountain");
        const mountainID = response.data.pop()._id;
        try {
          const response = await axios.put(
            "http://localhost:3001/mountain",
            {
              mountainID,
              userID,
            },
            { headers: { authorization: cookies.access_token } }
          );
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.log(error);
      }
      console.log("New mountains list added");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <TextField
          id="outlined-basic"
          label="List Name"
          variant="outlined"
          onChange={handleNameChange}
          name="listName"
        />
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">
            Resort Names
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={resortName}
            onChange={handleChange}
            input={<OutlinedInput label="Resort Names" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={resortName.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" type="submit">
          Save List
        </Button>
      </form>
      <div>You selected:</div>
      {resortName.map((mt, index) => (
        <ul key={index}>
          <li>{mt}</li>
        </ul>
      ))}
    </div>
  );
}
