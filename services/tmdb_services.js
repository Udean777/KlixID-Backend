import axios from "axios";
import { ENV_VARS } from "../config/env_vars.js";

export const fetchFromTMDB = async (url) => {
  const options = {
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODVmMjc5NDkyZGI1OTExYzhjN2UxMjNlMjBmZTU0MiIsIm5iZiI6MTcwMjM2MzA4OC4zNDksInN1YiI6IjY1NzdmZmQwZTkzZTk1MjE4ZjZiZTI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sG8WNY14QGVqMWq7rz-Ngn7krBgukA9DWyBuu-UULaY",
    },
  };
  const response = await axios.get(url, options);

  if (response.status !== 200) {
    throw new Error("Failed to fetch data from TMDB" + response.statusText);
  }

  return response.data;
};
