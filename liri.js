// console.log('App is running!');
//Get all requirements for the app
//Get the api key
var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

//look at the command and route it to the desired action function to be performed
function command(command, action) {
    switch (command) {
    case 'my-tweets':
      getTweets();
      break;
    case 'spotify-this-song':
      spotifySong(action);
      break;
    case 'movie-this':
      findMovie(action);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('I\'m going to pretend you didn\'t say that.');
  }
}

//get my latest tweets
function getTweets() {
  var client = new Twitter(keys.twitterKeys);
  var params = {screen_name: 'ALittleMorePop'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(' ');
        console.log('Tweet: '+tweets[i].text);
        console.log('Created: '+ tweets[i].created_at);
        console.log('- - - - -');
      }
    }
  });
}

function spotifySong(songName) {

  if (songName === undefined) {
    songName = 'The Sign';
  }

  spotify.search({
    type: 'track',
    query: songName
  }, function(err, data) {
    // console.log(data);
    if (err) {
      console.log('Not saying you messed up, but... ' + err);
      return;
    }

    var trackData = data.tracks.items;

    for (var i = 0; i < trackData.length; i++) {
      //print song info
      console.log(' ');
      console.log([i]+ '. Artist: ' + trackData[i].artists[0].name);
      console.log('Song Name: ' + trackData[i].name);
      console.log('Preview link: ' + trackData[i].preview_url);
      console.log('Album: ' + trackData[i].album.name);
      console.log('- - - - -');
    }
  });

}

//Find the specified movie
function findMovie(movieName) {
  if (movieName === undefined) {
    movieName = 'Mr Nobody';
  }

  // set up search url with movie parameter
  var searchURL = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=full&tomatoes=true&r=json';

  request(searchURL, function(error, response, body) {
    if (!error) {
      var jsonData = JSON.parse(body);
      //print movie info
      console.log('Title: ' + jsonData.Title);
      console.log('Year: ' + jsonData.Year);
      console.log('Rated: ' + jsonData.Rated);
      console.log('IMDB Rating: ' + jsonData.imdbRating);
      console.log('Country: ' + jsonData.Country);
      console.log('Language: ' + jsonData.Language);
      console.log('Plot: ' + jsonData.Plot);
      console.log('Actors: ' + jsonData.Actors);
      console.log('Rotten Tomatoes URL: ' + jsonData.tomatoURL);
    }
  });
}

//do what the text file says. Make sure to split the values in the text file.
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataSplit = data.split(",");

    if (dataSplit.length === 2) {
      command(dataSplit[0], dataSplit[1]);
    } 
    else if (dataSplit.length === 1) {
      command(dataSplit[0]);
    }
  });
}

command(process.argv[2], process.argv[3]);



