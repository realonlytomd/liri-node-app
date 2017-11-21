// set up npm's

var fs = require("fs");
var request = require("request");

//console.log(process.argv);
// reference the keys needed for twitter

var twitterInfo = require("./keys.js");

// initialize variables generic for all 4 actions
var action = process.argv[2];
var userInput = process.argv[3];

switch (action) {
  case "my-tweets":
    tweets();
    break;

  case "spotify-this-song":
    spotify();
    break;

  case "movie-this":
    movie();
    break;

  case "do-what-it-says":
    dowhat();
    break;
}
// the "movie-this" function.  accesses the OMDB API
function movie() {

	movieName = userInput;
	//console.log(movieName);

	//if the movie has more than a one word in the title, need to concatenate a plus sign
	// inbetween the words

	for (var i = 4; i < process.argv.length; i++) {
		if (process.argv[i]) {
		movieName = movieName + "+" + process.argv[i];
		//console.log(movieName);
		}
	}

	// build the queryurl with the properly formatted movie name
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	//console.log(queryUrl);

	// then perform the request to the omdb api

	request(queryUrl, function(error, response, body) {

		// if no error and status Code is ok
		if (!error && response.statusCode === 200) {

			// Parse the body (the data from the site)
			// Use the JSON.parse to make it into JSON and log that to the console.
   
			//console.log(JSON.parse(body));

			// then get the data required

			// Title of the movie.
			// Year the movie came out.
			// IMDB Rating of the movie.
			// Rotten Tomatoes Rating of the movie.
			// Country where the movie was produced.
			// Language of the movie.
			// Plot of the movie.
			// Actors in the movie.

			console.log("The movie's title is: " + JSON.parse(body).Title);
			console.log("The movie was released in: " + JSON.parse(body).Year);
			console.log("The movie's IMDB rating is: " + JSON.parse(body).imdbRating);
			console.log("The movie's Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
			console.log("The movie was produced in: " + JSON.parse(body).Country);
			console.log("The movie is in the language of : " + JSON.parse(body).Language);
			console.log("The plot of the movie is: " + JSON.parse(body).Plot);
			console.log("The actors in the movie are: " + JSON.parse(body).Actors);
 		}

	});

}