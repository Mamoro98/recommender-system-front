'use client'
import React, { useState } from "react";
import Image from "next/image";
import  "./style.css";

const MovieRecommendations = () => {
  const [movieName, setMovieName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [rating, setRating] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) return setSuggestions([]);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=918cce94627c68fa3cb45b04c4dc0691&query=${query}`
      );
      const data = await response.json();
      setSuggestions(data.results.map((movie) => movie.title));
    } catch (error) {
      console.error("Error fetching movie suggestions:", error);
    }
  };

  const handleMovieChange = (e) => {
    setMovieName(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/recommend?user_id=${movieName}&rating=${rating}`
      );
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
    setLoading(false);
  };

  return (
    <div className={"container"}>
      <h1>Movie Recommendations</h1>
      <div className={"inputContainer"}>
        <input
          type="text"
          placeholder="Enter Movie Name"
          value={movieName}
          onChange={handleMovieChange}
          className={"inputBox"}
          list="suggestions"
        />
        <datalist id="suggestions">
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>

        <input
          type="text"
          placeholder="Enter Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className={"inputBox"}
        />
        <button onClick={fetchRecommendations} className={"searchButton"}>
          Get Recommendations
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={"grid"}>
          {recommendations.map((movie) => (
            <div key={movie.movieId} className={"card"}>
              <Image
                src={movie.poster}
                alt={movie.title}
                width={200}
                height={300}
                className={"poster"}
              />
              <h3 style={{color:"black"}}>{movie.title}</h3>
              <p>{movie.overview}</p>
              <p>
                <strong>Release Date:</strong> {movie.release_date}
              </p>
              <p>
                <strong>Rating:</strong> {movie.rating}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieRecommendations;