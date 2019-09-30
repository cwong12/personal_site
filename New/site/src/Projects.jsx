import React from 'react'
import './App.css';
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


import 'bootstrap/dist/css/bootstrap.min.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

export default class Projects extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      rawScores: {
        "Cleveland Browns" : [132.4,	105.2	,124.3],
        "1/3 are playing": [98.1,	95.6,	94.4], //matt
        "Team Wong": [130.2,	141.2,127.9], //dad
        "Mom can win too, really": [75.9,	96.1,	97.2] //mom
      },
      week: 3,
      showing: false,
      password: "",
      newScore: 0,
      data:null

    }

    this.changeVis = this.changeVis.bind(this);
    this.addEntry = this.addEntry.bind(this);


    this.newTeam = React.createRef();
    this.weekNum = React.createRef();
    this.score = React.createRef();

  }

  componentDidMount() {
      const self = this;
      this.buildPoints();
      this.getSomeData();

     }



  testDB(){
    fetch('http://localhost:8080/standings', {
      method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    });

  };

  clearDB(){
    fetch('http://localhost:8080/clear', {
      method: 'GET',
    })
    .then(res => res.json())
    .then(data => {

    });

  };

  getSomeData(){
    var holder = {};
    var html = {};

      fetch('http://localhost:8080/standings', {
        method: 'GET',
      })
      .then(res => res.json())
      .then(data => {

        this.setState({data: data});


      })


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

    var holder = {};


    console.log(this.state.data);
    holder = this.state.data;
    console.log(holder);

    var htmlScores = {}

    var totalDict = {};

    for (var id in holder){

      var entry = holder[id];
      var curScores = [];
      var name = entry["teamName"];
      console.log(entry);
      for (var i = 1; i <= this.state.week;i++){
        console.log(i);

        curScores.push(entry["week" + i + "Score"]);
      }
      console.log(curScores);
      //sum scores and round total
      var curTotal = parseFloat(curScores.reduce((a,b) => a + b, 0));
      var rounded = (curTotal).toFixed(1)
      totalDict[name] = rounded;

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
    var rawScores = this.state.rawScores;

    var weekScores = {}

    var totalDict = {};
    totalDict[1] = 4;
    totalDict[2] = 4;

    //divide up scores into each week
    for (var name in rawScores){
      var teamName = name;
      for (var i = 0; i < rawScores[name].length-1; i++){
        //dict for team to score that week

        if (weekScores[i+1] === undefined){
          var obj = {};
          obj[teamName] = rawScores[name][i];
          weekScores[i+1] = obj;

        }
        else{
          weekScores[i+1][teamName] = rawScores[name][i];
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
      for (var team in teamScores){
        var score = teamScores[team];
        scores.push(score);


      }

      //sort and assigned 3,2,1,0 points based on highest raw score
      scores.sort(function(a, b){return b-a});

      for (var i = 0 ; i < scores.length; i++){
        //get the team that produced that score
        var key = Object.keys(teamScores).find(key => teamScores[key] === scores[i])
        var relativeScore = scores.length-i-1
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

    console.log(ourScoringDict);

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

  changeVis(e){

    const showing = this.state.showing;
    if (this.state.password === "a"){
      this.setState({showing: !showing});

    }
    e.preventDefault();
  }

  addEntry(e){
    console.log("entry");
    console.log(this.newTeam.current.value);
    console.log(this.weekNum.current.value);
    console.log(this.state.rawScores);
    var holder = "week1Score";

    var bodyJSON = {teamName: this.newTeam.current.value,
                    weekNum: this.weekNum.current.value,
                    score: this.state.newScore
    };




    console.log(bodyJSON);
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
  var table, rows, switching, i, x, y, shouldSwitch, switchcount = 0;
  table = document.getElementById(table);
  switching = true;
  var dir = "desc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
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
        if (switchcount == 0 && dir == "desc") {
          dir = "asc";
          switching = true;
        }
      }
    }
  }



  render() {


    return (
      <div>
        <div className="FF">
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
