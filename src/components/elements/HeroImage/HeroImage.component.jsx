import React from "react";
import PropTypes from "prop-types";

// import SearchBar from "../SearchBar/SearchBar.component";

import "./HeroImage.styles.css";

const friendsHero = "https://i.imgur.com/fXys3AT.jpg";

const HeroImage = ({ image, title, text }) => (
  <div
    className="vmdb-heroimage"
    style={{
      background: `linear-gradient(to bottom, rgba(0,0,0,0)
        39%,rgba(0,0,0,0)
        41%,rgba(0,0,0,0.65)
        100%),
        url('${friendsHero}'), #1c1c1c`
    }}
  >
    <div className="vmdb-heroimage-content">
      <div className="vmdb-heroimage-welcome">
        <h1 className="vmdb-heroimage-welcome-text">Welcome</h1>
      </div>
      <div className="vmdb-heroimage-text">
        <h1>
          Millions of Movies, TV Shows and people to discover. Explore Now.
        </h1>
      </div>
    </div>
  </div>
);

HeroImage.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string
};

export default HeroImage;
