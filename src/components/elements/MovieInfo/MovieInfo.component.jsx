import React, { useState } from "react";
import { IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE } from "../../../config";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import Veriff from "@veriff/js-sdk";
import MovieThumb from "../MovieThumb/MovieThumb.component";
import Moment from "react-moment";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MovieInfo.styles.css";

const MovieInfo = ({ movie, directors, genres, ratingTypes, ratingInfo }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const veriff = Veriff({
    apiKey: "394b1f03-204c-449c-bb45-98cc44ceabdb",
    parentId: "veriff-root",
    onSession: function(err, response) {
      // received the response, verification can be started now
    }
  });

  return (
    <>
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
              {movie.title} - (
              <Moment format="YYYY">{movie.release_date}</Moment>)
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
                  <div key={i}>
                    <p
                      style={{ color: "#71acb1" }}
                      key={i}
                      className="vmdb-director"
                    >
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

          {ratingInfo && ratingInfo === ("R" || "X") ? (
            <>
              <div className="rating-container">
                <p>
                  This movie is rated:{" "}
                  <span className="rating-span">{ratingInfo}</span>. <br /> To
                  watch this movie or its previews, you must first verify your
                  age.
                </p>

                <button onClick={handleShow}>
                  <FontAwesome
                    className="fa-film"
                    name="lock"
                    size="5x"
                    onClick={handleShow}
                  />
                  <p
                    className="continue"
                    style={{ color: "white", marginLeft: 10 }}
                  >
                    Click to Verify
                  </p>
                </button>
              </div>
            </>
          ) : (
            <a
              href={`https://www.themoviedb.org/movie/${movie.id}-deadpool/watch`}
            >
              <FontAwesome className="fa-film" name="film" size="5x" />
            </a>
          )}
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <span role="img" aria-label="lock emoji">
                🔐
              </span>
              Age Verification
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              To protect vulnerable users, we kindly ask that you verify that
              you meet the age requirement for this movie.
            </p>

            <p style={{ marginTop: 10 }}>
              To continue press 'Verify' and you will be re-directed to our
              third party verification partner, Veriff to complete the required
              steps.
              <span role="img" aria-label="rocket emoji">
                🚀
              </span>
            </p>
            <div id="veriff-root"></div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => veriff.mount()}>
              Verify
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

MovieInfo.propTypes = {
  movie: PropTypes.object,
  directors: PropTypes.array,
  ratingTypes: PropTypes.array
};

export default MovieInfo;
