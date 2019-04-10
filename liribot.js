require("dotenv").config();
let keys = require("./keys");
let fs = require("fs");

let inputArguments = process.argv.slice(2);
let inputCommand = inputArguments[0];
let inputSearchString = inputArguments.splice(1).join(" ");

fs.readFile("./random.txt", "utf8", function(error, data) {
  if (error) {
    console.log(error);
  } else {
    var lineArr = data.split(",");

    lineArr.forEach(element => {
      console.log(element);
    });
  }
});

switch (inputCommand) {
  case "concert-this":
    console.log("Bands In Town");
    break;
  case "spotify-this-song":
    console.log("Spotify");
    break;
  case "movie-this":
    console.log("OMDB API");
    break;
  case "do-what-it-says":
    console.log("Just something random");
    break;
  default:
    console.log("Nothing in here");
}
