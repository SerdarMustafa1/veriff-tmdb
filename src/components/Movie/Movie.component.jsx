import React, { Component } from "react";
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE } from "../../config";
import Navigation from "../elements/Navigation/Navigation.component";
import MovieInfo from "../elements/MovieInfo/MovieInfo.component";
import MovieThumb from "../elements/MovieThumb/MovieThumb.component";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar.component";
import FourColGrid from "../elements/FourColGrid/FourColGrid.component";
import Actor from "../elements/Actor/Actor.component";
import Spinner from "../elements/Spinner/Spinner.component";
import Slider from "react-slick";
import "./Movie.styles.css";

class Movie extends Component {
  state = {
    movie: null,
    dayMovies: [],
    actors: null,
    directors: [],
    loading: false,
    releaseData: [],
    favorites: []
  };

  componentDidMount() {
    const { movieId } = this.props.match.params;

    let releaseEndpoint = `${API_URL}movie/${movieId}/release_dates?api_key=${API_KEY}&language=en-US`;
    this.fetchReleaseData(releaseEndpoint);

    this.setState({ movieId });

    const similarMovies = `${API_URL}movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`;
    this.fetchSimilarMoies(similarMovies);

    if (localStorage.getItem(`${movieId}`)) {
      let state = JSON.parse(localStorage.getItem(`${movieId}`));
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      // First fetch the movie ...
      let endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
      this.fetchItems(endpoint);
    }
    console.log("please: ", movieId);
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

  fetchSimilarMoies = async similarMovies => {
    const { dayMovies, heroImage } = this.state;

    await fetch(similarMovies)
      .then(result => result.json())
      .then(result => {
        this.setState({
          dayMovies: [...dayMovies, ...result.results],
          heroImage: heroImage || result.results[0],
          loading: false,
          currentPage: result.page,
          totalPages: result.total_pages
        });
      })
      .catch(error => console.error("Error:", error));
  };

  render() {
    const { movieName } = this.props.location;
    const {
      movie,
      dayMovies,
      directors,
      actors,
      loading,
      releaseData,
      movieId
    } = this.state;

    console.log("foo:", movieId);

    const width = window.innerWidth;

    console.log("bike:", this.props);

    // dynamic sizing for mobile screens
    const slidesToShow = width <= "768" ? 2 : 6;
    const slidesToScroll = width <= "768" ? 1 : 5;

    const settings = {
      className: "slider",
      infinite: true,
      speed: 500,
      slidesToShow: slidesToShow,
      slidesToScroll: slidesToScroll,
      centerPadding: "100px",
      lazyLoad: "onDemand",
      onSwipe: null
    };

    return (
      <>
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
        <div className="vmdb-slider-container">
          <h1>Suggested Movies</h1>
          <Slider {...settings}>
            {dayMovies.map((element, i) => (
              <MovieThumb
                styled={{ marginRight: 15, marginLeft: 15 }}
                key={i}
                clickable={true}
                image={
                  element.poster_path
                    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
                    : "./images/no_image.jpg"
                }
                movieId={element.id}
                movieAverage={element.vote_average}
                movieName={element.original_title}
              />
            ))}
          </Slider>
        </div>
      </>
    );
  }
}

export default Movie;
