import React, { useState } from "react";
import { IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE } from "../../../config";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import MovieThumb from "../MovieThumb/MovieThumb.component";
import Moment from "react-moment";
import VeriffModal from "../VeriffModal/VeriffModal";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MovieInfo.styles.css";

const MovieInfo = ({ movie, directors, genres }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div
      className="vmdb-movieinfo"
      style={{
        background: movie.backdrop_path
          ? `url('${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.backdrop_path}')`
          : "#000"
      }}
    >
      <div className="vmdb-movieinfo-content">
        <div className="vmdb-movieinfo-thumb thumbTwo">
          <MovieThumb
            noRating
            image={
              movie.poster_path
                ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                : "./images/no_image.jpg"
            }
            clickable={false}
          />
        </div>
        <div className="vmdb-movieinfo-text">
          <h1>
            {movie.title} - (<Moment format="YYYY">{movie.release_date}</Moment>
            )
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            {movie.genres.map((element, i) => {
              return (
                <div>
                  <p key={element.id} className="vmdb-director">
                    {element.name}
                  </p>
                </div>
              );
            })}
          </div>
          <h3>Overview</h3>
          <p>{movie.overview}</p>
          <h3>IMDB RATING</h3>
          <div className="vmdb-rating">
            <meter
              min="0"
              max="100"
              optimum="100"
              low="40"
              high="70"
              value={movie.vote_average * 10}
            ></meter>
            <p className="vmdb-score">{movie.vote_average}</p>
          </div>
          {directors.length > 1 ? <h3>DIRECTORS</h3> : <h3>DIRECTOR</h3>}
          {directors.map((element, i) => {
            return (
              <p key={i} className="vmdb-director">
                {element.name}
              </p>
            );
          })}
        </div>
        <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button>
        {movie.adult && movie.adult === "true" ? (
          <p style={{ color: "white" }}>adult movie</p>
        ) : null}
        <a href={`https://www.themoviedb.org/movie/${movie.id}-deadpool/watch`}>
          <FontAwesome className="fa-film" name="film" size="5x" />
        </a>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

MovieInfo.propTypes = {
  movie: PropTypes.object,
  directors: PropTypes.array
};

export default MovieInfo;
