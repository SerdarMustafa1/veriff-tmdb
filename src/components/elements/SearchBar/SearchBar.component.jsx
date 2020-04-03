import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "./SearchBar.styles.css";

class SearchBar extends Component {
  state = {
    value: ""
  };
  // Must have this here so we can reset it
  timeout = null;

  doSearch = event => {
    const { callback } = this.props;

    this.setState({ value: event.target.value });
    clearTimeout(this.timeout);
    // Set a timeout to wait for the user to stop writing
    // So we don´t have to make unnessesary calls
    this.timeout = setTimeout(() => {
      callback(this.state.value);
    }, 500);
  };

  render() {
    const { value } = this.state;

    return (
      <div className="vmdb-searchbar">
        <div className="vmdb-searchbar-content">
          <FontAwesome className="vmdb-fa-search" name="search" size="2x" />
          <input
            type="text"
            className="vmdb-searchbar-input"
            placeholder="Search for a movie..."
            onChange={this.doSearch}
            value={value}
          />
        </div>
      </div>
    );
  }
}

SearchBar.propTypes = {
  callback: PropTypes.func
};

export default SearchBar;
