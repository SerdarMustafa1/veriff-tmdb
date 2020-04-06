import React, { Component } from "react";
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE } from "../../../config";
import classnames from "classnames";
import { isMobile, MobileView } from "react-device-detect";
import windowSize from "react-window-size";
import isString from "lodash/isString";
import isBoolean from "lodash/isBoolean";
import isFunction from "lodash/isFunction";
import PropTypes from "prop-types";
import MovieThumb from "../../elements/MovieThumb/MovieThumb.component";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./Trending.styles.css";

class ToggleSwitch extends Component {
  state = {
    movies: [],
    dayMovies: [],
    weekMovies: [],
    heroImage: null,
    loading: false,
    currentPage: 0,
    totalPages: 0,
    searchTerm: "",
    enabled: this.enabledFromProps()
  };

  componentDidMount() {
    const trendingToday = `${API_URL}trending/all/day?api_key=${API_KEY}&language=en-US&page=1`;
    this.fetchTodayItems(trendingToday);

    const trendingWeek = `${API_URL}trending/all/week?api_key=${API_KEY}&language=en-US&page=1`;
    this.fetchWeekItems(trendingWeek);
  }

  onSelect = key => {
    this.setState({ selected: key });
  };

  isEnabled = () => this.state.enabled;

  enabledFromProps() {
    let { enabled } = this.props;

    // If enabled is a function, invoke the function
    enabled = isFunction(enabled) ? enabled() : enabled;

    // Return enabled if it is a boolean, otherwise false
    return isBoolean(enabled) && enabled;
  }

  toggleSwitch = evt => {
    evt.persist();
    evt.preventDefault();

    const { onClick, onStateChanged } = this.props;

    this.setState({ enabled: !this.state.enabled }, () => {
      const state = this.state;

      // Augument the event object with SWITCH_STATE
      const switchEvent = Object.assign(evt, { SWITCH_STATE: state });

      // Execute the callback functions
      isFunction(onClick) && onClick(switchEvent);
      isFunction(onStateChanged) && onStateChanged(state);
    });
  };

  fetchTodayItems = trendingToday => {
    const { dayMovies, heroImage } = this.state;

    fetch(trendingToday)
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

  fetchWeekItems = trendingWeek => {
    const { weekMovies } = this.state;

    fetch(trendingWeek)
      .then(result => result.json())
      .then(result => {
        this.setState({
          weekMovies: [...weekMovies, ...result.results],
          loading: false,
          currentPage: result.page,
          totalPages: result.total_pages
        });
      })
      .catch(error => console.error("Error:", error));
  };

  getFromLocal = async movieName => {
    localStorage.getItem("favorites", JSON.stringify(movieName));
  };

  render() {
    const { dayMovies, weekMovies, enabled } = this.state;
    const width = window.innerWidth;
    // Isolate special props and store the remaining as restProps
    const {
      enabled: _enabled,
      theme,
      onClick,
      className,
      onStateChanged,
      ...restProps
    } = this.props;

    // Use default as a fallback theme if valid theme is not passed
    const switchTheme = theme && isString(theme) ? theme : "default";

    const switchClasses = classnames(
      `switch switch--${switchTheme}`,
      className
    );

    const togglerClasses = classnames(
      "switch-toggle",
      `switch-toggle--${enabled ? "on" : "off"}`
    );

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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 30,
            alignItems: "center"
          }}
        >
          <div style={{ marginLeft: 20, color: "white" }}>Today</div>
          <div style={{ marginLeft: 10, marginRight: 5 }}>
            <div
              className={switchClasses}
              onClick={this.toggleSwitch}
              {...restProps}
            >
              <div className={togglerClasses}></div>
            </div>
          </div>
          <div style={{ marginLeft: 10, color: "white" }}>This Week</div>
        </div>
        <p style={{ color: "white" }}></p>
        <div className="vmdb-slider-container">
          {enabled ? (
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
          ) : (
            <Slider {...settings}>
              {weekMovies.map((element, i) => (
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
          )}
        </div>
      </>
    );
  }
}

ToggleSwitch.propTypes = {
  theme: PropTypes.string,
  enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  onStateChanged: PropTypes.func
};

export default ToggleSwitch;
