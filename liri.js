var fs = require("fs");
var request = require("request");

console.log(process.argv);

var twitterInfo = require("./keys.js");

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

function movie() {

	movieName = userInput;
	console.log(movieName);

}