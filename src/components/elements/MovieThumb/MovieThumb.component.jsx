import React, { useState } from "react";
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
  const [favMovies, setFavMovies] = useState({});
  // // const [favList, setFavList] = setFavList([]);

  const addFavorite = (movieId, movieName, image) => {
    setFavMovies({ movieId, movieName, image });
  };
  console.log(favMovies);
  return (
    <div>
      <button style={{ backgroundColor: "white" }}>click here</button>
      <div className="vmdb-moviethumb" style={styled}>
        {!noRating ? (
          <div className="thumb-rating-container">
            <FontAwesome
              onClick={() => addFavorite(movieId, movieName, image)}
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
