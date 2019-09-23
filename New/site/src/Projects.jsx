import React from 'react'
import './App.css';
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
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
        "Mom can win too, really": [75.9,	96.1,	80] //mom
      },
      week: 3

    }

  }

  buildHeadings(word){

    var weekNum = this.state.week;

    //build an array with week numbers i.e. [1,2,3]
    var weeks = []
    for (var i = 1; i <= weekNum; i++){
      weeks.push(i);

    }

    var weekHtml = weeks.map((weekNums) =>
        <th className = "weekScores">Week {weekNums} {word}</th>
  );

    return (
      <React.Fragment>
      {weekHtml}
      <th className = "weekScores">Total</th>
      </React.Fragment>
    )
  }

  buildScores(){
    var holder = this.state.rawScores;

    var htmlScores = {}

    var totalDict = {};

    for (var name in holder){
      var curScores = holder[name];



      //sum scores and round total
      var curTotal = curScores.reduce((a,b) => a + b, 0);
      var rounded = (curTotal).toFixed(1)
      totalDict[name] = rounded;

      curScores.push(rounded);
      var listItems = curScores.map((scores) =>
        <td className = "score" id = "week1">{scores}</td>
);
      console.log(listItems);

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

  buildPoints(){
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
    console.log(weekScores);

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

      console.log(curScores);

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



  render() {
    return (
      <div>
        <div className="FF">
          <div className='standings'>
            <div className="biotext"> <b>Fantasy Football Standings</b>

              <table className = "table">
                <tbody>

                <tr>
                  <th>Team</th>
                  {this.buildHeadings("Points")}
                </tr>

                {this.buildScores()}


                  </tbody>
                </table>

                <table className = "table">
                  <tbody>

                  <tr>
                    <th>Team</th>
                    {this.buildHeadings("Scoring")}
                  </tr>

                  {this.buildPoints()}


                    </tbody>
                  </table>

            </div>
          </div>

        </div>

      </div>

    );
  }

}
