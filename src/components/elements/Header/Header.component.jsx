import React from "react";
import { Link } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import "./Header.styles.css";

const Header = () => {
  const showFavorites = () => {
    JSON.parse(localStorage.getItem("favorites"));
  };
  return (
    <div className="vmdb-header">
      <div className="vmdb-header-content">
        <Link to="/">
          <img
            className="vmdb-logo"
            src="/logo_transparent.png"
            alt="vmdb-logo"
          />
        </Link>
        <FontAwesome
          onClick={showFavorites}
          className="fa-heart"
          name="heart"
          size="5x"
        />
      </div>
    </div>
  );
};
export default Header;
