require("dotenv").config();
let keys = require("./keys");
let fs = require("fs");
let axios = require("axios");
let moment = require("moment");

let inputArguments = process.argv.slice(2);
let inputCommand = inputArguments[0];
let inputSearchString = inputArguments.splice(1).join(" ");
let fileLines = [];

fs.readFile("./random.txt", "utf8", function(error, data) {
  if (error) {
    console.log(error);
  } else {
    fileLines = data.split(",");

    // fileLines.forEach(line => {
    //   console.log(line);
    // });
  }
});

let getBandsInTown = inputSearchString => {
  let queryString = `https://rest.bandsintown.com/artists/${inputSearchString}/events?app_id=codingbootcamp`;

  axios.get(queryString).then(function(response) {
    response.data.forEach(event => {
      console.log(`Name: ${event.venue.name}`);
      console.log(`Location: ${event.venue.city}, ${event.venue.country}`);
      let eventDate = moment(event.datetime).format("MM/DD/YYYY");
      console.log(`Date: ${eventDate}`);
      console.log(`-------------------------------------------------------`);
    });
  });
};

switch (inputCommand) {
  case "concert-this":
    getBandsInTown(inputSearchString);
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
