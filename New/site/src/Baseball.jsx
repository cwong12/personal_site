import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css'
import Busch_Winter from "./images/Busch-Winter.JPG"
import Busch_Green from "./images/Busch-GreenSeats.JPG"
import Fenway from "./images/Fenway2.JPG"


mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';


export default class Baseball extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      lat: 38.8240,
      lng: -90.4128,
      zoom: 3,
      width: 500,
      height: 500,
      map: null,
      geojson: this.props.geojson,
      markerList : []
    };
  }

  addMarkers(map) {
    if (map != null){
        //var feats = this.state.geojson;
        var feats = {
          entries:[
          {"name": "Fenway Park",
          "date": "8/27/19",
          "coordinates": [42.3467, -71.0972],
          "link": {Fenway}},
          {"name": "Yankee Stadium",
          "date": "8/27/19",
          "coordinates": [40.8296, -73.9262],
          "link": {Fenway}}

        ]
        }



        var dict = {};
        console.log(feats.entries.length);
        for ( var i = 0 ; i < feats.entries.length ; i++ ) {
          console.log("here");

          if (dict[feats.entries[i].coordinates]) {
            dict[feats.entries[i].coordinates].push(i);
          } else {

            dict[feats.entries[i].coordinates] = [i];
          }
        }

        let changeMarkerList = this.state.markerList;

        for(var coords in dict) {
          var value = dict[coords];


          // create a HTML element for each feature
          var el = document.createElement('div');
          el.className = 'marker';

          // make a marker for each feature and add to the map
          var html = ``;

          var key = Object.keys(feats.entries[value[0]].link)
          html = `<div id="popup-container"><p id="popup-location">` + feats.entries[value[0]].name + `</p><p id="popup-date">` + "Visted on: "+ feats.entries[value[0]].date
           + `</p><div id = "image-container"> <img id = "popup-image" src=`+ feats.entries[value[0]].link[key] +` alt = "stad"/></div></div>`;


          let newMarker = new mapboxgl.Marker(el ,{offset: [0, -90/2]})
          .setLngLat([feats.entries[value[0]].coordinates[1], feats.entries[value[0]].coordinates[0]])
          .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(html))
          .addTo(map);

          changeMarkerList.push(newMarker);
          }
          this.setState({markerList: changeMarkerList})

    }
    else {
      console.log("first");
    }
  }

  componentDidMount() {
    this.updateMap();
  }

  updateMap(){
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: 'mapdiv',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom: zoom
    });

    map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    this.addMarkers(map);

    this.setState({
      map: map
    });

    return (
      <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
    )
  }

  render() {
    return (
      <div>
        <div id = "top-content">
            <img class = "banner" alt = "Busch" src={Busch_Green}/>
          </div>

          <div id = "middle-content">
          <div id = "write-up" >
            Part of growing up in St. Louis means that I live and
            breathe baseball. I've been playing since I could walk and follow the
            hometown Cardinals religiously. I was in the stadium when they won the World Series in 2011,
            and I'm looking forward to many more wins at Busch (and maybe even another hockey game).
          </div>
        </div>

        <div id="middle-content">

          <div id="write-up"> As a fan of the sport, one of my life goals is to attend
            a game at every major league stadium. As of right now, I've been to 7 of the 30,
            and I'll be tracking my progress here.

            </div>
        </div>
        <div id="map-info">
          <div id='mapdiv'></div>
          </div>
      </div>
    );
  }


}
