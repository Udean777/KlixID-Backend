import axios from "axios";
import { ENV_VARS } from "../config/env_vars.js";

export const fetchFromTMDB = async (url) => {
  const opt = {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + ENV_VARS.TMDB_API_KEY,
    },
  };

  const res = await axios.get(url, opt);

  if (response.status !== 200) {
    throw new Error("Failed to fetch data from TMDB API" + response.statusText);
  }

  return res.data;
};
