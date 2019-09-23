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
        "Mom can win too, really": [75.9,	96.1,	132.4] //mom

      }
    }

  }

  buildHeadings(){
    var weekNum = this.state.rawScores["Cleveland Browns"].length;
    var headingHtml = "";
    var weeks = []
    for (var i = 1; i <= weekNum; i++){
      weeks.push(i);

    }

    console.log(weeks);
    var weekHtml = weeks.map((weekNums) =>
        <th className = "weekScores">Week {weekNums} Scoring</th>
  );

    return weekHtml
  }

  buildStandings(){


    var htmlScores = {}

    var totalDict = {};

    for (var name in this.state.rawScores){
      var curScores = this.state.rawScores[name];
      var listItems = curScores.map((scores) =>
        <td className = "score" id = "week1">{scores}</td>
);
      var curTotal = curScores.reduce((a,b) => a + b, 0);
      console.log(curTotal);
      totalDict[name] = curTotal;
      var html  = <td>{name}</td>;
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



  render() {
    return (
      <div>
        <div className="FF">
          <div className='standings'>
            <div className="biotext"> <b>Fantasy Football Standings</b>

              <table>
                <tbody>

                <tr>
                  <th>Team</th>
                  {this.buildHeadings()}
                </tr>

                {this.buildStandings()}


                  </tbody>
                </table>
            </div>
          </div>

        </div>

      </div>

    );
  }

}
