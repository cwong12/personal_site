// TODO run "npm init" and "npm install express"
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);




const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology' , true);

db.on('error', console.error); // log any errors that occur

// bind a function to perform when the database has been opened
db.once('open', function() {
  // perform any queries here, more on this later
  console.log("Connected to DB!");
});

// process is a global object referring to the system process running this
// code, when you press CTRL-C to stop Node, this closes the connection
process.on('SIGINT', function() {
   mongoose.connection.close(function () {
       console.log('DB connection closed by Node process ending');
       process.exit(0);
   });
});

const standingsSchema = new mongoose.Schema({
    teamName: String,
    week1Score: Number,
    week2Score: Number,
    week3Score: Number,
    week4Score: Number,
    week5Score: Number,
    week6Score: Number,
    week7Score: Number,
    week8Score: Number,
    week9Score: Number,
    week10Score: Number,
    week11Score: Number,
    week12Score: Number





  });


  standingsSchema.index({'$**': 'text'});




// you will replace this with your on url and fill in your password in the next step
const url = 'mongodb+srv://cwong12:Wayland123!@cluster0-g7uzk.mongodb.net/test?retryWrites=true'
mongoose.connect(url, {useNewUrlParser: true});



const Standings = mongoose.model('Standings', standingsSchema);

const doc = new Standings();


//use to clear db

// Markers.deleteMany({}, function(err){
//   if (err) return console.error(err);
// })

app.get('/clear', function(request,response){
  Standings.deleteMany({}, function(err){
    if (err) return console.error(err);
  })

});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/standings', async function(request,response){
    console.log("dbside");
    markers = []
    var results;

    const doc = await Standings.find()
      .then(products => results = products)
      .catch(e => console.error(e));
    response.json(results);
});

app.post('/newEntry', async function(request, response){
  console.log(request.body.bodyJSON);
    let newTeamName = request.body.bodyJSON.teamName;
    let newWeekNum = request.body.bodyJSON.weekNum;
    let newWeekScore = request.body.bodyJSON.score;

    console.log(newTeamName);
    console.log("exists");
    const update = {};
    update["week" + newWeekNum + "Score"] = newWeekScore;
    const doc = await Standings.findOneAndUpdate({teamName: newTeamName}, update, {upsert: true});



});

app.post('/searchDelete',function(request,response){

  var results = []
  Markers.find({link: request.body.urlDelete})
    .then(products => results = products)
    .catch(e => console.error(e));

  setTimeout(function(){
    response.json(results);
      }, 1000);
})


app.post('/delete',function(request,response){
  console.log(request.body);

  var results = []
  Markers.deleteOne({ link: request.body.urlDelete })
  .then(products => results = products)
  .catch(e => console.error(e));


})



app.post('/newMarker', function(request, response){
    let coordinates = request.body.coordinates;
    let properties = JSON.stringify(request.body.properties);


    let Marker = new Markers({
      coordinates: coordinates,

      location: newLocation,
      title: newTitle,
      description: newDes,
      author: newAuthor,
      link: newlink,
      year: newYear,
      month: newMonth,
      day: newDay,
      thumbnail_link: newThumb,
      filters: newFilters

    })
    Marker.save(function (err) {
      if (err) return console.error(err);
    });

});


app.get('/marker', function(request, response){
    console.log('- request received:', request.url);

    markers = []

    Markers.find( {},function(err,result) {
      for(let i = 0; i < result.length; i++){
        markers.push(result[i]);
        }
    })



    setTimeout(function(){
      response.json(markers);

       }, 1000);
  });

server.listen(8080, function(){
    console.log('- Server listening on port 8080');
});
