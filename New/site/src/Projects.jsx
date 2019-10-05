import React from 'react'
import './App.css';
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Heat_Map from "./images/Visualizations/Heatmap.png"
import WL from "./images/Visualizations/Winlossbarchart.png"
import Money from "./images/Visualizations/Money.png"
import Lines from "./images/Visualizations/HomeAwayLine.png"



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
      week:4,
      showing: false,
      password: "",
      newScore: 0,
      data:null

    }

    this.changeVis = this.changeVis.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.changeWeek = this.changeWeek.bind(this);



    this.newTeam = React.createRef();
    this.weekNum = React.createRef();
    this.score = React.createRef();
    this.showWeek = React.createRef();


  }

  componentDidMount() {
      //this.buildPoints();
      this.getSomeData();
      //this.sortTable(this.state.week, "rawTable");

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
    console.log(weekScores);

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
      <div className ="projects">

            <div className = "MoneyBallers">
              <div className= "writeup">
            <h3>MoneyBallers</h3>
            <p>Collaborators: Will Glaser, Lynn Hlaing, Jake Acquardo</p>
            <p>All of our code is available on our Github: <a href="https://github.com/jakeacquadro/MLB-Data/">Here</a></p>

            <h4>Vision:</h4>
            <p>Our vision was to build a predictive model based off of historical MLB data to
            predict the outcomes of future games. In addition to accuracy, the intention was
            for this model to be profitable when used for betting on games based on these predictions.
            Initially, we intended to build a model that could predict games; we narrowed
            down the scope of the project so that we had the goal of making a model that could
            predict the winner of a game more than 50% of the time and could also be profitable.</p>

            <p>In the end, we achieved both of our goals: both of our machine learning models could
            predict the winner more for than 50% of games, and both models were profitable if we
            used the right betting strategy. We didn’t deviate too far from our initial goal,
            except for realizing that betting on the winner most of the time would not be profitable.
            We instead calculated the odds for winning and compared them to the odds provided by the betting agency.</p>

            <h4>Data:</h4>


            <p>Originally, we began with a data set of nearly 44,000 MLB games starting from 2000 until 2018,
               which we took from Retrosheet.com. This dataset originally contained 161 attributes, including
                game information, score lines, player data, umpire data, and game statistics. Since our plan was
                to develop a model capable of predicting the winner of the game, however, a number of the
                statistics were irrelevant as we would not have these particular statistics prior to the game
                that we would want to predict for. Thus, we removed nearly 80 attributes including, pitching,
                offensive and defensive statistics of the two teams during the game. We also removed games
                that were rained out, zero attendance, and had incomplete data. All of this cleaning and
                collection were done using SQL queries on a database created after we used python to import
                the data from txt files.</p>
            	<p>We collected the game data using a csv reader from python, pulling csv files from Retrosheet.com
                and reading them into a database. Collecting betting data was more difficult. We had to scrape
                it from sportsbookreview.com using BeautifulSoup. Since the data was storedon tables on each
                page and these tables were javascript objects, we had to use ChromeDriver to open a window of
                Google Chrome and automate the scraping. We initially scraped all of the data from a different
                website, oddsportal.com, then changed to a different website, sportsbookreview.com because the
                keys aligned better. Unfortunately, the scraper for the second website got deleted during
                pushing and pulling from Github, but we still have the scraped data and the original scraper
                which works.</p>
            	<p>In the end, we ended up with about 26,000 games that encompassed games from 2007 to 2018 as the
              betting data only contained data from after 2007. At this point we were left with about 85 attributes
               across all 26,000 data points. We decided that player data and umpire data would not be feasible to
                use as it would require a seperate dictionary tracking their various statistics and would greatly
                increase the total number of attributes to look at. From there, we used a combination of feature
                analysis and visualizations of the data to decide which final attributes we would use. This
                resulted in us using 8 main attributes:</p>


              <p>
                In the end, we had 26,000 games with 8 attributes to use for our models. As a side note,
                 our data set does not include Arizona because they are an irrelevant franchise that would
                 never really win any games and because their unique ID failed to merge on several occasions
                 despite our going back and checking on franchise ID and unique ID itself. However, this is
                 not a very large portion of games as there are 29 other teams we used.

            </p>

            <h4>Methodology:</h4>
              <p>
                Once we had merged our data, we decided to use a Logistic Regression from StatsModel and
                Random Forest classifiers from Sklearn. For both models, we trained on games from the 2007
                to 2017 MLB seasons, which amounted to approximately 24000 games, and tested on the 2018 season,
                 which was about 2400 games. Along the way we used some visualizations to aid in the choosing
                 of which attributes we would include in our models:
              </p>

              <img class = "chart" alt = "Win/loss chart" src={WL}/>
              <img class = "chart" alt = "Win/loss chart" src={Heat_Map}/>



              <p>
                These visualizations show us that being the home team almost universally
                wins more than 50% of the time
              </p>

              <h4>Machine Learning:</h4>
                <p>
              After preparing our data set, we decided that we would train on the example games
              from the years from 2007-2017 (~24,000 games) and validate our model on the games
              from 2018 (~2400 games). We initially started with a logistic regression using
              the statsmodel package as it was one of the more simple models relevant to our dataset and our purpose


              </p>

              <h4>Results:</h4>

              <p>
                We found that both machine learning models correctly predicted the winner more than
                50% of the time. The Logistic Regression and the Random Forest were both correct for
                around 54% of games. However, the Random Forest made 4.9% profit while the Logistic
                Regression only made 0.9% profit. Our betting strategy was to only bet when our
                calculated odds were better than the ones provided by the betting agency. </p>

                <p>
                Our most significant finding was that betting on the predicted winner was not a good
                betting strategy. We lost 8% with the Random Forest and 10% with the Logistic Regression
                when betting on the predicted winner only. This is because while you may get most games
                 right, you are not making a large profit on most if the betting lines are very negative.
                 You will be losing large amounts on the ones you do get wrong, netting a loss.

              </p>
              <img class = "chart" alt = "Win/loss chart" src={Money}/>


                  </div>
                  </div>

                  </div>



    );
  }

}
