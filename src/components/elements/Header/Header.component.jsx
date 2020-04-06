import React from "react";
import { Link } from "react-router-dom";
import "./Header.styles.css";

const Logo = "https://i.imgur.com/3J0A0RG.png";

const Header = () => {
  return (
    <div className="vmdb-header">
      <div className="vmdb-header-content">
        <Link to="/">
          <img className="vmdb-logo" src={Logo} alt="vmdb-logo" />
        </Link>
      </div>
    </div>
  );
};
export default Header;
