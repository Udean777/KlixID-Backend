import { User } from "../models/user_model";
import { fetchFromTMDB } from "../services/tmdb_services.js";

export const searchPerson = async (req, res) => {
  const { query } = req.params;

  try {
    const res = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (res.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].profile_path,
          title: response.results[0].name,
          searchType: "person",
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({ success: true, data: res.results });
  } catch (e) {
    console.log("Error in searchPerson controller: ", e.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const searchMovies = async (req, res) => {
  const { query } = req.params;

  try {
    const res = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (res.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          title: response.results[0].title,
          searchType: "movie",
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({ success: true, data: res.results });
  } catch (e) {
    console.log("Error in searchMovie controller: ", e.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const searchTvShows = async (req, res) => {
  const { query } = req.params;

  try {
    const res = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (res.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          title: response.results[0].name,
          searchType: "tv",
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({ success: true, data: res.results });
  } catch (e) {
    console.log("Error in searchTv controller: ", e.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSearchHistory = async (req, res) => {
  try {
    res.status(200).json({ success: true, content: req.user.searchHistory });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const removeItemFromSearchHistory = async (req, res) => {
  let { id } = req.params;

  id = parseInt(id);

  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: { id: id },
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Item removed from search history" });
  } catch (e) {
    console.log("Error in removeItemFromSearchHistory controller: ", e.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
