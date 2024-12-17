// Import the User model from the models directory
import { User } from "../models/user_model";

// Import the TMDB service for fetching data from the API
import { fetchFromTMDB } from "../services/tmdb_services.js";

// Controller to search for a person using TMDB API
export const searchPerson = async (req, res) => {
  const { query } = req.params; // Extract search query from request parameters

  try {
    // Fetch data from TMDB API for a person search
    const res = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );

    // Check if any results are returned
    if (res.results.length === 0) {
      return res.status(404).send(null); // Return 404 if no results found
    }

    // Save search details in user's search history
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: res.results[0].id,
          image: res.results[0].profile_path,
          title: res.results[0].name,
          searchType: "person",
          createdAt: new Date(),
        },
      },
    });

    // Return search results to the client
    res.status(200).json({ success: true, data: res.results });
  } catch (e) {
    console.log("Error in searchPerson controller: ", e.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to search for movies using TMDB API
export const searchMovies = async (req, res) => {
  const { query } = req.params; // Extract search query from request parameters

  try {
    // Fetch data from TMDB API for movie search
    const res = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    // Check if any results are returned
    if (res.results.length === 0) {
      return res.status(404).send(null); // Return 404 if no results found
    }

    // Save search details in user's search history
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: res.results[0].id,
          image: res.results[0].poster_path,
          title: res.results[0].title,
          searchType: "movie",
          createdAt: new Date(),
        },
      },
    });

    // Return search results to the client
    res.status(200).json({ success: true, data: res.results });
  } catch (e) {
    console.log("Error in searchMovie controller: ", e.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to search for TV shows using TMDB API
export const searchTvShows = async (req, res) => {
  const { query } = req.params; // Extract search query from request parameters

  try {
    // Fetch data from TMDB API for TV show search
    const res = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    // Check if any results are returned
    if (res.results.length === 0) {
      return res.status(404).send(null); // Return 404 if no results found
    }

    // Save search details in user's search history
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: res.results[0].id,
          image: res.results[0].poster_path,
          title: res.results[0].name,
          searchType: "tv",
          createdAt: new Date(),
        },
      },
    });

    // Return search results to the client
    res.status(200).json({ success: true, data: res.results });
  } catch (e) {
    console.log("Error in searchTv controller: ", e.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to retrieve user's search history
export const getSearchHistory = async (req, res) => {
  try {
    // Return user's search history
    res.status(200).json({ success: true, content: req.user.searchHistory });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to remove an item from user's search history
export const removeItemFromSearchHistory = async (req, res) => {
  let { id } = req.params; // Extract item ID from request parameters

  id = parseInt(id); // Convert ID to integer

  try {
    // Remove the specified item from user's search history
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: { id: id },
      },
    });

    // Confirm removal to the client
    res
      .status(200)
      .json({ success: true, message: "Item removed from search history" });
  } catch (e) {
    console.log("Error in removeItemFromSearchHistory controller: ", e.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
