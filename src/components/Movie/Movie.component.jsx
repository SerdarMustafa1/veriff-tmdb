import React, { Component } from "react";
import { API_URL, API_KEY } from "../../config";
import Navigation from "../elements/Navigation/Navigation.component";
import MovieInfo from "../elements/MovieInfo/MovieInfo.component";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar.component";
import FourColGrid from "../elements/FourColGrid/FourColGrid.component";
import Actor from "../elements/Actor/Actor.component";
import Spinner from "../elements/Spinner/Spinner.component";
import "./Movie.styles.css";

class Movie extends Component {
  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false,
    releaseData: [],
    favorites: []
  };

  addFavorite = favorite => {
    const { favorites } = this.state;

    if (!favorites.some(alreadyFavorite => alreadyFavorite.id == favorite.id)) {
      this.setState({
        favorites: [...this.state.favorites, favorite]
      });
    }
  };

  componentDidMount() {
    const { movieId } = this.props.match.params;

    let releaseEndpoint = `${API_URL}movie/${movieId}/release_dates?api_key=${API_KEY}&language=en-US`;
    this.fetchReleaseData(releaseEndpoint);

    if (localStorage.getItem(`${movieId}`)) {
      let state = JSON.parse(localStorage.getItem(`${movieId}`));
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      // First fetch the movie ...
      let endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
      this.fetchItems(endpoint);
    }
  }

  fetchReleaseData = async releaseEndpoint => {
    await fetch(releaseEndpoint)
      .then(result => result.json())
      .then(result => {
        const UsRating = result.results.filter(us => us.iso_3166_1 === "US");
        this.setState({
          loading: false,
          UsRating,
          releaseData: UsRating[0].release_dates[0].certification
        });
      })
      .catch(error => console.error("Error:", error));
  };

  fetchItems = async endpoint => {
    const { movieId } = this.props.match.params;

    await fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        if (result.status_code) {
          // If we don't find any movie
          this.setState({ loading: false });
        } else {
          this.setState({ movie: result }, () => {
            // ... then fetch actors in the setState callback function
            let endpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
            fetch(endpoint)
              .then(result => result.json())
              .then(result => {
                const directors = result.crew.filter(
                  member => member.job === "Director"
                );
                this.setState(
                  {
                    actors: result.cast,
                    genres: result.genres,
                    directors,
                    loading: false
                  },
                  () => {
                    localStorage.setItem(
                      `${movieId}`,
                      JSON.stringify(this.state)
                    );
                  }
                );
              });
          });
        }
      })
      .catch(error => console.error("Error:", error));
  };

  // saveToFavorites = () => {
  //   localStorage.setItem(`${movieId}`, JSON.stringify(favorites));
  // };

  render() {
    const { movieName } = this.props.location;
    const { movie, directors, actors, loading, releaseData } = this.state;

    return (
      <div className="vmdb-movie">
        {movie ? (
          <div>
            <Navigation movie={movieName} />
            <MovieInfo
              movie={movie}
              directors={directors}
              ratingInfo={releaseData}
            />
            <MovieInfoBar
              time={movie.runtime}
              budget={movie.budget}
              revenue={movie.revenue}
            />
          </div>
        ) : null}
        {actors ? (
          <div className="vmdb-movie-grid">
            <FourColGrid header={"Actors"}>
              {actors.map((element, i) => (
                <Actor key={i} actor={element} />
              ))}
            </FourColGrid>
          </div>
        ) : null}
        {!actors && !loading ? <h1>No movie found</h1> : null}
        {loading ? <Spinner /> : null}
      </div>
    );
  }
}

export default Movie;
