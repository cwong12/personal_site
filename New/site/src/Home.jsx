import React from 'react'
import './App.css';
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

export default class Home extends React.Component {


  render() {
    return (
      <div>
      <div class="content-center">
        <div class="biotext">Born and raised in St. Louis, Missouri, I am currently an undergraduate student at Brown University,
        where I studying Computer Science. I'm captain of the club baseball team here, involved in Brown's
        Camp Kesem chapter, and a member of the Sigma Chi fraternity
      
        </div>
      </div>


      </div>
    );
  }

}
