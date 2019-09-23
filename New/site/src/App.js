import React, { Component } from 'react';
import './App.css';
import Header from './Header.jsx';
import Baseball from './Baseball.jsx';

import Home from './Home.jsx';
import Projects from './Projects.jsx';
import Footer from './Footer.jsx';



import { BrowserRouter, Switch, Route } from 'react-router-dom';

class App extends Component {

  render() {
    return (

      <div>
      <BrowserRouter>
        <Header />

        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/baseball' component={Baseball} />
          <Route exact path='/projects' component={Projects} />



        </Switch>
        <Footer />
        </BrowserRouter>

      </div>
    );
  }
}

export default App;
