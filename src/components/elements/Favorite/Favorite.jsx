import React, { Component } from "react";
import { FavContext } from "../../../context";

// import NavLinks from "./components/navLink";

export default class Favorite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favList: []
    };
  }
  static contextType = FavContext;

  componentDidMount() {
    this.setState({
      favList: [...this.context.addToFav]
    });
  }

  render() {
    return (
      <div>
        {/* <NavLinks /> */}
        <h3>Favorite List</h3>
        {this.state.favList.map(e => (
          <p key={e}>{e}</p>
        ))}
      </div>
    );
  }
}
