import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { FavContext } from "../../context";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE
} from "../../config";
import HeroImage from "../elements/HeroImage/HeroImage.component";
import SearchBar from "../elements/SearchBar/SearchBar.component";
import FourColGrid from "../elements/FourColGrid/FourColGrid.component";
import MovieThumb from "../elements/MovieThumb/MovieThumb.component";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn.component";
import Spinner from "../elements/Spinner/Spinner.component";
import ToggleSwitch from "../elements/Trending/Trending";

import "./Home.styles.css";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      heroImage: null,
      loading: false,
      currentPage: 0,
      totalPages: 0,
      searchTerm: "",
      list: [],
      addToFav: false
    };
    this.list = [];
  }

  static contextType = FavContext;
  componentDidMount() {
    if (sessionStorage.getItem("HomeState")) {
      let state = JSON.parse(sessionStorage.getItem("HomeState"));
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
      this.fetchItems(endpoint);
    }
  }

  addToFav = () => {
    this.setState(
      {
        addToFav: !this.state.addToFav
      },
      () => console.log(this.state.addToFav)
    );
  };

  searchItems = searchTerm => {
    let endpoint = "";
    this.setState({
      movies: [],
      loading: true,
      searchTerm
    });

    if (searchTerm === "") {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
    }
    this.fetchItems(endpoint);
  };

  loadMoreItems = () => {
    const { searchTerm, currentPage } = this.state;

    let endpoint = "";
    this.setState({ loading: true });

    if (searchTerm === "") {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage +
        1}`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${currentPage +
        1}`;
    }
    this.fetchItems(endpoint);
  };

  fetchItems = endpoint => {
    const { movies, heroImage, searchTerm } = this.state;

    fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        this.setState(
          {
            movies: [...movies, ...result.results],
            heroImage: heroImage || result.results[0],
            loading: false,
            currentPage: result.page,
            totalPages: result.total_pages
          },
          () => {
            // Remember state for the next mount if we´re not in a search view
            if (searchTerm === "") {
              sessionStorage.setItem("HomeState", JSON.stringify(this.state));
            }
          }
        );
      })
      .catch(error => console.error("Error:", error));
  };

  render() {
    const {
      movies,
      heroImage,
      loading,
      currentPage,
      totalPages,
      searchTerm
    } = this.state;

    console.log(`state`, this.state);
    console.log("dsadasd", this.context.addToFav);

    return (
      <div className="vmdb-home">
        {heroImage ? (
          <div>
            <HeroImage
              image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
              title={heroImage.original_title}
              text={heroImage.overview}
            />
            <SearchBar callback={this.searchItems} />
          </div>
        ) : null}

        {!searchTerm ? (
          <div className="vmdb-trending-container">
            <h1
              style={{
                color: "white",
                marginLeft: 20
              }}
            >
              Trending
            </h1>

            <ToggleSwitch />
          </div>
        ) : null}

        <div className="vmdb-home-grid">
          <FourColGrid
            header={searchTerm ? "Search Result" : "Popular Movies"}
            loading={loading}
          >
            {movies.map((element, i) => (
              <MovieThumb
                movies={movies}
                key={i}
                clickable={true}
                image={
                  element.poster_path
                    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
                    : "./images/no_image.jpg"
                }
                movieId={element.id}
                movieName={element.original_title}
                movieAverage={element.vote_average}
                releaseDate={element.release_date}
              />
            ))}
          </FourColGrid>
          {loading ? <Spinner /> : null}
          {currentPage <= totalPages && !loading ? (
            <LoadMoreBtn text="Load More" onClick={this.loadMoreItems} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Home;
