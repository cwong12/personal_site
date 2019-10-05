import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css'
import Busch_Winter from "./images/Busch-Winter.JPG"
import Busch_Green from "./images/Busch-GreenSeats.JPG"
import Fenway from "./images/Fenway2.JPG"
import Yankee from "./images/Yankee.JPG"
import Citi from "./images/Citi2.JPG"




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
      markerList : [],
      rawScores: {
        "Cleveland Browns" : [132.4,	105.2	,124.3],
        "1/3 are playing": [98.1,	95.6,	94.4], //matt
        "Team Wong": [130.2,	141.2,127.9], //dad
        "Mom can win too, really": [75.9,	96.1,	97.2] //mom
      },
      week:4,
      showing: false,
      password: "",
      newScore: 0,
      data:null,
      stads:[
        {"name": "Fenway Park",
      "date": "8/27/19",
      "coordinates": [42.3467, -71.0972],
      "link": {Fenway}},
      {"name": "Yankee Stadium",
      "date": "8/27/19",
      "coordinates": [40.8296, -73.9262],
      "link": {Yankee}},
      {"name": "Citi Field",
      "date": "8/27/19",
      "coordinates": [40.7571, -73.8458],
      "link": {Citi}},

    ],
      stadsJSON: {"type": "FeatureCollection",
  "features": [
        {"type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
           -71.0972,
          42.3467
        ]
      },
      "properties": {
        "name": "Fenway Park",
    "date": "8/27/19",
    "link": {Fenway}
        }

    }


      // {"name": "Yankee Stadium",
      // "date": "8/27/19",
      // "coordinates": [40.8296, -73.9262],
      // "link": {Yankee}}
    ]
  }
    };

    this.changeVis = this.changeVis.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.changeWeek = this.changeWeek.bind(this);
    this.updateMap = this.updateMap.bind(this);




    this.newTeam = React.createRef();
    this.weekNum = React.createRef();
    this.score = React.createRef();
    this.showWeek = React.createRef();
  }

  fly(coords){
    console.log(coords);
  }


  addMarkers(map) {
    if (map != null){
        //var feats = this.state.geojson;
        var feats = {
          entries: this.state.stads


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
          html = `<div id="popup-container"><p id="popup-location">` + feats.entries[value[0]].name + `</p><p id="popup-date">` + "Visited on: "+ feats.entries[value[0]].date
           + `</p><div id = "image-container"> <img id = "popup-image" src=`+ feats.entries[value[0]].link[key] +` alt = "stad"/></div></div>`;


          let newMarker = new mapboxgl.Marker(el ,{offset: [0, -90/2], onClick: this.fly(feats.entries[value[0]].coordinates[1])})
          .setLngLat([feats.entries[value[0]].coordinates[1], feats.entries[value[0]].coordinates[0]])
          .setPopup(new mapboxgl.Popup({ offset: 25, onClick: this.fly(feats.entries[value[0]].coordinates[1]) }) // add popups
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
  popup(){
    console.log("popup");
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

    var stads = this.state.stadsJSON;


    // map.on('load', function(e) {
  // Add the data to your map as a layer
//   map.addLayer({
//     id: 'locations',
//     type: 'symbol',
//     // Add a GeoJSON source containing place coordinates and information.
//     source: {
//       type: 'geojson',
//       data: stads
//     },
//     layout: {
//       'icon-image': './mapbox-icon.png',
//       'icon-allow-overlap': true,
//     }
//   });
//   console.log("loaded");
// });
    var stadData = this.state.stads;

    map.on('click', function(e) {
    // Query all the rendered points in the view
    var features = map.queryRenderedFeatures(e.point, { layers: ['locations'] });
    console.log("clicked");
    console.log(features);
    console.log(e.lngLat);
    var curMin = 1000;
    var minIndex = -1;
    for (var i = 0 ; i < stadData.length; i++){
      console.log(stadData[i]);

      var dist = Math.sqrt((e.lngLat.lng-stadData[i].coordinates[1])**2+(e.lngLat.lat-stadData[i].coordinates[0])**2);
      if (dist <= 2){
        if (curMin > dist){
          curMin = dist;
          minIndex = i;
        }
      }
      console.log(dist);
    }
    console.log(stadData[minIndex]);
    console.log(curMin);
    if (curMin < 1000){
    map.flyTo({
      center: [ stadData[minIndex].coordinates[1],stadData[minIndex].coordinates[0]-0.12],
      zoom: 10
    });
  }

    if (features.length) {
      var clickedPoint = features[0];
      console.log(clickedPoint);
      // 1. Fly to the point

    }
  });

    this.addMarkers(map);

    this.setState({
      map: map
    });

    return (
      <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
    )
  }



  componentDidMount() {
    this.updateMap();
    this.getSomeData();

  }

  clearDB(){
    fetch('http://localhost:8080/clear', {
      method: 'GET',
    })
    .then(res => res.json())
    .then(data => {

    });

  };

  getSomeData(){

      fetch('http://localhost:8080/standings', {
        method: 'GET',
      })
      .then(res => res.json())
      .then(data => {

        this.setState({data: data});


      })


  }

  parseData(entry){
    let curScores = [];
    for (var i = 1; i <= this.state.week;i++){

      curScores.push(entry["week" + i + "Score"]);
    }
    return curScores;

  }



  buildHeadings(word){

    var weekNum = this.state.week;

    //figure out which table it's building then pass the appropriate id
    var mode = "";

    if (word === "Points"){
      mode = "rawTable";
    }
    else if (word === "Scoring"){
      mode = "adjTable";
    }

    //build an array with week numbers i.e. [1,2,3]
    var weeks = []
    for (var i = 1; i <= weekNum; i++){
      weeks.push(i);

    }

    var weekHtml = weeks.map((weekNums, index) =>
        <th className = "headers" onClick={() => this.sortTable(index+1, mode)}>Week {weekNums} {word}</th>
  );

    return (
      <React.Fragment>
      {weekHtml}
      <th className = "headers" onClick={() => this.sortTable(this.state.week+1, mode)}>Total</th>
      </React.Fragment>
    )
  }


  //build table with raw scores
  buildPoints(){

    var holder = this.state.data;

    var htmlScores = {};
    var rawDict = {};


    for (var id in holder){

      var entry = holder[id];
      var name = entry["teamName"];
      let curScores = this.parseData(entry);

      rawDict[name] = curScores;

      //sum scores and round total
      var curTotal = parseFloat(curScores.reduce((a,b) => a + b, 0));
      var rounded = (curTotal).toFixed(1)

      if (!curScores.includes(rounded)){
        curScores.push(rounded);

      }
      var listItems = curScores.map((scores) =>
        <td className = "score" id = "week1">{scores}</td>
);

      htmlScores[name] = listItems;
    }


    return (

      Object.entries(htmlScores).map(([key, value]) =>
       <React.Fragment>
         <tr>
          <td>{key}</td>
          {value}

          </tr>
        </React.Fragment>

    )
    )

  }

  //build table according to our scoring

  buildScoring(){
    var rawScores = {};
    var holder = this.state.data;

    for (var id in holder){

      var entry = holder[id];
      var name = entry["teamName"];
      let curScores = this.parseData(entry);

      rawScores[name] = curScores;
    }

    var weekScores = {}

    //divide up scores into each week
    for (var teamName in rawScores){
      for (var i = 0; i < rawScores[teamName].length; i++){
        //dict for team to score that week

        if (weekScores[i+1] === undefined){
          var obj = {};
          obj[teamName] = rawScores[teamName][i];
          weekScores[i+1] = obj;

        }
        else{
          weekScores[i+1][teamName] = rawScores[teamName][i];
        }


      }

    }

    var ourScoringDict = {};

    //data is now divided into weeks with each week being a dict mapping team teamName
    //to the amount of points that team score that week
    for (var week in weekScores){
      var scores = [];

      var teamScores = weekScores[week];
      //create an array of all the scores
      for (var curTeam in teamScores){
        var score = teamScores[curTeam];
        scores.push(score);


      }

      //sort and assigned 3,2,1,0 points based on highest raw score
      scores.sort(function(a, b){return b-a});

      for (var j = 0 ; j < scores.length; j++){
        //get the team that produced that score
        var key = Object.keys(teamScores).find(key => teamScores[key] === scores[j])
        var relativeScore = scores.length-j-1
        if (ourScoringDict[key] === undefined){
          ourScoringDict[key] = [relativeScore];
        }
        else{
          ourScoringDict[key].push(relativeScore)
        }

      }

    }
    //Finally go back through dict and transform data to react elements
    for (var team in ourScoringDict){
      var curScores = ourScoringDict[team];
      var curTotal = curScores.reduce((a,b) => a + b, 0);
      curScores.push(curTotal);


      //turn array into react table elements
      var listItems = curScores.map((scores) =>
            <td className = "score" >{scores}</td>
      );
      ourScoringDict[team] = listItems;
    }


    return (

      Object.entries(ourScoringDict).map(([key, value]) =>
       <React.Fragment>
         <tr>
          <td>{key}</td>
          {value}

          </tr>
        </React.Fragment>

    )
    )
  }

  changeWeek(){
    console.log(this.showWeek.current.value);
    this.setState({week: this.showWeek.current.value})

  }

  changeVis(e){

    const showing = this.state.showing;
    if (this.state.password === "a"){
      this.setState({showing: !showing});

    }
    e.preventDefault();
  }

  addEntry(e){

    var bodyJSON = {teamName: this.newTeam.current.value,
                    weekNum: this.weekNum.current.value,
                    score: this.state.newScore
    };


    fetch('http://localhost:8080/newEntry', {
      headers: {
              'Accept': 'application/json',
              "Content-Type": "application/json"
          },
      method: 'POST',
      body: JSON.stringify({bodyJSON})


    })
    .then(res => res.json())
    .then(data => {
  // process returned data
    }).catch(err => {
  // handle err
    })
    e.preventDefault();

  }

  sortTable(col, table) {
  var tableRef, rows, switching, i, x, y, shouldSwitch, switchcount = 0;
  tableRef = document.getElementById(table);
  switching = true;
  var dir = "desc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = tableRef.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[col];
      y = rows[i + 1].getElementsByTagName("TD")[col];

      //check if the two rows should switch place:

      x = x.innerHTML;
      y = y.innerHTML;

      if(col === 0){
        x = x.toLowerCase();
        y = y.toLowerCase();


      }
      else{
        x = parseInt(x);
        y = parseInt(y);
      }
      if (dir === "asc") {
        if (x > y) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }else{
        if (x < y) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }

    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount === 0 && dir === "desc") {
          dir = "asc";
          switching = true;
        }
      }
    }
  }




  render() {
    return (
      <div>
        <div id = "top-content">
            <img className = "banner" alt = "Busch" src={Busch_Green}/>
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
      <div className = "bottom">


      { this.state.data ?
        <div className='standings'>
          <div className="biotext"> <b>Fantasy Football Standings</b>
            <table className = "table" id = "rawTable">
              <tbody>
              <tr>
                <th onClick={() => this.sortTable(0, "rawTable") } className = "headers">Team</th>
                {this.buildHeadings("Points")}
              </tr>
              {this.buildPoints()}
                </tbody>
              </table>

              <table className = "table" id = "adjTable">
                <tbody>

                <tr>
                  <th onClick={() => this.sortTable(0, "adjTable") } className = "headers">Team</th>
                  {this.buildHeadings("Scoring")}
                </tr>

                {this.buildScoring()}


                  </tbody>
                </table>

          </div>
        </div>
      : null}
        <div className = "admin">


          <Form id = "btn" onSubmit = {this.changeVis}>
            <InputGroup id="admin-form">
              <Form.Group id="admin-add-form" >
                <Form.Label>Enter password to add scores:</Form.Label>
                <Form.Control onChange={e => this.setState({password :e.target.value})} type="password" placeholder="Password" />
              </Form.Group>
            </InputGroup>
            <Button  variant="success"  onClick={this.changeVis}>Enter</Button>
          </Form>

        <div>
        { this.state.showing ?
          <div>

            <div className = "newEntry">
            <Form id = "btn" onSubmit = {this.addEntry}>
              <InputGroup id="admin-form">
                <Form.Group id="admin-add-form" >
                  <Form.Label>Team</Form.Label>
                  <Form.Control as="select" ref={this.newTeam}>
                      <option>Cleveland Browns</option>
                      <option>1/3 are playing</option>
                      <option>Team Wong</option>
                      <option>Mom can win too, really</option>
                  </Form.Control>
                  <Form.Label>Week Number</Form.Label>
                  <Form.Control as="select" ref={this.weekNum}>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>12</option>

                  </Form.Control>
                  <Form.Label>Score</Form.Label>
                  <Form.Control onChange={e => this.state.newScore = e.target.value} type="text" placeholder="Score" />
                  </Form.Group>
                </InputGroup>
              <Button  variant="success"  onClick={this.addEntry}>Add Entry</Button>
            </Form>

            <Form id = "btn" onSubmit = {this.changeWeek}>
              <InputGroup id="admin-form">
                <Form.Group id="admin-add-form" >

                  <Form.Label>Week Number</Form.Label>
                  <Form.Control as="select" ref={this.showWeek}>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>12</option>

                  </Form.Control>
                  </Form.Group>
                </InputGroup>
              <Button  variant="success"  onClick={this.changeWeek}>Add Entry</Button>
            </Form>

          </div>
        </div>
          : null }
             </div>
          </div>
      </div>
    </div>

    );
  }


}
