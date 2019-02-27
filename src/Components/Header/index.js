import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

export default class Header extends Component {
  render() {
    return (
      <header>
        <div>
          <Link to={this.props.back || "/"} className="btn inline back">&larr;</Link>
          <p className="title inline">{this.props.title}</p>
        </div>
      </header>
    )
  }
}
