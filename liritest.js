// set up npm's
// reference the keys needed for twitter
var Twitter = require("twitter");
var twitterKeyInfo = require("./keys.js");
var client = new Twitter(twitterKeyInfo);

// reference the keys needed for spotify
var Spotify = require("node-spotify-api");
var spotifyKeyInfo = require("./spotifykeys.js");
var spotify = new Spotify(spotifyKeyInfo);

var fs = require("fs");
var request = require("request");

// console.log(process.argv);

// initialize variables generic for all 4 actions
var action = process.argv[2];
var userInput = process.argv[3];

// console.log(userInput);
function overAgain() {

	switch (action) {
		case "my-tweets":
		logaction();
		tweets();
		break;

	case "spotify-this-song":
		logaction();
		spotifynow();
		break;

	case "movie-this":
		logaction();
		movie();
		break;

	case "do-what-it-says":
		logaction();
		dowhat();
		break;
	}
}

// the "my-tweets" function.  accesses the twitter API
function tweets() {

	var count = 20;

	// I found help about adding in the count parameter at 
	//https://www.sitepoint.com/twitter-json-example/
	
	var params = { 
		screen_name: 'onlytom', 
		count: count
	};

	client.get("statuses/user_timeline", params, function(error, tweets, response) {
  		if (!error) {
    	// console.log(tweets);
    	var result = [];
    	// log all 20 dates and tweets
    	for (var i = 0; i < count; i++) {
    		console.log("\nDate: " + tweets[i].created_at);
    		console.log("The tweet: " + tweets[i].text);
    		result[i] = tweets[i].created_at + "\n" + tweets[i].text;
    		logresults(result[i]);
    	}
		}
	});

}

// the "spotify-this" function.  accesses the Spotify API.

function spotifynow() {
	
	//console.log(userInput);

	spotify.search({ type: "track", query: userInput, limit: 1 }, function(err, data) {
		
		if (err) {
		return console.log('Error occurred: ' + err);
		}

		// Get the required info:
		// Artist(s)
     	// The album that the song is from
     	// The song's name
     	// A preview link of the song from Spotify
     	var name = data.tracks.items[0].album.artists[0].name;
     	var album = data.tracks.items[0].album.name;
     	var song = data.tracks.items[0].name;
     	var preview = data.tracks.items[0].preview_url

		console.log("The artist is: " + name);
		console.log("The song is on the album: " + album);
		console.log("The song is: " + song);
		console.log("Here is a preview: " + preview);
		
		var result =[name + ", " + album + ", " + song + ", " + preview];
		logresults(result);
	});
}

// the "movie-this" function.  accesses the OMDB API.
function movie() {

	var movieName = userInput;

	if (movieName === undefined) {
		movieName = "Mr. Nobody";
	}

	// console.log(movieName);

	// if the movie has more than a one word in the title, need to concatenate a plus sign
	// inbetween the words

	for (var i = 4; i < process.argv.length; i++) {
		if (process.argv[i]) {
		movieName = movieName + "+" + process.argv[i];
		//console.log(movieName);
		}
	}

	// build the queryurl with the properly formatted movie name
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	// console.log(queryUrl);

	// then perform the request to the omdb api

	request(queryUrl, function(error, response, body) {

		// if no error and status Code is ok
		if (!error && response.statusCode === 200) {

			// Parse the body (the data from the site)
			// Use the JSON.parse to make it into JSON
   			var answer = JSON.parse(body);
			// console.log(answer);

			// then get the data required

			// Title of the movie.
			// Year the movie came out.
			// IMDB Rating of the movie.
			// Rotten Tomatoes Rating of the movie.
			// Country where the movie was produced.
			// Language of the movie.
			// Plot of the movie.
			// Actors in the movie.

			console.log("The movie's title is: " + answer.Title);
			console.log("The movie was released in: " + answer.Year);
			console.log("The movie's IMDB rating is: " + answer.imdbRating);
			if (answer.Ratings[1] != undefined) {
				console.log("The movie's Rotten Tomatoes rating is: " + 
				answer.Ratings[1].Value);
			}
			console.log("The movie was produced in: " + answer.Country);
			console.log("The movie is in the language of : " + answer.Language);
			console.log("The plot of the movie is: " + answer.Plot);
			console.log("The actors in the movie are: " + answer.Actors);
 		}

	});

}

function dowhat() {

	// read the random.txt file

	fs.readFile("./random.txt", "utf8", function(error, randomTodo) {

		if (error) {
			return console.log(error);
		}

		// split the string by the comma, to make an array
		var randomArr = randomTodo.split(",");

		//console.log(randomTodo);
		//console.log(randomArr);

		// Assign the data from this array to the action and userInput
		// variables.  This has to be done here (inside the fs function)
		// because fs is asynchronous

		action = randomArr[0];
		userInput = randomArr[1];

		// call the original function to take the newly assigned variable into
		// their proper functions
		overAgain();

	});
	
}

// This is the original call to the function that calls the
// tweets, spotify, or movie functions.

overAgain();

function logaction() {

	fs.appendFile("log.txt", "\r\nCommand: " + action, function(err) {
    	if (err) {
      		return console.log(err);
    }
  });
}

function logresults(data) {

	fs.appendFile("log.txt", "\r\nAnswer: " + data, function(err) {
		if (err) {
			return console.log(err);
		}
	});
}