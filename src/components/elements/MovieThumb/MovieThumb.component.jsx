import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Moment from "react-moment";
import FontAwesome from "react-fontawesome";
import "./MovieThumb.styles.css";

const MovieThumb = ({
  noRating,
  movies,
  movieAverage,
  releaseDate,
  image,
  movieId,
  movieName,
  clickable,
  styled
}) => {
  const push1 = async (movieId, movieName, image) => {
    const stringId = JSON.stringify(movieId);
    const stringName = JSON.stringify(movieName);
    const stringImage = JSON.stringify(image);

    // our array
    let moviesList = [];

    // our object
    let movies = {
      movieId: stringId,
      movieName: stringName,
      image: stringImage
    };

    moviesList.push(movies);

    // storing our array as a string
    localStorage.setItem("movieList", JSON.stringify(moviesList));

    // let updatedMoviesList = [];

    const retrievedMovies = localStorage.getItem("movieList");
    const parseRetrievedMovies = JSON.parse(retrievedMovies);
    console.log("retrievedMovies: ", retrievedMovies);
    console.log("parseRetrievedMovies: ", parseRetrievedMovies);
    parseRetrievedMovies.push(movies);
  };

  return (
    <div>
      <div className="vmdb-moviethumb" style={styled}>
        {!noRating ? (
          <div className="thumb-rating-container">
            <FontAwesome
              // onClick={() => addFavorite(movieId, movieName, image)}
              onClick={() => push1(movieId, movieName, image)}
              className="fa-heart"
              name="heart"
              size="2x"
            />
            <p>{movieAverage}</p>
          </div>
        ) : null}
        {/* You can send props via the Links "to" object. Here we create our own "movieName" */}
        {clickable ? (
          <Link
            to={{
              pathname: `/${movieId}`,
              movieName: `${movieName}`,
              movies: `${movies}`
            }}
          >
            <img className="clickable" src={image} alt="moviethumb" />
          </Link>
        ) : (
          <img src={image} alt="moviethumb" />
        )}
        <div style={{ flexWrap: "nowrap" }}>
          <h4>{movieName}</h4>
          <h6>
            <Moment format="MMM Do YYYY">{releaseDate}</Moment>
          </h6>
        </div>
      </div>
    </div>
  );
};

MovieThumb.propTypes = {
  movieAverage: PropTypes.string,
  image: PropTypes.string,
  movieId: PropTypes.number,
  movieName: PropTypes.string,
  clickable: PropTypes.bool,
  releaseDate: PropTypes.string
};

export default MovieThumb;
