import React, { Component } from 'react';
import './App.css';
import { Link } from "react-router-dom";



export default class Header extends Component {

  render() {
    return(
      <header >

          <div id="top-links">

              <ul id="top-links-list">
                  <li><Link to="/" id="header-links">Home</Link></li>
                  <li><Link to="/baseball" id="header-links">Fun Stuff</Link></li>
                  <li><Link to="/projects" id="header-links">Projects</Link></li>


              </ul>
              <form acceptCharset="UTF-8" action="/search" method="get"><div><input name="utf8" type="hidden" value="✓"/></div>
                  <input id="search" name="search" type="text"/>
              </form>
          </div>



      </header>
    );
  }
}
